import { Message,Modal} from 'antd';
import { ExclamationCircleOutlined,CheckCircleOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import PinInput from 'react-pin-input';
import { theme } from './styles/GlobalStyles';
import PropTypes from 'prop-types';

const { confirm } = Modal;

const ModalPin = ({submit,cancel,modalPin}) =>{

    const [isModal,setIsModal]=useState(modalPin);
    const [pin,setPin]=useState('');
    useEffect(() => {
    }, [isModal]);

    const showPin = () => {
        if(pin.length===6){
            cancel(false);
            confirm({
                okText:"Simpan",
                cancelText:"Batal",
                title: 'Konfirmasi',
                icon: <ExclamationCircleOutlined />,
                content: 'Anda Yakin Akan Melanjutkan Proses ini ?',
                onOk() {
                    return new Promise((resolve, reject) => {
                        setTimeout(reject, 1000);
                    }).catch(() => {
                        submit(pin);
                    });
                },
                onCancel() {
                    cancel(false);
                },
            });
        }

    };
    return <Modal
        title="Masukan Pin Anda"
        visible={isModal}
        onOk={()=>showPin()}
        onCancel={()=>{
            cancel(isModal)
        }}
        okText="Lanjut"
        cancelText="Batal"
        closable={true}
        destroyOnClose={true}
        maskClosable={false}
    >
        <div>
            <p>Demi Keamanan & Kenyamanan Menggunakan Sistem Ini, Pastikan Pin Yang Anda Masukan Sesuai</p>
            <PinInput
                focus={true}
                length={6}
                secret
                onChange={(value, index) => {
                    setPin(value);
                }}
                type="numeric"
                inputMode="number"
                style={{padding: '0px'}}
                inputStyle={{borderColor: theme.primaryColor,borderRadius:"5px",height:"30px",width:"30px"}}
                inputFocusStyle={{borderColor: theme.darkColor}}
                onComplete={(value, index) => {
                    setPin(value);
                }}
                autoSelect={true}
                regexCriteria={/^[ A-Za-z0-9_@./#&+-]*$/}
            />
        </div>
    </Modal>;
};



export default ModalPin;
