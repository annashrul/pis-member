import {
  Col,
  PageHeader,
  Message,
  Row,
  Button,
  Card,
  List,
  Avatar,
  Spin,
  Modal,
  Select,
} from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import { useAppState } from "../shared/AppProvider";
import React, { useEffect, useState } from "react";
import { handleGet, handlePost } from "../../action/baseAction";
import Router from "next/router";
import Helper from "../../helper/general_helper";
import { StringLink } from "../../helper/string_link_helper";
import ModalPin from "../ModalPin";
const { Option } = Select;

const CheckoutProduct = () => {
  const [state] = useAppState();
  const [arrKurir, setArrKurir] = useState([]);
  const [arrChannel, setArrChannel] = useState([]);
  const [arrLayanan, setArrLayanan] = useState([]);
  const [arrAddress, setArrAddress] = useState([]);
  const [idxKurir, setIdxKurir] = useState(0);
  const [idxLayanan, setIdxLayanan] = useState(0);
  const [objAddress, setObjAddress] = useState({});
  const [objProduct, setObjProduct] = useState({});
  const [subtotal, setSubtotal] = useState(0);
  const [ongkir, setOngkir] = useState(0);
  const [total, setTotal] = useState(0);
  const [loadingLayanan, setLoadingLayanan] = useState(true);
  const [idxPayment, setIdxPayment] = useState(0);
  const [isModal, setIsModal] = useState(false);
  const [loadingPin, setLoadingPin] = useState(false);

  useEffect(() => {
    if (Object.keys(Router.query).length > 0) {
      setSubtotal(parseInt(Router.query.price, 10));
      setTotal(parseInt(Router.query.price, 10));
      setObjProduct(Router.query);
      handleLoadAddress();
      handleLoadChannel();
    } else {
      Message.info("terjadi kesalahan")
        .then(() => Message.info("anda akan diarahkan ke halaman produk", 2.5))
        .then(() => Router.push(StringLink.product));
    }
  }, []);
  const handleLoadAddress = async () => {
    await handleGet("address?page=1", (datum, isLoading) => {
      setObjAddress(datum.data[0]);
      handleLoadKurir();
      setArrAddress(datum.data);
    });
  };

  const handleLoadKurir = async () => {
    await handleGet("transaction/kurir/show", (datum, isLoading) => {
      setArrKurir(datum.data);
      handleLayanan(idxKurir, Router.query.kd_kec, datum.data[idxKurir].kurir);
    });
  };

  const handleLayanan = async (idx, addr, kurir) => {
    setArrLayanan([]);
    setLoadingLayanan(true);
    const field = { ke: addr, berat: "100", kurir: kurir };
    await handlePost(
      "transaction/kurir/cek/ongkir",
      field,
      (datum, status, msg) => {
        setIdxKurir(idx);
        if (!status) {
          setArrLayanan([]);
          setLoadingLayanan(false);
          setOngkir(0);
        } else {
          setLoadingLayanan(false);
          setArrLayanan(datum.data.ongkir);
          setOngkir(
            parseInt(
              datum.data.ongkir.length > 0 ? datum.data.ongkir[0].cost : 0,
              10
            )
          );
          setIdxLayanan(0);
        }
      }
    );
  };

  const handleLoadChannel = async () => {
    await handleGet("transaction/channel", (datum, isLoading) => {
      setArrChannel(datum.data);
    });
  };

  const handleCheckout = async (pin) => {
    setLoadingPin(true);
    const data = {
      member_pin: pin,
      payment_channel: arrChannel[idxPayment].code,
      ongkir: ongkir,
      jasa_pengiriman: arrKurir[idxKurir].kurir,
      id_alamat: objAddress.id,
      id_paket: objProduct.id_paket,
    };
    await handlePost("transaction/checkout", data, (res, status, msg) => {
      if (status) {
        localStorage.setItem("linkBack", StringLink.product);
        localStorage.setItem("typeTrx", "Produk RO");
        localStorage.setItem("kdTrx", res.data);
        Message.success(msg).then(() => {
          Router.push(StringLink.invoiceProduct).then(() => {
            setLoadingPin(false);
            setIsModal(false);
          });
        });
      } else {
        setLoadingPin(false);
      }
    });
  };

  return (
    <div>
      <Row gutter={16}>
        <Col xs={24} sm={24} md={24}>
          <PageHeader
            className="site-page-header"
            onBack={() => Router.back()}
            title={`Pembayaran`}
          />
        </Col>
        <Col xs={24} sm={12} md={18}>
          <Row>
            <Col xs={24} sm={24} md={24}>
              <Card
                className="mb-2"
                title="Alamat"
                extra={
                  <Select
                    style={{ width: "100%" }}
                    showSearch
                    placeholder="Pilih Alamat"
                    optionFilterProp="children"
                    onSearch={() => {}}
                    onSelect={(e, i) =>
                      setObjAddress(arrAddress[parseInt(i.key, 10)])
                    }
                  >
                    {arrAddress.map((val, key) => {
                      return (
                        <Option key={key} value={val.title}>
                          {val.title}
                        </Option>
                      );
                    })}
                  </Select>
                }
              >
                <List
                  dataSource={[objAddress]}
                  renderItem={(item, key) => (
                    <List.Item className="border-bottom-0" key={key}>
                      <List.Item.Meta
                        title={
                          <span>
                            {item.penerima}, {item.no_hp}
                          </span>
                        }
                        description={
                          <span className="">{`${objAddress.main_address}, kecamatan ${objAddress.kecamatan}, kota ${objAddress.kota}, provinsi ${objAddress.provinsi}`}</span>
                        }
                      />
                    </List.Item>
                  )}
                />
              </Card>
            </Col>
            <Col xs={24} sm={24} md={24}>
              <Card className="mb-2" title="Kurir">
                {arrKurir.length > 0 &&
                  arrKurir.map((val, key) => {
                    return (
                      <Button
                        key={key}
                        size="small"
                        type={idxKurir === key ? `primary` : `info`}
                        className={"mr-2 mb-2 mt-2"}
                        onClick={() => {
                          handleLayanan(key, objAddress.kd_kec, val.kurir);
                        }}
                      >
                        <small>{val.title}</small>
                      </Button>
                    );
                  })}
              </Card>
            </Col>
            <Col xs={24} sm={24} md={24}>
              <Spin spinning={loadingLayanan}>
                <Card
                  className="mb-2"
                  title={`Layanan ${
                    arrKurir.length > 0 && arrKurir[idxKurir]["title"]
                  }`}
                >
                  {arrLayanan.length > 0
                    ? arrLayanan.map((val, key) => {
                        return (
                          <Button
                            key={key}
                            size="small"
                            type={idxLayanan === key ? "primary" : "info"}
                            className={"mb-2 mt-2 mr-2"}
                            onClick={() => {
                              setIdxLayanan(key);
                              setOngkir(parseInt(val.cost, 10));
                            }}
                          >
                            <small>
                              {val.description} | {Helper.toRp(val.cost)} |{" "}
                              {val.estimasi}
                            </small>
                          </Button>
                        );
                      })
                    : "tidak ada layanan yang tersedia"}
                </Card>
              </Spin>
            </Col>
            <Col xs={24} sm={24} md={24}>
              <Card className="mb-2" title={`Channel Pembayaran`}>
                <List
                  bordered={false}
                  itemLayout="horizontal"
                  dataSource={arrChannel}
                  renderItem={(item, key) => (
                    <List.Item
                      onClick={() => {
                        setIdxPayment(key);
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      <List.Item.Meta
                        avatar={
                          <img
                            alt={item.logo}
                            src={item.logo}
                            onError={({ currentTarget }) => {
                              currentTarget.onerror = null; // prevents looping
                              currentTarget.src = Helper.imgDefault;
                            }}
                            width="100px"
                            height="40px"
                          />
                        }
                        title={item.name}
                        description={`Admin : ${Helper.toRp(
                          item.fee_customer.flat
                        )}`}
                      />
                      {key === idxPayment && (
                        <div>
                          <CheckCircleOutlined />
                        </div>
                      )}
                    </List.Item>
                  )}
                />
              </Card>
            </Col>
          </Row>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Row>
            <Col xs={24} sm={24} md={24}>
              <Card className="mb-2" title="Ringkasan Produk">
                <List
                  dataSource={
                    Object.keys(objProduct).length > 0 ? [objProduct] : []
                  }
                  renderItem={(item, key) => (
                    <List.Item className="border-bottom-0" key={key}>
                      <List.Item.Meta
                        avatar={
                          <Avatar
                            size={48}
                            style={{
                              color: "rgb(143, 0, 245)",
                              backgroundColor: "rgb(214, 207, 253)",
                            }}
                          >
                            {item.gambar}
                          </Avatar>
                        }
                        title={item.title}
                        description={
                          <span className="">{Helper.toRp(item.price)}</span>
                        }
                      />
                    </List.Item>
                  )}
                />
              </Card>
              <Card className="mb-2">
                <Row>
                  <Col xs={12} md={12}>
                    <p>Subtotal</p>
                  </Col>
                  <Col xs={12} md={12}>
                    <p className="text-right">{Helper.toRp(subtotal)}</p>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12} md={12}>
                    <p>Ongkos Kirim</p>
                  </Col>
                  <Col xs={12} md={12}>
                    <p className="text-right">{Helper.toRp(ongkir)}</p>
                  </Col>
                </Row>
                <hr />
                <Row>
                  <Col xs={12} md={12}>
                    <p>Total Belanja</p>
                  </Col>
                  <Col xs={12} md={12}>
                    <p className="text-right">{Helper.toRp(total + ongkir)}</p>
                  </Col>
                </Row>
              </Card>

              <Card>
                <Button
                  disabled={arrLayanan.length < 1}
                  style={{ width: "100%" }}
                  size="medium"
                  type={"primary"}
                  onClick={() => {
                    setIsModal(true);
                  }}
                >
                  Bayar
                </Button>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
      {isModal && (
        <ModalPin
          loading={loadingPin}
          submit={(pin) => {
            handleCheckout(pin);
          }}
          cancel={(isShow) => {
            setIsModal(false);
          }}
          modalPin={isModal}
        />
      )}
    </div>
  );
};

export default CheckoutProduct;
