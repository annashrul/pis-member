import {
  Col,
  Row,
  Card,PageHeader 
} from 'antd';
import React, { useEffect, useState } from 'react';
import { handleGet } from '../../action/baseAction';
import Router from 'next/router';
const { Meta } = Card;
const News = () => {
  const [arrNews, setArrNews] = useState([]);

  useEffect(() => {
    handleLoadNews("&page=1");
  }, []);

 
  const handleLoadNews = async(where)=>{
    await handleGet(`content?page=1&perpage=10&status=1${where}`,(res,status,msg)=>{
      setArrNews(res.data);
    })
  }
  

  return (
    <div>
        <PageHeader
            className="site-page-header"
            onBack={() => Router.back()}
            title="Berita Terbaru"
        >
      <Row gutter={16}>
        
      
        {
              arrNews.length>0&&arrNews.map((val,key)=>{
                return(
                  <Col xs={12} sm={8} md={6} className="mb-2" style={{cursor:"pointer"}} onClick={()=>Router.push(`/news/${val.id}`)}>
                    <Card
                      hoverable
                      cover={<img alt="example" src={val.picture} />}
                    >
                      <Meta title={val.title} description={val.caption} />
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
