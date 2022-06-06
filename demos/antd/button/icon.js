import { Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const Component = () => (
  <div>
    <Button type="primary" shape="circle" icon={<SearchOutlined />} />
    <Button type="primary" icon={<SearchOutlined />}>
      Search
    </Button>
    <Button shape="circle" icon={<SearchOutlined />} />
    <Button icon={<SearchOutlined />}>Search</Button>
    <br />
    <Button shape="circle" icon={<SearchOutlined />} />
    <Button icon={<SearchOutlined />}>Search</Button>
    <Button type="dashed" shape="circle" icon={<SearchOutlined />} />
    <Button type="dashed" icon={<SearchOutlined />}>
      Search
    </Button>
  </div>
);

export default Component;
