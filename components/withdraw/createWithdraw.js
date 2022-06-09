import { Button,Select, Steps, message,Form,Row,Col,Radio,Input,InputNumber  } from 'antd';
import React, { useRef,useEffect, useState } from 'react';
import StatCard from '../shared/StatCard';
import { theme } from '../styles/GlobalStyles';
import { BellOutlined, BookOutlined, MessageOutlined, PhoneOutlined,WalletOutlined } from '@ant-design/icons';
import Helper from "../../helper/general_helper";
import {handleGet} from "../../action/baseAction";
const Step = Steps.Step;
const Option = Select.Option;



const CreateWithdraw = () => {
    const [form] = Form.useForm();
    const [current, setCurrent] = useState(0);
    const [bonus, setBonus] = useState(0);
    const [bonusNasional, setBonusNasional] = useState(0);
    const [amount, setAmount] = useState(0);
    const [minWd, setMinWd] = useState(0);
    const [maxWdBonusNasional, setMaxWdBonusNasional] = useState(3000000);
    const [type, setType] = useState("0");
    const [info, setInfo] = useState({});
    const [emailError, setEmailError] = useState({ enable: false, helpText: "-" });
    const emailErrorRef = useRef(emailError);
    const nominalInput = useRef(null);


    useEffect(() => {

        // setType("0");
        emailErrorRef.current = emailError;
        if (emailError.enable) {
            console.log("error");
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
            setInfo(datum.data);
            setBonus(parseInt(datum.data.saldo,10));
            setBonusNasional(parseInt(datum.data.saldo_pending,10));
        })
    };
    const handleLoadConfig = async()=>{
        await handleGet("site/config",(datum,isLoading)=>{
            console.log(datum.data)
           setMinWd(parseInt(datum.data.min_wd,10))
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
        let isBonus=0;
        let isWdMin=type==="0";
        let nominal = parseInt(e.amount,10);

        if(type==="0"){
            if(nominal < minWd){
                setEmailError({enable: true, helpText: "Minimal Penarikan Sebesar "+Helper.toRp(minWd)});
                return;
            }
            console.log("nominal",nominal)
            console.log("bonus",bonus)
            if(nominal > bonus){
                setEmailError({enable: true, helpText: "Nominal Melebihi Bonus Anda. Anda Hanya Bisa Melakukan Penarikan Sebesar "+Helper.toRp(bonus)});
                return;
            }

        }
        console.log(e);

        // if(type==="1"){
        //     isBonus = parseInt(bonusNasional,10);
        // }else{
        //     isBonus = parseInt(bonus,10);
        // }
        //
        // if(nominal < minWd && isWdMin){
        //     setEmailError({enable: true, helpText: "Minimal Penarikan Sebesar "+Helper.toRp(minWd)});
        // }
        // else if(nominal > isBonus){
        //     setEmailError({enable: true, helpText: "Tidak Boleh Melebihi Saldo Anda"});
        // }
        // else{
        //     console.log(e);
        // }

    }



    return(
        <div>
            <Row gutter={16}>
                <Col xs={12} sm={12} md={6}>
                    <StatCard
                        title="Saldo Bonus"
                        value={Helper.toRp(bonus)}
                        color={theme.primaryColor}
                        clickHandler={() => Message.info('Campaign stat button clicked')}
                    />
                </Col>
                <Col xs={12} sm={12} md={6}>
                    <StatCard
                        title="Saldo Bonus Nasional"
                        value={Helper.toRp(bonusNasional)}
                        color={theme.primaryColor}
                        clickHandler={() => Message.info('Campaign stat button clicked')}
                    />
                </Col>
            </Row>
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
            <Row>
                <Col xs={24} sm={12} md={24}>
                    <Form.Item name="type" label="Tipe Withdraw"  onChange={onChange}>
                        <Radio.Group buttonStyle="outline">
                            <Radio.Button value="0">Bonus</Radio.Button>
                            <Radio.Button value="1">Bonus Nasional</Radio.Button>
                        </Radio.Group>
                    </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12}>
                    <Form.Item  name="amount" label="Nominal" onChange={onChange}  rules={[
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

                        <Input   ref={nominalInput} disabled={type==="1"} prefix={"Rp."} suffix={
                            type==="0"&&<Button onClick={(e)=>{
                                e.preventDefault();
                                form.setFieldsValue({amount:bonus});
                                console.log("tarik")
                            }} htmlType="button" size={"small"} type={"info"}>Tarik Semua Saldo</Button>
                        }/>
                    </Form.Item>
                </Col>
                <Button
                    className={"mt-2"}
                    type={"primary"}
                    size={"medium"}
                    style={{width:"100%"}}
                    htmlType="submit"
                    // loading={loadingSave}
                    // disabled={disabledSave}
                >Simpan</Button>
            </Row>
            </Form>
        </div>
    );

};


export default CreateWithdraw;
