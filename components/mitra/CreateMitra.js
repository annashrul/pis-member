import { EyeTwoTone,CheckCircleOutlined,FormOutlined ,BellOutlined, BookOutlined, MessageOutlined, PhoneOutlined,CloseSquareOutlined } from '@ant-design/icons';
import {Popconfirm, Col, Message, Row, Tag, Input, Card, List, Button, Form, Select, Skeleton, Avatar} from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { handleGet, handlePost} from "../../action/baseAction";
import Action from "../../action/auth.action";
const { Option } = Select;
const msgInput='Tidak Boleh Kosong';
import Router from 'next/router';

const TambahMitra = () => {
    const [form] = Form.useForm();
    const [arrPaymentChannel,setArrPaymentChannel]= useState([]);
    const [arrProduct,setArrProduct]= useState([]);
    const [arrBank,setArrBank]= useState([]);
    const [iconLoading,setIconLoading]= useState(false);
    const [user,setUser]= useState({});
    const [, forceUpdate] = useState();

    useEffect(() => {
        setUser(Action.getUser());
        forceUpdate({});
        handleProduct();
        handleBank();
        handlePaymentChannel();
    }, [form]);
    const onSearch = (value) => {
        console.log('search:', value);
    };
    const handleProduct = async()=>{
        await handleGet("paket?page=1&perpage=10&category=5d96d9f0-49bd-49e2-895f-f8171ba3a9ea",(datum,isLoading)=>{
        // await handleGet("paket?page=1&perpage=10",(datum,isLoading)=>{
            setArrProduct(datum.data);
            console.log("paket",datum);
        })
    };
    const handlePaymentChannel = async()=>{
        await handleGet("transaction/channel",(datum,isLoading)=>{
            setArrPaymentChannel(datum.data);
            console.log("payment channel",datum);
        })
    };
    const handleBank = async()=>{
        await handleGet("transaction/data_bank",(datum,isLoading)=>{
            // await handleGet("paket?page=1&perpage=10",(datum,isLoading)=>{
            setArrBank(datum.data);
            console.log("bank",datum);
        })
    };
    const onChange = (e) => {
        // let val = e.target.value;

    };


    const onFinish = async(e)=>{
        console.log("is update",e);
        const data={
            "fullname":e.fullname,
            "mobile_no":e.mobile_no,
            "username":e.username,
            "password":e.password,
            "sponsor":user.referral,
            "payment_channel":e.payment_channel,
            "id_paket":e.id_paket,
            "data_bank":{
                "id_bank":e.id_bank,
                "acc_name":e.acc_name,
                "acc_no":e.acc_no
            }
        };
        setIconLoading(true);
        await handlePost("auth/signup",data,(res,status,msg)=>{
            console.log(res);
            setIconLoading(false)
            if(status){
                localStorage.setItem('invoice', JSON.stringify(res.data));
                Message.success(msg).then(() => Router.push('/invoice'));
                onReset();
            }else{
                Message.info(msg)
            }
        })
    };


    const onReset = () => {
        form.resetFields();
    };



    return (
        <>
        <Form form={form}
              layout="vertical"
              name="addressForm"
              onFinish={onFinish}
              initialValues={{
                  sponsor: 'NETINDO',
              }}
        >
            <Row type="flex" justify="center" gutter={10}>

                <Col md={8} xs={24} className={"mb-2"}>
                    <Card title={"Pendaftaran Mitra Baru"} extra={<Button size={"small"} type={"info"}>{user.referral}</Button>}>

                        <Form.Item hasFeedback name={"fullname"} onChange={onChange} label="Name"  rules={[{ required: true,message: msgInput }]}>
                            <Input placeholder="Ex: Jhon Doe"/>
                        </Form.Item>
                        <Form.Item hasFeedback name="mobile_no" label="No Handphone" onChange={onChange}  rules={[
                            { required: true, message: "Tidak Boleh Kosong" },
                            {pattern: new RegExp(/^[0-9]*$/),message: "Harus Berupa Angka"},
                        ]}>
                            <Input prefix={"+62"} placeholder="81223165XXXX"/>
                        </Form.Item>
                        <Form.Item hasFeedback name={"username"} onChange={onChange} label="Username"  rules={[{ required: true,message: msgInput }]}>
                            <Input placeholder="Ex: jhondoe"/>
                        </Form.Item>
                        <Form.Item hasFeedback name={"password"} onChange={onChange} label="Password"  rules={[{ required: true,message: msgInput }]}>
                            <Input.Password />
                        </Form.Item>
                        <Form.Item
                            name="confirm_password"
                            label="Konfirmasi Password"
                            dependencies={['password']}
                            hasFeedback
                            rules={[
                                {
                                    required: true,
                                    message: msgInput,
                                },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('Password Tidak Sama'));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>


                    </Card>
                </Col>
                <Col md={8} xs={24} className={"mb-2"}>
                    <Card title={"Pendaftaran Mitra Baru"}>
                        <Row gutter={4}>
                            <Col xs={24} md={12}>
                                <Form.Item hasFeedback name={"acc_name"} onChange={onChange} label="Atas Nama"  rules={[{ required: true,message: msgInput }]}>
                                    <Input placeholder="Ex: Jhon Doe"/>
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12}>
                                <Form.Item hasFeedback name="acc_no" label="No Rekening" onChange={onChange}  rules={[
                                    { required: true, message: "Tidak Boleh Kosong" },
                                    {pattern: new RegExp(/^[0-9]*$/),message: "Harus Berupa Angka"},
                                ]}>
                                    <Input placeholder="XXXXXXXX"/>
                                </Form.Item>
                            </Col>
                        </Row>


                        <Form.Item hasFeedback name="id_bank" label="Bank"  rules={[{ required: true,message:msgInput }]}>
                            <Select
                                style={{width:"100%"}}
                                showSearch
                                placeholder="Pilih Bank"
                                optionFilterProp="children"
                                onChange={(e,i)=>form.setFieldsValue({ id_bank: e })}
                                onSearch={onSearch}
                            >
                                {
                                    arrBank.map((val,key)=>{
                                        return (
                                            <Option key={key} value={val.id}>{val.name}</Option>
                                        );
                                    })
                                }
                            </Select>
                        </Form.Item>
                        <Form.Item hasFeedback name="payment_channel" label="Payment Channel"  rules={[{ required: true,message:msgInput }]}>
                            <Select
                                style={{width:"100%"}}
                                showSearch
                                placeholder="Pilih Payment Channel"
                                optionFilterProp="children"
                                onChange={(e)=>form.setFieldsValue({ payment_channel: e })}
                                onSearch={onSearch}
                            >
                                {
                                    arrPaymentChannel.map((val,key)=>{
                                        return (
                                            <Option key={key} value={val.code}>{val.name}</Option>
                                        );
                                    })
                                }
                            </Select>
                        </Form.Item>
                        <Form.Item hasFeedback name="id_paket" label="Paket"  rules={[{ required: true,message:msgInput }]}>
                            <Select
                                style={{width:"100%"}}
                                showSearch
                                placeholder="Pilih Paket"
                                optionFilterProp="children"
                                onChange={(e)=>form.setFieldsValue({ id_paket: e })}
                                onSearch={onSearch}
                            >
                                {
                                    arrProduct.map((val,key)=>{
                                        return (
                                            <Option key={key} value={val.id}>{val.title} - {val.price}</Option>
                                        );
                                    })
                                }
                            </Select>
                        </Form.Item>
                        <Form.Item shouldUpdate={true}>
                            {() => (

                                <Button
                                    style={{width:"100%"}}
                                    type="primary"
                                    htmlType="submit"
                                    className="mt-3"
                                    loading={iconLoading}
                                    disabled={
                                        !form.isFieldsTouched(true) ||
                                        form.getFieldsError().filter(({ errors }) => errors.length).length
                                    }
                                >
                                    Log in
                                </Button>
                            )}
                        </Form.Item>
                    </Card>
                </Col>

            </Row>
        </Form>

        </>
    );
};

export default TambahMitra;
