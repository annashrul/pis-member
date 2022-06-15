import { Table, Select, Row, Col, Input, Form } from "antd";
const { Column, ColumnGroup } = Table;
import { CopyOutlined } from "@ant-design/icons";
import Helper from "../../helper/general_helper";
import React, { useEffect, useState } from "react";
import { handleGet } from "../../action/baseAction";
const Option = Select.Option;
const Search = Input.Search;
import moment from "moment";
moment.lang("id");

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 24 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 24 },
  },
};
const PurchaseReport = () => {
  const [searchby, setSearchBy] = useState("fullname");
  const [where, setWhere] = useState("");
  const [loading, setLoading] = useState(false);
  const [arrDatum, setArrDatum] = useState([]);
  const [meta, setMeta] = useState({});
  const [form] = Form.useForm();

  useEffect(() => {
    handleLoadData(`&page=1`);
  }, []);
  const handleLoadData = async (where) => {
    setLoading(true);
    await handleGet(
      `transaction/penjualan/report?perpage=10${where}`,
      (datum, isLoading) => {
        let datas = datum.data;
        setMeta(datum.pagination);
        datas.map((val, key) => {
          Object.assign(val, {
            key: key,
            no: Helper.generateNo(
              key,
              parseInt(datum.pagination.current_page, 10)
            ),
            subtotal: Helper.toRp(parseInt(val.subtotal, 10), true),
            ongkir: Helper.toRp(parseInt(val.ongkir, 10), true),
            grand_total: Helper.toRp(parseInt(val.grand_total, 10), true),
            created_at: moment(val.created_at).format("LLL"),
          });
        });
        setArrDatum(datas);
        setTimeout(() => setLoading(false), 300);
      }
    );
  };
  const onFinish = (values) => {
    let where = ``;
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
        <Option value="kd_trx">Kode Transaksi</Option>
        <Option value="title">Paket</Option>
        <Option value="resi">No.Resi</Option>
        <Option value="status_st">Status</Option>
      </Select>
    </Form.Item>
  );

  return (
    <div>
      <Form
        {...formItemLayout}
        form={form}
        layout="vertical"
        name="register"
        onFinish={onFinish}
        initialValues={{
          prefix: "kd_trx",
        }}
      >
        <Row gutter={16}>
          <Col xs={24} sm={12} md={12}>
            <Form.Item name="any" label="Cari">
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
          let subTotal = 0;
          let ongkirs = 0;
          let grandTotal = 0;

          pageData.forEach(({ subtotal, ongkir, grand_total }) => {
            subTotal += parseInt(subtotal.replaceAll(".", ""), 10);
            ongkirs += parseInt(ongkir.replaceAll(".", ""), 10);
            grandTotal += parseInt(grand_total.replaceAll(".", ""), 10);
          });

          return (
            <>
              <Table.Summary.Row>
                <Table.Summary.Cell colSpan={4} index={0}>
                  Total Perhalaman
                </Table.Summary.Cell>
                <Table.Summary.Cell index={1}>
                  <span style={{ float: "right" }}>
                    {Helper.toRp(subTotal, true)}
                  </span>
                </Table.Summary.Cell>
                <Table.Summary.Cell colSpan={2} index={1} />
                <Table.Summary.Cell index={2}>
                  <span style={{ float: "right" }}>
                    {Helper.toRp(ongkirs, true)}
                  </span>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={2}>
                  <span style={{ float: "right" }}>
                    {Helper.toRp(grandTotal, true)}
                  </span>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            </>
          );
        }}
      >
        <Column title="No" dataIndex="no" key="no" />
        <Column
          title="Transaksi"
          dataIndex="status"
          key="status"
          render={(_, record) => {
            return (
              <p>
                {record.status_st}
                <br />
                {record.kd_trx}
              </p>
            );
          }}
        />
        <Column
          title="Resi"
          dataIndex="resi"
          key="resi"
          render={(_, record) => {
            return (
              <span>
                {record.resi} {record.resi !== "-" && <CopyOutlined />}
              </span>
            );
          }}
        />
        <ColumnGroup title="Paket">
          <Column title="Nama" dataIndex="title" key="title" />
          <Column
            title="Harga"
            dataIndex="subtotal"
            key="subtotal"
            align="right"
          />
        </ColumnGroup>
        <ColumnGroup title="Pembayaran">
          <Column
            title="Metode"
            dataIndex="metode_pembayaran"
            key="metode_pembayaran"
          />
          <Column
            title="Layanan"
            dataIndex="layanan_pengiriman"
            key="layanan_pengiriman"
          />
          <Column
            title="Ongkir"
            dataIndex="ongkir"
            key="ongkir"
            align="right"
          />
        </ColumnGroup>
        <Column
          title="Total"
          dataIndex="grand_total"
          key="grand_total"
          align="right"
        />
        <Column title="Alamat" dataIndex="main_address" key="main_address" />
        <Column title="Tanggal" dataIndex="created_at" key="created_at" />
      </Table>
      {/*<Table columns={columns} dataSource={data} loading={loading} onChange={(page)=>{*/}
      {/*console.log(page)*/}
      {/*}}  pagination={{ defaultPageSize: 1,hideOnSinglePage: true,total:data.length }}/>*/}
    </div>
  );
};

export default PurchaseReport;
