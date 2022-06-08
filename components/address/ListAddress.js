import { FormOutlined ,BellOutlined, BookOutlined, MessageOutlined, PhoneOutlined,CloseSquareOutlined } from '@ant-design/icons';
import {Popconfirm ,Col, Message, Row, Tag , Input, Card, List, Button, Form, Select,  Skeleton} from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import MockFeed from '../../demos/mock/feed';
import {handleDelete, handleGet, handlePost, handlePut} from "../../action/baseAction";
const Search = Input.Search;
const { Option } = Select;
const msgInput='Tidak Boleh Kosong';

const ListAddress = () => {
    const [form] = Form.useForm();
    const [feed] = useState(MockFeed.slice(0, 3));
    const [arrAddress, setArrAddress] = useState([]);
    const [arrProvinsi, setArrProvinsi] = useState([]);
    const [arrKota, setArrKota] = useState([]);
    const [arrKecamatan, setArrKecamatan] = useState([]);
    const [loadingProvinsi, setLoadingProvinsi] = useState(false);
    const [loadingKota, setLoadingKota] = useState(false);
    const [loadingKecamatan, setLoadingKecamatan] = useState(false);
    const [loadingSave, setLoadingSave] = useState(false);
    const [loadingAddress, setLoadingAddress] = useState(true);
    const [disabledSave,setDisabledSave] = useState(true);
    const [isUpdate,setIsUpdate] = useState('');
    const [, forceUpdate] = useState();
    const titleInput = useRef(null);


    const setBtnDisabled=()=>{
        let isDisable=!form.isFieldsTouched(true) || form.getFieldsError().filter(({ errors }) => errors.length).length;
        if(isDisable===0){
            setDisabledSave(false);
        }else{
            setDisabledSave(true);
        }
    }

    useEffect(() => {
        setBtnDisabled();
        handleLoadProvinsi();
        handleLoadAddress();
        forceUpdate({});

    }, [form]);
    const handleLoadAddress = async()=>{
        setLoadingAddress(true);
        await handleGet("address?page=1",(datum,isLoading)=>{
            setArrAddress(datum.data);
            setLoadingAddress(false);
        })
    };
    const handleLoadProvinsi = async()=>{
        await handleGet("transaction/kurir/get/provinsi",(datum,isLoading)=>{
            setArrProvinsi(datum.data);
            form.setFieldsValue({ kd_prov: datum.data[0].id });
            handleLoadKota(datum.data[0].id);
            setLoadingProvinsi(false);

        })
    };
    const handleLoadKota = async(id,valId=null)=>{
        setLoadingKota(true);
        await handleGet(`transaction/kurir/get/kota?id=${id}`,(datum,isLoading)=>{
            setArrKota(datum.data);
            if(valId!==null){
                form.setFieldsValue({ kd_kota: valId});
            }
            else{
                form.setFieldsValue({ kd_kota: datum.data[0].id });
                handleLoadKecamatan(datum.data[0].id);
            }




            setLoadingKota(false)
        })
    };
    const handleLoadKecamatan = async(id,valId=null)=>{
        setLoadingKecamatan(true);
        await handleGet(`transaction/kurir/get/kecamatan?id=${id}`,(datum,isLoading)=>{
            setArrKecamatan(datum.data);
            form.setFieldsValue({ kd_kec: valId!==null?valId:datum.data[0].id  });
            setLoadingKecamatan(false);
        })
    };
    const onChange = (value,col="",idx=0) => {
        setBtnDisabled();
        console.log("ads")
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
        console.log("is update",e);
        setLoadingSave(true);
        if(isUpdate===""){
            await handlePost("address",e,(data,status,msg)=>{
                setLoadingSave(false);
            })
        }
        else{
            await handlePut(`address/${isUpdate}`,e,(data,status,msg)=>{
                setLoadingSave(false);
            })
        }
        setIsUpdate("");
        handleLoadAddress();
        onReset();

    };

    const handleEdit = (e,val) =>{
        console.log(val);
        handleLoadKota(val.kd_prov,val.kd_kota);
        handleLoadKecamatan(val.kd_kota,val.kd_kec);

        titleInput.current.focus();
        // Object.assign(val,{kd_kota:val.kota,kd_kec:val.kecamatan});
        form.setFieldsValue(val);
        setBtnDisabled();
        setIsUpdate(val.id);
        console.log("disabled",)

    }
    const onReset = () => {
        setIsUpdate('');
        form.resetFields();
        titleInput.current.focus();
        setBtnDisabled();
    };
    const handleConfirm = async(e,id)=>{
        console.log(e);
        await handleDelete(`address/${id}`,(res,status,msg)=>{
            handleLoadAddress();
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
                    <Card title={"Form Alamat"} extra={
                        <div>
                            <Button
                                className={"mr-2"}
                                size={"medium"}
                                htmlType="button"
                                onClick={onReset}
                            >Batal</Button>
                            <Button
                                type={"primary"}
                                size={"medium"}
                                htmlType="submit"
                                loading={loadingSave}
                                disabled={disabledSave}
                            >Simpan</Button>


                        </div>
                    }>
                        <Row gutter={16}>
                            <Col xs={24} sm={12} md={8}>
                                <Form.Item name={"title"} onChange={onChange} label="Title"  rules={[{ required: true,message: msgInput }]}>
                                    <Input placeholder="Ex: Rumah, Kantor"  ref={titleInput}/>
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12} md={8}>
                                <Form.Item name={"penerima"} onChange={onChange} label="Penerima"  rules={[{ required: true,message:msgInput }]}>
                                    <Input placeholder="Ex: Jhon Doe" />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12} md={8}>
                                <Form.Item name={"no_hp"} onChange={onChange} label="No Handphone"  rules={[{ required: true,message: msgInput }]}>
                                    <Input placeholder="Ex: 081223165XXX" />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={24} md={8}>
                                <Form.Item name="kd_prov" label="Provinsi"  rules={[{ required: true,message:msgInput }]}>
                                    <Select
                                        value={"anying"}
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
                                <Form.Item name={"main_address"} onChange={onChange} label="Alamat Lengkap"  rules={[{ required: true,message: msgInput }]}>
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
                        loading={loadingAddress}
                        itemLayout="vertical"
                        dataSource={arrAddress}
                        renderItem={(item,key) =>{
                            return <List.Item
                                key={item.id}
                                className="border-bottom-0"
                                actions={[
                                    <Tag color="lime">{item.title}</Tag>,
                                    <Button onClick={(e)=>handleEdit(e,item)} key="list-edit" type={"primary"} size={"small"}><FormOutlined/></Button>,
                                    <Popconfirm
                                        title="Are you sure to delete this task?"
                                        onConfirm={(e)=>handleConfirm(e,item.id)}
                                        onCancel={(e)=>{}}
                                        okText="Oke"
                                        cancelText="Batal"
                                    >
                                        <Button type={"primary"} size={"small"}  key="list-delete"><CloseSquareOutlined /></Button>
                                    </Popconfirm>


                                ]}>
                                <Skeleton title={false} loading={loadingAddress} active >
                                    <List.Item.Meta
                                        title={
                                            `${item.penerima} | ${item.no_hp}`
                                        }
                                        description={`${item.main_address}, Kecamatan ${item.kecamatan}, kota ${item.kota}, provinsi ${item.provinsi}`}
                                    />
                                </Skeleton>
                            </List.Item>
                        } }
                    />
                </Card>

            </Col>

        </Row>

        </>
    );
};

export default ListAddress;
