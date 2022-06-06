import {
  Button,
  Col,
  DatePicker,
  Drawer,
  Form,
  Input,
  Row,
  Select
} from 'antd';

import { Component } from 'react';

const { Option } = Select;

class DrawerForm extends Component {
  state = { visible: false };

  showDrawer = () => {
    this.setState({
      visible: true
    });
  };

  onClose = () => {
    this.setState({
      visible: false
    });
  };

  render() {
    return (
      <div>
        <Button onClick={this.showDrawer}>Create</Button>
        <Drawer
          title="Create"
          width={720}
          placement="right"
          onClose={this.onClose}
          maskClosable={false}
          visible={this.state.visible}
          style={{
            height: 'calc(100% - 55px)',
            overflow: 'auto',
            paddingBottom: 53
          }}
        >
          <Form layout="vertical" hideRequiredMark>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Name" name="name" rules={[
                      { required: true, message: 'please enter user name' }
                    ]}>
                  <Input placeholder="please enter user name" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Url" name="url" rules={[{ required: true, message: 'please enter url' }]}>
                  <Input
                    style={{ width: '100%' }}
                    addonBefore="http://"
                    addonAfter=".com"
                    placeholder="please enter url"
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Owner" name="owner" rules={[
                      { required: true, message: 'Please select an owner' }
                    ]}>
                  <Select placeholder="Please select an owner">
                      <Option value="xiao">Xiaoxiao Fu</Option>
                      <Option value="mao">Maomao Zhou</Option>
                    </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Type" name="type" rules={[
                      { required: true, message: 'Please choose the type' }
                    ]}>
                  <Select placeholder="Please choose the type">
                      <Option value="private">Private</Option>
                      <Option value="public">Public</Option>
                    </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Approver" name="approver" rules={[
                      { required: true, message: 'Please choose the approver' }
                    ]}>
                  <Select placeholder="Please choose the approver">
                      <Option value="jack">Jack Ma</Option>
                      <Option value="tom">Tom Liu</Option>
                    </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="DateTime" name="dateTime" rules={[
                      { required: true, message: 'Please choose the dateTime' }
                    ]}>
                  <DatePicker.RangePicker
                      style={{ width: '100%' }}
                      getPopupContainer={trigger => trigger.parentNode}
                    />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item label="Description" name="description" rules={[
                      {
                        required: true,
                        message: 'please enter url description'
                      }
                    ]}>
                  <Input.TextArea
                      rows={4}
                      placeholder="please enter url description"
                    />
                </Form.Item>
              </Col>
            </Row>
          </Form>
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              width: '100%',
              borderTop: '1px solid #e8e8e8',
              padding: '10px 16px',
              textAlign: 'right',
              left: 0,
              background: '#fff',
              borderRadius: '0 0 4px 4px'
            }}
          >
            <Button
              style={{
                marginRight: 8
              }}
              onClick={this.onClose}
            >
              Cancel
            </Button>
            <Button onClick={this.onClose}>Submit</Button>
          </div>
        </Drawer>
      </div>
    );
  }
}

export default DrawerForm;
