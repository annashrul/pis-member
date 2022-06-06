import { Button, Switch } from 'antd';

import { Component } from 'react';
class App extends Component {
  state = {
    disabled: true
  };

  toggle = () => {
    this.setState({
      disabled: !this.state.disabled
    });
  };

  render() {
    return (
      <div>
        <Switch disabled={this.state.disabled} defaultChecked />
        <span className="d-block my-3 w-100" />
        <Button type="primary" onClick={this.toggle}>
          Toggle disabled
        </Button>
      </div>
    );
  }
}

export default App;
