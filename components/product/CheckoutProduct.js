import { Col, Message, Row,Button,Card,List,Avatar } from 'antd';
import StatCard from '../shared/StatCard';
import { CarOutlined,BellOutlined, HomeOutlined, MessageOutlined, PhoneOutlined } from '@ant-design/icons';
import { theme } from '../styles/GlobalStyles';
import { useAppState } from '../shared/AppProvider';
import React, { useEffect, useState } from 'react';
import {handleGet, handlePost} from "../../action/baseAction";
import Router from 'next/router';
import Action from "../../action/auth.action";
import Helper from "../../helper/general_helper";
import PostCard from '../shared/PostCard';

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
    const [ke,setKe]=useState("");
    const [subtotal,setSubtotal]=useState(parseInt(Router.query.price,10));
    const [ongkir,setOngkir]=useState(0);
    const [total,setTotal]=useState(parseInt(Router.query.price,10));


    useEffect(() => {
        handleLoadAddress();
        handleLoadChannel();
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
        const field={"ke":addr, "berat":"100", "kurir":kurir};
        await handlePost('transaction/kurir/cek/ongkir',field,(datum,status,msg)=>{
            setIdxKurir(idx);
            setIdxLayanan(0);
            setArrLayanan(datum.data.ongkir);
            setOngkir(parseInt(datum.data.ongkir.length>0?datum.data.ongkir[0].cost:0,10))
        })
    };
    const handleLoadChannel = async()=>{
        await handleGet("transaction/channel",(datum,isLoading)=>{
            setArrChannel(datum.data);
            console.log("channel",datum.data)
        })
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
                                                title={<a href="javascript:void(0)" className="">{item.penerima}, {item.no_hp}</a>}
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
                        </Col>
                    </Row>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Row>
                        <Col xs={24} sm={24} md={24}>
                            <Card className="mb-2" title="Ringkasan Produk">
                                <List
                                    dataSource={[Router.query]}
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
                                                title={<a href="javascript:void(0)" className="">{item.title}</a>}
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
                                    style={{width:"100%"}}
                                    size="medium"
                                    type={'primary'}
                                    onClick={()=>{

                                    }}
                                >
                                    Bayar
                                </Button>
                            </Card>
                        </Col>
                    </Row>
                </Col>
            </Row>

        </div>
    );
    // return(
    //     <Row gutter={16}>
    //         <Col xs={24} sm={12} md={24}>
    //             <StatCard
    //                 title="Jln kebon manggu rt 03/04 kelurahan padasuka"
    //                 value="Alamat"
    //                 icon={<HomeOutlined  style={{ fontSize: '20px'}} />}
    //                 color={theme.primaryColor}
    //                 clickHandler={() => Message.info('Campaign stat button clicked')}
    //             />
    //         </Col>
    //     </Row>
    // );
};

export default CheckoutProduct;
