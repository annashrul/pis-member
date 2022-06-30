import { Row, Col, PageHeader, Card, Image } from "antd";
import React, { useEffect, useState } from "react";
import { handleGet } from "../../action/baseAction";
import { useAppState } from "../../components/shared/AppProvider";
import Helper from "../../helper/general_helper";
import moment from "moment";
import Router from "next/router";

moment.locale("id");
const DetailBerita = () => {
  const [objNews, setObjNews] = useState({});
  const [font, setFont] = useState("14px");
  const [state] = useAppState();

  useEffect(() => {
    if (state.mobile) {
      setFont("80%");
    }
    handleDetail();
  }, []);

  const handleDetail = async () => {
    await handleGet(
      `content/get/${Router.router.query.id_berita}`,
      (res, status, msg) => {
        setObjNews(res.data);
      }
    );
  };

  const temp = () => {
    return (
      Object.keys(objNews).length > 0 && (
        <Row gutter={16}>
          <Col xs={24} sm={24} md={16}>
            <Card
              title={<small style={{ fontSize: font }}>{objNews.title}</small>}
              cover={<Image src={objNews.picture} />}
            >
              <small style={{ fontSize: font }}>
                {objNews.user} | {objNews.category} |{" "}
                {moment(
                  objNews.created_at ? objNews.created_at : moment().format()
                ).format("LLL")}
              </small>
              <hr />
              <small style={{ fontSize: font }}>
                {Helper.rmHtml(objNews.caption)}
              </small>
            </Card>
          </Col>
        </Row>
      )
    );
  };

  return state.mobile ? (
    <PageHeader
      className="site-page-header"
      onBack={() => Router.back()}
      title="Kembali"
    >
      {temp()}
    </PageHeader>
  ) : (
    temp()
  );
};

export default DetailBerita;
