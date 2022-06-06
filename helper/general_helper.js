import Cookies from "js-cookie";

const setCookie=(name,data)=>{
    Cookies.set(name, btoa(data), { expires: 1 });
};

const removeCookie=(name)=>{
    Cookies.remove(name);
};
const toRp=(angka)=>{
    if(angka===undefined) return 0;
    const number_string = angka.toString().replace(/[^,\d]/g, '');
    const split = number_string.split('.');
    const sisa = split[0].length % 3;
    let rupiah = split[0].substr(0, sisa);
    const ribuan = split[0].substr(sisa).match(/\d{3}/gi);

    // tambahkan titik jika yang di input sudah menjadi angka ribuan
    if (ribuan) {
        const separator = sisa ? '.' : '';
        rupiah += separator + ribuan.join('.');
    }

    rupiah = split[1] !== undefined ? rupiah + ',' + split[1] : rupiah;
    return "Rp "+rupiah;
}
const rmHtml=(str)=>{
    // var parser = new DOMParser();
    // return parser.parseFromString(str,'text/html')
    const regex = /(&#39;|&nbsp;|<([^>]+)>)/gi;
    let cek = str.replace(regex, '');
    return cek.replace('/<[^>]*(>|$)|&nbsp;|&zwnj;|&raquo;|&laquo;|&gt;/g','')

    // return str.replace(/(<([^>]+)>)/gi, "");
}




export default {
    setCookie,
    removeCookie,
    toRp,
    rmHtml
};
