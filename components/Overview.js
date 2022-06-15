import { RightCircleOutlined, WalletOutlined } from "@ant-design/icons";
import { Col, Message, Row, Card } from "antd";
import StatCard from "./shared/StatCard";
import { theme } from "./styles/GlobalStyles";
import React, { useEffect, useState } from "react";
import { handleGet } from "../action/baseAction";
import Action from "../action/auth.action";
import Helper from "../helper/general_helper";
import Router from "next/router";
import ProfileComponent from "./profile/profileComponent";
const { Meta } = Card;

const Overview = () => {
  const [objInfo, setObjInfo] = useState({});
  const [arrNews, setArrNews] = useState([]);

  useEffect(() => {
    handleLoadInfo();
    handleLoadNews("&page=1");
  }, []);

  const handleLoadInfo = async () => {
    await handleGet("site/info", (res, status, msg) => {
      setObjInfo(res.data);
      Action.setInfo(res.data);
    });
  };
  const handleLoadNews = async (where) => {
    await handleGet(
      `content?page=1&perpage=10&status=1${where}`,
      (res, status, msg) => {
        setArrNews(res.data);
      }
    );
  };

  return (
    <div>
      <Row gutter={4}>
        <Col xs={24} sm={12} md={6} className="mb-2">
          <StatCard
            type="fill"
            title="Saldo Bonus"
            value={Helper.toRp(parseFloat(objInfo.saldo).toFixed(0))}
            icon={<WalletOutlined style={{ fontSize: "20px" }} />}
            color={theme.primaryColor}
            clickHandler={() => Message.info("Campaign stat button clicked")}
          />
        </Col>
        <Col xs={24} sm={12} md={6} className="mb-2">
          <StatCard
            type="fill"
            title="Saldo Bonus Nasional"
            value={Helper.toRp(parseFloat(objInfo.saldo_pending).toFixed(0))}
            icon={<WalletOutlined style={{ fontSize: "20px" }} />}
            color={theme.darkColor}
            clickHandler={() => Message.info("Customers stat button clicked")}
          />
        </Col>
        <Col xs={24} sm={12} md={6} className="mb-2">
          <StatCard
            type="fill"
            title="Total Penarikan"
            value={Helper.toRp(parseFloat(objInfo.total_wd).toFixed(0))}
            icon={<WalletOutlined style={{ fontSize: "20px" }} />}
            color={theme.warningColor}
            clickHandler={() => Message.info("Queries stat button clicked")}
          />
        </Col>
        <Col xs={24} sm={12} md={6} className="mb-2">
          <StatCard
            type="fill"
            title="Total Omset Nasional"
            value={Helper.toRp(parseFloat(objInfo.omset_nasional).toFixed(0))}
            icon={<WalletOutlined style={{ fontSize: "20px" }} />}
            color={theme.errorColor}
            clickHandler={() => Message.info("Opens stat button clicked")}
          />
        </Col>
      </Row>

      <Row gutter={16}>
        {arrNews.length > 0 && (
          <Col xs={24} sm={24} md={24}>
            <p
              align="right"
              style={{ cursor: "pointer" }}
              onClick={() => Router.push(`/news`)}
            >
              <a>
                Lihat Semua <RightCircleOutlined />
              </a>
            </p>
          </Col>
        )}

        {arrNews.length > 0 &&
          arrNews.map((val, key) => {
            return (
              <Col
                xs={12}
                sm={8}
                md={6}
                className="mb-2"
                style={{ cursor: "pointer" }}
                onClick={() => Router.push(`/news/${key}`)}
              >
                <Card hoverable cover={<img alt="example" src={val.picture} />}>
                  <Meta title={val.title} description={val.caption} />
                </Card>
              </Col>
            );
          })}
      </Row>
    </div>
  );
};

export default Overview;
