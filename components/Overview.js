import {
  RightCircleOutlined,
  WalletOutlined,
  CopyOutlined,
} from "@ant-design/icons";
import { Col, Message, Button, Row, Card } from "antd";
import StatCard from "./shared/StatCard";
import { theme } from "./styles/GlobalStyles";
import React, { useEffect, useState } from "react";
import { handleGet } from "../action/baseAction";
import Action from "../action/auth.action";
import Helper from "../helper/general_helper";
import Router from "next/router";
import { useAppState } from "./shared/AppProvider";
import CardNews from "./news/cardNews";
const { Meta } = Card;

const Overview = () => {
  const [objInfo, setObjInfo] = useState({});
  const [objUser, setObjUser] = useState({});
  const [isData, setIsData] = useState(false);
  const [font, setFont] = useState("14px");
  const [state] = useAppState();

  useEffect(() => {
    if (state.mobile) {
      setFont("80%");
    }
    handleLoadInfo();
  }, [isData]);

  const handleLoadInfo = async () => {
    await handleGet("site/info", (res, status, msg) => {
      setObjInfo(res.data);
      Action.setInfo(res.data);
      const user = Action.getUser();
      setObjUser(user);
    });
  };

  const cardMobile = (bg, saldo, title) => {
    return (
      <Card style={{ backgroundColor: bg }} size="small">
        <small style={{ fontSize: font }} className="text-white">
          {Helper.toRp(parseFloat(saldo).toFixed(0))}{" "}
        </small>
        <br />
        <small style={{ fontSize: font }} className="text-white">
          {title}
        </small>
      </Card>
    );
  };

  console.log(objUser);

  return (
    <div>
      <Row gutter={4}>
        <Col xs={24} sm={24} md={24} className="mb-2">
          <Button
            type="dashed"
            danger
            icon={<CopyOutlined />}
            style={{ whiteSpace: "normal", height: "auto", width: "100%" }}
            block={true}
            onClick={async (e) => {
              await navigator.clipboard.writeText(objUser.referral_url);
              Message.success("Referral berhasil di salin");
            }}
          >
            {objUser && objUser.referral_url}
          </Button>
        </Col>
        <Col xs={12} sm={12} md={6} className="mb-2">
          {state.mobile ? (
            cardMobile(theme.primaryColor, objInfo.saldo, "Saldo Bonus")
          ) : (
            <StatCard
              type="fill"
              title="Saldo Bonus"
              value={Helper.toRp(parseFloat(objInfo.saldo).toFixed(0))}
              icon={<WalletOutlined style={{ fontSize: "20px" }} />}
              color={theme.primaryColor}
            />
          )}
        </Col>
        <Col xs={12} sm={12} md={6} className="mb-2">
          {state.mobile ? (
            cardMobile(
              theme.darkColor,
              objInfo.saldo_pending,
              "Saldo Bonus Nasional"
            )
          ) : (
            <StatCard
              type="fill"
              title="Saldo Bonus Nasional"
              value={Helper.toRp(parseFloat(objInfo.saldo_pending).toFixed(0))}
              icon={<WalletOutlined style={{ fontSize: "20px" }} />}
              color={theme.darkColor}
            />
          )}
        </Col>
        <Col xs={12} sm={12} md={6} className="mb-2">
          {state.mobile ? (
            cardMobile(theme.warningColor, objInfo.total_wd, "Total Penarikan")
          ) : (
            <StatCard
              type="fill"
              title="Total Penarikan"
              value={Helper.toRp(parseFloat(objInfo.total_wd).toFixed(0))}
              icon={<WalletOutlined style={{ fontSize: "20px" }} />}
              color={theme.warningColor}
            />
          )}
        </Col>
        <Col xs={12} sm={12} md={6} className="mb-2">
          {state.mobile ? (
            cardMobile(
              theme.errorColor,
              objInfo.omset_nasional,
              "Total Omset Nasional"
            )
          ) : (
            <StatCard
              type="fill"
              title="Total Omset Nasional"
              value={Helper.toRp(parseFloat(objInfo.omset_nasional).toFixed(0))}
              icon={<WalletOutlined style={{ fontSize: "20px" }} />}
              color={theme.errorColor}
            />
          )}
        </Col>
      </Row>

      {isData && (
        <Row>
          <Col xs={24} md={24} sm={24}>
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
        </Row>
      )}

      <Row gutter={16} type="flex">
        <CardNews
          callback={(res) => {
            setIsData(res.data.length > 0);
          }}
        />
      </Row>
    </div>
  );
};

export default Overview;
