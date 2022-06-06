import { BellOutlined, BookOutlined, MessageOutlined, PhoneOutlined } from '@ant-design/icons';
import { Col, Message, Row } from 'antd';
import MockFeed from '../../demos/mock/feed';
import PostCard from '../shared/PostCard';
import React, { useEffect, useState } from 'react';
import {handleGet} from "../../action/baseAction";

const ListProduct = () => {
    const [loading, setLoading] = useState(false);
    const [arrDatum,setArrDatum]= useState([]);


    useEffect(() => {
        handleLoadData("");
        console.log("anying")
    }, []);
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
                    return <Col xs={24} sm={12} md={6} key={key}>
                        <PostCard
                            title={val.title}
                            subtitle={val.category}
                            price={val.price}
                            image={val.gambar}
                            images={[
                                val.gambar
                            ]}
                            imageHeight={365}
                            text={val.caption}
                            handleClick={(e)=>console.log("click")}
                        />
                    </Col>
                })
            }
        </Row>
        </>
    );
};

export default ListProduct;
