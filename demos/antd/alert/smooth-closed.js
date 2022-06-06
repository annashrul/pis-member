import { Alert } from 'antd';
import { Component } from 'react';
class App extends Component {
  state = {
    visible: true
  };

  handleClose = () => {
    this.setState({ visible: false });
  };

  render() {
    return (
      <div>
        {this.state.visible ? (
          <Alert
            message="Alert Message Text"
            type="success"
            closable
            afterClose={this.handleClose}
          />
        ) : null}
        <p>placeholder text here</p>
      </div>
    );
  }
}

export default App;
