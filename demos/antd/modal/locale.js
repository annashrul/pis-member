import { Button, Modal } from 'antd';

import { Component } from 'react';

class LocalizedModal extends Component {
  state = { visible: false };

  showModal = () => {
    this.setState({
      visible: true
    });
  };

  hideModal = () => {
    this.setState({
      visible: false
    });
  };

  render() {
    return (
      <div>
        <Button onClick={this.showModal}>Modal</Button>
        <Modal
          title="Modal"
          visible={this.state.visible}
          onOk={this.hideModal}
          onCancel={this.hideModal}
          okText="确认"
          cancelText="取消"
        >
          <p>Bla bla ...</p>
          <p>Bla bla ...</p>
          <p>Bla bla ...</p>
        </Modal>
      </div>
    );
  }
}

function confirm() {
  Modal.confirm({
    title: 'Confirm',
    content: 'Bla bla ...',
    okText: '确认',
    cancelText: '取消'
  });
}

const LocaleComponent = () => (
  <div>
    <LocalizedModal />
    <br />
    <Button onClick={confirm}>Confirm</Button>
  </div>
);
export default LocaleComponent;
