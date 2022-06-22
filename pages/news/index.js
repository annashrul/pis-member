import { Col, Tag, Button, Message, Row, Card, PageHeader } from "antd";
import React, { useEffect, useState } from "react";
import { handleGet } from "../../action/baseAction";
import Router from "next/router";
const { Meta } = Card;
import Helper from "../../helper/general_helper";
import { useAppState } from "../../components/shared/AppProvider";
import CardNews from "../../components/news/cardNews";
const News = () => {
  const [arrNews, setArrNews] = useState([]);
  const [font, setFont] = useState("14px");
  const [state] = useAppState();

  useEffect(() => {
    if (state.mobile) {
      setFont("80%");
    }
  }, [state]);

  return state.mobile ? (
    <PageHeader
      className="site-page-header"
      onBack={() => Router.back()}
      title="Informasi Terbaru"
    >
      <Row gutter={16}>
        <CardNews
          callback={(res) => {
            setArrNews(res);
          }}
          isLoadMore={true}
          pagePer={8}
        />
      </Row>
    </PageHeader>
  ) : (
    <Row gutter={16}>
      <CardNews
        callback={(res) => {
          setArrNews(res);
        }}
        isLoadMore={true}
        pagePer={8}
      />
    </Row>
  );
};

export default News;
