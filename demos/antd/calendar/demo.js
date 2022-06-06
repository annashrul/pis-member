import { Card, Divider } from 'antd';

import Basic from './basic';
import CardDemo from './card';
import { Component } from 'react';
import NoticeCalendar from './notice-calendar';
import Select from './select';

class Demo extends Component {
  render() {
    return (
      <Card bodyStyle={{ padding: 0 }}>
        <Divider orientation="left">
          <small>Basic</small>
        </Divider>
        <div className="p-4">
          <Basic />
        </div>

        <Divider orientation="left">
          <small>Notice calendar</small>
        </Divider>
        <div className="p-4">
          <NoticeCalendar />
        </div>

        <Divider orientation="left">
          <small>Selectable Calendar</small>
        </Divider>
        <div className="p-4">
          <Select />
        </div>

        <Divider orientation="left">
          <small>Card</small>
        </Divider>
        <div className="p-4">
          <CardDemo />
        </div>
      </Card>
    );
  }
}

export default Demo;
