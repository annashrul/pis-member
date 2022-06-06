import { Button, Icon } from 'antd';
import { CloudDownloadOutlined, CloudOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';

const ButtonGroup = Button.Group;

const Component = () => (
  <div>
    <small className="d-block">Basic</small>
    <ButtonGroup>
      <Button>Cancel</Button>
      <Button>OK</Button>
    </ButtonGroup>
    <ButtonGroup>
      <Button disabled>L</Button>
      <Button disabled>M</Button>
      <Button disabled>R</Button>
    </ButtonGroup>
    <ButtonGroup>
      <Button>L</Button>
      <Button>M</Button>
      <Button>R</Button>
    </ButtonGroup>

    <small className="d-block">With Icon</small>
    <ButtonGroup>
      <Button type="primary">
        <LeftOutlined />
        Go back
      </Button>
      <Button type="primary">
        Go forward
        <RightOutlined />
      </Button>
    </ButtonGroup>
    <ButtonGroup>
      <Button type="primary" icon={<CloudOutlined />} />
      <Button type="primary" icon={<CloudDownloadOutlined />} />
    </ButtonGroup>
  </div>
);

export default Component;

/*<style>
#components-button-demo-button-group h4 {
  margin: 16px 0;
  font-size: 14px;
  line-height: 1;
  font-weight: normal;
}
#components-button-demo-button-group h4:first-child {
  margin-top: 0;
}
#components-button-demo-button-group .ant-btn-group {
  margin-right: 8px;
}
</style>*/
