import { Button, Tag } from 'antd';

import { Component } from 'react';
class Demo extends Component {
  state = {
    visible: true
  };

  render() {
    return (
      <div>
        <Tag
          closable
          visible={this.state.visible}
          onClose={() => this.setState({ visible: false })}
        >
          Movies
        </Tag>
        <br />
        <Button
          size="small"
          onClick={() => this.setState({ visible: !this.state.visible })}
        >
          Toggle
        </Button>
      </div>
    );
  }
}

export default Demo;
