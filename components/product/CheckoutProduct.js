import { notification,Col, Message, Row,Button,Card,List,Avatar,Spin,Modal} from 'antd';
import { ExclamationCircleOutlined,CheckCircleOutlined } from '@ant-design/icons';
import { useAppState } from '../shared/AppProvider';
import React, { useEffect, useState } from 'react';
import {handleGet, handlePost} from "../../action/baseAction";
import Router from 'next/router';
import Helper from "../../helper/general_helper";
import {StringLink} from "../../helper/string_link_helper";
import PinInput from 'react-pin-input';
import { theme } from '../styles/GlobalStyles';

const { confirm } = Modal;

const CheckoutProduct = () =>{

    const [state] = useAppState();
    const [arrKurir,setArrKurir]= useState([]);
    const [arrChannel,setArrChannel]= useState([]);
    const [arrLayanan,setArrLayanan]= useState([]);
    const [idxKurir,setIdxKurir]= useState(0);
    const [idxAddress,setIdxAddress]= useState(0);
    const [idxLayanan,setIdxLayanan]= useState(0);
    const [objAddress,setObjAddress]=useState([]);
    const [objProduct,setObjProduct]=useState({});
    const [subtotal,setSubtotal]=useState(0);
    const [ongkir,setOngkir]=useState(0);
    const [total,setTotal]=useState(0);
    const [loadingLayanan,setLoadingLayanan]=useState(true);
    const [idxPayment,setIdxPayment]=useState(0);
    const [isModal,setIsModal]=useState(false);
    const [pin,setPin]=useState('');



    useEffect(() => {
        if(Object.keys(Router.query).length>0){
            setSubtotal(parseInt(Router.query.price,10));
            setTotal(parseInt(Router.query.price,10));
            setObjProduct(Router.query);
            handleLoadAddress();
            handleLoadChannel();
        }else{
            Message.info('terjadi kesalahan').then(() => Message.info('anda akan diarahkan ke halaman produk', 2.5)).then(() => Router.push(StringLink.product));
        }


    }, []);
    const handleLoadAddress = async()=>{
        await handleGet("address?page=1",(datum,isLoading)=>{
            setObjAddress([datum.data[0]]);
            handleLoadKurir();
        })
    };

    const handleLoadKurir = async()=>{
        await handleGet("transaction/kurir/show",(datum,isLoading)=>{
            setArrKurir(datum.data);
            handleLayanan(idxKurir,Router.query.kd_kec,datum.data[idxKurir].kurir)
        })
    };


    const handleLayanan = async(idx,addr,kurir) =>{
        setArrLayanan([]);
        setLoadingLayanan(true)
        const field={"ke":addr, "berat":"100", "kurir":kurir};
        await handlePost('transaction/kurir/cek/ongkir',field,(datum,status,msg)=>{
            setIdxKurir(idx);
            if(!status){
                setArrLayanan([]);
                setLoadingLayanan(false);
                setOngkir(0);
            }
            else{
                setLoadingLayanan(false);
                setArrLayanan(datum.data.ongkir);
                setOngkir(parseInt(datum.data.ongkir.length>0?datum.data.ongkir[0].cost:0,10));
                setIdxLayanan(0);
            }

        })
    };

    const handleLoadChannel = async()=>{
        await handleGet("transaction/channel",(datum,isLoading)=>{
            setArrChannel(datum.data);
        })
    };

    const handleCheckout = async()=>{
        // const hide=Message.loading("tunggu sebentar ...");
        const data={
            "pin":pin,
            "payment_channel":arrChannel[idxPayment].code,
            "ongkir":ongkir,
            "jasa_pengiriman":arrKurir[idxKurir].kurir,
            "id_alamat":objAddress[0].id,
            "id_paket":objProduct.id_paket
        };
        await handlePost("transaction/checkout",data,(res,status,msg)=>{
            if(status){
                Message.success('Transaksi Berhasil').then(() => Message.info('anda akan diarahkan ke halaman produk')).then(() => Router.push(StringLink.product));
            }
        })
    }
    const showPin = () => {
        setIsModal(false);
        confirm({
            title: 'Pastikan data anda sudah benar',
            icon: <ExclamationCircleOutlined />,
            content: 'Data yang anda masukan akan mempengaruhi proses pengiriman',
            onOk() {

                return new Promise((resolve, reject) => {
                    setTimeout(reject, 1000);
                    // setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
                    console.log("bus",reject)
                }).catch(() => handleCheckout());


            },
            onCancel() {
                setIsModal(false);
            },
        });
    };


    return (
        <div>

            <Row gutter={16}>
                <Col xs={24} sm={12} md={18}>
                    <Row>
                        <Col xs={24} sm={24} md={24}>
                            <Card className="mb-2" title="Alamat Pengiriman" extra={
                                <Button
                                    size="small"
                                    type="primary"
                                    className={`${state.direction === 'rtl' ? 'ml-4' : ''}`}
                                    onClick={()=>{}}
                                >
                                    Ganti Alamat
                                </Button>
                            }>
                                <List
                                    dataSource={objAddress}
                                    renderItem={(item,key) => (
                                        <List.Item className="border-bottom-0" key={key}>
                                            <List.Item.Meta
                                                title={<span>{item.penerima}, {item.no_hp}</span>}
                                                description={<span className="">{objAddress.length>0&&`${objAddress[0].main_address}, kecamatan ${objAddress[0].kecamatan}, kota ${objAddress[0].kota}, provinsi ${objAddress[0].provinsi}`}</span>}
                                            />
                                        </List.Item>
                                    )}
                                />
                            </Card>
                        </Col>
                        <Col xs={24} sm={24} md={24}>
                            <Card className="mb-2" title="Kurir Pengiriman">
                                {
                                    arrKurir.length>0&&arrKurir.map((val,key)=>{
                                        return (
                                            <Button
                                                key={key}
                                                size="small"
                                                type={idxKurir===key?`primary`:`info`}
                                                className={'mr-2 mb-2 mt-2'}
                                                onClick={()=>{
                                                    handleLayanan(key,objAddress[idxAddress].kd_kec,val.kurir)
                                                }}
                                            >
                                                <small>{val.title}</small>
                                            </Button>
                                        );
                                    })
                                }
                            </Card>
                        </Col>
                        <Col xs={24} sm={24} md={24}>
                            <Spin spinning={loadingLayanan}>
                                <Card className="mb-2" title={`Layanan Pengiriman ${arrKurir.length>0&&arrKurir[idxKurir]['title']}`}>
                                    {
                                        arrLayanan.length>0?arrLayanan.map((val,key)=>{
                                            return (
                                                <Button
                                                    key={key}
                                                    size="small"
                                                    type={idxLayanan===key?'primary':'info'}
                                                    className={'mb-2 mt-2 mr-2'}
                                                    onClick={()=>{
                                                        setIdxLayanan(key);
                                                        setOngkir(parseInt(val.cost,10));
                                                    }}
                                                >
                                                    <small>{val.description} | {Helper.toRp(val.cost)} | {val.estimasi}</small>
                                                </Button>
                                            );
                                        }):"tidak ada layanan yang tersedia"
                                    }
                                </Card>
                            </Spin>

                        </Col>
                        <Col xs={24} sm={24} md={24}>
                            <Card className="mb-2" title={`Channel Pembayaran`}>
                                <List
                                    bordered={false}
                                    itemLayout="horizontal"
                                    dataSource={arrChannel}
                                    renderItem={(item,key) => (
                                        <List.Item onClick={()=>{setIdxPayment(key)}} style={{cursor:"pointer"}}>
                                            <List.Item.Meta
                                                avatar={<Avatar src={item.logo} />}
                                                title={<a href="https://ant.design">{item.name}</a>}
                                                description={`${item.group} - ${Helper.toRp(item.fee_customer.flat)}`}
                                            />
                                            {key===idxPayment&&<div><CheckCircleOutlined/></div>}

                                        </List.Item>
                                    )}
                                />

                            </Card>

                        </Col>
                    </Row>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Row>
                        <Col xs={24} sm={24} md={24}>
                            <Card className="mb-2" title="Ringkasan Produk">
                                <List
                                    dataSource={Object.keys(objProduct).length>0?[objProduct]:[]}
                                    renderItem={(item,key) => (
                                        <List.Item className="border-bottom-0" key={key}>
                                            <List.Item.Meta
                                                avatar={
                                                    <Avatar
                                                        size={48}
                                                        style={{
                                                            color: "rgb(143, 0, 245)",
                                                            backgroundColor: "rgb(214, 207, 253)"
                                                        }}
                                                    >
                                                        {item.gambar}
                                                    </Avatar>
                                                }
                                                title={item.title}
                                                description={<span className="">{Helper.toRp(item.price)}</span>}
                                            />
                                        </List.Item>

                                    )}
                                />
                            </Card>
                            <Card className="mb-2">
                                <Row>
                                    <Col xs={12} md={12}><p>Subtotal</p></Col>
                                    <Col xs={12} md={12}><p className="text-right">{Helper.toRp(subtotal)}</p></Col>
                                </Row>
                                <Row>
                                    <Col xs={12} md={12}><p>Ongkos Kirim</p></Col>
                                    <Col xs={12} md={12}><p className="text-right">{Helper.toRp(ongkir)}</p></Col>
                                </Row>
                                <hr/>
                                <Row>
                                    <Col xs={12} md={12}><p>Total Belanja</p></Col>
                                    <Col xs={12} md={12}><p className="text-right">{Helper.toRp(total+ongkir)}</p></Col>
                                </Row>
                            </Card>

                            <Card>
                                <Button
                                    disabled={arrLayanan.length<1}
                                    style={{width:"100%"}}
                                    size="medium"
                                    type={'primary'}
                                    onClick={()=>{
                                        setIsModal(true);
                                    }}
                                >
                                    Bayar
                                </Button>
                            </Card>
                        </Col>
                    </Row>
                </Col>
            </Row>
            {
                isModal&&<Modal
                    title="Masukan Pin"
                    visible={isModal}
                    onOk={()=>showPin()}
                    onCancel={()=>setIsModal(false)}
                    okText="Simpan"
                    cancelText="Batal"
                    closable={true}
                    destroyOnClose={true}
                    maskClosable={false}
                >
                    <PinInput
                        focus={true}
                        length={6}
                        secret
                        onChange={(value, index) => {}}
                        type="numeric"
                        inputMode="number"
                        style={{padding: '0px'}}
                        inputStyle={{borderColor: theme.primaryColor,borderRadius:"5px",height:"30px",width:"30px"}}
                        inputFocusStyle={{borderColor: theme.darkColor}}
                        onComplete={(value, index) => {
                            console.log(index,value)
                            setPin(value);
                        }}
                        autoSelect={true}
                        regexCriteria={/^[ A-Za-z0-9_@./#&+-]*$/}
                    />
                </Modal>
            }


        </div>
    );

};

export default CheckoutProduct;
