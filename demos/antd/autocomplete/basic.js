import { AutoComplete } from 'antd';
import { Component } from 'react';
function onSelect(value) {
  console.log('onSelect', value);
}

class Complete extends Component {
  state = {
    dataSource: []
  };

  handleSearch = value => {
    this.setState({
      dataSource: !value ? [] : [value, value + value, value + value + value]
    });
  };

  render() {
    const { dataSource } = this.state;
    return (
      <AutoComplete
        dataSource={dataSource}
        style={{ width: 200 }}
        onSelect={onSelect}
        onSearch={this.handleSearch}
        placeholder="input here"
      />
    );
  }
}

export default Complete;
