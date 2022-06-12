import { Avatar, Badge, Layout, List, Menu,Popconfirm } from "antd";
import { BellTwoTone, InteractionTwoTone, SettingTwoTone } from '@ant-design/icons';
import DashHeader, { Notification } from "./styles/Header";

import Link from "next/link";
import MockNotifications from "../demos/mock/notifications";
import { useAppState } from "./shared/AppProvider";
import { useState,useEffect } from "react";
import Routes from 'next/router';
import Cookies from "js-cookie";
import axios from 'axios';
import jwt_decode from "jwt-decode";

import {doLogout} from "../action/auth.action";
import general_helper from "../helper/general_helper";

const { SubMenu } = Menu;
const { Header } = Layout;

const MainHeader = () => {

    useEffect(() => {
        const coo=Cookies.get('_prowara');
        if(coo!==undefined) {
            axios.defaults.headers.common["Authorization"] = `Bearer ${atob(coo)}`;
            const decodedToken = jwt_decode(atob(coo));
            const dateNow = new Date();
            if (decodedToken.exp * 1000 < dateNow.getTime()) {
                doLogout();
                // window.location.href = '/signin';
            }
            else {
            }
        }
        else{
            doLogout();
            Routes.push("/signin");
        }
    }, []);
    const [state, dispatch] = useAppState();
    const [notifications] = useState(MockNotifications);
    return (
        <DashHeader>
          <Header>
            <Menu mode="horizontal">
                {state.mobile && (
                    <Menu.Item>
                      <a
                          onClick={() => dispatch({ type: "mobileDrawer" })}
                          className="trigger"
                      >

                        <svg width="1em" height="1em" fill="currentColor" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                             viewBox="0 0 384.97 384.97" style={{enableBackground: 'new 0 0 384.97 384.97'}} xmlSpace="preserve">
                          <g id="Menu_1_">
                            <path d="M12.03,120.303h360.909c6.641,0,12.03-5.39,12.03-12.03c0-6.641-5.39-12.03-12.03-12.03H12.03
                      c-6.641,0-12.03,5.39-12.03,12.03C0,114.913,5.39,120.303,12.03,120.303z"/>
                            <path d="M372.939,180.455H12.03c-6.641,0-12.03,5.39-12.03,12.03s5.39,12.03,12.03,12.03h360.909c6.641,0,12.03-5.39,12.03-12.03
                      S379.58,180.455,372.939,180.455z"/>
                            <path d="M372.939,264.667H132.333c-6.641,0-12.03,5.39-12.03,12.03c0,6.641,5.39,12.03,12.03,12.03h240.606
                      c6.641,0,12.03-5.39,12.03-12.03C384.97,270.056,379.58,264.667,372.939,264.667z"/>
                          </g>
                        </svg>
                      </a>
                    </Menu.Item>
                )}
              <Menu.Item>
                <Link href="/">
                  <a className="brand">
                    {/* <img src={general_helper.imgDefault} style={{height:"30px",width:"30px"}}/> */}
                    <Avatar size={{
                      xs: 24,
                      sm: 32,
                      md: 40,
                      lg: 64,
                      xl: 64,
                      xxl: 80,
                    }} src={general_helper.imgDefault} />

                    {/* <PlaySquareTwoTone style={{fontSize: '20px'}} /> */}
                    <strong className="text-black">PROWARA</strong>
                  </a>
                </Link>
              </Menu.Item>



              <span className="mr-auto" />

                {!state.mobile && (
                    <Menu.Item onClick={() => dispatch({ type: "fullscreen" })}>
                      <InteractionTwoTone style={{fontSize: '20px'}} />
                    </Menu.Item>
                )}
              {!state.mobile&&(<Menu.Item onClick={() => dispatch({ type: "options" })}>
                <SettingTwoTone style={{fontSize: '20px'}} />
              </Menu.Item>)}
              {!state.mobile&&(<SubMenu
                  title={
                    <Badge count={5}>
                      <span className="submenu-title-wrapper">
                        <BellTwoTone style={{fontSize: '20px'}} />
                      </span>
                    </Badge>
                  }
              >
                <Menu.Item
                    className="p-0 bg-transparent"
                    style={{ height: "auto" }}
                >
                  <List
                      className="header-notifications"
                      itemLayout="horizontal"
                      dataSource={notifications}
                      footer={<div>5 Notifications</div>}
                      renderItem={item => (
                          <Notification>
                            <List.Item>
                              <List.Item.Meta
                                  avatar={item.avatar}
                                  title={<a href="/">{item.title}</a>}
                                  description={<small>{item.description}</small>}
                              />
                            </List.Item>
                          </Notification>
                      )}
                  />
                </Menu.Item>
              </SubMenu>)}

              {!state.mobile&&(<SubMenu title={<Avatar src="/images/avatar.jpg" />}>
                <Menu.Item>Settings</Menu.Item>
                <Menu.Item>Profile</Menu.Item>
                <Menu.Item>Notifications</Menu.Item>
                <Menu.Divider />
                <Menu.Item>
                  <Link href="//one-readme.fusepx.com">
                    <a>Help?</a>
                  </Link>
                </Menu.Item>
                <Menu.Item>
                    <Popconfirm
                        placement="top"
                        title="Are you sure you want to sign out?"
                        onConfirm={() => {
                            doLogout();
                            Routes.push('/signin')
                        }}
                        okText="Oke"
                        cancelText="Batal"
                    >
                        <a>
                            Keluar
                        </a>
                    </Popconfirm>


                </Menu.Item>
              </SubMenu>)}
            </Menu>
          </Header>
        </DashHeader>
    );
};

export default MainHeader;
