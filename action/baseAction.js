import Action from "./httpService";
import { Message, notification } from "antd";

export const handleGet = async (url, callback) => {
  try {
    const getData = await Action.get(Action.apiUrl + url);
    const datum = getData.data;
    callback(datum, false);
  } catch (err) {
    callback([], false, "gagal");
    let msg = "Terjadi Kesalahan Jaringan";
    if (err.response.data.meta !== undefined) {
      msg = err.response.data.meta.message;
    }
    const key = `open${Date.now()}`;
    notification.error({
      message: "Terjadi Kesalahan",
      description: msg,
      key,
      onClose: () => {},
    });
  }
};

export const handlePost = async (url, data, callback) => {
  try {
    const submitData = await Action.post(Action.apiUrl + url, data);
    const datum = submitData.data;
    if (submitData.status === 200) {
      callback(datum, true, datum.meta.message);
    } else {
      callback(datum, false, "gagal memproses permintaan.");
    }
  } catch (err) {
    callback([], false, "gagal");
    let msg = "Terjadi Kesalahan Jaringan";
    if (err.response.data.meta !== undefined) {
      msg = err.response.data.meta.message;
    }
    const key = `open${Date.now()}`;
    notification.error({
      message: "Terjadi Kesalahan",
      description: msg,
      key,
      onClose: () => {},
    });
  }
};

export const handlePut = async (url, data, callback) => {
  let hide = Message.loading("tunggu sebentar..");
  try {
    const submitData = await Action.put(Action.apiUrl + url, data);
    const datum = submitData.data;
    if (submitData.status === 200) {
      callback(datum, true, "Berhasil");
    } else {
      callback(datum, false, "gagal memproses permintaan.");
    }
    setTimeout(hide, 200);
  } catch (err) {
    setTimeout(hide, 200);
    callback([], false, "gagal");
    let msg = "Terjadi Kesalahan Jaringan";
    if (err.response.data.meta !== undefined) {
      msg = err.response.data.meta.message;
    }
    const key = `open${Date.now()}`;
    notification.error({
      message: "Terjadi Kesalahan",
      description: msg,
      key,
      onClose: () => {},
    });
  }
};
export const handleDelete = async (url, callback) => {
  let hide = Message.loading("tunggu sebentar..");
  try {
    const submitData = await Action.delete(Action.apiUrl + url);
    const datum = submitData.data;
    if (submitData.status === 200) {
      callback(datum, true, "Berhasil");
    } else {
      callback(datum, false, "gagal memproses permintaan.");
    }
    setTimeout(hide, 200);
  } catch (err) {
    setTimeout(hide, 200);
    callback([], false, "gagal");
    let msg = "Terjadi Kesalahan Jaringan";
    if (err.response.data.meta !== undefined) {
      msg = err.response.data.meta.message;
    }
    const key = `open${Date.now()}`;
    notification.error({
      message: "Terjadi Kesalahan",
      description: msg,
      key,
      onClose: () => {},
    });
  }
};
