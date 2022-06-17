import {
  Button,
  PageHeader,
  Popconfirm,
  notification,
  Form,
  Row,
  Col,
  Select,
  Radio,
  Input,
  Card,
  message,
  Spin,
} from "antd";
import React, { useRef, useEffect, useState } from "react";
import { theme } from "../styles/GlobalStyles";
import Helper from "../../helper/general_helper";
import { handleGet, handlePost } from "../../action/baseAction";
import ModalPin from "../ModalPin";
import Action from "../../action/auth.action";
import Router from "next/router";
import { useAppState } from "../shared/AppProvider";
const { Option } = Select;

const CreateWithdraw = () => {
  const [state] = useAppState();
  const [form] = Form.useForm();
  const [idxPayment, setIdxPayment] = useState(0);
  const [modalPin, setModalPin] = useState(false);
  const [bonus, setBonus] = useState(0);
  const [rekening, setRekening] = useState([]);
  const [bonusNasional, setBonusNasional] = useState(0);
  const [amount, setAmount] = useState(0);
  const [minWd, setMinWd] = useState(0);
  const [maxWdBonusNasional, setMaxWdBonusNasional] = useState(3000000);
  const [type, setType] = useState("0");
  const [config, setConfig] = useState({});
  const [nominalError, setNominalError] = useState({
    enable: false,
    helpText: "-",
  });
  const nominalErrorRef = useRef(nominalError);
  const nominalInput = useRef(null);
  const [fontSize, setFontSize] = useState("14px");
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const [dataField, setDataField] = useState({
    member_pin: "",
    id_bank: "",
    acc_name: "",
    acc_no: "",
    amount: "",
    type: 0,
  });

  useEffect(() => {
    if (state.mobile) {
      setFontSize("80%");
    }
    // setType("0");
    nominalErrorRef.current = nominalError;
    if (nominalError.enable) {
      nominalInput.current.focus();
      form.validateFields();
    } else {
      if (nominalError.helpText === "-") {
        handleLoadConfig();
        handleLoadInfo();
      }
    }
  }, [nominalError, state]);

  const handleLoadInfo = async () => {
    await handleGet("site/info", (datum, isLoading) => {
      setBonus(parseInt(datum.data.saldo, 10));
      setAmount(datum.data.saldo);
      setRekening([datum.data.rekening]);
      setBonusNasional(parseInt(datum.data.saldo_pending, 10));
      Action.setInfo(datum.data);
    });
  };
  const handleLoadConfig = async () => {
    await handleGet("site/config", (datum, isLoading) => {
      setMinWd(parseInt(datum.data.min_wd, 10));
      setConfig(datum.data);
    });
  };

  const onChange = (e) => {
    let val = e.target.value;
    if (e.target.type === "radio") {
      setType(val);
      if (val === "1") {
        if (bonusNasional < maxWdBonusNasional) {
          form.setFieldsValue({ amount: bonusNasional });
          setAmount(bonusNasional);
        } else {
          form.setFieldsValue({ amount: maxWdBonusNasional });
          setAmount(maxWdBonusNasional);
        }
      } else {
        form.setFieldsValue({ amount: bonus });
      }
    } else {
      setAmount(val);
    }
  };

  const handleSubmit = async (e) => {
    let nominal = parseInt(e.amount, 10);

    if (type === "0") {
      if (nominal < minWd) {
        setNominalError({
          enable: true,
          helpText: "Minimal Penarikan Sebesar " + Helper.toRp(minWd),
        });
        return;
      }
      if (nominal > bonus) {
        setNominalError({
          enable: true,
          helpText: "Nominal Melebihi Bonus Anda",
        });
        return;
      }
    } else {
      if (bonusNasional < maxWdBonusNasional) {
        setNominalError({
          enable: true,
          helpText:
            "Penarikan Harus Sebesar " + Helper.toRp(maxWdBonusNasional),
        });
        return;
      }
    }

    let field = dataField;
    Object.assign(field, {
      amount: nominal,
      type: type,
      id_bank: rekening[idxPayment].id,
      acc_name: rekening[idxPayment].acc_name,
      acc_no: rekening[idxPayment].acc_no,
    });

    if (step === 0) {
      setStep(1);
    }

    setDataField(field);
  };

  const handleFinish = async (e) => {
    let field = dataField;
    Object.assign(field, { member_pin: e });
    setLoading(true);
    await handlePost("transaction/withdrawal", field, (res, status, msg) => {
      if (status) {
        setModalPin(false);
        notification.open({
          message: res.meta.status,
          description: res.meta.message,
          onClose: () => {
            setStep(0);
            form.resetFields();
            handleLoadInfo();
          },
        });
      }
      setLoading(false);
    });
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
            {isRp ? Helper.toRp(desc) : desc}
          </small>
        </Col>
      </Row>
    );
  };

  return (
    <div>
      <Form
        onChange={() => {
          if (nominalError.enable) {
            setNominalError({ enable: false, helpText: "" });
          }
        }}
        form={form}
        layout="vertical"
        name="register"
        onFinish={handleSubmit}
        initialValues={{
          type: "0",
        }}
      >
        <Row
          type="flex"
          style={{ alignItems: "center" }}
          justify="center"
          gutter={10}
        >
          <Col md={4} xs={12}>
            <small style={{ fontSize: fontSize }}>
              Saldo Bonus <br />
              <span style={{ fontSize: "18px", color: theme.primaryColor }}>
                {Helper.toRp(bonus)}
              </span>
            </small>
          </Col>
          <Col md={4} xs={12}>
            <small style={{ fontSize: fontSize }}>
              Saldo Bonus Nasional
              <br />
              <span style={{ fontSize: "18px", color: theme.primaryColor }}>
                {Helper.toRp(parseFloat(bonusNasional).toFixed(0))}
              </span>
            </small>
          </Col>
        </Row>
        <Row>
          <Col md={24} xs={24} sm={24} className="mb-2" />
        </Row>
        {step === 0 && (
          <Row
            type="flex"
            style={{ alignItems: "center" }}
            justify="center"
            gutter={4}
          >
            <Col md={8} xs={24}>
              <Card>
                <Form.Item
                  style={{
                    marginBottom: 0,
                  }}
                  name="type"
                  label={
                    <small style={{ fontSize: fontSize }}>Tipe Withdraw</small>
                  }
                  onChange={onChange}
                >
                  <Radio.Group buttonStyle="outline" style={{ width: "100%" }}>
                    <Radio.Button value="0" style={{ width: "50%" }}>
                      <small style={{ fontSize: fontSize }}>Bonus</small>
                    </Radio.Button>
                    <Radio.Button value="1" style={{ width: "50%" }}>
                      <small style={{ fontSize: fontSize }}>
                        Bonus Nasional
                      </small>
                    </Radio.Button>
                  </Radio.Group>
                </Form.Item>
                <Form.Item
                  hasFeedback
                  name="id_bank"
                  label={
                    <small style={{ fontSize: fontSize }}>Bank Tujuan</small>
                  }
                  rules={[{ required: true, message: "Tidak Boleh Kosong" }]}
                >
                  <Select
                    style={{ width: "100%" }}
                    showSearch
                    placeholder="Pilih Bank"
                    optionFilterProp="children"
                    onChange={(e, i) => form.setFieldsValue({ id_bank: e })}
                    onSearch={() => {}}
                    onSelect={(e, i) => setIdxPayment(parseInt(i.key, 10))}
                  >
                    {rekening.map((val, key) => {
                      return (
                        <Option key={key} value={val.id}>
                          {val.bank_name}
                        </Option>
                      );
                    })}
                  </Select>
                </Form.Item>
                <Form.Item
                  label={<small style={{ fontSize: fontSize }}>Nominal</small>}
                >
                  <Row gutter={4}>
                    <Col
                      xs={type === "0" ? 14 : 24}
                      sm={type === "0" ? 14 : 24}
                      md={type === "0" ? 14 : 24}
                    >
                      <Form.Item
                        hasFeedback
                        onChange={onChange}
                        name="amount"
                        rules={[
                          { required: true, message: "Tidak Boleh Kosong" },
                          {
                            pattern: new RegExp(/^[0-9]*$/),
                            message: "Harus Berupa Angka",
                          },
                          {
                            validator(_, value) {
                              if (nominalError.enable) {
                                return Promise.reject(nominalError.helpText);
                              }
                              return Promise.resolve();
                            },
                          },
                        ]}
                      >
                        <Input
                          style={{ fontSize: state.mobile ? "12px" : "14px" }}
                          ref={nominalInput}
                          disabled={type === "1"}
                          prefix={"Rp."}
                        />
                      </Form.Item>
                    </Col>
                    {type === "0" && (
                      <Col xs={10} sm={10} md={10}>
                        <Button
                          onClick={(e) => {
                            e.preventDefault();
                            form.setFieldsValue({ amount: bonus });
                          }}
                          type="dashed"
                          primary
                          style={{ width: "100%" }}
                        >
                          {state.mobile ? (
                            <small style={{ fontSize: fontSize }}>
                              Tarik Semua
                            </small>
                          ) : (
                            "Tarik Semua"
                          )}
                        </Button>
                      </Col>
                    )}
                  </Row>
                </Form.Item>
                <Button
                  type={"primary"}
                  size={"medium"}
                  style={{ width: "100%" }}
                  htmlType="submit"
                >
                  Lanjut
                </Button>
              </Card>
            </Col>
          </Row>
        )}

        {step === 1 && (
          <Row type="flex" justify="center" gutter={10}>
            <Col md={8} xs={24} className={"mb-2"}>
              <Card>
                <p>Total Yang Harus Di Bayar</p>
                <Button
                  style={{ width: "100%", marginBottom: "2px" }}
                  type="dashed"
                  danger
                  size={"large"}
                >
                  {Helper.toRp(amount - parseInt(config.charge_wd, 10))}
                </Button>
                <Row>
                  <Col md={24} sm={24} xs={24} className="mt-2"></Col>
                </Row>
                {tempRow(
                  "Tipe Penarikan",
                  type === "0" ? "Bonus" : "Bonus Nasional",
                  false
                )}
                <Row>
                  <Col md={24} sm={24} xs={24}>
                    <hr />
                  </Col>
                </Row>
                {tempRow("Bank Tujuan", rekening[idxPayment].bank_name, false)}
                <Row>
                  <Col md={24} sm={24} xs={24}>
                    <hr />
                  </Col>
                </Row>
                {tempRow("Atas Nama", rekening[idxPayment].acc_name, false)}
                <Row>
                  <Col md={24} sm={24} xs={24}>
                    <hr />
                  </Col>
                </Row>
                {tempRow("No.Rekening", rekening[idxPayment].acc_no, false)}
                <Row>
                  <Col md={24} sm={24} xs={24}>
                    <hr />
                  </Col>
                </Row>
                {tempRow("Nominal", amount)}
                <Row>
                  <Col md={24} sm={24} xs={24}>
                    <hr />
                  </Col>
                </Row>
                {tempRow("Biaya Admin", config.charge_wd)}
                <Row>
                  <Col md={24} sm={24} xs={24}>
                    <hr />
                  </Col>
                </Row>
                {tempRow("Total", amount - parseInt(config.charge_wd, 10))}
                <Row>
                  <Col md={24} sm={24} xs={24}>
                    <hr />
                  </Col>
                </Row>
                <Row gutter={6}>
                  <Col md={12} sm={12} xs={12}>
                    <Button
                      className={"mt-2"}
                      type={"dashed"}
                      primary
                      size={"medium"}
                      style={{ width: "100%" }}
                      htmlType="button"
                      onClick={() => setStep(0)}
                    >
                      Kembali
                    </Button>
                  </Col>
                  <Col md={12} sm={12} xs={12}>
                    <Popconfirm
                      title="harap periksa data anda kembali"
                      onConfirm={(e) => setModalPin(true)}
                      onCancel={() => {}}
                      okText="Lanjut"
                      cancelText="Batal"
                    >
                      <Button
                        className={"mt-2"}
                        type={"primary"}
                        size={"medium"}
                        style={{ width: "100%" }}
                        htmlType="submit"
                      >
                        Simpan
                      </Button>
                    </Popconfirm>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        )}
      </Form>

      {modalPin && (
        <ModalPin
          loading={loading}
          submit={(pin) => {
            handleFinish(pin);
          }}
          cancel={(isShow) => {
            setModalPin(false);
          }}
          modalPin={modalPin}
        />
      )}
    </div>
  );
};

export default CreateWithdraw;
