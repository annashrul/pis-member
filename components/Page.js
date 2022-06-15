import { Container, Inner } from "./styles/Page";
import { Layout, Spin } from "antd";
import { useEffect, useState } from "react";
import Header from "./Header";
import SidebarMenu from "./SidebarMenu";
import { ThemeProvider } from "styled-components";
import { theme } from "./styles/GlobalStyles";
import { useAppState } from "./shared/AppProvider";
import { withRouter } from "next/router";
import { StringLink } from "../helper/string_link_helper";
import Routes from "next/router";
import Cookies from "js-cookie";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { doLogout } from "../action/auth.action";

const { Content } = Layout;

const NonDashboardRoutes = [
  "/signin",
  "/signup",
  "/forgot",
  "/lockscreen",
  "/_error",
  StringLink.transactionRecycle,
  StringLink.invoiceRecycle,
  StringLink.invoiceMitra,
  StringLink.invoiceProduct,
];

const Page = ({ router, children }) => {
  const [loading, setLoading] = useState(true);
  const [isCookie, setIsCookie] = useState(true);
  const [state] = useAppState();
  const isNotDashboard = NonDashboardRoutes.includes(router.pathname);

  // if (coo !== undefined) {
  // axios.defaults.headers.common["Authorization"] = `Bearer ${atob(coo)}`;
  // const decodedToken = jwt_decode(atob(coo));
  // const dateNow = new Date();
  // if (decodedToken.exp * 1000 < dateNow.getTime()) {
  //   doLogout();
  // } else {
  //   // Routes.push("/");
  // }
  // } else {
  //   doLogout();
  //   Routes.push("/signin");
  // }

  useEffect(() => {
    const coo = Cookies.get("_prowara");
    // if (coo !== undefined) {
    //   setTimeout(() => {
    //     setIsCookie(false);
    //     setLoading(false);
    //   }, 1000);
    // } else {
    //   setTimeout(() => {
    //     setIsCookie(false);
    //     setLoading(true);
    //     doLogout();
    //     Routes.push("/signin").then(() => setLoading(false));
    //   }, 1000);
    // }
    setTimeout(() => {
      if (coo !== undefined) {
        setLoading(false);
        axios.defaults.headers.common["Authorization"] = `Bearer ${atob(coo)}`;
        const decodedToken = jwt_decode(atob(coo));
        const dateNow = new Date();
        if (decodedToken.exp * 1000 < dateNow.getTime()) {
          doLogout();
        }
      } else {
        setLoading(true);
        doLogout();
        Routes.push("/signin").then(() => setLoading(false));
      }
    }, 1000);
  }, []);

  return (
    <Spin tip="Tunggu Sebentar..." size="large" spinning={loading}>
      <ThemeProvider theme={theme}>
        <Container
          className={`weakColor ${state.boxed ? "boxed shadow-sm" : ""}`}
        >
          {!isNotDashboard && <Header />}
          <Layout className="workspace">
            {!loading && !isNotDashboard && (
              <SidebarMenu
                sidebarTheme={state.darkSidebar ? "dark" : "light"}
                sidebarMode={state.sidebarPopup ? "vertical" : "inline"}
                sidebarIcons={state.sidebarIcons}
                collapsed={state.collapsed}
              />
            )}

            <Layout>
              {!loading && (
                <Content>
                  {!isNotDashboard ? <Inner>{children}</Inner> : children}
                </Content>
              )}
            </Layout>
          </Layout>
        </Container>
      </ThemeProvider>
    </Spin>
  );
};

export default withRouter(Page);
