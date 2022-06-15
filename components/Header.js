import { Layout, Menu } from "antd";
import DashHeader from "./styles/Header";
import MockNotifications from "../demos/mock/notifications";
import { useAppState } from "./shared/AppProvider";
import { useState, useEffect } from "react";
import Routes from "next/router";
import Cookies from "js-cookie";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { doLogout } from "../action/auth.action";
import general_helper from "../helper/general_helper";

const { Header } = Layout;

const MainHeader = () => {
  const [state, dispatch] = useAppState();
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
                <svg
                  width="1em"
                  height="1em"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  viewBox="0 0 384.97 384.97"
                  style={{ enableBackground: "new 0 0 384.97 384.97" }}
                  xmlSpace="preserve"
                >
                  <g id="Menu_1_">
                    <path
                      d="M12.03,120.303h360.909c6.641,0,12.03-5.39,12.03-12.03c0-6.641-5.39-12.03-12.03-12.03H12.03
                      c-6.641,0-12.03,5.39-12.03,12.03C0,114.913,5.39,120.303,12.03,120.303z"
                    />
                    <path
                      d="M372.939,180.455H12.03c-6.641,0-12.03,5.39-12.03,12.03s5.39,12.03,12.03,12.03h360.909c6.641,0,12.03-5.39,12.03-12.03
                      S379.58,180.455,372.939,180.455z"
                    />
                    <path
                      d="M372.939,264.667H132.333c-6.641,0-12.03,5.39-12.03,12.03c0,6.641,5.39,12.03,12.03,12.03h240.606
                      c6.641,0,12.03-5.39,12.03-12.03C384.97,270.056,379.58,264.667,372.939,264.667z"
                    />
                  </g>
                </svg>
              </a>
            </Menu.Item>
          )}
          <Menu.Item>
            <img src={general_helper.imgDefault} style={{ width: "100px" }} />
          </Menu.Item>
        </Menu>
      </Header>
    </DashHeader>
  );
};

export default MainHeader;
