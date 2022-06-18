import { Col, Tag, Row, Skeleton, Card, PageHeader } from "antd";
import React, { useEffect, useState } from "react";
import { handleGet } from "../../action/baseAction";
import Router from "next/router";
const { Meta } = Card;
import Helper from "../../helper/general_helper";
import { useAppState } from "../shared/AppProvider";

const CardNews = ({ callback, wheres = "&page=1&perpage=10&status=1" }) => {
  const [arrNews, setArrNews] = useState([]);
  const [font, setFont] = useState("14px");
  const [state] = useAppState();
  const [loading, setLoading] = useState(true);
  const [dummyData, setDummyData] = useState(["a", "a", "a", "a"]);

  useEffect(() => {
    if (state.mobile) {
      setFont("80%");
    }
    handleLoadNews(wheres);
  }, [state, wheres]);

  const handleLoadNews = async (where) => {
    await handleGet(`content?${where}`, (res, status, msg) => {
      setArrNews(res.data);
      callback(res);
      setLoading(false);
    });
  };

  return !loading && arrNews.length
    ? arrNews.map((val, key) => {
        let desc = Helper.rmHtml(val.caption);
        if (desc.length > state.mobile ? 50 : 100) {
          desc = desc.substr(0, state.mobile ? 50 : 100) + " ..";
        }
        return (
          <Col
            key={key}
            xs={12}
            sm={8}
            md={6}
            className="mb-2"
            style={{ cursor: "pointer" }}
            onClick={() => {
              Router.push(`/news/${val.id}`);
            }}
          >
            <Card
              style={{ height: !state.mobile ? "330px" : "260px" }}
              title={<small style={{ fontSize: font }}>{val.title}</small>}
              hoverable
              cover={
                <img
                  style={{ height: !state.mobile ? "180px" : "105px" }}
                  alt="example"
                  src={val.picture}
                  onError={({ currentTarget }) => {
                    currentTarget.onerror = null; // prevents looping
                    currentTarget.src = Helper.imgDefault;
                  }}
                />
              }
            >
              <small style={{ fontSize: font }}>{desc}</small>
            </Card>
          </Col>
        );
      })
    : dummyData.map((val, key) => {
        return (
          <Col key={key} xs={12} sm={8} md={6} className="mb-2">
            <Card>
              <Skeleton />
            </Card>
          </Col>
        );
      });
};

export default CardNews;
