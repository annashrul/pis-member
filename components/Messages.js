import {
  Button,
  Col,
  DatePicker,
  Drawer,
  Form,
  Input,
  Layout,
  List,
  Menu,
  Row,
  Select
} from 'antd';
import { CopyTwoTone, EditTwoTone, HeartTwoTone, MessageTwoTone, MinusCircleFilled, PushpinTwoTone, StarTwoTone } from '@ant-design/icons';

import MOCKMESSAGES from '../demos/mock/messages';
import format from 'date-fns/format';
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import styled from 'styled-components';
import { useAppState } from './shared/AppProvider';
import { useState } from 'react';

const { Sider } = Layout;
const { Option } = Select;

const Fab = styled.div`
  position: fixed;
  bottom: 0;
  z-index: 1;
  width: 40px;
  right: 2rem;
  padding: 0 2rem;
  margin-bottom: 2rem;
`;

const Messages = ({ form } = props) => {
  const [state] = useAppState();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [replyBox, setBox] = useState(false);
  const [navigation, setNavigation] = useState(false);
  const [messages, setMessages] = useState(false);
  const selectedMessage = MOCKMESSAGES[selectedIndex];

  const createMarkup = body => {
    return { __html: body };
  };

  const navigationSidebar = (
    <div className="h-100">
      <div className="p-4">
        <Button type="primary" onClick={() => setBox(!replyBox)}>
          Compose
        </Button>
      </div>
      <div className="px-4">
        <small>
          <b>Mailboxes</b>
        </small>
      </div>
      <Menu mode="inline" className="mb-3 border-right-0">
        <Menu.Item key="1">Inbox</Menu.Item>
        <Menu.Item key="2">Sent mail</Menu.Item>
        <Menu.Item key="3">Starred</Menu.Item>
        <Menu.Item key="4">Drafts</Menu.Item>
        <Menu.Item key="5">Trash</Menu.Item>
      </Menu>

      <div className="px-4">
        <small>
          <b>Tags</b>
        </small>
      </div>
      <Menu mode="inline" className="border-0">
        <Menu.Item key="1">
          <MinusCircleFilled style={{ fontSize: '10px' }} className={`${state.direction === 'rtl' ? 'ml-3': 'mr-3'} text-error`} />
          Personal
        </Menu.Item>
        <Menu.Item key="2">
          <MinusCircleFilled style={{ fontSize: '10px' }} className={`${state.direction === 'rtl' ? 'ml-3': 'mr-3'} text-success`}/>
          Clients
        </Menu.Item>
        <Menu.Item key="3">
          <MinusCircleFilled style={{ fontSize: '10px' }} className={`${state.direction === 'rtl' ? 'ml-3': 'mr-3'} text-normal`}/>
          Family
        </Menu.Item>
        <Menu.Item key="4">
          <MinusCircleFilled style={{ fontSize: '10px' }} className={`${state.direction === 'rtl' ? 'ml-3': 'mr-3'} text-primary`} />
          Friends
        </Menu.Item>
      </Menu>
    </div>
  );

  const messagesSidebar = (
    <div
      css={`
        display: flex;
        flex: 1;
        flex-direction: column;
        height: 100%;
        overflow: hidden;
        border-right: 1px solid rgba(0, 0, 0, 0.05);
      `}
    >
      <Menu mode="horizontal" className="border-0 m-auto">
        <Menu.Item key="read">
          <a href="/">
            <PushpinTwoTone style={{ fontSize: '20px' }} />
          </a>
        </Menu.Item>
        <Menu.Item key="favorite">
          <a href="/">
            <HeartTwoTone style={{ fontSize: '20px' }} />
          </a>
        </Menu.Item>
        <Menu.Item key="star">
          <a href="/">
            <StarTwoTone style={{ fontSize: '20px' }} />
          </a>
        </Menu.Item>
        <Menu.Item key="refresh">
          <a href="/">
            <CopyTwoTone style={{ fontSize: '20px' }} />
          </a>
        </Menu.Item>
      </Menu>
      <List
        className="scroll-y flex-1 bg-transparent px-3 py-1"
        itemLayout="horizontal"
        dataSource={MOCKMESSAGES}
        renderItem={(item, index) => (
          <List.Item
            onClick={() => setSelectedIndex(index)}
            style={{
              backgroundColor: selectedIndex === index ? '#e6f7ff' : ''
            }}
            className={`${
              selectedIndex === index ? '' : 'border-0'
            } rounded border-0 p-3`}
          >
            <List.Item.Meta
              avatar={item.avatar}
              title={
                <small
                  css={`
                    display: flex;
                    width: 100%;
                  `}
                >
                  <span>{item.from}</span>
                  <span className="mr-auto" />
                  <span>{formatDistanceToNow(item.date)}</span>
                </small>
              }
              description={item.subject}
            />
          </List.Item>
        )}
      />
    </div>
  );

  return (
    <>
      <Layout className="fill-workspace rounded shadow-sm overflow-hidden">
        {!state.mobile && <Sider width={150}>{navigationSidebar}</Sider>}
        <Drawer
          closable={false}
          width={150}
          placement={`${state.direction === 'rtl' ? 'right': 'left'}`}
          onClose={() => setNavigation(false)}
          visible={navigation}
          className="chat-drawer"
        >
          {navigationSidebar}
        </Drawer>
        {!state.mobile && <Sider width={350}>{messagesSidebar}</Sider>}
        <Drawer
          closable={false}
          width={350}
          placement={`${state.direction === 'rtl' ? 'right': 'left'}`}
          onClose={() => setMessages(false)}
          visible={messages}
          className="chat-drawer"
        >
          {messagesSidebar}
        </Drawer>
        <div
          className="p-5 scroll-y"
          css={`
            background: #f5f5f5;
          `}
        >
          <div className={`${state.mobile ? 'px-1 py-3' : 'px-5 py-3'}`}>
            <div
              className="mb-3"
              css={`
                display: flex;
              `}
            >
              {selectedMessage.avatar}
              <div className="px-3">
                <h6>{selectedMessage.from}</h6>
                <small>
                  {format(new Date(selectedMessage.date), "yyyy LLLL iiii HH:mm")}
                </small>
              </div>
            </div>
            <h5 className="my-4">{selectedMessage.subject}</h5>
            <div dangerouslySetInnerHTML={createMarkup(selectedMessage.body)} />

            {state.mobile && (
              <Fab>
                <Button
                  type="primary"
                  shape="circle"
                  size="large"
                  onClick={() => setNavigation(true)}
                  className="mb-3"
                >
                  <MessageTwoTone style={{ fontSize: '20px'}} />
                </Button>
                <span className="mr-auto" />
                <Button
                  type="primary"
                  shape="circle"
                  size="large"
                  onClick={() => setMessages(true)}
                >
                  <EditTwoTone style={{ fontSize: '20px'}} />
                </Button>
              </Fab>
            )}
          </div>
        </div>
      </Layout>

      <Drawer
        title="Compose"
        width={720}
        placement={`${state.direction === 'rtl' ? 'left': 'right'}`}
        onClose={() => setBox(!replyBox)}
        maskClosable={false}
        visible={replyBox}
      >
        <Form layout="vertical" hideRequiredMark>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Name" name="name" rules={[{ required: true, message: 'please enter user name' }]}>
                <Input placeholder="please enter user name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Url" name="url" rules={[{ required: true, message: 'please enter url' }]}>
                <Input
                  style={{ width: '100%' }}
                  addonBefore="http://"
                  placeholder="please enter url"
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Owner" name="owner" rules={[{ required: true, message: 'Please select an owner' }]}>
                <Select Select placeholder="Please select an owner">
                  <Option value="xiao">Xiaoxiao Fu</Option>
                  <Option value="mao">Maomao Zhou</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Type" name="type" rules={[{ required: true, message: 'Please choose the type' }]}>
                <Select placeholder="Please choose the type">
                  <Option value="private">Private</Option>
                  <Option value="public">Public</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Approver" name="approver" rules={[{ required: true, message: 'Please choose the approver' }]}>
                <Select placeholder="Please choose the approver">
                  <Option value="jack">Jack Ma</Option>
                  <Option value="tom">Tom Liu</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="DateTime" name="dateTime" rules={[{ required: true, message: 'Please choose the dateTime' }]}>
                <DatePicker.RangePicker
                  style={{ width: '100%' }}
                  getPopupContainer={trigger => trigger.parentNode}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item label="Description" name="description" rules={[{required: true, message: 'please enter url description'}]}>
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
            textAlign: state.direction === 'rtl' ? 'left' : 'right',
            left: 0,
            background: '#fff',
            borderRadius: '0 0 4px 4px'
          }}
        >
          <Button
            style={{
              marginRight: state.direction === 'rtl' ? 0 : 8,
              marginLeft: state.direction === 'rtl' ? 8 : 0
            }}
            onClick={() => setBox(!replyBox)}
          >
            Cancel
          </Button>
          <Button onClick={() => setBox(!replyBox)}>Submit</Button>
        </div>
      </Drawer>
    </>
  );
};

export default Messages;
