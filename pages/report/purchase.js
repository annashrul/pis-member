import { Space, Table, Tag,Select,Row,Col,Input,Form,Message  } from 'antd';
const { Column, ColumnGroup } = Table;

import Helper from "../../helper/general_helper";
import React, { useEffect, useState } from 'react';
import moment from "moment";
import {handleGet} from "../../action/baseAction";
const Option = Select.Option;
const Search = Input.Search;
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
    const [startDate, setStartDate] = useState(moment());
    const [endDate, setEndDate] = useState(moment());
    const [searchby, setSearchBy] = useState('');
    const [any, setAny] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const [loading, setLoading] = useState(false);
    const [arrDatum,setArrDatum]= useState([]);
    const [form] = Form.useForm();

    useEffect(() => {
        handleLoadData(1);
    }, []);
    const handleLoadData = async(val)=>{
        setLoading(true);
        await handleGet(`transaction/report/member?page=${val}&perpage=10`,(datum,isLoading)=>{
            let datas=[];
            console.log(datum.pagination);
            setCurrentPage(datum.pagination?datum.pagination.current_page:1);
            datum.data.map((val,key)=>{
                datas.push({
                    key: key,
                    no:Helper.generateNo(key,datum.pagination.current_page),
                    fullname: val.fullname,
                    saldo_awal: Helper.toRp(val.saldo_awal),
                    saldo_akhir: Helper.toRp(val.saldo_akhir),
                    trx_in: Helper.toRp(val.trx_in),
                    trx_out: Helper.toRp(val.trx_out),
                })
            })
            setArrDatum(datas);
            setTimeout(()=>setLoading(false),300)
        })
    };
    const onFinish = (values) =>{
        let where="";
        console.log("start date",startDate);
        console.log("end date",endDate);
        console.log("searchby",searchby);
        console.log("any",values);
    };

    const prefixSelector = (
        <Form.Item name="prefix" noStyle>
            <Select onChange={(e)=>setSearchBy(e)}>
                <Option value="fullname">Fullname</Option>
                <Option value="trx_in">Transaksi In</Option>
                <Option value="trx_out">Transaksi Out</Option>
            </Select>
        </Form.Item>
    );

    console.log("arrat",arrDatum);


    return (
        <div>
            <Form
                {...formItemLayout}
                form={form}
                layout="vertical"
                name="register"
                onFinish={onFinish}
                initialValues={{
                    prefix: 'fullname',
                }}
            >
                <Row gutter={16}>
                    <Col xs={24} sm={12} md={6}>
                        <Form.Item name="periode" label="Periode">
                            {Helper.dateRange((dates,dateStrings)=>{
                                setStartDate(dateStrings[0]);
                                setEndDate(dateStrings[1]);
                            },false,[startDate,endDate])}
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                        <Form.Item name="any" label="Cari"  onChange={(e)=>setAny(e.target.value)}>
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
            <Table style={{ whiteSpace: 'nowrap '}} scroll={{ x: 400 }} bordered={true} dataSource={arrDatum}  loading={loading} pagination={{
                defaultPageSize: 10,
                hideOnSinglePage: false,
                total:arrDatum.length,
                current:currentPage,
                onChange:(page,pageSize)=>{
                    handleLoadData(page)
                    console.log("page",page);
                    console.log("pageSize",pageSize);
                }
            }}>
                <Column title="No" dataIndex="no" key="no" />
                <Column title="Nama" dataIndex="fullname" key="fullname" />
                <ColumnGroup title="Saldo">
                    <Column title="Awal" dataIndex="saldo_awal" key="saldo_awal" />
                    <Column title="Akhir" dataIndex="saldo_akhir" key="saldo_akhir" />
                </ColumnGroup>
                <ColumnGroup title="Transaksi">
                    <Column title="Masuk" dataIndex="trx_in" key="trx_in" />
                    <Column title="Keluar" dataIndex="trx_out" key="trx_out" />
                </ColumnGroup>

            </Table>
        </div>
    );
};

export default PurchaseReport;