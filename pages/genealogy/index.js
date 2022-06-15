import { Table, Select, Row, Col, Input, Form, Avatar } from "antd";
const { Column } = Table;
import Helper from "../../helper/general_helper";
import React, { useEffect, useState } from "react";
const Option = Select.Option;
const Search = Input.Search;
import { handleGet } from "../../action/baseAction";
import moment from "moment";
moment.locale("id");

const Genealogy = () => {
  const [status, setStatus] = useState("");
  const [searchby, setSearchBy] = useState("fullname");
  const [any, setAny] = useState("");
  const [where, setWhere] = useState("");
  const [loading, setLoading] = useState(false);
  const [arrDatum, setArrDatum] = useState([]);
  const [meta, setMeta] = useState({});
  const [form] = Form.useForm();

  useEffect(() => {
    handleLoadData("&page=1");
  }, []);
  const handleLoadData = async (where) => {
    setLoading(true);
    await handleGet(
      `member/genealogy?perpage=10${where}`,
      (datum, isLoading) => {
        let datas = datum.data;
        setMeta(datum.pagination);
        datum.data.map((val, key) => {
          Object.assign(val, {
            key: key,
            no: Helper.generateNo(
              key,
              parseInt(datum.pagination.current_page, 10)
            ),
            jumlah_sponsor: Helper.toRp(parseInt(val.jumlah_sponsor, 10), true),
            saldo_pending: Helper.toRp(parseInt(val.saldo_pending, 10), true),
            recycle_date: moment(val.recycle_date).format("LLL"),
          });
        });
        setArrDatum(datas);
        setTimeout(() => setLoading(false), 300);
      }
    );
  };
  const onFinish = (values) => {
    let where = status === "" ? "" : `&status=${status}`;
    if (values !== "") {
      where += `&searchby=${searchby}&q=${
        searchby === "kd_trx" ? btoa(values) : values
      }`;
    }
    setWhere(where);
    handleLoadData(where);
  };

  const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select onChange={(e) => setSearchBy(e)}>
        <Option value="fullname">Fullname</Option>
        <Option value="mobile_no">No Handphone</Option>
        <Option value="referral">Referral</Option>
      </Select>
    </Form.Item>
  );

  return (
    <div>
      <Form
        form={form}
        layout="vertical"
        name="register"
        onFinish={onFinish}
        initialValues={{
          prefix: "fullname",
          status: "",
        }}
      >
        <Row gutter={16}>
          <Col xs={24} sm={12} md={6}>
            <Form.Item name="status" label="Status">
              <Select onChange={(e) => setStatus(e)}>
                <Option value="">Semua</Option>
                <Option value="1">Aktif</Option>
                <Option value="0">Tidak Aktif</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Form.Item
              name="any"
              label="Cari"
              onChange={(e) => setAny(e.target.value)}
            >
              <Search
                addonBefore={prefixSelector}
                placeholder="Tulis sesuatu disini ..."
                enterButton
                onSearch={onFinish}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <Table
        style={{ whiteSpace: "nowrap " }}
        scroll={{ x: 400 }}
        bordered={true}
        dataSource={arrDatum}
        loading={loading}
        pagination={{
          defaultPageSize: 10,
          hideOnSinglePage: false,
          total: parseInt(meta.total, 10),
          current: parseInt(meta.current_page, 10),
          onChange: (page, pageSize) => {
            handleLoadData(`&page=${page}${where}`);
          },
        }}
        summary={(pageData) => {
          let totalSponsor = 0;
          let totalSaldo = 0;

          pageData.forEach(({ jumlah_sponsor, saldo_pending }) => {
            totalSponsor += parseInt(jumlah_sponsor.replaceAll(".", ""), 10);
            totalSaldo += parseInt(saldo_pending.replaceAll(".", ""), 10);
          });

          return (
            <>
              <Table.Summary.Row>
                <Table.Summary.Cell colSpan={5} index={0}>
                  Total Perhalaman
                </Table.Summary.Cell>
                <Table.Summary.Cell index={1}>
                  <span style={{ float: "right" }}>
                    {Helper.toRp(totalSponsor, true)}
                  </span>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            </>
          );
        }}
      >
        <Column title="No" dataIndex="no" key="no" />
        <Column
          title="Foto"
          dataIndex="foto"
          key="foto"
          render={(_, record) => {
            return (
              <Avatar
                src={record.foto}
                style={{
                  verticalAlign: "middle",
                }}
              >
                {Helper.getInitialName(record.fullname)}
              </Avatar>
            );
          }}
        />
        <Column title="Nama" dataIndex="fullname" key="fullname" />
        <Column title="No Handphone" dataIndex="mobile_no" key="mobile_no" />
        <Column title="Referral" dataIndex="referral" key="referral" />
        <Column
          title="Jumlah Sponsor"
          dataIndex="jumlah_sponsor"
          key="jumlah_sponsor"
          align="right"
        />
        <Column
          title="Tanggal Recycle"
          dataIndex="recycle_date"
          key="recycle_date"
        />
      </Table>
    </div>
  );
};

export default Genealogy;
