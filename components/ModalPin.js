import { Modal, Popconfirm, Row, Spin, Col, Button, Message } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { theme } from "./styles/GlobalStyles";
import dynamic from "next/dynamic";
const ReactCodeInput = dynamic(import("react-code-input"));
const { confirm } = Modal;

const ModalPin = ({ submit, cancel, modalPin, loading = false }) => {
  const [isModal, setIsModal] = useState(modalPin);
  const [pin, setPin] = useState("");
  const [focusPin, setFocusPin] = useState(true);
  useEffect(() => {
    console.log("focus", modalPin);
    setTimeout(() => setFocusPin(true), 300);
  }, [isModal, focusPin, pin]);

  return (
    <Modal
      title="Masukan Pin Anda"
      visible={isModal}
      closable={false}
      destroyOnClose={true}
      maskClosable={false}
      footer={null}
    >
      <Spin tip="Tunggu Sebentar..." size="large" spinning={loading}>
        <div>
          <p>
            Demi Keamanan & Kenyamanan Menggunakan Sistem Ini, Pastikan Pin Yang
            Anda Masukan Sesuai
          </p>
          <ReactCodeInput
            inputStyle={{
              margin: "4px",
              height: "30px",
              width: "30px",
              paddingLeft: "0px",
              borderRadius: "3px",
              color: theme.primaryColor,
              fontSize: "14px",
              textAlign: "center",
              verticalAlign: "middle",
              border: `1px solid ${theme.darkColor}`,
            }}
            value={pin}
            type="password"
            fields={6}
            onChange={(e) => {
              setPin(parseInt(e));
            }}
            autoFocus={focusPin}
            pattern={/^[0-9]*$/}
          />
          <Row gutter={12} className="mt-5" justify="end">
            <Col>
              <Button
                onClick={() => cancel(isModal)}
                type={"dashed"}
                primary
                size={"medium"}
                htmlType="button"
              >
                Batal
              </Button>
            </Col>
            <Col>
              <Popconfirm
                title="Anda yakin akan melanjutkan proses ini ?"
                onConfirm={(e) => {
                  if (!isNaN(pin)) {
                    const x = pin.toString().length;
                    setFocusPin(true);
                    if (x === 6) {
                      submit(pin.toString());
                    } else {
                      Message.info("Pin Harus 6 Digit Angka");
                      setPin("");
                    }
                  } else {
                    Message.info("Pin Hanya Di Perbolehkan Angka");
                    setFocusPin(true);
                    setPin("");
                  }

                  // submit(pin);
                }}
                onCancel={() => {}}
                okText="Oke"
                okType="submit"
                cancelText="Batal"
              >
                <Button type={"primary"} size={"medium"}>
                  Lanjut
                </Button>
              </Popconfirm>
            </Col>
          </Row>
        </div>
      </Spin>
    </Modal>
  );
};

export default ModalPin;
