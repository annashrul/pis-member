import { Table, Tag, Select, Row, Col, Input, Form } from "antd";
import Helper from "../../helper/general_helper";
import React, { useEffect, useState } from "react";
import moment from "moment";
import { handleGet } from "../../action/baseAction";
const Option = Select.Option;
const Search = Input.Search;
const { Column, ColumnGroup } = Table;
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
const WithdrawReport = () => {
  const [startDate, setStartDate] = useState(moment());
  const [endDate, setEndDate] = useState(moment());
  const [searchby, setSearchBy] = useState("fullname");
  const [where, setWhere] = useState("");
  const [loading, setLoading] = useState(false);
  const [arrDatum, setArrDatum] = useState([]);
  const [meta, setMeta] = useState({});
  const [form] = Form.useForm();
  const [status, setStatus] = useState("");

  useEffect(() => {
    handleLoadData("&page=1");
  }, []);
  const handleLoadData = async (where) => {
    setLoading(true);
    console.log(`transaction/report?perpage=10${where}`);
    await handleGet(
      `transaction/withdrawal?perpage=10${where}`,
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
            amount: Helper.toRp(parseInt(val.amount, 10), true),
            charge: Helper.toRp(parseInt(val.charge, 10), true),
            charge: Helper.toRp(parseInt(val.charge, 10), true),
            created_at: moment(val.created_at).format("LLL"),
          });
        });
        setArrDatum(datas);
        setTimeout(() => setLoading(false), 300);
      }
    );
  };
  const onFinish = (values) => {
    setStartDate(moment(startDate).format("YYYY-MM-DD"));
    setEndDate(moment(endDate).format("YYYY-MM-DD"));
    let where = `&datefrom=${moment(startDate).format(
      "YYYY-MM-DD"
    )}&dateto=${moment(endDate).format("YYYY-MM-DD")}`;
    where += status === "" ? "" : `&status=${status}`;

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
        <Option value="kd_trx">Kode Transaksi</Option>
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
          prefix: "fullname",
          status: "",
        }}
      >
        <Row gutter={16}>
          <Col xs={24} sm={12} md={6}>
            <Form.Item name="periode" label="Periode">
              {Helper.dateRange(
                (dates, dateStrings) => {
                  setStartDate(dateStrings[0]);
                  setEndDate(dateStrings[1]);
                },
                false,
                [startDate, endDate]
              )}
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Form.Item name="status" label="Status">
              <Select onChange={(e) => setStatus(e)}>
                <Option value="">Semua</Option>
                <Option value="0">Pending</Option>
                <Option value="1">Berhasil</Option>
                <Option value="2">Gagal</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8}>
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
          let trxIn = 0;
          let trxOut = 0;

          pageData.forEach(({ amount, charge }) => {
            trxIn += parseInt(amount.replaceAll(".", ""), 10);
            trxOut += parseInt(charge.replaceAll(".", ""), 10);
          });

          return (
            <>
              <Table.Summary.Row>
                <Table.Summary.Cell colSpan={2} index={0}>
                  Total Perhalaman
                </Table.Summary.Cell>
                <Table.Summary.Cell index={1}>
                  <span style={{ float: "right" }}>
                    {Helper.toRp(trxIn, true)}
                  </span>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={2}>
                  <span style={{ float: "right" }}>
                    {Helper.toRp(trxOut, true)}
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
          dataIndex="fullname"
          key="fullname"
          render={(_, record) => {
            return (
              <p>
                {record.fullname}
                <br />
                {record.kd_trx}
              </p>
            );
          }}
        />

        <Column
          title="Nominal"
          dataIndex="amount"
          key="amount"
          align={"right"}
        />
        <Column
          title="Charge"
          dataIndex="charge"
          key="charge"
          align={"right"}
        />

        <ColumnGroup title="Akun Bank">
          <Column title="Nama" dataIndex="bank_name" key="bank_name" />
          <Column title="Atas Nama" dataIndex="acc_name" key="acc_name" />
          <Column title="No.Rekening" dataIndex="acc_no" key="acc_no" />
        </ColumnGroup>
        <Column
          title="Status"
          dataIndex="status"
          key="stauts"
          render={(_, record) => {
            return (
              <Tag
                color={
                  record.status === 0
                    ? "volcano"
                    : record.status === 1
                    ? "green"
                    : "blue"
                }
              >
                {record.status === 0
                  ? "Pending"
                  : record.status === 1
                  ? "Berhasil"
                  : "Gagal"}
              </Tag>
            );
          }}
        />
        <Column title="Tanggal" dataIndex="created_at" key="created_at" />
      </Table>
      {/*<Table columns={columns} dataSource={data} loading={loading} onChange={(page)=>{*/}
      {/*console.log(page)*/}
      {/*}}  pagination={{ defaultPageSize: 1,hideOnSinglePage: true,total:data.length }}/>*/}
    </div>
  );
};

export default WithdrawReport;
