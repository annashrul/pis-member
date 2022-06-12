import "../assets/styles.less";
import App from "next/app";
import AppProvider from "../components/shared/AppProvider";
import { GlobalStyles } from "../components/styles/GlobalStyles";
import Head from "next/head";
import NProgress from "nprogress";
import Page from "../components/Page";
import Router from "next/router";
import axios from 'axios';
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";
import Action from "../action/auth.action"

axios.defaults.headers.common['Content-Type'] = `application/x-www-form-urlencoded`;
axios.defaults.headers.common['X-Project-ID'] = `296cd1b03960e8c8176fe06464c58ab8`;
axios.defaults.headers.common['X-Requested-From'] = `apps`;

// LogRocket.init('9razfl/prowara');
const coo=Cookies.get('_prowara');
if(coo!==undefined) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${atob(coo)}`;
    const decodedToken = jwt_decode(atob(coo));
    const dateNow = new Date();
    if (decodedToken.exp * 1000 < dateNow.getTime()) {
        Action.doLogout();
        // window.location.href = '/signin';
    }
    else {
    }
}


Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());
class MyApp extends App {
    static async getInitialProps({ Component, ctx, req }) {

        let pageProps = {};
        const userAgent = ctx.req
            ? ctx.req.headers["user-agent"]
            : navigator.userAgent;

        let ie = false;
        if (userAgent.match(/Edge/i) || userAgent.match(/Trident.*rv[ :]*11\./i)) {
            ie = true;
        }

        if (Component.getInitialProps) {
            pageProps = await Component.getInitialProps(ctx);
        }

        pageProps.query = ctx.query;
        pageProps.ieBrowser = ie;
        return { pageProps };
    }
    UnLoadWindow(){
        return 'We strongly recommends NOT closing this window yet.'
    }

    render() {
        // window.onbeforeunload = this.UnLoadWindow;
        const coo=Cookies.get('_prowara');
        console.log("cookies",coo)
        if(coo!==undefined) {
            axios.defaults.headers.common["Authorization"] = `Bearer ${atob(coo)}`;
            const decodedToken = jwt_decode(atob(coo));
            const dateNow = new Date();
            if (decodedToken.exp * 1000 < dateNow.getTime()) {
                Action.doLogout();
                // Router.push("/signin")
            }
            else{
            }

        }else{
            // window.location.href="/signin"
            // Action.doLogout();
            // Routes.push('/signin')
            // Router.push("/signin")
        }
        const { Component, pageProps } = this.props;

        return (
            <>
            <GlobalStyles />
            <Head>
                <meta
                    name="viewport"
                    content="user-scalable=no,initial-scale=1,maximum-scale=1,minimum-scale=1,width=device-width,height=device-height"
                />
                <meta charSet="utf-8" />
                <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
                <link rel="shortcut icon" href="/images/triangle.png" />
                <title>Prowara Member</title>


                <link rel="preconnect" href="https://fonts.gstatic.com" />
                <link rel="preconnect" href="https://fonts.googleapis.com"/>
                    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
                    <link href="https://fonts.googleapis.com/css2?family=Joan&family=Noto+Sans:wght@600&display=swap" rel="stylesheet"/>
                    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900|Anonymous+Pro:400,700&display=swap" rel="stylesheet" />
                    {pageProps.ieBrowser && (
                        <script src="https://cdnjs.cloudflare.com/ajax/libs/babel-polyfill/7.2.5/polyfill.min.js" />
                    )}

            </Head>
            <AppProvider>
                <Page>
                    <Component {...pageProps} />
                </Page>
            </AppProvider>
            </>
    );
    }
    }

    export default MyApp;
