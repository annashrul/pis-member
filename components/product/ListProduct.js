import { BellOutlined, BookOutlined, MessageOutlined, PhoneOutlined } from '@ant-design/icons';
import { Col, Card,Message,PageHeader, Row } from 'antd';
import PostCard from '../shared/PostCard';
import React, { useEffect, useState } from 'react';
import {handleGet} from "../../action/baseAction";
import Router from 'next/router';
import Helper from "../../helper/general_helper"
import { StringLink } from '../../helper/string_link_helper';
const { Meta } = Card;

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
        await handleGet("paket?page=1&perpage=10&category=1ec17e57-0c5c-4867-958d-195e577eabeb",(datum,isLoading)=>{
            setLoading(isLoading);
            setArrDatum(datum)
        })
    };


    return (
        <>
        <PageHeader
            className="site-page-header"
            onBack={() => Router.back()}
            title="Produk RO"
        >
      <Row gutter={16}>
        
      
        {
              (arrDatum.data!==undefined&&arrDatum.data.length>0)&&arrDatum.data.map((val,key)=>{
                return(
                  <Col xs={12} sm={8} md={6} className="mb-2" style={{cursor:"pointer"}} onClick={()=>{
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
                                Router.push({pathname:StringLink.checkout,query:objAddress},StringLink.checkout)
                            }
                        }
                    }
                  }}>
                    <Card
                    title={<small>{val.title}</small>}
                      hoverable
                      cover={<img alt="example" src={val.gambar} onError={({ currentTarget }) => {
                        currentTarget.onerror = null; // prevents looping
                        currentTarget.src=Helper.imgDefault
                      }} />}
                    >
                      <Meta description={Helper.toRp(val.price)}/>
                      <small>{Helper.rmHtml(val.caption)}</small>
                    </Card>
                  </Col>
                );
              })
            }
            
      </Row>
      </PageHeader>
        
        </>
    );
};

export default ListProduct;
