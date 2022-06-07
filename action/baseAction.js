
import Action from "./httpService";
import { Col, Message, Row } from 'antd';

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
    let hide = Message.loading('tunggu sebentar..');
    try {
        const submitData = await Action.post(Action.apiUrl+url, data);
        const datum = submitData.data;
        if (datum.status === 'success') {
            callback(datum, true, 'Berhasil memproses permintaan.');
        } else {
            callback(datum, false, 'gagal memproses permintaan.');
        }
        setTimeout(hide,200);
    } catch (err) {
        setTimeout(hide,200);
        Message.info("terjadi kesalahan server")
    }
};
