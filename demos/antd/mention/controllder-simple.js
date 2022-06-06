import { Component } from 'react';
import { Mentions } from 'antd';

class App extends Component {
  state = {
    value: '@afc163'
  };

  componentDidMount() {
    this.mention.focus();
  }

  handleChange = editorState => {
    this.setState({
      value: editorState
    });
  };

  render() {
    return (
      <Mentions
        ref={ele => (this.mention = ele)}
        suggestions={[
          'afc163',
          'benjycui',
          'yiminghe',
          'RaoHai',
          '中文',
          'にほんご'
        ]}
        value={this.state.value}
        onChange={this.handleChange}
      />
    );
  }
}

export default App;
