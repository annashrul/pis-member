import { InfoCircleOutlined } from "@ant-design/icons";
import {
  Popconfirm,
  Col,
  Tooltip,
  Row,
  Tag,
  Input,
  Card,
  List,
  Button,
  Form,
  Select,
  Skeleton,
} from "antd";
import React, { useEffect, useRef, useState } from "react";
import {
  handleDelete,
  handleGet,
  handlePost,
  handlePut,
} from "../../action/baseAction";
import general_helper from "../../helper/general_helper";
const Search = Input.Search;
const { Option } = Select;
const msgInput = "Tidak Boleh Kosong";
import { useAppState } from "../shared/AppProvider";

const ListAddress = () => {
  const [state] = useAppState();

  const [form] = Form.useForm();
  const [arrAddress, setArrAddress] = useState([]);
  const [arrProvinsi, setArrProvinsi] = useState([]);
  const [arrKota, setArrKota] = useState([]);
  const [arrKecamatan, setArrKecamatan] = useState([]);
  const [loadingProvinsi, setLoadingProvinsi] = useState(false);
  const [loadingKota, setLoadingKota] = useState(false);
  const [loadingKecamatan, setLoadingKecamatan] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingAddress, setLoadingAddress] = useState(true);
  const [disabledSave, setDisabledSave] = useState(true);
  const [isUpdate, setIsUpdate] = useState("");
  const [, forceUpdate] = useState();
  const [dummyData, setDummyData] = useState(["a", "a", "a", "a"]);

  const titleInput = useRef(null);

  const setBtnDisabled = () => {
    let isDisable =
      !form.isFieldsTouched(true) ||
      form.getFieldsError().filter(({ errors }) => errors.length).length;
    if (isDisable === 0) {
      setDisabledSave(false);
    } else {
      setDisabledSave(true);
    }
  };

  useEffect(() => {
    setBtnDisabled();
    handleLoadProvinsi();
    handleLoadAddress();
    forceUpdate({});
  }, [form]);
  const handleLoadAddress = async () => {
    setLoadingAddress(true);
    await handleGet("address?page=1", (datum, isLoading) => {
      setArrAddress(datum.data);
      setLoadingAddress(false);
    });
  };
  const handleLoadProvinsi = async () => {
    await handleGet("transaction/kurir/get/provinsi", (datum, isLoading) => {
      setArrProvinsi(datum.data);
      form.setFieldsValue({ kd_prov: datum.data[0].id });
      handleLoadKota(datum.data[0].id);
      setLoadingProvinsi(false);
    });
  };
  const handleLoadKota = async (id, valId = null) => {
    setLoadingKota(true);
    await handleGet(
      `transaction/kurir/get/kota?id=${id}`,
      (datum, isLoading) => {
        setArrKota(datum.data);
        if (valId !== null) {
          form.setFieldsValue({ kd_kota: valId });
        } else {
          form.setFieldsValue({ kd_kota: datum.data[0].id });
          handleLoadKecamatan(datum.data[0].id);
        }

        setLoadingKota(false);
      }
    );
  };
  const handleLoadKecamatan = async (id, valId = null) => {
    setLoadingKecamatan(true);
    await handleGet(
      `transaction/kurir/get/kecamatan?id=${id}`,
      (datum, isLoading) => {
        setArrKecamatan(datum.data);
        form.setFieldsValue({
          kd_kec: valId !== null ? valId : datum.data[0].id,
        });
        setLoadingKecamatan(false);
      }
    );
  };
  const onChange = (value, col = "", idx = 0) => {
    setBtnDisabled();
    if (col === "prov") {
      form.setFieldsValue({ kd_kota: undefined }); //reset product selection
      setTimeout(() => handleLoadKota(value), 300);
    } else if (col === "kota") {
      form.setFieldsValue({ kd_kec: undefined }); //reset product selection
      setTimeout(() => handleLoadKecamatan(value), 300);
    }
  };

  const onSearch = (value) => {};

  const onFinish = async (e) => {
    setLoadingSave(true);
    Object.assign(e, {
      no_hp: general_helper.checkNo(e.no_hp),
    });
    console.log(e);
    if (isUpdate === "") {
      await handlePost("address", e, (data, status, msg) => {
        setLoadingSave(false);
      });
    } else {
      await handlePut(`address/${isUpdate}`, e, (data, status, msg) => {
        setLoadingSave(false);
      });
    }
    setIsUpdate("");
    handleLoadAddress();
    onReset();
  };

  const handleEdit = (e, val) => {
    handleLoadKota(val.kd_prov, val.kd_kota);
    handleLoadKecamatan(val.kd_kota, val.kd_kec);
    titleInput.current.focus();
    form.setFieldsValue(val);
    setBtnDisabled();
    setIsUpdate(val.id);
  };
  const onReset = () => {
    setIsUpdate("");
    form.resetFields();
    setArrKecamatan([]);
    setArrKota([]);
    titleInput.current.focus();
    setBtnDisabled();
  };
  const handleConfirm = async (e, id) => {
    await handleDelete(`address/${id}`, (res, status, msg) => {
      handleLoadAddress();
    });
  };

  return (
    <>
      <Row gutter={16}>
        <Col xs={24} sm={12} md={15}>
          <Form
            form={form}
            layout="vertical"
            name="addressForm"
            onFinish={onFinish}
          >
            <Card
              title={!state.mobile && "Form Alamat"}
              extra={
                <div>
                  <Button
                    className={"mr-2"}
                    size={"medium"}
                    htmlType="button"
                    onClick={onReset}
                  >
                    Batal
                  </Button>
                  <Button
                    type={"primary"}
                    size={"medium"}
                    htmlType="submit"
                    loading={loadingSave}
                    disabled={disabledSave}
                  >
                    Simpan
                  </Button>
                </div>
              }
            >
              <Row gutter={16}>
                <Col xs={24} sm={12} md={8}>
                  <Form.Item
                    hasFeedback
                    name={"title"}
                    onChange={onChange}
                    label="Title"
                    rules={[{ required: true, message: msgInput }]}
                  >
                    <Input placeholder="Ex: Rumah, Kantor" ref={titleInput} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <Form.Item
                    hasFeedback
                    name={"penerima"}
                    onChange={onChange}
                    label="Penerima"
                    rules={[{ required: true, message: msgInput }]}
                  >
                    <Input placeholder="Ex: Jhon Doe" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <Form.Item
                    hasFeedback
                    name="no_hp"
                    label="No Handphone"
                    onChange={onChange}
                    rules={[
                      { required: true, message: msgInput },
                      {
                        pattern: new RegExp(/^[0-9]*$/),
                        message: "Harus Berupa Angka",
                      },
                      { min: 10, message: "no handphone tidak valid" },
                    ]}
                    tooltip={{
                      title: "Minimal 10 Angka",
                      icon: <InfoCircleOutlined />,
                    }}
                  >
                    <Input prefix={"+62"} placeholder="81223165XXXX" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={8}>
                  <Form.Item
                    hasFeedback
                    name="kd_prov"
                    label="Provinsi"
                    rules={[{ required: true, message: msgInput }]}
                  >
                    <Select
                      value={"anying"}
                      loading={loadingProvinsi}
                      style={{ width: "100%" }}
                      showSearch
                      placeholder="Pilih Provinsi"
                      optionFilterProp="children"
                      onChange={(e) => onChange(e, "prov", 0)}
                      onSearch={onSearch}
                      filterOption={(input, option) =>
                        option.children
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                    >
                      {arrProvinsi.map((val, key) => {
                        return (
                          <Option key={key} value={val.id}>
                            {val.name}
                          </Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={8}>
                  <Form.Item
                    hasFeedback
                    name="kd_kota"
                    label="Kota"
                    rules={[{ required: true, message: msgInput }]}
                  >
                    <Select
                      loading={loadingKota}
                      disabled={arrKota.length < 1}
                      style={{ width: "100%" }}
                      showSearch
                      placeholder="Pilih Kota"
                      optionFilterProp="children"
                      onChange={(e) => onChange(e, "kota", 0)}
                      onSearch={onSearch}
                      filterOption={(input, option) =>
                        option.children
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                    >
                      {arrKota.map((val, key) => {
                        return (
                          <Option key={key} value={val.id}>
                            {val.name}
                          </Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={8}>
                  <Form.Item
                    hasFeedback
                    name="kd_kec"
                    label="Kecamatan"
                    rules={[{ required: true, message: msgInput }]}
                  >
                    <Select
                      loading={loadingKecamatan}
                      disabled={arrKecamatan.length < 1}
                      style={{ width: "100%" }}
                      showSearch
                      placeholder="Pilih Kecamatan"
                      optionFilterProp="children"
                      onChange={onChange}
                      onSearch={onSearch}
                      filterOption={(input, option) =>
                        option.children
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                    >
                      {arrKecamatan.map((val, key) => {
                        return (
                          <Option key={key} value={val.id}>
                            {val.kecamatan}
                          </Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={24}>
                  <Form.Item
                    hasFeedback
                    name={"main_address"}
                    onChange={onChange}
                    label="Alamat Lengkap"
                    rules={[
                      { required: true, message: msgInput },
                      { min: 20, message: "minimal 20 karakter" },
                    ]}
                    tooltip={{
                      title:
                        "Masukan alamat anda dari nama jalan,rt,rw,blok rumah, no rumah",
                      icon: <InfoCircleOutlined />,
                    }}
                  >
                    <Input.TextArea placeholder="Ex: Jln Kebon Manggu Rt 02/04 No.112" />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </Form>
        </Col>
        <Col xs={24} sm={12} md={9}>
          <Card title="Daftar Alamat" className="mb-4">
            {!loadingAddress && arrAddress.length > 0 ? (
              <List
                loading={loadingAddress}
                itemLayout="vertical"
                dataSource={arrAddress}
                renderItem={(item, key) => {
                  return (
                    <List.Item
                      bordered={true}
                      key={item.id}
                      actions={[
                        <Tooltip title={`Alamat ${item.title}`}>
                          <Tag color="lime">{item.title}</Tag>
                        </Tooltip>,
                        <Tooltip title={`Ubah Alamat ${item.penerima}`}>
                          <Button
                            onClick={(e) => handleEdit(e, item)}
                            key="list-edit"
                            type={"primary"}
                            size={"small"}
                          >
                            Ubah
                          </Button>
                        </Tooltip>,
                        <Tooltip title={`Hapus Alamat ${item.penerima}`}>
                          <Popconfirm
                            title={`Anda yakin akan menghapus alamat ${item.penerima} ?`}
                            onConfirm={(e) => handleConfirm(e, item.id)}
                            onCancel={(e) => {}}
                            okText="Oke"
                            cancelText="Batal"
                          >
                            <Button
                              type={"primary"}
                              size={"small"}
                              key="list-delete"
                            >
                              Hapus
                            </Button>
                          </Popconfirm>
                        </Tooltip>,
                      ]}
                    >
                      <Skeleton title={false} loading={loadingAddress} active>
                        <List.Item.Meta
                          title={`${item.penerima} | ${item.no_hp}`}
                          description={`${item.main_address}, Kecamatan ${item.kecamatan}, kota ${item.kota}, provinsi ${item.provinsi}`}
                        />
                      </Skeleton>
                    </List.Item>
                  );
                }}
              />
            ) : (
              dummyData.map((val, key) => <Skeleton key={key} />)
            )}
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default ListAddress;
