import { Row, Col, Tag, PageHeader, Card, Image } from "antd";
import React, { useEffect, useState } from "react";
import { handleGet } from "../../action/baseAction";
import { useAppState } from "../../components/shared/AppProvider";
import Helper from "../../helper/general_helper";
import {
  UserOutlined,
  ClockCircleOutlined,
  CloseSquareOutlined,
} from "@ant-design/icons";
import moment from "moment";
import Router from "next/router";

moment.lang("id");
const DetailBerita = () => {
  const [objNews, setObjNews] = useState({});
  const [font, setFont] = useState("14px");
  const [state] = useAppState();

  useEffect(() => {
    if (state.mobile) {
      setFont("80%");
    }
    console.log(Router.router.query.id_berita);

    handleDetail();
  }, []);

  const handleDetail = async () => {
    await handleGet(
      `content/get/${Router.router.query.id_berita}`,
      (res, status, msg) => {
        console.log(res);
        setObjNews(res.data);
      }
    );
  };
  const desc = `JAKARTA, KOMPAS.com - Hadi Tjahjanto resmi dilantik oleh Presiden
              Joko Widodo menjadi Menteri Agraria dan Tata Ruang/Kepala Badan
              Pertanahan Nasional (ATR/BPN) pada Rabu (15/6/2022) siang di
              Istana Negara Jakarta. Setelah dilantik, mantan Panglima TNI ini
              pun langsung mengungkapkan tiga masalah yang ingin ia tuntaskan
              dalam waktu dekat. Masalah pertama adalah soal sertifikat tanah
              yang saat ini baru terealisasi sebanyak 81 juta sertifikat. Baca
              juga: Hadi Tjahjanto Gantikan Sofyan Djalil Jadi Menteri
              ATR/Kepala BPN, Begini Profilnya “Tugas saya yang pertama adalah
              menyelesaian sertifikat milik rakyat di mana saat ini sudah
              terelasisasi sebanyak 81 juta sertifikat. Target yang ingin kita
              capai adalah 126 juta sertifikat,” ujar Hadi usai pelantikan.
              Meski mengaku ingin masalah sertifikat ini bisa segera
              direalisasikan, namun ia akan melihat kembali status tanah di
              lapangan. “Nanti saya akan lihat apakah tanahnya masih berstatus
              K2 (tanah sengketa) atau K3 (tanah yang belum memenuhi syarat
              sehingga hanya didaftarkan). Ini akan kita selesaikan dan
              berkordinasi dengan instasi lain agar masalah sertifikat tanah
              rakyat ini bisa selesai,” jelasnya. Artikel ini telah tayang di
              Kompas.com dengan judul "Tancap Gas, Hadi Tjahjanto Ingin
              Tuntaskan 3 Masalah Pertanahan", Klik untuk baca:
              https://www.kompas.com/properti/read/2022/06/15/163000721/tancap-gas-hadi-tjahjanto-ingin-tuntaskan-3-masalah-pertanahan.
              Penulis : Masya Famely Ruhulessin Editor : Masya Famely Ruhulessin
              Download aplikasi Kompas.com untuk akses berita lebih mudah dan
              cepat: Android: https://bit.ly/3g85pkA iOS:
              https://apple.co/3hXWJ0L`;

  const temp = () => {
    return (
      Object.keys(objNews).length > 0 && (
        <Row gutter={16}>
          <Col xs={24} sm={24} md={16}>
            <Card
              title={<small style={{ fontSize: font }}>{objNews.title}</small>}
              cover={<Image src={objNews.picture} />}
            >
              <small style={{ fontSize: font }}>
                {objNews.user} | {objNews.category} |{" "}
                {moment(
                  objNews.created_at ? objNews.created_at : moment().format()
                ).format("LLL")}
              </small>
              <hr />
              <small style={{ fontSize: font }}>
                {Helper.rmHtml(objNews.caption)}
              </small>
            </Card>
          </Col>
        </Row>
      )
    );
  };

  console.log(Object.keys(objNews));

  return state.mobile ? (
    <PageHeader
      className="site-page-header"
      onBack={() => Router.back()}
      title="Kembali"
    >
      {temp()}
    </PageHeader>
  ) : (
    temp()
  );
};

export default DetailBerita;
