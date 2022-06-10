
import Action from "./httpService";
import { Col, Message, Row } from 'antd';
import axios from "axios";

export const handleGet = async(url,callback)=>{
    try{
        const getData=await Action.get(Action.apiUrl+url);
        const datum = getData.data;
        callback(datum,false);
    }catch (err){
        callback([],false);
    }
};

export const handlePost = async (url, data, callback) => {
    // const hide = Message.loading('tunggu sebentar..');
    console.log("loading .....")

    try {
        const submitData = await Action.post(Action.apiUrl+url, data);
        const datum = submitData.data;
        if (submitData.status===200) {
            callback(datum, true, 'Berhasil');
        } else {
            callback(datum, false, 'gagal memproses permintaan.');
        }

    } catch (err) {
        callback([], false, 'gagal');
        if(err.response.data.meta!==undefined){
            Message.info(err.response.data.meta.message)
        }else{
            Message.info("Terjadi Kesalahan Jaringan")
        }
        // if()
        // Message.info(err.response.data.meta.message)
    }
};

export const handlePut = async (url, data, callback) => {
    let hide = Message.loading('tunggu sebentar..');
    try {
        const submitData = await Action.put(Action.apiUrl+url, data);
        const datum = submitData.data;
        if (submitData.status===200) {
            callback(datum, true, 'Berhasil');
        } else {
            callback(datum, false, 'gagal memproses permintaan.');
        }
        setTimeout(hide,200);
    } catch (err) {
        setTimeout(hide,200);
        Message.info("terjadi kesalahan server")
    }
};
export const handleDelete = async (url, callback) => {
    let hide = Message.loading('tunggu sebentar..');
    try {
        const submitData = await Action.delete(Action.apiUrl+url);
        const datum = submitData.data;
        if (submitData.status===200) {
            callback(datum, true, 'Berhasil');
        } else {
            callback(datum, false, 'gagal memproses permintaan.');
        }
        setTimeout(hide,200);
    } catch (err) {
        setTimeout(hide,200);
        Message.info("terjadi kesalahan server")
    }
};
