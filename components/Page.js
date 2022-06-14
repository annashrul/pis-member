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

const { Content } = Layout;

const NonDashboardRoutes = [
  "/signin",
  "/signup",
  "/recycle",
  "/recycle/invoice",
  "/forgot",
  "/lockscreen",
  "/_error",
  StringLink.invoiceMitra,
  StringLink.invoiceProduct
];

const Page = ({ router, children }) => {
  const [loading, setLoading] = useState(true);
  const [state] = useAppState();
  const isNotDashboard = NonDashboardRoutes.includes(router.pathname);

  useEffect(() => {
    console.log("state.mobile",state.mobile)
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [loading,state]);

  console.log(state.weakColor);

  return (
    <Spin tip="Loading..." size="large" spinning={loading}>
      <ThemeProvider theme={theme}>
        <Container
          className={`weakColor ${
            state.boxed ? "boxed shadow-sm" : ""
          }`}
        >
          {!isNotDashboard && <Header />}
          <Layout className="workspace">
            {!isNotDashboard && (
              <SidebarMenu
                sidebarTheme={state.darkSidebar ? "dark" : "light"}
                sidebarMode={state.sidebarPopup ? "vertical" : "inline"}
                sidebarIcons={state.sidebarIcons}
                collapsed={state.collapsed}
              />
            )}

            <Layout>
              <Content>
                {!isNotDashboard ? <Inner>{children}</Inner> : children}
              </Content>
            </Layout>
          </Layout>
        </Container>
      </ThemeProvider>
    </Spin>
  );
};

export default withRouter(Page);
