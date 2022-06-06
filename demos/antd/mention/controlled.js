import { Button, Form, Mentions } from 'antd';

import { Component } from 'react';

const { getMentions } = Mentions;
const FormItem = Form.Item;

class App extends Component {
  state = {
    initValue: '@afc163'
  };

  handleReset = e => {
    e.preventDefault();
    this.props.form.resetFields();
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((errors, values) => {
      if (errors) {
        console.log('Errors in the form!!!');
        return;
      }
      console.log('Submit!!!');
      console.log(values);
    });
  };

  checkMention = (rule, value, callback) => {
    const mentions = getMentions('mention');
    if (mentions.length < 2) {
      callback(new Error('More than one must be selected!'));
    } else {
      callback();
    }
  };

  render() {
    return (
      <Form layout="horizontal">
        <FormItem
          id="control-mention"
          label="Top coders"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
          name="mention"
          rules={[{ validator: this.checkMention }]}
          initialValue={this.state.initValue}
        >
          <Mentions
            suggestions={[
              'afc163',
              'benjycui',
              'yiminghe',
              'RaoHai',
              '中文',
              'にほんご'
            ]}
          />
        </FormItem>
        <FormItem wrapperCol={{ span: 14, offset: 6 }}>
          <Button type="primary" onClick={this.handleSubmit}>
            Submit
          </Button>
          &nbsp;&nbsp;&nbsp;
          <Button onClick={this.handleReset}>Reset</Button>
        </FormItem>
      </Form>
    );
  }
}

export default App;
