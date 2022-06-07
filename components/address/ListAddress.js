import { BellOutlined, BookOutlined, MessageOutlined, PhoneOutlined } from '@ant-design/icons';
import { Col, Message, Row, Avatar,Input, Card, List, Button,Form,Select, Spin} from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import debounce from 'lodash/debounce';
import SelectUsers from '../../demos/antd/select/select-users';

import MockFeed from '../../demos/mock/feed';
import {handleGet, handlePost} from "../../action/baseAction";
const Search = Input.Search;
const { Option } = Select;
const msgInput='Tidak Boleh Kosong';

const ListAddress = () => {
    const [form] = Form.useForm();
    const [feed] = useState(MockFeed.slice(0, 3));
    const [arrProvinsi, setArrProvinsi] = useState([]);
    const [arrKota, setArrKota] = useState([]);
    const [arrKecamatan, setArrKecamatan] = useState([]);
    const [loadingProvinsi, setLoadingProvinsi] = useState(false);
    const [loadingKota, setLoadingKota] = useState(false);
    const [loadingKecamatan, setLoadingKecamatan] = useState(false);
    const [loadingSave, setLoadingSave] = useState(false);
    const [selectedProvinsiId, setSelectedProvinsiId] = useState(undefined);
    const [selectedKecamatanId, setSelectedKecamatanId] = useState(undefined);
    const [selectedKotaId, setSelectedKotaId] = useState(undefined);
    const [, forceUpdate] = useState();

    useEffect(() => {
        handleLoadProvinsi();
        forceUpdate({});

    }, []);
    const handleLoadProvinsi = async()=>{
        setLoadingProvinsi(true);
        await handleGet("transaction/kurir/get/provinsi",(datum,isLoading)=>{
            setArrProvinsi(datum.data);
            form.setFieldsValue({ kd_prov: datum.data[0].id });
            handleLoadKota(datum.data[0].id);
            setLoadingProvinsi(false);

        })
    };
    const handleLoadKota = async(id)=>{
        setLoadingKota(true);
        await handleGet(`transaction/kurir/get/kota?id=${id}`,(datum,isLoading)=>{
            setArrKota(datum.data);
            handleLoadKecamatan(datum.data[0].id);
            form.setFieldsValue({ kd_kota: datum.data[0].id });
            setLoadingKota(false)
        })
    };
    const handleLoadKecamatan = async(id)=>{
        setLoadingKecamatan(true);
        await handleGet(`transaction/kurir/get/kecamatan?id=${id}`,(datum,isLoading)=>{
            setArrKecamatan(datum.data);
            form.setFieldsValue({ kd_kec: datum.data[0].id });
            setLoadingKecamatan(false);
        })
    };
    const onChange = (value,col="",idx=0) => {
        if(col==="prov"){
            form.setFieldsValue({ kd_kota: undefined }); //reset product selection
            setTimeout(()=>handleLoadKota(value),300);
        }
        else if(col==="kota"){
            form.setFieldsValue({ kd_kec: undefined }); //reset product selection
            setTimeout(()=>handleLoadKecamatan(value),300);
        }
    };

    const onSearch = (value) => {
        console.log('search:', value);
    };

    const onFinish = async(e)=>{
        setLoadingSave(true);
        await handlePost("address",e,(data,status,msg)=>{
            setLoadingSave(false);
        })
    }

    return (
        <>
        <Row gutter={16}>
            <Col xs={24} sm={12} md={15}>
                <Form form={form}
                      layout="vertical"
                      name="addressForm"
                      onFinish={onFinish}
                >
                    <Card title={"Tambah Alamat"} extra={
                        <Button type={"primary"} size={"medium"} htmlType="submit" loading={loadingSave}
                                disabled={
                                    !form.isFieldsTouched(true) ||
                                    form.getFieldsError().filter(({ errors }) => errors.length).length
                                }>Simpan</Button>
                    }>
                        <Row gutter={16}>
                            <Col xs={24} sm={12} md={8}>
                                <Form.Item name={"title"} label="Title"  rules={[{ required: true,message: msgInput }]}>
                                    <Input placeholder="Ex: Rumah, Kantor" />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12} md={8}>
                                <Form.Item name={"penerima"} label="Penerima"  rules={[{ required: true,message:msgInput }]}>
                                    <Input placeholder="Ex: Jhon Doe" />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12} md={8}>
                                <Form.Item name={"no_hp"} label="No Handphone"  rules={[{ required: true,message: msgInput }]}>
                                    <Input placeholder="Ex: 081223165XXX" />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={24} md={8}>
                                <Form.Item name="kd_prov" label="Provinsi"  rules={[{ required: true,message:msgInput }]}>
                                    <Select
                                        loading={loadingProvinsi}
                                        style={{width:"100%"}}
                                        showSearch
                                        placeholder="Pilih Provinsi"
                                        optionFilterProp="children"
                                        onChange={(e)=>onChange(e,"prov",0)}
                                        onSearch={onSearch}
                                        filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                                    >
                                        {
                                            arrProvinsi.map((val,key)=>{
                                                return (
                                                    <Option key={key} value={val.id}>{val.name}</Option>
                                                );
                                            })
                                        }
                                    </Select>
                                </Form.Item>

                            </Col>
                            <Col xs={24} sm={24} md={8}>
                                <Form.Item name="kd_kota" label="Kota"  rules={[{ required: true,message:msgInput }]}>
                                    <Select
                                        loading={loadingKota}
                                        disabled={arrKota.length<1}
                                        style={{width:"100%"}}
                                        showSearch
                                        placeholder="Pilih Kota"
                                        optionFilterProp="children"
                                        onChange={(e)=>onChange(e,"kota",0)}
                                        onSearch={onSearch}
                                        filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                                    >
                                        {
                                            arrKota.map((val,key)=>{
                                                return (
                                                    <Option key={key} value={val.id}>{val.name}</Option>
                                                );
                                            })
                                        }
                                    </Select>
                                </Form.Item>

                            </Col>
                            <Col xs={24} sm={24} md={8}>
                                <Form.Item name="kd_kec" label="Kecamatan"  rules={[{ required: true,message:msgInput }]}>
                                    <Select
                                        loading={loadingKecamatan}
                                        disabled={arrKecamatan.length<1}
                                        style={{width:"100%"}}
                                        showSearch
                                        placeholder="Pilih Kecamatan"
                                        optionFilterProp="children"
                                        onChange={onChange}
                                        onSearch={onSearch}
                                        filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}

                                    >
                                        {
                                            arrKecamatan.map((val,key)=>{
                                                return (
                                                    <Option key={key} value={val.id}>{val.kecamatan}</Option>
                                                );
                                            })
                                        }
                                    </Select>
                                </Form.Item>

                            </Col>
                            <Col xs={24} sm={24} md={24}>
                                <Form.Item name={"main_address"} label="Alamat Lengkap"  rules={[{ required: true,message: msgInput }]}>
                                    <Input.TextArea />
                                </Form.Item>
                            </Col>
                        </Row>

                    </Card>
                </Form>
            </Col>
            <Col xs={24} sm={12} md={9}>
                <Card title={
                    <Search
                        placeholder="Tulis sesuatu disini ..."
                        enterButton
                        onSearch={(val)=>{}}
                    />
                } className="mb-4">
                    <List
                        itemLayout="horizontal"
                        dataSource={feed}
                        renderItem={item => (
                            <List.Item className="border-bottom-0">
                                <List.Item.Meta
                                    avatar={
                                        item.avatar ? (
                                            item.avatar
                                        ) : (
                                            <Avatar
                                                size={48}
                                                style={{
                                                    color: "rgb(143, 0, 245)",
                                                    backgroundColor: "rgb(214, 207, 253)"
                                                }}
                                            >
                                                {item.subject.charAt(0)}
                                            </Avatar>
                                        )
                                    }
                                    title={
                                        <a href="/" className="text-truncate">
                                            {item.subject}
                                        </a>
                                    }
                                    description={<span className="text-truncate">{item.message}</span>}
                                />
                            </List.Item>
                        )}
                    />
                </Card>

            </Col>

        </Row>

        </>
    );
};

export default ListAddress;
