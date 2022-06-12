import { Button, Card, Col,Collapse,PageHeader, Divider,Image , Row } from 'antd';
import { useAppState } from '../shared/AppProvider';
import React, { useEffect, useRef, useState } from 'react';
import Router from 'next/router';
import { handleGet } from '../../action/baseAction';
import Helper from "../../helper/general_helper";
const { Panel } = Collapse;

const InvoiceComponent = () => {
  const [state] = useAppState();
  const [objData,setObjData]= useState({});
  const [fontSize,setFontSize]= useState("14px");

  useEffect(() => {
    if(state.mobile){
      setFontSize("80%");
    }
    handleGetInvoice();
    console.log("Router.query",Router.query);
  }, []);

  const handleGetInvoice = async()=>{
    await handleGet(`transaction/deposit/${btoa(Router.query.kd_trx)}/invoice`,(res,status,msg)=>{
      setObjData(res.data);
    })
  }
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
                <Image width={200} src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg" />
                    {tempRow("Kode Pembayaran",objData.transaction_data&&objData.transaction_data.pay_code,false)}
                    <hr/>
                    <small style={{fontSize:fontSize}}>Silahkan transfer sebesar</small>
                    <Row style={{margin:"5px"}}><Col/></Row>
                    <Button style={{width:"100%",marginBottom:"2px"}} type="dashed" danger size={"large"}>
                        {Helper.toRp(objData.transaction_data&&objData.transaction_data.total_pay)}
                    </Button>
                    <Row style={{margin:"5px"}}><Col/></Row>
                    <small style={{fontSize:fontSize}}>Pembayaran dapat dilakukan ke rekening berikut :</small>
                    <Row style={{margin:"5px"}}><Col/></Row>
                    {tempRow("Metode Pembayaran",objData.transaction_data&&objData.transaction_data.payment_method,false)}
                    {tempRow("Bank",objData.transaction_data&&objData.transaction_data.payment_name,false)}
                    {tempRow("Atas Nama",objData.transaction_data&&objData.transaction_data.acc_name,false)}
                    {tempRow("No.Rekening",objData.transaction_data&&objData.transaction_data.pay_code,false)}
                    <Row style={{margin:"5px"}}><Col/></Row>
                    <Collapse bordered={false}>
                        {
                            objData.transaction_data&&<Panel header={<small style={{fontSize:fontSize}}>Rincian Biaya</small>} key={"0"}>
                                {tempRow("Kode Unik",objData.transaction_data&&objData.transaction_data.unique_code)}
                                {tempRow("Biaya Admin",objData.transaction_data&&objData.transaction_data.admin)}
                                {tempRow("Total",objData.transaction_data&&objData.transaction_data.total_pay)}
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
                            objData.transaction_data&&objData.transaction_data.instruction.map((val,key)=>{
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
                    <Row style={{margin:"5px"}}><Col/></Row>
                    
                    <Row>
                      <Col md={24} xs={24} sm={24}>
                      {
                        objData.payment_slip==="-"?(
                          <Button style={{width:"100%"}} type="primary" size="medium">Upload Bukti Transfer</Button>  
                        ):"Bukti Transfer Terkirim"
                      }
                      <Row style={{margin:"5px"}}><Col/></Row>
                      <Button style={{width:"100%"}} type="primary" danger size="medium">Batalkan Transfer</Button> 
                      <Row style={{margin:"5px"}}><Col/></Row>
                      <Button style={{width:"100%"}} type="dashed" primary size="medium">Kembali</Button> 
                      </Col>
                    </Row>


                </Card>
            </PageHeader>

        </Col>
    </Row>
    </>
);
};

export default InvoiceComponent;
