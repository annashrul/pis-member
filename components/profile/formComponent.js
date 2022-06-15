import {
  Avatar,
  Drawer,
  Space,
  Button,
  Badge,
  Card,
  Col,
  Row,
  Input,
  Tooltip,
  Upload,
  Modal,
  Form,
} from "antd";
import { theme } from "../styles/GlobalStyles";
import { InfoCircleOutlined, InboxOutlined } from "@ant-design/icons";
import { useAppState } from "../shared/AppProvider";
import { useState, useEffect } from "react";
import authAction from "../../action/auth.action";
import { CopyOutlined } from "@ant-design/icons";
import general_helper from "../../helper/general_helper";
import moment from "moment";
import { handlePut } from "../../action/baseAction";
moment.locale("id");
const { Dragger } = Upload;

const FormComponent = ({ isModal, ok, cancel, userData }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    console.log(userData.fullname);
    form.setFieldsValue({ fullname: userData.fullname });
  }, []);

  const handleSubmit = async (e) => {
    setLoading(true);
    let datas = e;
    if (fileList[0] !== undefined) {
      const img = await general_helper.convertBase64(fileList[0]);
      Object.assign(datas, { photo: img });
    }
    await handlePut(`member/${userData.id}`, datas, (res, status, msg) => {
      console.log(res);
      setLoading(false);
      if (status) {
        ok();
      }
    });
  };
  return (
    <Modal
      title="Ubah Profile"
      visible={isModal}
      closable={false}
      destroyOnClose={true}
      maskClosable={false}
      footer={null}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Row gutter={4}>
          <Col xs={24} sm={12} md={12}>
            <Form.Item
              hasFeedback
              name="fullname"
              label="Nama"
              rules={[{ required: true, message: "Tidak Boleh Kosong" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              hasFeedback
              name="current_pin"
              label="Pin Saat Ini"
              rules={[
                { required: true, message: "Tidak Boleh Kosong" },
                { min: 6, message: "Harus 6 Angka" },
                { max: 6, message: "Harus 6 Angka" },
                {
                  pattern: new RegExp(/^[0-9]*$/),
                  message: "Harus Berupa Angka",
                },
              ]}
              tooltip={{
                title: "Harus 6 Angka",
                icon: <InfoCircleOutlined />,
              }}
            >
              <Input.Password />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={12}>
            <Form.Item
              hasFeedback
              name="pin"
              label="Pin Baru"
              rules={[
                { required: true, message: "Tidak Boleh Kosong" },
                { min: 6, message: "Harus 6 Angka" },
                { max: 6, message: "Harus 6 Angka" },
                {
                  pattern: new RegExp(/^[0-9]*$/),
                  message: "Harus Berupa Angka",
                },
              ]}
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
              rules={[
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
              ]}
              tooltip={{
                title: "Harus 6 Angka",
                icon: <InfoCircleOutlined />,
              }}
            >
              <Input.Password />
            </Form.Item>
          </Col>
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
    </Modal>
  );
};

export default FormComponent;
