import {
  Col,
  Button,
  Skeleton,
  Card,
  Message,
  PageHeader,
  Row,
  Empty,
} from "antd";
import React, { useEffect, useState } from "react";
import { handleGet } from "../../action/baseAction";
import Router from "next/router";
import Helper from "../../helper/general_helper";
import { StringLink } from "../../helper/string_link_helper";
import Action from "../../action/auth.action";
const { Meta } = Card;

const ListProduct = () => {
  const [loading, setLoading] = useState(false);
  const [arrDatum, setArrDatum] = useState([]);
  const [info, setInfo] = useState(false);
  const [address, setAddress] = useState(false);
  const [objAddress, setObjAddress] = useState({});
  const [dummyData, setDummyData] = useState(["a", "a", "a", "a"]);

  useEffect(() => {
    handleLoadData("");
    handleLoadInfo();
    handleLoadAddress();
  }, []);
  const handleLoadInfo = async () => {
    const infos = Action.getInfo();
    setInfo(infos);
  };
  const handleLoadAddress = async () => {
    await handleGet("address?page=1", (datum, isLoading) => {
      setAddress(datum.data.length > 0);

      setObjAddress(datum.data[0]);
    });
  };
  const handleLoadData = async (val) => {
    setLoading(true);
    await handleGet(
      "paket?page=1&perpage=10&category=1ec17e57-0c5c-4867-958d-195e577eabeb",
      (datum, isLoading) => {
        setLoading(false);
        setArrDatum(datum);
      }
    );
  };

  return (
    <>
      <Row gutter={16}>
        {!loading ? (
          arrDatum.data !== undefined && arrDatum.data.length > 0 ? (
            arrDatum.data.map((val, key) => {
              return (
                <Col
                  key={key}
                  xs={12}
                  sm={8}
                  md={6}
                  className="mb-2"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    if (!address) {
                      Message.success(
                        "anda belum mempunya alamat, anda akan dialihkan untuk membuat alamat"
                      ).then(() => Router.push(StringLink.address));
                    } else {
                      if (!info.check_hak_ro) {
                        Message.info("anda belum memenuhi syarat RO");
                      } else {
                        if (parseInt(val.stock, 10) < 1) {
                          Message.info("stock tidak tersedia");
                        } else if (val.id_type === info.type_ro) {
                          Message.info("Paket ini bukan paket RO anda");
                        } else {
                          Object.assign(val, { id_paket: val.id });
                          Object.assign(objAddress, val);
                          Router.push(
                            {
                              pathname: StringLink.checkout,
                              query: objAddress,
                            },
                            StringLink.checkout
                          );
                        }
                      }
                    }
                  }}
                >
                  <Card
                    title={<small>{val.title}</small>}
                    hoverable
                    cover={
                      <img
                        alt={val.gambar}
                        src={val.gambar}
                        onError={({ currentTarget }) => {
                          currentTarget.onerror = null; // prevents looping
                          currentTarget.src = Helper.imgDefault;
                        }}
                      />
                    }
                  >
                    <Meta description={Helper.toRp(val.price)} />
                    <small>{Helper.rmHtml(val.caption)}</small>
                    <Row className="mt-2">
                      <Col xs={24} sm={24} md={24}>
                        <Button type="primary" style={{ width: "100%" }}>
                          Checkout
                        </Button>
                      </Col>
                    </Row>
                  </Card>
                </Col>
              );
            })
          ) : (
            <Empty />
          )
        ) : (
          dummyData.map((val, key) => {
            return (
              <Col key={key} xs={12} sm={8} md={6}>
                <Skeleton />
              </Col>
            );
          })
        )}
      </Row>
    </>
  );
};

export default ListProduct;
