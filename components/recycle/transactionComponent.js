import { Button, Form,Select, Input, Message, Row, Tooltip } from 'antd';
import { InfoCircleOutlined,EyeTwoTone, MailTwoTone, PlaySquareTwoTone, QuestionCircleTwoTone, SkinTwoTone } from '@ant-design/icons';
import Link from 'next/link';
import Router from 'next/router';
import styled from 'styled-components';
import React, { useEffect, useRef, useState } from 'react';
import {handleGet, handlePost} from "../../action/baseAction";
import Helper from "../../helper/general_helper"
const { Option } = Select;
const msgInput='Tidak Boleh Kosong';
import Action from "../../action/auth.action";
import {StringLink} from "../../helper/string_link_helper"

const FormItem = Form.Item;

const Content = styled.div`
  max-width: 400px;
  z-index: 2;
  min-width: 300px;
`;

const transactionComponent = () => {
    const [form] = Form.useForm();
    const [, forceUpdate] = useState();
    const [arrPaymentChannel,setArrPaymentChannel]= useState([]);
    const [arrProduct,setArrProduct]= useState([]);
    const [objProduct,setObjProduct]= useState();
    const [objPaymentChannel,setObjPaymentChannel]= useState();
    const [priceProduct,setPriceProduct]=useState(0);
    const [pricePaymentChannel,setPricePaymentChannel]=useState(0);
    const [iconLoading,setIconLoading]= useState(false);
    const [user,setUser]= useState({});


    useEffect(() => {
        setUser(Action.getUser());
        forceUpdate({});
        handleProduct();
        handlePaymentChannel();
    }, [form]);
    const handleProduct = async()=>{
        await handleGet("paket?page=1&perpage=10&category=5d96d9f0-49bd-49e2-895f-f8171ba3a9ea",(datum,isLoading)=>{
            setArrProduct(datum.data);
        })
    };
    const handlePaymentChannel = async()=>{
        await handleGet("transaction/channel",(datum,isLoading)=>{
            setArrPaymentChannel(datum.data);
        })
    };

    const handleSubmit = async(e) =>{
        const field={
            "id_member":user.id,
            "payment_channel":e.payment_channel,
            "id_paket":e.id_paket
        };
        setIconLoading(true);
        await handlePost("auth/recycle",field,(res,status,msg)=>{
            console.log("res",res);
            if(status){
                localStorage.setItem("kdTrx",res.data.kd_trx);
                Message.success('Berhasil. anda akan dialihkan ke halaman invoice!').then(() => Router.push({pathname:StringLink.invoiceRecycle,query:{kd_trx:res.data.kd_trx}},StringLink.invoiceRecycle));
            }
            setIconLoading(false);

        })
    }

    return (
        <Row
            type="flex"
            align="middle"
            justify="center"
            className="px-3 bg-white"
            style={{ minHeight: '100vh' }}
        >
            <Content>
                <div className="text-center mb-5">
                    <Link href="/">
                        <a className="brand mr-0">
                            <PlaySquareTwoTone style={{fontSize: '32px'}} />
                        </a>
                    </Link>
                    <h5 className="mb-0 mt-3">Recycle</h5>
                </div>

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                >

                    <Form.Item hasFeedback name="id_paket" label={
                        <span>Paket&nbsp;
                            <Tooltip title="Silahkan Pilih Paket Register"><InfoCircleOutlined style={{fontSize: '16px'}} /></Tooltip>
                        </span>
                    }  rules={[{ required: true,message:msgInput }]}>
                        <Select
                            style={{width:"100%"}}
                            showSearch
                            placeholder="Pilih Paket"
                            optionFilterProp="children"
                            onSelect={(e,v)=>{
                                setPriceProduct(parseInt(arrProduct[parseInt(v.key,10)].price,10));
                            }}
                            onChange={(e)=>form.setFieldsValue({ id_paket: e })}
                        >
                            {
                                arrProduct.map((val,key)=>{
                                    return (
                                        <Option key={key} value={val.id}>{val.title} - {Helper.toRp(val.price)}</Option>
                                    );
                                })
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item hasFeedback name="payment_channel" label={
                        <span>Metode Pembayaran&nbsp;
                            <Tooltip title="Silahkan Pilih Metode Pembayaran"><InfoCircleOutlined style={{fontSize: '16px'}} /></Tooltip>
                        </span>
                    }  rules={[{ required: true,message:msgInput }]}>
                        <Select
                            style={{width:"100%"}}
                            showSearch
                            placeholder="Pilih Payment Channel"
                            optionFilterProp="children"
                            onSelect={(e,v)=>{
                                setPricePaymentChannel(parseInt(arrPaymentChannel[parseInt(v.key,10)].fee_customer.flat,10));
                            }}
                            onChange={(e)=>form.setFieldsValue({ payment_channel: e })}
                        >
                            {
                                arrPaymentChannel.map((val,key)=>{
                                    return (
                                        <Option key={key} value={val.code}>{val.name} -  Admin: {Helper.toRp(val.fee_customer.flat)}</Option>
                                    );
                                })
                            }
                        </Select>
                    </Form.Item>

                    <p>Total Pembayaran : {`${Helper.toRp(priceProduct + pricePaymentChannel)}`}</p>


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
                                Lanjut
                            </Button>
                        )}
                    </Form.Item>
                </Form>
            </Content>
        </Row>
    );
};

export default transactionComponent;
