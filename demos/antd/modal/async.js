import { Button, Modal } from 'antd';

import { Component } from 'react';
class App extends Component {
  state = {
    ModalText: 'Content of the modal',
    visible: false,
    confirmLoading: false
  };

  showModal = () => {
    this.setState({
      visible: true
    });
  };

  handleOk = () => {
    this.setState({
      ModalText: 'The modal will be closed after two seconds',
      confirmLoading: true
    });
    setTimeout(() => {
      this.setState({
        visible: false,
        confirmLoading: false
      });
    }, 2000);
  };

  handleCancel = () => {
    console.log('Clicked cancel button');
    this.setState({
      visible: false
    });
  };

  render() {
    const { visible, confirmLoading, ModalText } = this.state;
    return (
      <div>
        <Button onClick={this.showModal}>Open Modal with async logic</Button>
        <Modal
          title="Title"
          visible={visible}
          onOk={this.handleOk}
          confirmLoading={confirmLoading}
          onCancel={this.handleCancel}
        >
          <p>{ModalText}</p>
        </Modal>
      </div>
    );
  }
}

export default App;
