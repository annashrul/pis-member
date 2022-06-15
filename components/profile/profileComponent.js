import { Avatar, Button, Badge, Card, Col, Row, Tooltip } from "antd";
import { theme } from "../styles/GlobalStyles";
import { CameraOutlined } from "@ant-design/icons";
import { useAppState } from "../shared/AppProvider";
import { useState, useEffect } from "react";
import authAction from "../../action/auth.action";
import { CopyOutlined } from "@ant-design/icons";
import general_helper from "../../helper/general_helper";
import moment from "moment";
moment.lang("id");
const ProfileComponent = ({ children }) => {
  const [state] = useAppState();
  const [user, setUser] = useState({});
  const [info, setInfo] = useState({});
  const [font, setFont] = useState("14px");
  useEffect(() => {
    if (state.mobile) {
      setFont("80%");
    }
    const users = authAction.getUser();
    const infos = authAction.getInfo();
    setUser(users);
    setInfo(infos);
    console.log(users);
  }, [state]);
  const tempRow = (title, desc, isRp = true) => {
    return (
      <Row>
        <Col xs={10} md={10} style={{ alignItems: "left", textAlign: "left" }}>
          <small style={{ fontSize: font }}>{title}</small>
        </Col>
        <Col
          xs={14}
          md={14}
          style={{
            alignItems: state.mobile ? "right" : "left",
            textAlign: state.mobile ? "right" : "left",
          }}
        >
          <small style={{ fontSize: font }}>
            {!state.mobile && ":"} {desc}
          </small>
        </Col>
      </Row>
    );
  };

  console.log("user", user.fullname);
  return (
    <div>
      <Card
        headStyle={{
          backgroundImage: "url(/images/23.jpg)",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center center",
        }}
        bodyStyle={{ padding: 10 }}
        className="mb-4 overflow-hidden w-100"
        title={
          <Row type="flex" align="middle">
            <Badge
              count={
                <CameraOutlined style={{ color: "red", cursor: "pointer" }} />
              }
            >
              <Avatar size={50} shape="square" src={user.foto}>
                {" "}
                {user.fullname !== undefined &&
                  general_helper.getInitialName(user.fullname)}
              </Avatar>
            </Badge>
            <div
              className="px-2 text-light"
              css={`
                display: inline-block;
              `}
            >
              <h5 className="my-0 text-white">
                <span>{user.fullname}</span>
              </h5>
              <small>
                {user.referral} &nbsp;
                <Tooltip title="copy kode referral">
                  <CopyOutlined style={{ marginLeft: "1px" }} />
                </Tooltip>
              </small>
            </div>
          </Row>
        }
        extra={
          <Row
            style={{ display: !state.mobile ? "block" : "none" }}
            type="flex"
            align="middle"
            className="p-4"
          >
            <Button type="primary">Ubah Profile</Button>
          </Row>
        }
      >
        {tempRow("Username", user.uid)}
        <Row>
          <Col style={{ margin: "1px" }}></Col>
        </Row>
        {tempRow("No Handphone", user.mobile_no)}
        <Row>
          <Col style={{ margin: "1px" }}></Col>
        </Row>
        {tempRow("Tanggal Recycle", moment(user.recycle_date).format("LLL"))}
        <Row>
          <Col style={{ margin: "1px" }}></Col>
        </Row>
      </Card>
      <Row gutter={4}>
        <Col xs={12} sm={12} md={6} className="mb-1">
          <Card style={{ backgroundColor: theme.primaryColor }} size="small">
            <small style={{ fontSize: font }} className="text-white">
              {general_helper.toRp(parseFloat(info.saldo).toFixed(0))}{" "}
            </small>
            <br />
            <small style={{ fontSize: font }} className="text-white">
              Saldo Bonus
            </small>
          </Card>
        </Col>
        <Col xs={12} sm={12} md={6} className="mb-1">
          <Card
            style={{ backgroundColor: theme.darkColor, padding: 0 }}
            size="small"
          >
            <small className="text-white" style={{ fontSize: font }}>
              {general_helper.toRp(parseFloat(info.saldo_pending).toFixed(0))}{" "}
            </small>
            <br />
            <small style={{ fontSize: font }} className="text-white">
              Saldo Bonus Nasional
            </small>
          </Card>
        </Col>

        <Col xs={12} sm={12} md={6} className="mb-1">
          <Card style={{ backgroundColor: theme.warningColor }} size="small">
            <small className="text-white" style={{ fontSize: font }}>
              {general_helper.toRp(parseFloat(info.total_wd).toFixed(0))}{" "}
            </small>
            <br />
            <small style={{ fontSize: font }} className="text-white">
              Total Penarikan
            </small>
          </Card>
        </Col>
        <Col xs={12} sm={12} md={6} className="mb-1">
          <Card style={{ backgroundColor: theme.errorColor }} size="small">
            <small className="text-white" style={{ fontSize: font }}>
              {general_helper.toRp(parseFloat(info.omset_nasional).toFixed(0))}{" "}
            </small>
            <br />
            <small style={{ fontSize: font }} className="text-white">
              Total Omset Nasional
            </small>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ProfileComponent;
