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
const TransactionReport = () => {
    const [startDate, setStartDate] = useState(moment());
    const [endDate, setEndDate] = useState(moment());
    const [searchby, setSearchBy] = useState('fullname');
    const [any, setAny] = useState('');
    const [where, setWhere] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const [loading, setLoading] = useState(false);
    const [arrDatum,setArrDatum]= useState([]);
    const [meta,setMeta]= useState({});
    const [form] = Form.useForm();

    useEffect(() => {

        handleLoadData(`&page=1&datefrom=${moment(startDate).format("YYYY-MM-DD")}&dateto=${moment(endDate).format("YYYY-MM-DD")}`);
    }, []);
    const handleLoadData = async(where)=>{
        setLoading(true);
        await handleGet(`transaction/report?perpage=10${where}`,(datum,isLoading)=>{
            let datas=[];
            setMeta(datum.pagination);
            datum.data.map((val,key)=>{
                datas.push({
                    key: key,
                    no:Helper.generateNo(key,parseInt(datum.pagination.current_page,10)),
                    fullname: val.fullname,
                    kd_trx: val.kd_trx,
                    note: val.note,
                    trx_in: Helper.toRp(parseInt(val.trx_in,10),true),
                    trx_out: Helper.toRp(parseInt(val.trx_out,10),true),
                })
            })
            setArrDatum(datas);
            setTimeout(()=>setLoading(false),300)
        })
    };
    const onFinish = (values) =>{
        setStartDate(moment(startDate).format("YYYY-MM-DD"));
        setEndDate(moment(endDate).format("YYYY-MM-DD"));
        let where=`&datefrom=${moment(startDate).format("YYYY-MM-DD")}&dateto=${moment(endDate).format("YYYY-MM-DD")}`;
        if(values!==""){
            where+=`&searchby=${searchby}&q=${searchby==='kd_trx'?btoa(values):values}`;
        }
        setWhere(where);
        handleLoadData(where);

    };

    const prefixSelector = (
        <Form.Item name="prefix" noStyle>
            <Select onChange={(e)=>setSearchBy(e)}>
                <Option value="fullname">Fullname</Option>
                <Option value="kd_trx">Kode Transaksi</Option>
                <Option value="note">Catatan</Option>
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
                total:parseInt(meta.total,10),
                current:parseInt(meta.current_page,10),
                onChange:(page,pageSize)=>{

                    handleLoadData(`&page=${page}${where}`)
                }
            }}
                   summary={pageData => {
                       let trxIn = 0;
                       let trxOut = 0;

                       pageData.forEach(({ trx_in, trx_out }) => {
                           trxIn += parseInt(trx_in.replaceAll(".",""),10);
                           trxOut += parseInt(trx_out.replaceAll(".",""),10);
                       });

                       return (
                           <>
                           <Table.Summary.Row>
                               <Table.Summary.Cell colSpan={3} index={0}>Total Perhalaman</Table.Summary.Cell>
                               <Table.Summary.Cell index={1}>
                                   <span style={{float:"right"}}>{Helper.toRp(trxIn,true)}</span>
                               </Table.Summary.Cell>
                               <Table.Summary.Cell index={2}>
                                   <span style={{float:"right"}}>{Helper.toRp(trxOut,true)}</span>
                               </Table.Summary.Cell>
                           </Table.Summary.Row>
                           </>
                       );
                   }}
            >
                <Column title="No" dataIndex="no" key="no" />
                <Column title="Nama" dataIndex="fullname" key="fullname" />
                <Column title="Kode Transaksi" dataIndex="kd_trx" key="kd_trx" />

                <ColumnGroup title="Transaksi">
                    <Column title="Masuk" dataIndex="trx_in" key="trx_in" align={"right"}/>
                    <Column title="Keluar" dataIndex="trx_out" key="trx_out" align={"right"}/>
                </ColumnGroup>
                <Column title="Catatan" dataIndex="note" key="note" />


            </Table>
                {/*<Table columns={columns} dataSource={data} loading={loading} onChange={(page)=>{*/}
                    {/*console.log(page)*/}
                {/*}}  pagination={{ defaultPageSize: 1,hideOnSinglePage: true,total:data.length }}/>*/}

        </div>
    );
};

export default TransactionReport;