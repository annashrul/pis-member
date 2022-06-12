import { Button, Card,message, Col,Collapse,PageHeader, Modal,Image ,Upload , Row } from 'antd';
import { UploadOutlined,InboxOutlined } from '@ant-design/icons';
import { useAppState } from './shared/AppProvider';
import React, { useEffect, useRef, useState } from 'react';
import Router from 'next/router';
import { handleGet, handlePut } from '../action/baseAction';
import Helper from "../helper/general_helper";
const { Panel } = Collapse;
const { Dragger } = Upload;
const InvoiceComponent = () => {
  const [state] = useAppState();
  const [objData,setObjData]= useState({});
  const [fontSize,setFontSize]= useState("14px");
  const [showModalUpload,setShowModalUpload]= useState(false);
  const [loadingUpload,setLoadingUpload]= useState(false);
  const [fileList,setFileList]= useState([]);


  useEffect(() => {
    let kdTrx=localStorage.getItem("kdTrx");
    let typeTrx=localStorage.getItem("typeTrx");
    console.log("type",typeTrx);
    if(kdTrx===undefined || kdTrx===null || typeTrx===undefined || typeTrx===null){
        Router.back();
        Router.push("/_error");
    }
    if(state.mobile){
      setFontSize("80%");
    }
    handleGetInvoice();
  }, []);

  const handleGetInvoice = async()=>{
    await handleGet(`transaction/deposit/${btoa(localStorage.getItem("kdTrx"))}/invoice`,(res,status,msg)=>{
      setObjData(res.data);
    })
  }

  const rmStorageLocal = ()=>{
    localStorage.removeItem("kdTrx");
    localStorage.removeItem("typeTrx");
  }

  const handleBack = () =>{
    rmStorageLocal();
    Router.back();
  }
 
  const tempRow = (title,desc,isRp=true) =>{
    return (
        <Row>
            <Col xs={10} md={10} style={{ alignItems: "left",textAlign:"left" }}><small style={{fontSize:fontSize}}>{title}</small></Col>
            <Col xs={14} md={14} style={{ alignItems: "right",textAlign:"right" }}><small style={{fontSize:fontSize}}>{isRp?Helper.toRp(desc):desc}</small></Col>
        </Row>
    );
  };
  const props = {
    name: 'file',
    multiple: false,
    onRemove: file => {
        setFileList([])
    },
    beforeUpload: file => {
        if (file.type === 'image/png' || file.type === 'image/jpg' || file.type === 'image/jpeg') {
            setFileList([file])
            return false;
           
        }else{
            message.error(`Silahkan Upload Gambar Sesuai Dengan Ketentuan`);
            return false;
        }
    },
    fileList
}
const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file)
      fileReader.onload = () => {
        resolve(fileReader.result);
      }
      fileReader.onerror = (error) => {
        reject(error);
      }
    })
  }

  const handleUpload = async()=>{
    setLoadingUpload(true);
    const img = await convertBase64(fileList[0])
    const data={bukti:img};
    await handlePut(`transaction/deposit/${btoa(localStorage.kdTrx)}/paymentslip`,data,(res,status,msg)=>{
        setLoadingUpload(false);
        if(status){
            rmStorageLocal();
        }
    })
  }
 
  return (
    <>
    <Row type="flex" justify="center"   gutter={10}>
        <Col md={8} xs={24}>
            <Card>
                <PageHeader
                    className="site-page-header"
                    onBack={handleBack}
                    title={`Invoice ${localStorage.typeTrx}`}
                >
                    <div align="middle">
                        <Image style={{ verticalAlign: 'middle' }} width={200} src="https://prowara.id/static/media/logo.bc4aea99.png" />
                    </div>
                    <Row style={{margin:"5px"}}><Col/></Row>
                    {tempRow("Kode Transaksi",objData&&objData.kd_trx,false)}
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
                                {tempRow("Kode Unik",objData&&objData.unique_code)}
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
                          <Button onClick={()=>setShowModalUpload(true)} style={{width:"100%"}} type="primary" size="medium">Upload Bukti Transfer</Button>  
                        ):"Bukti Transfer Terkirim"
                      }
                      <Row style={{margin:"5px"}}><Col/></Row>
                      <Button style={{width:"100%"}} type="primary" danger size="medium">Batalkan Transfer</Button> 
                      <Row style={{margin:"5px"}}><Col/></Row>
                      <Button onClick={handleBack} style={{width:"100%"}} type="dashed" primary size="medium">Kembali</Button> 
                      </Col>
                    </Row>

                    </PageHeader>
                </Card>
            

        </Col>
    </Row>
    {
        showModalUpload&&<Modal
        title="Upload Bukti Transfer"
        visible={showModalUpload}
        onOk={handleUpload}
        onCancel={()=>{
            setShowModalUpload(false)
        }}
        confirmLoading={loadingUpload}
        okText={`Simpan`}
        cancelText="Batal"
        closable={true}
        destroyOnClose={true}
        maskClosable={false}
    >
        <Dragger {...props} >
            <p className="ant-upload-drag-icon">
            <InboxOutlined />
            </p>
            <p className="ant-upload-text">Klik atau seret file ke area ini untuk mengunggah</p>
            <p className="ant-upload-hint">
            Tipe gambar yang diperbolehkan hanya .PNG, .JPEG, .JPG
            </p>
        </Dragger>
        
        
    </Modal>
    }
    </>
);
};

export default InvoiceComponent;
