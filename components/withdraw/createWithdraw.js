import {Button, notification ,Modal, Form, Row, Col, Radio, Input, Card, List, Avatar} from 'antd';
import React, { useRef,useEffect, useState } from 'react';
import { theme } from '../styles/GlobalStyles';
import { CheckCircleOutlined } from '@ant-design/icons';
import Helper from "../../helper/general_helper";
import {handleGet, handlePost} from "../../action/baseAction";
import ModalPin from "../ModalPin";


const CreateWithdraw = () => {
    const [form] = Form.useForm();
    const [idxPayment, setIdxPayment] = useState(0);
    const [modalPin, setModalPin] = useState(false);
    const [modalConfim, setModalConfirm] = useState(false);
    const [bonus, setBonus] = useState(0);
    const [rekening, setRekening] = useState([]);
    const [bonusNasional, setBonusNasional] = useState(0);
    const [amount, setAmount] = useState(0);
    const [minWd, setMinWd] = useState(0);
    const [maxWdBonusNasional, setMaxWdBonusNasional] = useState(3000000);
    const [type, setType] = useState("0");
    const [config, setConfig] = useState({});
    const [emailError, setEmailError] = useState({ enable: false, helpText: "-" });
    const emailErrorRef = useRef(emailError);
    const nominalInput = useRef(null);
    const [dataField,setDataField] = useState({
        member_pin:"",
        id_bank:"",
        acc_name:"",
        acc_no:"",
        amount:"",
        type:0
    });




    useEffect(() => {

        // setType("0");
        emailErrorRef.current = emailError;
        if (emailError.enable) {
            nominalInput.current.focus();
            form.validateFields();
        }else{
            if(emailError.helpText==="-"){
                handleLoadInfo();
                handleLoadConfig();
            }
        }
    }, [emailError]);

    const handleLoadInfo = async()=>{
        await handleGet("site/info",(datum,isLoading)=>{
            setBonus(parseInt(datum.data.saldo,10));
            setRekening([datum.data.rekening])
            setBonusNasional(parseInt(datum.data.saldo_pending,10));
        })
    };
    const handleLoadConfig = async()=>{
        await handleGet("site/config",(datum,isLoading)=>{
           setMinWd(parseInt(datum.data.min_wd,10));
           setConfig(datum.data);
        })
    };


    const onChange = (e) => {
        let val = e.target.value;
        if(e.target.type==="radio"){
            setEmailError({enable: false, helpText: ""});
            setType(val);
            if(val==="1"){
                if(bonusNasional<maxWdBonusNasional){
                    form.setFieldsValue({amount:bonusNasional});
                    setAmount(bonusNasional);
                }else{
                    form.setFieldsValue({amount:maxWdBonusNasional});
                    setAmount(maxWdBonusNasional);
                }
            }
            else{
                form.setFieldsValue({amount:bonus});
            }
        }
        else{
            setAmount(val);
        }

    };

    const handleSubmit = async (e) => {
        let nominal = parseInt(e.amount,10);
        if(type==="0"){
            if(nominal < minWd){

                setEmailError({enable: true, helpText: "Minimal Penarikan Sebesar "+Helper.toRp(minWd)});
                return;
            }
            if(nominal > bonus){
                setEmailError({enable: true, helpText: "Nominal Melebihi Bonus Anda. Anda Hanya Bisa Melakukan Penarikan Sebesar "+Helper.toRp(bonus)});
                return;
            }
        }else{
            if(bonusNasional < maxWdBonusNasional){
                setEmailError({enable: true, helpText: "Penarikan Harus Sebesar "+Helper.toRp(maxWdBonusNasional)});
                return;
            }
        }

        let field=dataField;
        Object.assign(field,{amount:nominal,type:type,id_bank:rekening[idxPayment].id,acc_name:rekening[idxPayment].acc_name,acc_no:rekening[idxPayment].acc_no});
        setDataField(field);
        setModalConfirm(true);





    }

    const handleFinish = async(e)=>{
        let field=dataField;
        Object.assign(field,{member_pin:e});
        await handlePost("transaction/withdrawal",field,(res,status,msg)=>{
            if(status){
                form.resetFields();
                handleLoadInfo();
                setModalPin(false);
                setModalConfirm(false);
                const key = `open${Date.now()}`;
                const btn = (
                    <Button type="primary" size="small" onClick={() => notification.close(key)}>
                        Confirm
                    </Button>
                );
                notification.open({
                    message: res.meta.status,
                    description:res.meta.message,
                    btn,
                    key,
                    onClose: ()=>console.log("close"),
                });
            }

        })

    }

    const handleConfirm = async() =>{
        setModalPin(true);
    }


    return(

        <div>

            <Form
                onChange={() => {
                    if (emailError.enable) {
                        setEmailError({ enable: false, helpText: "" });
                    }
                }}
                form={form}
                layout="vertical"
                name="register"
                onFinish={handleSubmit}
                initialValues={{
                    type: '0',
                }}
            >

                <Row type="flex"
                     style={{ alignItems: "center" }}
                     justify="center"
                     gutter={10}>

                    <Col md={4} xs={12}>
                        <p>Saldo Bonus <br/><span style={{fontSize:"18px",color:theme.primaryColor}}>{Helper.toRp(bonus)}</span></p>
                    </Col>
                    <Col md={4} xs={12}>
                        <p>Saldo Bonus Nasional<br/><span style={{fontSize:"18px",color:theme.primaryColor}}>{Helper.toRp(bonusNasional)}</span></p>
                    </Col>
                </Row>
                <Row type="flex"
                    style={{ alignItems: "center" }}
                    justify="center"
                    gutter={10}>
                    <Col md={8} xs={24}>
                        <Card title={"Tipe Withdraw"}>
                            <Form.Item name="type" label=""  onChange={onChange}>
                                <Radio.Group buttonStyle="outline">
                                    <Radio.Button value="0">Bonus</Radio.Button>
                                    <Radio.Button value="1">Bonus Nasional</Radio.Button>
                                </Radio.Group>
                            </Form.Item>
                        </Card>
                    </Col>
                </Row>

                <br/>
                <Row type="flex"
                     style={{ alignItems: "center" }}
                     justify="center"
                     gutter={10}>
                    <Col md={8} xs={24}>
                        <Card title={"Nominal Withdraw"} extra={
                            type==="0"&&<Button onClick={(e)=>{
                                e.preventDefault();
                                form.setFieldsValue({amount:bonus});
                            }} htmlType="button" size={"small"} type={"info"}>Tarik Semua</Button>
                        }>
                            <Form.Item hasFeedback name="amount" label="Nominal" onChange={onChange}  rules={[
                                { required: true, message: "Tidak Boleh Kosong" },
                                {pattern: new RegExp(/^[0-9]*$/),message: "Harus Berupa Angka"},
                                {
                                    validator(_, value) {
                                        if (emailError.enable) {
                                            return Promise.reject(emailError.helpText);
                                        }
                                        return Promise.resolve();
                                    },
                                }
                            ]}>
                                <Input ref={nominalInput} disabled={type==="1"} prefix={"Rp."}/>
                            </Form.Item>
                        </Card>
                    </Col>
                </Row>
                <br/>
                <Row type="flex"
                     style={{ alignItems: "center" }}
                     justify="center"
                     gutter={10}>
                    <Col md={8} xs={24}>
                        <Card title={"Payment Channel"}>
                            <List
                                bordered={false}
                                itemLayout="horizontal"
                                dataSource={rekening}
                                renderItem={(item,key) => {
                                    return(
                                        <List.Item key={key} onClick={()=>setIdxPayment(key)} style={{cursor:"pointer"}}>
                                            <List.Item.Meta
                                                avatar={<Avatar src={item.bank_logo} />}
                                                title={item.acc_name}
                                                description={`${item.acc_no}`}
                                            />
                                            {key===idxPayment&&<div><CheckCircleOutlined/></div>}

                                        </List.Item>
                                    );
                                }}
                            />
                        </Card>
                    </Col>
                </Row>
                <Row type="flex"
                     style={{ alignItems: "center" }}
                     justify="center"
                     gutter={10}>
                    <Col md={8} xs={24}>
                        <Button
                            className={"mt-2"}
                            type={"primary"}
                            size={"medium"}
                            style={{width:"100%"}}
                            htmlType="submit"
                        >Simpan</Button>
                    </Col>
                </Row>

            </Form>

            {
                modalPin&&<ModalPin submit={(pin)=>{
                    setModalPin(false);
                    handleFinish(pin);
                }} cancel={(isShow)=>{
                    setModalPin(false)
                } } modalPin={modalPin}/>
            }

            {
                modalConfim&&<Modal
                    title="Konfirmasi Data"
                    visible={modalConfim}
                    onOk={()=>{
                        setModalConfirm(true);
                        setModalPin(true)
                    }}
                    onCancel={()=>setModalConfirm(false)}
                    okText="Lanjut"
                    cancelText="Batal"
                    closable={true}
                    destroyOnClose={true}
                    maskClosable={false}
                >
                    <Row gutter={4}>
                        <Col xs={12} sm={12} md={12}>
                            <p>Bank Tujuan</p>
                        </Col>
                        <Col xs={12} sm={12}  md={12}>
                            <p>: {rekening[idxPayment].bank_name}</p>
                        </Col>

                        <Col xs={12} sm={12}  md={12}>
                            <p>Atas Nama</p>
                        </Col>
                        <Col xs={12} sm={12}  md={12}>
                            <p>: {rekening[idxPayment].acc_name}</p>
                        </Col>
                        <Col xs={12} sm={12}  md={12}>
                            <p>Nominal</p>
                        </Col>
                        <Col xs={12} sm={12}  md={12}>
                            <h5>: {Helper.toRp(amount)}</h5>
                        </Col>
                        <Col xs={12} sm={12}  md={12}>
                            <p>Biaya Admin</p>
                        </Col>
                        <Col xs={12} sm={12}  md={12}>
                            <p>: {Helper.toRp(config.charge_wd)}</p>
                        </Col>
                        <Col xs={12} sm={12}  md={12}>
                            <p>Total</p>
                        </Col>
                        <Col xs={12} sm={12}  md={12}>
                            <h5>: {Helper.toRp(amount-parseInt(config.charge_wd,10))}</h5>
                        </Col>
                    </Row>
                </Modal>
            }
        </div>
    );

};


export default CreateWithdraw;
