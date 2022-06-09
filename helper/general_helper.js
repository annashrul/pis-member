import Cookies from "js-cookie";
import moment from "moment";
import { DatePicker } from 'antd';
const RangePicker = DatePicker.RangePicker;



const setCookie=(name,data)=>{
    Cookies.set(name, btoa(data), { expires: 1 });
};

const removeCookie=(name)=>{
    Cookies.remove(name);
};
const toRp=(angka,isInput=false)=>{
    if(angka===undefined) return 0;
    const number_string = angka.toString().replace(/[^,\d]/g, '');
    const split = number_string.split('.');
    const sisa = split[0].length % 3;
    let rupiah = split[0].substr(0, sisa);
    const ribuan = split[0].substr(sisa).match(/\d{3}/gi);
    if (ribuan) {
        const separator = sisa ? '.' : '';
        rupiah += separator + ribuan.join('.');
    }

    rupiah = split[1] !== undefined ? rupiah + ',' + split[1] : rupiah;

    return isInput?rupiah:"Rp "+rupiah;
};

const rmRp = (angka) => {
    let numbers = 0;
    if (parseFloat(angka) === 0) return 0;
    if (parseFloat(angka) < 0) {
        numbers = angka.toString().replace("-", "");
    } else {
        numbers = angka;
    }
    let number_string = numbers === "" || numbers === undefined ? String(0.0) : numbers.toString().replace(/,|\D/g, ""),
        split = number_string.split("."),
        sisa = split[0].length % 3,
        rupiah = split[0].substr(0, sisa),
        ribuan = split[0].substr(sisa).match(/\d{3}/gi);

    if (ribuan) {
        rupiah += ribuan.join("");
    }

    rupiah = split[1] !== undefined ? rupiah + "" + split[1] : rupiah;
    rupiah = parseFloat(angka) < 0 ? "-" + rupiah.replace(/^0+/, "") : rupiah.replace(/^0+/, "");
    return parseInt(numbers,10);
};


const rmHtml=(str)=>{
    const regex = /(&#39;|&nbsp;|<([^>]+)>)/gi;
    let cek = str.replace(regex, '');
    return cek.replace('/<[^>]*(>|$)|&nbsp;|&zwnj;|&raquo;|&laquo;|&gt;/g','')
};
const isEmptyOrUndefined = (val, col, isShowError = true) => {
    return !(val === "" || val === undefined || val === null || val === "null" || val === "undefined");

};

let date = new Date();
date.setDate(date.getDate());
const rangeDate = {
    "Hari Ini": [moment(), moment()],
    "7 Hari Terakhir": [moment().subtract(7, "days"), moment()],
    "30 Hari Terakhir": [moment().subtract(30, "days"), moment()],
    "Minggu Ini": [moment().startOf("isoWeek"), moment().endOf("isoWeek")],
    "Minggu Lalu": [moment().subtract(1, "weeks").startOf("isoWeek"), moment().subtract(1, "weeks").endOf("isoWeek")],
    "Bulan Ini": [moment().startOf("month"), moment().endOf("month")],
    "Bulan Lalu": [moment().subtract(1, "month").startOf("month"), moment().subtract(1, "month").endOf("month")],
    "Tahun Ini": [moment().startOf("year"), moment().endOf("year")],
    "Tahun Lalu": [moment().subtract(1, "year").startOf("year"), moment().subtract(1, "year").endOf("year")],
};


const dateRange = (onApply, isLabel = true,value) => {
    return (
        <div className={`form-group`}>
            <label style={{ display: isLabel || isLabel === undefined ? "block" : "none" }}> Periode </label>
            <RangePicker
                defaultValue={value}
                ranges={rangeDate}
                onChange={onApply}
            />
        </div>
    );
};
const generateNo = (i, current_page, perpage = 10) => {
    return i + 1 + perpage * (parseInt(current_page, 10) - 1);
};






export default {
    generateNo,
    isEmptyOrUndefined,
    dateRange,
    setCookie,
    removeCookie,
    toRp,
    rmHtml,
    rmRp
};
