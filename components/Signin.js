import { Button, Checkbox, Form, Input, Message, Row } from 'antd';
import { EyeTwoTone, MailTwoTone, PlaySquareTwoTone } from '@ant-design/icons';

import Link from 'next/link';
import Router from 'next/router';
import styled from 'styled-components';
import { useAppState } from './shared/AppProvider';
import React, { useEffect, useState } from 'react';


import Action from "../action/auth.action"

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

    useEffect(() => {
        forceUpdate({});
    }, []);
    const handleSubmit = async (values) => {
        setLoading(true);
        setIconLoading(true);


        try{
            const hitLogin=await Action.http.post(Action.http.apiClient+'auth/signin', {
                username:values.username,
                password:values.password,
            });
            const data = hitLogin.data.data;
            console.log(data);
            Action.setUser(data);
            Action.setToken(data.token);
            Action.http.axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
            setTimeout(()=>{
                setLoading(false);
                setIconLoading(false);
                Message.success('Sign complete. Taking you to your dashboard!').then(() => Router.push('/'));
            },3000)
        } catch (err){
            console.log(err);
            setTimeout(()=>{
                setLoading(false);
                setIconLoading(false);
                Message.error(err.message);
            },3000)
        }


    };
    return (<Row
            type="flex"
            align="middle"
            justify="center"
            className="px-3 bg-white mh-page"
            style={{ minHeight: '100vh' }}
        >
          <Content>
            <div className="text-center mb-5">
              <Link href="/signin">
                <a className="brand mr-0">
                  <PlaySquareTwoTone style={{fontSize: '32px'}} />
                </a>
              </Link>
              <h5 className="mb-0 mt-3">Sign in ghgh</h5>

              <p className="text-muted">get started with our service</p>
            </div>

            <Form
                layout="vertical"
                onFinish={handleSubmit}
                form={form}
            >
              <FormItem label="Username" name="username" rules={[{ required: true, message: 'Username tidak boleh kosong!' }]}>
                <Input
                    prefix={
                      <MailTwoTone style={{fontSize: '16px'}} />
                    }
                    type="text"
                    placeholder="Username"
                />
              </FormItem>

              <FormItem label="Password" name="password" rules={[{ required: true, message: 'Password tidak boleh kosong!' }]}>
                <Input
                    prefix={
                      <EyeTwoTone style={{fontSize: '16px'}} />
                    }
                    type="password"
                    placeholder="Password"
                />
              </FormItem>

                <Form.Item shouldUpdate={true}>
                    {() => (

                        <Button
                            type="primary"
                            htmlType="submit"
                            className="mt-3"
                            loading={iconLoading}
                            disabled={
                                !form.isFieldsTouched(true) ||
                                form.getFieldsError().filter(({ errors }) => errors.length).length
                            }
                        >
                            Log in
                        </Button>
                    )}
                </Form.Item>


            </Form>
          </Content>
        </Row>
    );
}

export default Signin;
