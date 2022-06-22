import {
  Col,
  Collapse,
  Message,
  Row,
  Input,
  Card,
  Button,
  Form,
  Select,
  Popconfirm,
  Spin,
} from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import React, { useEffect, useState, useRef } from "react";
import { handleGet, handlePost } from "../../action/baseAction";
import Action from "../../action/auth.action";
import Router from "next/router";
import { StringLink } from "../../helper/string_link_helper";
import general_helper from "../../helper/general_helper";
import { useAppState } from "../shared/AppProvider";
const { Panel } = Collapse;
const { Option } = Select;
const msgInput = "Tidak Boleh Kosong";

const TambahMitra = () => {
  const [state] = useAppState();
  const [form] = Form.useForm();
  const [form1] = Form.useForm();
  const [form2] = Form.useForm();
  const [arrPaymentChannel, setArrPaymentChannel] = useState([]);
  const [arrProduct, setArrProduct] = useState([]);
  const [arrBank, setArrBank] = useState([]);
  const [iconLoading, setIconLoading] = useState(false);
  const [user, setUser] = useState({});
  const [info, setInfo] = useState({});
  const [step, setStep] = useState(0);
  const [, forceUpdate] = useState();
  const [objBank, setObjBank] = useState({});
  const [objPaket, setObjPaket] = useState({});
  const [objPaymentChannel, setObjPaymentChannel] = useState({});
  const [usernameError, setUsernameError] = useState({
    enable: false,
    helpText: "-",
  });
  const usernameErrorRef = useRef(usernameError);
  const usernameInput = useRef(null);
  const [fontSize, setFontSize] = useState("12px");

  useEffect(() => {
    if (state.mobile) {
      setFontSize("80%");
    }
    usernameErrorRef.current = usernameError;
    if (usernameError.enable) {
      usernameInput.current.focus();
      form.validateFields();
    } else {
      if (usernameError.helpText === "-") {
        setInfo(Action.getInfo());
        setUser(Action.getUser());
        forceUpdate({});
        handleProduct();
        handleBank();
        handlePaymentChannel();
      }
    }
  }, [form, usernameError]);

  const handleProduct = async () => {
    await handleGet(
      "paket?page=1&perpage=10&category=5d96d9f0-49bd-49e2-895f-f8171ba3a9ea",
      (datum, isLoading) => {
        setArrProduct(datum.data);
      }
    );
  };
  const handlePaymentChannel = async () => {
    await handleGet("transaction/channel", (datum, isLoading) => {
      setArrPaymentChannel(datum.data);
    });
  };
  const handleBank = async () => {
    await handleGet("transaction/data_bank", (datum, isLoading) => {
      setArrBank(datum.data);
    });
  };

  const handleStep = async (e) => {
    setIconLoading(true);
    await handlePost(
      "auth/validate/username",
      { username: e.username },
      (res, status, msg) => {
        setIconLoading(false);
        if (!status) {
          usernameInput.current.focus();
          setUsernameError({
            enable: true,
            helpText: "username telah digunakan",
          });
        } else {
          setStep(1);
        }
      }
    );
  };
  const handleStep1 = (e) => {
    setStep(2);
  };

  const onFinish = async (e) => {
    const data = {
      fullname: form.getFieldValue("fullname"),
      mobile_no: general_helper.checkNo(form.getFieldValue("mobile_no")),
      username: form.getFieldValue("username"),
      password: form.getFieldValue("password"),
      sponsor: user.referral,
      payment_channel: form1.getFieldValue("payment_channel"),
      id_paket: form1.getFieldValue("id_paket"),
      data_bank: {
        id_bank: objBank.id,
        acc_name: form.getFieldValue("acc_name"),
        acc_no: form.getFieldValue("acc_no"),
      },
    };
    setIconLoading(true);
    await handlePost("auth/signup", data, (res, status, msg) => {
      if (status) {
        localStorage.setItem("linkBack", StringLink.tambahMitra);
        localStorage.setItem("typeTrx", "Mitra Baru");
        localStorage.setItem("kdTrx", res.data.kd_trx);
        // setIconLoading(false);
        Message.success(msg).then(() =>
          Router.push(StringLink.invoiceMitra).then(() => setIconLoading(false))
        );
        // onReset();
      } else {
        setIconLoading(false);
        // Message.info(msg).then(() => setIconLoading(false));
      }
    });
  };

  const onReset = () => {
    form.resetFields();
  };

  const tempRow = (title, desc, isRp = true) => {
    return (
      <Row>
        <Col xs={10} md={10} style={{ alignItems: "left", textAlign: "left" }}>
          <small style={{ fontSize: fontSize }}>{title}</small>
        </Col>
        <Col
          xs={14}
          md={14}
          style={{ alignItems: "right", textAlign: "right" }}
        >
          <small style={{ fontSize: fontSize }}>
            {isRp ? general_helper.toRp(desc) : desc}
          </small>
        </Col>
      </Row>
    );
  };

  return (
    <>
      <Form
        form={form}
        onChange={() => {
          if (usernameError.enable) {
            setUsernameError({ enable: false, helpText: "" });
          }
        }}
        layout="vertical"
        name="addressForm"
        onFinish={handleStep}
        initialValues={{
          sponsor: "NETINDO",
        }}
      >
        {step === 0 && (
          <Row type="flex" justify="center" gutter={10}>
            <Col md={24} xs={24} sm={24} className={"mb-2"}>
              <Card
                title={!state.mobile && "Mitra Baru"}
                extra={
                  <Button size={"small"} type={"info"}>
                    {user.referral}
                  </Button>
                }
              >
                <Row gutter={6}>
                  <Col md={8} xs={24} sm={12}>
                    <Form.Item
                      hasFeedback
                      name={"fullname"}
                      label="Name"
                      rules={[{ required: true, message: msgInput }]}
                    >
                      <Input placeholder="Ex: Jhon Doe" />
                    </Form.Item>
                    <Form.Item
                      hasFeedback
                      name="mobile_no"
                      label="No Handphone"
                      rules={[
                        { required: true, message: "Tidak Boleh Kosong" },
                        {
                          pattern: new RegExp(/^[0-9]*$/),
                          message: "Harus Berupa Angka",
                        },
                        { min: 9, message: "no handphone tidak valid" },
                        { max: 14, message: "no handphone tidak valid" },
                      ]}
                      tooltip={{
                        title: "Minimal 10 Angka",
                        icon: <InfoCircleOutlined />,
                      }}
                    >
                      <Input prefix={"+62"} placeholder="81223165XXXX" />
                    </Form.Item>
                    <Form.Item
                      hasFeedback
                      name={"username"}
                      label="Username"
                      rules={[
                        { required: true, message: msgInput },
                        {
                          pattern: new RegExp(/^[a-zA-Z0-9]*$/),
                          message:
                            "Tidak boleh memasukan selain huruf,angka dan tanpa spasi",
                        },
                        {
                          validator(_, value) {
                            if (usernameError.enable) {
                              return Promise.reject(usernameError.helpText);
                            }
                            return Promise.resolve();
                          },
                        },
                      ]}
                      tooltip={{
                        title:
                          "hanya diperbolehkan huruf,angka dan tanpa spasi",
                        icon: <InfoCircleOutlined />,
                      }}
                    >
                      <Input ref={usernameInput} placeholder="Ex: jhondoe" />
                    </Form.Item>
                  </Col>
                  <Col md={8} xs={24} sm={12}>
                    <Form.Item
                      hasFeedback
                      name={"password"}
                      label="Password"
                      rules={[
                        { required: true, message: msgInput },
                        { min: 6, message: "password minimal 6 karakter" },
                      ]}
                      tooltip={{
                        title: "Minimal 6 Karakter",
                        icon: <InfoCircleOutlined />,
                      }}
                    >
                      <Input.Password />
                    </Form.Item>
                    <Form.Item
                      name="confirm_password"
                      label="Konfirmasi Password"
                      dependencies={["password"]}
                      hasFeedback
                      rules={[
                        {
                          required: true,
                          message: msgInput,
                        },
                        {
                          min: 6,
                          message: "konfirmasi password minimal 6 karakter",
                        },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (!value || getFieldValue("password") === value) {
                              return Promise.resolve();
                            }
                            return Promise.reject(
                              new Error("Password Tidak Sama")
                            );
                          },
                        }),
                      ]}
                    >
                      <Input.Password />
                    </Form.Item>
                    <Form.Item
                      hasFeedback
                      name={"acc_name"}
                      label="Atas Nama"
                      rules={[{ required: true, message: msgInput }]}
                    >
                      <Input placeholder="Ex: Jhon Doe" />
                    </Form.Item>
                  </Col>
                  <Col md={8} xs={24} sm={12}>
                    <Form.Item
                      hasFeedback
                      name="acc_no"
                      label="No Rekening"
                      rules={[
                        { required: true, message: "Tidak Boleh Kosong" },
                        {
                          pattern: new RegExp(/^[0-9]*$/),
                          message: "Harus Berupa Angka",
                        },
                        { min: 10, message: "no rekening tidak valid" },
                      ]}
                      tooltip={{
                        title: "Minimal 10 Angka",
                        icon: <InfoCircleOutlined />,
                      }}
                    >
                      <Input placeholder="XXXXXXXX" />
                    </Form.Item>
                    <Form.Item
                      hasFeedback
                      name="id_bank"
                      label="Bank"
                      rules={[{ required: true, message: msgInput }]}
                    >
                      <Select
                        style={{ width: "100%" }}
                        showSearch
                        placeholder="Pilih Bank"
                        optionFilterProp="children"
                        onChange={(e, i) => form.setFieldsValue({ id_bank: e })}
                        onSearch={() => {}}
                        onSelect={(e, i) =>
                          setObjBank(arrBank[parseInt(i.key, 10)])
                        }
                      >
                        {arrBank.map((val, key) => {
                          return (
                            <Option key={key} value={val.id}>
                              {val.name}
                            </Option>
                          );
                        })}
                      </Select>
                    </Form.Item>

                    <Form.Item shouldUpdate={true} label={`   `}>
                      {() => (
                        <Button
                          loading={iconLoading}
                          style={{ width: "100%" }}
                          type="primary"
                          htmlType="submit"
                          className=""
                        >
                          Lanjut
                        </Button>
                      )}
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        )}
      </Form>

      {step === 1 && (
        <Form
          form={form1}
          layout="vertical"
          name="formSte2"
          onFinish={handleStep1}
        >
          <Row
            type="flex"
            justify="center"
            align="middle"
            style={{ alignItems: "center" }}
            gutter={10}
          >
            <Col
              md={8}
              xs={24}
              className={"mb-2"}
              style={{
                verticalAlign: "middle",
              }}
            >
              <Card
                title={!state.mobile && "Mitra Baru"}
                extra={
                  <Button size={"small"} type={"info"}>
                    {user.referral}
                  </Button>
                }
              >
                <Form.Item
                  hasFeedback
                  name="payment_channel"
                  label="Payment Channel"
                  rules={[{ required: true, message: msgInput }]}
                >
                  <Select
                    style={{ width: "100%" }}
                    showSearch
                    placeholder="Pilih Payment Channel"
                    optionFilterProp="children"
                    onChange={(e) =>
                      form1.setFieldsValue({ payment_channel: e })
                    }
                    onSearch={() => {}}
                    onSelect={(e, i) =>
                      setObjPaymentChannel(
                        arrPaymentChannel[parseInt(i.key, 10)]
                      )
                    }
                  >
                    {arrPaymentChannel.map((val, key) => {
                      return (
                        <Option key={key} value={val.code}>
                          {val.name}
                        </Option>
                      );
                    })}
                  </Select>
                </Form.Item>
                <Form.Item
                  hasFeedback
                  name="id_paket"
                  label="Paket"
                  rules={[{ required: true, message: msgInput }]}
                >
                  <Select
                    style={{ width: "100%" }}
                    showSearch
                    placeholder="Pilih Paket"
                    optionFilterProp="children"
                    onChange={(e) => form1.setFieldsValue({ id_paket: e })}
                    onSearch={() => {}}
                    onSelect={(e, i) =>
                      setObjPaket(arrProduct[parseInt(i.key, 10)])
                    }
                  >
                    {arrProduct.map((val, key) => {
                      return (
                        <Option key={key} value={val.id}>
                          {val.title} - {general_helper.toRp(val.price)}
                        </Option>
                      );
                    })}
                  </Select>
                </Form.Item>
                <Row gutter={6}>
                  <Col xs={12} md={12} sm={12}>
                    <Button
                      style={{ width: "100%" }}
                      type="dashed"
                      primary
                      htmlType="button"
                      className="mt-3"
                      onClick={() => setStep(0)}
                    >
                      Kembali
                    </Button>
                  </Col>
                  <Col xs={12} md={12} sm={12}>
                    <Button
                      style={{ width: "100%" }}
                      type="primary"
                      htmlType="submit"
                      className="mt-3"
                    >
                      Lanjut
                    </Button>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        </Form>
      )}

      {step === 2 && (
        <Form
          form={form2}
          layout="vertical"
          name="formSte3"
          onFinish={onFinish}
        >
          <Row type="flex" justify="center" gutter={10}>
            <Col md={8} xs={24} className={"mb-2"}>
              <Spin
                tip="Tunggu Sebentar..."
                size="large"
                spinning={iconLoading}
              >
                <Card
                  title={!state.mobile && "Mitra Baru"}
                  extra={
                    <Button size={"small"} type={"info"}>
                      {user.referral}
                    </Button>
                  }
                >
                  <small style={{ fontSize: fontSize }}>
                    Total Yang Harus Di Bayar
                  </small>
                  <Row>
                    <Col className="mb-2" md={24} sm={24} xs={24}></Col>
                  </Row>
                  <Button
                    style={{ width: "100%", marginBottom: "2px" }}
                    type="dashed"
                    danger
                    size={"large"}
                  >
                    {general_helper.toRp(
                      parseInt(objPaket.price, 10) +
                        parseInt(info.fee_aktivasi, 10) +
                        parseInt(objPaymentChannel.fee_customer.flat, 10)
                    )}
                  </Button>
                  <Row>
                    <Col className="mb-2" md={24} sm={24} xs={24}></Col>
                  </Row>

                  {tempRow("Nama", form.getFieldValue("fullname"), false)}
                  <Row>
                    <Col md={24} sm={24} xs={24}>
                      <hr />
                    </Col>
                  </Row>
                  {tempRow(
                    "No Handphone",
                    general_helper.checkNo(form.getFieldValue("mobile_no")),
                    false
                  )}
                  <Row>
                    <Col md={24} sm={24} xs={24}>
                      <hr />
                    </Col>
                  </Row>

                  {tempRow("Username", form.getFieldValue("username"), false)}
                  <Row>
                    <Col md={24} sm={24} xs={24}>
                      <hr />
                    </Col>
                  </Row>

                  {tempRow("Bank", objBank.name, false)}
                  <Row>
                    <Col md={24} sm={24} xs={24}>
                      <hr />
                    </Col>
                  </Row>

                  {tempRow("Atas Nama", form.getFieldValue("acc_name"), false)}
                  <Row>
                    <Col md={24} sm={24} xs={24}>
                      <hr />
                    </Col>
                  </Row>

                  {tempRow("No Rekening", form.getFieldValue("acc_no"), false)}

                  <Row>
                    <Col md={24} sm={24} xs={24}>
                      <hr />
                    </Col>
                  </Row>
                  <Collapse bordered={false}>
                    <Panel
                      header={
                        <small style={{ fontSize: fontSize }}>
                          Informasi Paket
                        </small>
                      }
                      key={"0"}
                    >
                      {tempRow("Nama", objPaket.title, false)}
                      {tempRow("Pin Registrasi", info.fee_aktivasi)}
                      {tempRow("Harga", objPaket.price)}
                    </Panel>
                  </Collapse>
                  <Collapse bordered={false}>
                    <Panel
                      header={
                        <small style={{ fontSize: fontSize }}>
                          Metode Pembayaran
                        </small>
                      }
                      key={"0"}
                    >
                      {tempRow(
                        objPaymentChannel.code,
                        objPaymentChannel.name,
                        false
                      )}
                      {tempRow("Admin", objPaymentChannel.fee_customer.flat)}
                    </Panel>
                  </Collapse>
                  <Row>
                    <Col className="mb-2" md={24} sm={24} xs={24}></Col>
                  </Row>

                  {tempRow(
                    "Total",
                    general_helper.toRp(
                      parseInt(objPaket.price, 10) +
                        parseInt(info.fee_aktivasi, 10) +
                        parseInt(objPaymentChannel.fee_customer.flat, 10)
                    )
                  )}

                  <Row gutter={6}>
                    <Col xs={12} sm={12} md={12}>
                      <Button
                        style={{ width: "100%" }}
                        type="dashed"
                        primary
                        htmlType="button"
                        className="mt-3"
                        onClick={() => setStep(1)}
                      >
                        Kembali
                      </Button>
                    </Col>
                    <Col xs={12} sm={12} md={12}>
                      <Popconfirm
                        title="harap periksa data anda kembali"
                        onConfirm={(e) => onFinish(e)}
                        onCancel={() => {}}
                        okText="Lanjut"
                        cancelText="Batal"
                        okType="submit"
                      >
                        <Button
                          style={{ width: "100%" }}
                          type="primary"
                          htmlType="button"
                          className="mt-3"
                          // loading={iconLoading}
                        >
                          Lanjut
                        </Button>
                      </Popconfirm>
                    </Col>
                  </Row>
                </Card>
              </Spin>
            </Col>
          </Row>
        </Form>
      )}
    </>
  );
};

export default TambahMitra;
