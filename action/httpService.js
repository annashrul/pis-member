import axios from "axios";
import Cookies from "js-cookie";

const coo=Cookies.get('_prowara');
if(coo!==undefined) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${atob(coo)}`;
}

export default {
    axios:axios,
    get: axios.get,
    post: axios.post,
    put: axios.put,
    delete: axios.delete,
    // apiUrl: "http://192.168.100.10:6704/",
    // apiClient: "http://192.168.100.10:6704/",
    noData:'https://www.napro.id/assets/images/placeholder-no-data.png',
    // apiUrl: "http://192.168.111.2:6704/",
    apiUrl: "http://ptnetindo.com:6700/",
    apiClient: "http://ptnetindo.com:6700/"
}
