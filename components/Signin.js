import { Button, Form, Input, Message, Row } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";

import Link from "next/link";
import Router from "next/router";
import styled from "styled-components";
import { useAppState } from "./shared/AppProvider";
import React, { useEffect, useState } from "react";
import { StringLink } from "../helper/string_link_helper";

import Action from "../action/auth.action";
import ModalPin from "./ModalPin";
import { handleGet, handlePost, handlePut } from "../action/baseAction";
import general_helper from "../helper/general_helper";

const FormItem = Form.Item;

const Content = styled.div`
  max-width: 400px;
  z-index: 2;
  min-width: 300px;
`;

const Signin = () => {
  const [state] = useAppState();
  const [form] = Form.useForm();
  const [, forceUpdate] = useState();
  const [loading, setLoading] = useState(false);
  const [iconLoading, setIconLoading] = useState(false);
  const [showModalPin, setShowModalPin] = useState(false);
  const [dataUser, setDataUser] = useState({});

  useEffect(() => {
    forceUpdate({});
  }, []);
  const handleLoadInfo = async () => {
    await handleGet("site/info", (res, status, msg) => {
      Action.setInfo(res.data);
    });
  };

  const handleUserDetail = async (dataLogin) => {
    await handleGet(
      `member/get/${dataLogin.id}`,
      (resUser, statusUser, msgUser) => {
        if (dataLogin.pin === "-") {
          Message.success("Anda Belum Mempunya Pin").then(() => {
            setShowModalPin(true);
            setIconLoading(false);
          });
        } else if (dataLogin.status === 3) {
          if (dataLogin.kd_trx === "" || dataLogin.kd_trx === "-") {
            Router.push(StringLink.transactionRecycle).then(() =>
              setIconLoading(false)
            );
          } else {
            localStorage.setItem("linkBack", "/signin");
            localStorage.setItem("typeTrx", "Recycle");
            localStorage.setItem("kdTrx", dataLogin.kd_trx);
            Router.push(StringLink.invoiceRecycle).then(() =>
              setIconLoading(false)
            );
          }
        } else {
          Message.success(
            "Login Berhasil. Anda Akan Dialihkan Ke Halaman Dashboard!"
          ).then(() => Router.push("/").then(() => setIconLoading(false)));
        }
        setLoading(false);
        setIconLoading(false);
        Action.setToken(dataLogin.token);
        Object.assign(dataLogin, resUser.data);
        Action.setUser(dataLogin);
        setDataUser(dataLogin);
      }
    );
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    setIconLoading(true);
    await handlePost("auth/signin", values, async (res, status, msg) => {
      if (status) {
        Action.http.axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${res.data.token}`;

        handleUserDetail(res.data);
        handleLoadInfo();
      } else {
        setLoading(false);
        setIconLoading(false);
      }
    });
  };

  const handlePin = async (pin) => {
    setLoading(true);
    let data = Object.assign(dataUser, { pin: pin });
    await handlePut(
      `member/pin/${data.id}`,
      { pin: pin },
      (res, status, msg) => {
        if (status) {
          Message.success(
            "Berhasil membuat Pin. anda akan dialihkan ke halaman dashboard!"
          ).then(() => {
            Router.push("/").then(() => {
              setShowModalPin(false);
              setLoading(false);
            });
          });
        } else {
          setLoading(false);
        }
      }
    );
  };

  return (
    <Row
      type="flex"
      align="middle"
      justify="center"
      className="px-3 bg-white mh-page"
      style={{ minHeight: "100vh" }}
    >
      <Content>
        <div className="text-center mb-4">
          <Link href="/signin">
            <a className="brand mr-0">
              <img src={general_helper.imgDefault} style={{ width: "100px" }} />
            </a>
          </Link>
          <h5 className="mb-0 mt-3">Sign in Member</h5>
        </div>
        <Form layout="vertical" onFinish={handleSubmit} form={form}>
          <FormItem
            label="Username"
            name="username"
            rules={[
              { required: true, message: "Username tidak boleh kosong!" },
            ]}
          >
            <Input
              prefix={<UserOutlined style={{ fontSize: "16px" }} />}
              type="text"
              placeholder="Username"
            />
          </FormItem>

          <FormItem
            label="Password"
            name="password"
            rules={[
              { required: true, message: "Password tidak boleh kosong!" },
            ]}
          >
            <Input.Password
              placeholder="Password"
              prefix={<LockOutlined style={{ fontSize: "16px" }} />}
            />
            {/* <Input
              prefix={<EyeTwoTone style={{ fontSize: "16px" }} />}
              type="password"
              placeholder="Password"
            /> */}
          </FormItem>

          <Form.Item shouldUpdate={true}>
            {() => (
              <Button
                type="primary"
                htmlType="submit"
                className="mt-3"
                style={{ width: "100%" }}
                loading={iconLoading}
                disabled={
                  !form.isFieldsTouched(true) ||
                  form.getFieldsError().filter(({ errors }) => errors.length)
                    .length
                }
              >
                Log in
              </Button>
            )}
          </Form.Item>
        </Form>
      </Content>
      {showModalPin && (
        <ModalPin
          loading={loading}
          submit={(pin) => {
            handlePin(pin);
          }}
          cancel={(isShow) => {
            setShowModalPin(false);
          }}
          modalPin={showModalPin}
        />
      )}
    </Row>
  );
};

export default Signin;
