import {Button, Collapse ,PageHeader ,Card, Col, Divider, Row, Message, Avatar} from 'antd';
import { LeftOutlined } from '@ant-design/icons';

import MockInvoice from '../demos/mock/invoice';
import { formatPrice } from '../lib/helpers';
import { useAppState } from './shared/AppProvider';
import React, { useEffect, useRef, useState } from 'react';
import Router from 'next/router';
import Helper from "../helper/general_helper"
import StatCard from "./shared/StatCard";
import { theme } from './styles/GlobalStyles';
const { Panel } = Collapse;

const InvoiceComponent = () => {
    const [state] = useAppState();
    const [objData,setObjData]= useState({});
    const [fontSize,setFontSize]= useState("14px");

    useEffect(() => {
        console.log("mobile",state.mobile)
        if(state.mobile){
            setFontSize("80%");
        }
        let retrievedObject = localStorage.getItem('invoice');
        if(retrievedObject===null)
        {
            Message.info('terjadi kesalahan').then(() =>  Router.back());
        }else{
            setObjData(JSON.parse(retrievedObject));
            console.log("asdasd",JSON.parse(retrievedObject));
        }

    }, [state]);

    const tempRow = (title,desc,isRp=true) =>{
        return (
            <Row>
                <Col xs={10} md={10} style={{ alignItems: "left",textAlign:"left" }}><small style={{fontSize:fontSize}}>{title}</small></Col>
                <Col xs={14} md={14} style={{ alignItems: "right",textAlign:"right" }}><small style={{fontSize:fontSize}}>{isRp?Helper.toRp(desc):desc}</small></Col>
            </Row>
        );
    };

    return (
        <>
        <Row type="flex" justify="center" gutter={10}>

            <Col md={8} xs={24}>
                <PageHeader
                    className="site-page-header"

                    onBack={() => Router.back()}
                    title={`#${objData.kd_trx}`}
                >
                    <Card>

                        <small style={{fontSize:fontSize}}>Silahkan transfer sebesar</small>
                        <Row style={{margin:"5px"}}><Col/></Row>
                        <Button style={{width:"100%",marginBottom:"2px"}} type="dashed" danger size={"large"}>
                            {Helper.toRp(objData.transaksi&&objData.transaksi.total_pay)}
                        </Button>
                        <Row style={{margin:"5px"}}><Col/></Row>
                        <small style={{fontSize:fontSize}}>Pembayaran dapat dilakukan ke rekening berikut :</small>
                        <Row style={{margin:"5px"}}><Col/></Row>
                        {tempRow("Metode Pembayaran",objData.transaksi&&objData.transaksi.payment_method,false)}
                        {tempRow("Bank",objData.transaksi&&objData.transaksi.payment_name,false)}
                        {tempRow("Atas Nama",objData.transaksi&&objData.transaksi.acc_name,false)}
                        {tempRow("No.Rekening",objData.transaksi&&objData.transaksi.pay_code,false)}
                        <Row style={{margin:"5px"}}><Col/></Row>
                        <Collapse bordered={false}>
                            {
                                objData.transaksi&&<Panel header={<small style={{fontSize:fontSize}}>Rincian Biaya</small>} key={"0"}>
                                    {tempRow("Biaya Join",objData.biaya_join)}
                                    {tempRow("Biaya Aktivasi",objData.biaya_aktivasi)}
                                    {tempRow("Kode Unik",objData.transaksi&&objData.transaksi.kode_unik)}
                                    {tempRow("Biaya Admin",objData.transaksi&&objData.transaksi.admin)}
                                    {tempRow("Total",objData.transaksi&&objData.transaksi.total_pay)}
                                </Panel>
                            }
                        </Collapse>
                        <Collapse bordered={false}>
                            {
                                objData.detail_paket_join&&<Panel header={<small style={{fontSize:fontSize}}>Informasi Paket</small>} key={"0"}>
                                    {tempRow("Barang",objData.detail_paket_join.title,false)}
                                    {tempRow("Harga",objData.detail_paket_join.price)}
                                </Panel>
                            }
                        </Collapse>
                        <Collapse bordered={false}>
                            {
                                objData.transaksi&&objData.transaksi.instruction.map((val,key)=>{
                                    return <Panel header={<small style={{fontSize:fontSize}}>{val.title}</small>} key={key}>
                                        <small style={{fontSize:fontSize}}>
                                            <ol style={{paddingLeft:"35px"}}>
                                                {val.steps.map((row,i)=>{
                                                    return <li key={i}>{row}</li>
                                                })}
                                            </ol>
                                        </small>
                                    </Panel>
                                })
                            }
                        </Collapse>


                    </Card>
                </PageHeader>

            </Col>
        </Row>
        </>
    );
};

export default InvoiceComponent;
