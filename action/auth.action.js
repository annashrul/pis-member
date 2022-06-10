import http from "./httpService";
import Cookies from "js-cookie";
import Helper from "../helper/general_helper";

function setUser(datum) {
    Cookies.set('__uid', btoa(JSON.stringify(datum)), { expires: 7 });
}

function setToken(datum) {
    Cookies.set('_prowara', btoa(datum), { expires: 7 });

}
export function doLogout() {
    Helper.removeCookie('__uid');
    Helper.removeCookie('_prowara');
    Helper.removeCookie('_regist');
    http.axios.defaults.headers.common["Authorization"] = '';

}
function getUser() {
    const coo=Cookies.get('__uid');
    return JSON.parse(atob(coo));
}






function getToken() {
    return Cookies.get('_prowara');
}

export default {
    http,
    doLogout,
    setUser,
    getUser,
    getToken,
    setToken
};
