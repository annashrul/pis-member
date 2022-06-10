import { Button,Card, Col, Divider, Row,Message } from 'antd';

import MockInvoice from '../demos/mock/invoice';
import { formatPrice } from '../lib/helpers';
import { useAppState } from './shared/AppProvider';
import React, { useEffect, useRef, useState } from 'react';
import Router from 'next/router';
import Helper from "../helper/general_helper"

const InvoiceComponent = () => {
    const [state] = useAppState();
    const [objData,setObjData]= useState({});

    useEffect(() => {
        let retrievedObject = localStorage.getItem('invoice');
        if(retrievedObject===null)
        {
            Message.info('terjadi kesalahan').then(() =>  Router.back());
        }else{
            setObjData(JSON.parse(retrievedObject));
            console.log("asdasd",JSON.parse(retrievedObject));
        }

    }, []);


    return (
        <>
        <Row type="flex" justify="center" gutter={10}>

            <Col md={8} xs={24}>
                <Card title={`#${objData.kd_trx}`}>


                    <Row>
                        <Col xs={12} md={12}>Biaya Aktivasi</Col>
                        <Col xs={12} md={12} style={{ alignItems: "right",textAlign:"right" }}> {Helper.toRp(objData.biaya_aktivasi)}</Col>
                    </Row>
                    <hr/>
                    <Row>
                        <Col xs={12} md={12}>Biaya Join</Col>
                        <Col xs={12} md={12} style={{ alignItems: "right",textAlign:"right" }}> {Helper.toRp(objData.biaya_join)}</Col>
                    </Row>
                    <hr/>
                    <Row>
                        <Col xs={12} md={12}>Nominal</Col>
                        <Col xs={12} md={12} style={{ alignItems: "right",textAlign:"right" }}>{Helper.toRp(objData.transaksi&&objData.transaksi.amount)}</Col>
                    </Row>
                    <hr/>
                    <Row>
                        <Col xs={12} md={12}>Biaya Admin</Col>
                        <Col xs={12} md={12} style={{ alignItems: "right",textAlign:"right" }}> {Helper.toRp(objData.transaksi&&objData.transaksi.admin)}</Col>
                    </Row>
                    <hr/>
                    <Row>
                        <Col xs={12} md={12}>Kode Unik</Col>
                        <Col xs={12} md={12} style={{ alignItems: "right",textAlign:"right" }}> {Helper.toRp(objData.transaksi&&objData.transaksi.kode_unik)}</Col>
                    </Row>
                    <hr/>
                    <Button style={{width:"100%",marginBottom:"5px",marginTop:"5px"}} type={"danger"} size={"large"}>
                        {Helper.toRp(objData.transaksi&&objData.transaksi.total_pay)}
                    </Button>
                    <Row>
                        <Col xs={12} md={12}>Metode Pembyaran</Col>
                        <Col xs={12} md={12}>: {objData.transaksi&&objData.transaksi.payment_method}</Col>
                    </Row>
                </Card>
            </Col>

        </Row>


        </>
    );
};

export default InvoiceComponent;
