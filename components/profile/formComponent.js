import {
  Button,
  Col,
  Row,
  Input,
  Message,
  Upload,
  Modal,
  Form,
  Tabs,
  Spin,
} from "antd";
import {
  InfoCircleOutlined,
  InboxOutlined,
  SolutionOutlined,
  KeyOutlined,
  LockOutlined,
} from "@ant-design/icons";
import Router from "next/router";

import { useState, useEffect } from "react";
import general_helper from "../../helper/general_helper";
import { handlePut } from "../../action/baseAction";
import { StringLink } from "../../helper/string_link_helper";
import authAction from "../../action/auth.action";
const { TabPane } = Tabs;
const { Dragger } = Upload;

const FormComponent = ({ isModal, ok, cancel, userData }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  useEffect(() => {
    setStep(1);
    form.setFieldsValue({ fullname: userData.fullname });
  }, []);

  const handleSubmit = async (e) => {
    setLoading(true);
    let datas = {};
    if (step === 1) {
      Object.assign(datas, { fullname: e.fullname });
      if (fileList[0] !== undefined) {
        const img = await general_helper.convertBase64(fileList[0]);
        Object.assign(datas, { foto: img });
      }
    } else if (step === 2) {
      Object.assign(datas, { pin: e.pin, current_pin: e.current_pin });
    } else {
      Object.assign(datas, { password: e.password });
    }
    await handlePut(`member/${userData.id}`, datas, (res, status, msg) => {
      if (status) {
        Message.success(msg)
          .then(() => Message.info("Anda akan dialikan ke halaman login"))
          .then(() => {
            Router.push("/signin").then(() => {
              setLoading(false);
              authAction.doLogout();
              ok();
            });
          });
      } else {
        setLoading(false);
      }
    });
  };
  return (
    <Modal
      centered
      title="Ubah Profile"
      visible={isModal}
      closable={false}
      destroyOnClose={true}
      maskClosable={false}
      footer={null}
    >
      <Spin spinning={loading}>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Tabs defaultActiveKey="1" onChange={(e) => setStep(parseInt(e, 10))}>
            <TabPane
              tab={
                <span>
                  <SolutionOutlined />
                  Data Diri
                </span>
              }
              key="1"
            >
              <Row gutter={6}>
                <Col xs={24} sm={24} md={24}>
                  <Form.Item
                    hasFeedback
                    name="fullname"
                    label="Nama"
                    rules={
                      step === 1 && [
                        { required: true, message: "Tidak Boleh Kosong" },
                      ]
                    }
                  >
                    <Input />
                  </Form.Item>
                  <Row>
                    <Col xs={24} sm={24} md={24}>
                      <Dragger
                        {...general_helper.getPropsUpload(fileList, (file) =>
                          setFileList(file)
                        )}
                      >
                        <p className="ant-upload-drag-icon">
                          <InboxOutlined />
                        </p>
                        <p className="ant-upload-text">
                          Klik atau seret file ke area ini untuk mengunggah
                        </p>
                        <p className="ant-upload-hint">
                          Tipe gambar yang diperbolehkan hanya .PNG, .JPEG, .JPG
                        </p>
                      </Dragger>
                    </Col>
                  </Row>
                  <br />
                  <br />
                </Col>
              </Row>
            </TabPane>
            <TabPane
              tab={
                <span>
                  <KeyOutlined />
                  PIN
                </span>
              }
              key="2"
            >
              <Form.Item
                hasFeedback
                name="current_pin"
                label="Pin Saat Ini"
                rules={
                  step === 2 && [
                    { required: true, message: "Tidak Boleh Kosong" },
                    { min: 6, message: "Harus 6 Angka" },
                    { max: 6, message: "Harus 6 Angka" },
                    {
                      pattern: new RegExp(/^[0-9]*$/),
                      message: "Harus Berupa Angka",
                    },
                  ]
                }
                tooltip={{
                  title: "Harus 6 Angka",
                  icon: <InfoCircleOutlined />,
                }}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item
                hasFeedback
                name="pin"
                label="Pin Baru"
                rules={
                  step === 2 && [
                    { required: true, message: "Tidak Boleh Kosong" },
                    { min: 6, message: "Harus 6 Angka" },
                    { max: 6, message: "Harus 6 Angka" },
                    {
                      pattern: new RegExp(/^[0-9]*$/),
                      message: "Harus Berupa Angka",
                    },
                  ]
                }
                tooltip={{
                  title: "Harus 6 Angka",
                  icon: <InfoCircleOutlined />,
                }}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item
                hasFeedback
                name="confirm_pin"
                label="Konfirmasi Pin Baru"
                rules={
                  step === 2 && [
                    { required: true, message: "Tidak Boleh Kosong" },
                    { min: 6, message: "Harus 6 Angka" },
                    { max: 6, message: "Harus 6 Angka" },
                    {
                      pattern: new RegExp(/^[0-9]*$/),
                      message: "Harus Berupa Angka",
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("pin") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error("Pin Tidak Sama"));
                      },
                    }),
                  ]
                }
                tooltip={{
                  title: "Harus 6 Angka",
                  icon: <InfoCircleOutlined />,
                }}
              >
                <Input.Password />
              </Form.Item>
            </TabPane>
            <TabPane
              tab={
                <span>
                  <LockOutlined />
                  Password
                </span>
              }
              key="3"
            >
              <Form.Item
                hasFeedback
                name="password"
                label="Password"
                rules={
                  step === 3 && [
                    { required: true, message: "Tidak Boleh Kosong" },
                    { min: 6, message: "Minimal 6 Karakter" },
                  ]
                }
                tooltip={{
                  title: "Harus 6 Karakter",
                  icon: <InfoCircleOutlined />,
                }}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item
                hasFeedback
                name="confirm_password"
                label="Konfirmasi Password"
                rules={
                  step === 3 && [
                    { required: true, message: "Tidak Boleh Kosong" },
                    { min: 6, message: "Minimal 6 Karakter" },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("password") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error("Password Tidak Sama"));
                      },
                    }),
                  ]
                }
                tooltip={{
                  title: "Harus 6 Karakter",
                  icon: <InfoCircleOutlined />,
                }}
              >
                <Input.Password />
              </Form.Item>
            </TabPane>
          </Tabs>

          <br />
          <Row gutter={12} className="mt-5">
            <Col xs={12} sm={12} md={12}>
              <Button
                onClick={() => cancel()}
                type={"dashed"}
                primary
                size={"medium"}
                style={{ width: "100%" }}
                htmlType="button"
              >
                Batal
              </Button>
            </Col>
            <Col xs={12} sm={12} md={12}>
              <Button
                type={"primary"}
                size={"medium"}
                style={{ width: "100%" }}
                htmlType="submit"
                loading={loading}
              >
                Lanjut
              </Button>
            </Col>
          </Row>
        </Form>
      </Spin>
    </Modal>
  );
};

export default FormComponent;
