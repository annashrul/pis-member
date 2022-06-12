import { RightCircleOutlined,WalletOutlined, BellOutlined, BookOutlined, DatabaseTwoTone, EditTwoTone, EllipsisOutlined, FallOutlined, FileZipTwoTone, MessageOutlined, PhoneOutlined, PrinterTwoTone, RestTwoTone, RiseOutlined, SaveTwoTone } from '@ant-design/icons';
import {
  Col,
  Message,
  Row,Avatar, List,
  Card,Empty,PageHeader 
} from 'antd';
import React, { useEffect, useState } from 'react';
import { handleGet } from '../../action/baseAction';
import Action from "../../action/auth.action";
import Helper from "../../helper/general_helper"
import Router from 'next/router';
import Link from 'next/link';
const { Meta } = Card;
const News = () => {
  const [objInfo, setObjInfo] = useState({});
  const [arrNews, setArrNews] = useState([]);

  useEffect(() => {
    handleLoadInfo();
    handleLoadNews("&page=1");
  }, []);

  const handleLoadInfo = async()=>{
    await handleGet("site/info",(res,status,msg)=>{
      setObjInfo(res.data);
      Action.setInfo(res.data);
    })
  }
  const handleLoadNews = async(where)=>{
    await handleGet(`content?page=1&perpage=10&status=1${where}`,(res,status,msg)=>{
      setArrNews(res.data);
    })
  }
  const data = [
    {
      title: 'Ant Design Title 1',
    },
    {
      title: 'Ant Design Title 2',
    },
    {
      title: 'Ant Design Title 3',
    },
    {
      title: 'Ant Design Title 4',
    },
  ];

  return (
    <div>
        <PageHeader
            className="site-page-header"
            onBack={() => Router.back()}
            title="Berita Terbaru"
        >
      <Row gutter={16}>
        
      
        {
              data.length>0&&data.map((val,key)=>{
                return(
                  <Col xs={12} sm={8} md={6} className="mb-2" style={{cursor:"pointer"}} onClick={()=>Router.push(`/news/${key}`)}>
                    <Card
                      hoverable
                      cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />}
                    >
                      <Meta title="Europe Street beat" description="www.instagram.com" />
                    </Card>
                  </Col>
                );
              })
            }
            
      </Row>
      </PageHeader>
    </div>
  );
};

export default News;
