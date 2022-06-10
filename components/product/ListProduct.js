import { BellOutlined, BookOutlined, MessageOutlined, PhoneOutlined } from '@ant-design/icons';
import { Col, Message, Row } from 'antd';
import PostCard from '../shared/PostCard';
import React, { useEffect, useState } from 'react';
import {handleGet} from "../../action/baseAction";
import Router from 'next/router';

const ListProduct = () => {
    const [loading, setLoading] = useState(false);
    const [arrDatum,setArrDatum]= useState([]);
    const [info,setInfo]=useState(false);
    const [address,setAddress]=useState(false);
    const [objAddress,setObjAddress]=useState({});


    useEffect(() => {
        handleLoadData("");
        handleLoadInfo();
        handleLoadAddress();
        console.log("anying")
    }, []);
    const handleLoadInfo = async()=>{
        await handleGet("site/info",(datum,isLoading)=>{
            setInfo(datum.data.check_hak_ro);
        })
    };
    const handleLoadAddress = async()=>{
        await handleGet("address?page=1",(datum,isLoading)=>{
            setAddress(datum.data.length>0);

            setObjAddress(datum.data[0]);
        })
    };
    const handleLoadData = async(val)=>{
        setLoading(true);
        await handleGet("paket?page=1&perpage=10",(datum,isLoading)=>{
            setLoading(isLoading);
            setArrDatum(datum)
        })
    };


    return (
        <>
        <Row gutter={16}>
            {
                (arrDatum.data!==undefined&&arrDatum.data.length>0)&&arrDatum.data.map((val,key)=>{
                    return <Col className="mb-2" xs={12} sm={12} md={6} key={key}>
                        <PostCard
                            title={val.title}
                            subtitle={val.category}
                            price={val.price}
                            image={val.gambar}
                            images={[
                                val.gambar
                            ]}
                            imageHeight={200}
                            text={val.caption}
                            handleClick={(e)=>{
                                if(!address){
                                    Message.success('anda belum mempunya alamat, anda akan dialihkan untuk membuat alamat').then(() => Router.push('/alamat'));
                                }
                                else{
                                    if(!info){
                                        Message.info("anda belum memenuhi syarat RO");
                                    }
                                    else{
                                        if(parseInt(val.stock,10) < 1){
                                            Message.info("stock tidak tersedia");
                                        }else{
                                            Object.assign(val,{id_paket:val.id});
                                            Object.assign(objAddress,val);
                                            Router.push({pathname:'/checkout',query:objAddress},'/checkout',)
                                        }
                                    }
                                }

                            }}
                        />
                    </Col>
                })
            }
        </Row>
        </>
    );
};

export default ListProduct;
