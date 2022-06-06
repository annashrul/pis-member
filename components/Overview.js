import { ApiTwoTone, BellOutlined, BookOutlined, DatabaseTwoTone, EditTwoTone, EllipsisOutlined, FallOutlined, FileZipTwoTone, MessageOutlined, PhoneOutlined, PrinterTwoTone, RestTwoTone, RiseOutlined, SaveTwoTone } from '@ant-design/icons';
import {
  Avatar,
  Card,
  Col,
  DatePicker,
  Dropdown,
  List,
  Menu,
  Message,
  Progress,
  Row,
  Timeline
} from 'antd';
import {
  DiscreteColorLegend,
  FlexibleWidthXYPlot,
  HorizontalGridLines,
  VerticalBarSeries,
  VerticalGridLines,
  XAxis,
  YAxis
} from 'react-vis';

import NoSSR from 'react-no-ssr';
import PostCard from './shared/PostCard';
import StatCard from './shared/StatCard';
import WeatherCard from './shared/WeatherCard';
import styled from 'styled-components';
import { theme } from './styles/GlobalStyles';

const { MonthPicker } = DatePicker;

const axes = Array.from(Array(12).keys());

const generate = () => {
  let arr = [];
  axes.map(x => {
    const y = Math.floor(Math.random() * 10) + 1;
    arr.push({ x, y });
  });
  return arr;
};

const series = [
  {
    title: 'Views',
    data: generate()
  },
  {
    title: 'Sales',
    data: generate()
  }
];

const Legend = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0;
  .rv-discrete-color-legend {
    display: inline-block;
    width: auto !important;
  }
  .rv-discrete-color-legend-item {
    padding-top: 0;
    padding-bottom: 0;
  }
`;

const menu = (
  <Menu>
    <Menu.Item>
      <Row type="flex" align="middle">
        <FileZipTwoTone style={{ fontSize: '16px' }} />
        <span className="mx-3">Archive</span>
      </Row>
    </Menu.Item>
    <Menu.Item>
      <Row type="flex" align="middle">
        <EditTwoTone style={{ fontSize: '16px' }} />
        <span className="mx-3">Edit</span>
      </Row>
    </Menu.Item>
    <Menu.Item>
      <Row type="flex" align="middle">
        <RestTwoTone style={{ fontSize: '16px' }} />
        <span className="mx-3">Delete</span>
      </Row>
    </Menu.Item>
    <Menu.Divider />
    <Menu.Item>
      <Row type="flex" align="middle">
        <SaveTwoTone style={{ fontSize: '16px' }} />
        <span className="mx-3">Save as</span>
      </Row>
    </Menu.Item>
    <Menu.Item>
      <Row type="flex" align="middle">
        <PrinterTwoTone style={{ fontSize: '16px' }} />
        <span className="mx-3">Print</span>
      </Row>
    </Menu.Item>
  </Menu>
);

const data = [
  {
    title: 'Click through ratio',
    subtitle: (
      <span>
        <span className="mr-1">15%</span>
        <RiseOutlined style={{ fontSize: '20px' }} className="text-success" />
      </span>
    )
  },
  {
    title: 'Cost per thousand',
    subtitle: (
      <span>
        <span className="mr-1">$320.89</span>
        <FallOutlined style={{ fontSize: '20px' }} className="text-error" />
      </span>
    )
  },
  {
    title: 'Bounce rate',
    subtitle: (
      <span>
        <span className="mr-1">34%</span>
        <RiseOutlined style={{ fontSize: '20px' }} className="text-success" />
      </span>
    )
  }
];

const TimelinePeriod = ({ content }) => (
  <small
    className="text-muted"
    css={`
      display: block;
    `}
  >
    {content}
  </small>
);

const Overview = () => {
  return (
    <div>
      <Row gutter={16}>
        <Col xs={24} sm={12} md={6}>
          <StatCard
            type="fill"
            title="Campaigns"
            value={103}
            icon={<BookOutlined style={{ fontSize: '20px'}} />}
            color={theme.primaryColor}
            clickHandler={() => Message.info('Campaign stat button clicked')}
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatCard
            type="fill"
            title="Customers"
            value={230}
            icon={<PhoneOutlined style={{ fontSize: '20px'}}  />}
            color={theme.darkColor}
            clickHandler={() => Message.info('Customers stat button clicked')}
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatCard
            type="fill"
            title="Queries"
            value={323}
            icon={<BellOutlined style={{ fontSize: '20px'}} />}
            color={theme.warningColor}
            clickHandler={() => Message.info('Queries stat button clicked')}
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatCard
            type="fill"
            title="Opens"
            value={870}
            icon={<MessageOutlined style={{ fontSize: '20px'}} />}
            color={theme.errorColor}
            clickHandler={() => Message.info('Opens stat button clicked')}
          />
        </Col>
      </Row>

      <Card
        title="Sales analytics"
        extra={
          <Dropdown overlay={menu}>
            <EllipsisOutlined style={{ fontSize: '20px' }} />
          </Dropdown>
        }
        bodyStyle={{ padding: '1rem' }}
        className="mb-4"
      >
        <NoSSR>
          <Legend>
            <DiscreteColorLegend width={180} height={20} items={series} />
            <MonthPicker placeholder="Select a month" />
          </Legend>
          <FlexibleWidthXYPlot xType="ordinal" height={340} xDistance={100}>
            <VerticalGridLines style={{ strokeWidth: 0.5 }} />
            <HorizontalGridLines style={{ strokeWidth: 0.5 }} />
            <XAxis style={{ strokeWidth: 0.5 }} />
            <YAxis style={{ strokeWidth: 0.5 }} />
            <VerticalBarSeries color="#007bff" data={series[0].data} />
            <VerticalBarSeries
              color="rgb(211, 232, 255)"
              data={series[1].data}
            />
          </FlexibleWidthXYPlot>
        </NoSSR>
      </Card>

      <Row gutter={16}>
        <Col sm={24} md={8} className="mb-4">
          <Card bodyStyle={{ padding: 0 }}>
            <Row
              type="flex"
              align="middle"
              justify="center"
              gutter={16}
              className="py-4"
            >
              <Progress
                type="dashboard"
                percent={90}
                width={181}
                format={percent => (
                  <span className="text-center">
                    <div
                      css={`
                        display: block;
                        color: #007bff;
                        margin: auto;
                      `}
                    >
                      <ApiTwoTone style={{ fontSize: '20px'}} />
                    </div>
                    <div
                      className="h5 mb-0"
                      css={`
                        display: block;
                      `}
                    >
                      {percent}
                    </div>
                    <div className="h6">
                      <small>30% commission rate</small>
                    </div>
                  </span>
                )}
              />
            </Row>

            <List
              itemLayout="horizontal"
              dataSource={data}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    title={
                      <a
                        href="/"
                        className="px-4"
                        css={`
                          display: flex;
                        `}
                      >
                        {item.title}
                        <span className="mr-auto" />
                        <small>{item.subtitle}</small>
                      </a>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col sm={24} md={8} className="mb-4">
          <Card
            title="Tasks"
            extra={
              <Dropdown overlay={menu}>
                <EllipsisOutlined style={{ fontSize: '20px' }} />
              </Dropdown>
            }
          >
            <Timeline pending="Tasks pending..." className="mt-2">
              <Timeline.Item>
                <div className="text-truncate">
                  <TimelinePeriod content="09.45" />
                  <span>Create a services site</span>
                </div>
              </Timeline.Item>
              <Timeline.Item>
                <div className="text-truncate">
                  <TimelinePeriod content="11.20" />
                  <span>Solve initial network problems</span>
                </div>
              </Timeline.Item>
              <Timeline.Item
                dot={
                  <DatabaseTwoTone style={{ fontSize: '16px' }} />
                }
              >
                <div className="text-truncate">
                  <TimelinePeriod content="13.00" />
                  <span>Technical testing</span>
                </div>
              </Timeline.Item>
              <Timeline.Item>
                <div className="text-truncate">
                  <TimelinePeriod content="15.00" />
                  <span>Network problems being solved</span>
                </div>
              </Timeline.Item>
            </Timeline>
          </Card>
        </Col>
        <Col sm={24} md={8} className="mb-4">
          <Card
            title="Activity"
            extra={
              <Dropdown overlay={menu}>
                <EllipsisOutlined style={{ fontSize: '20px' }} />
              </Dropdown>
            }
          >
            <Timeline
              pending={<div className="ml-4">Activities pending...</div>}
              className="mt-2"
            >
              <Timeline.Item
                dot={<Avatar size={24} src="/images/face1.jpg" />}
              >
                <div className="ml-4 text-truncate">
                  <TimelinePeriod content="9.45" />
                  <span>
                    <a>John Doe</a> launched a new application
                  </span>
                </div>
              </Timeline.Item>
              <Timeline.Item
                dot={<Avatar size={24} src="/images/face2.jpg" />}
              >
                <div className="ml-4 text-truncate">
                  <TimelinePeriod content="11.20" />
                  <span>
                    <a>Paula Bean</a> Cleared calendar events
                  </span>
                </div>
              </Timeline.Item>
              <Timeline.Item
                dot={<Avatar size={24} src="/images/face3.jpg" />}
              >
                <div className="ml-4 text-truncate">
                  <TimelinePeriod content="13.00" />
                  <span>
                    <a>Peter Hadji</a> Joined your mailing list
                  </span>
                </div>
              </Timeline.Item>
              <Timeline.Item
                dot={<Avatar size={24} src="/images/face4.jpg" />}
              >
                <div className="ml-4 text-truncate">
                  <TimelinePeriod content="15.00" />
                  <span>
                    <a>Trevor Belmont</a> Created a new task list
                  </span>
                </div>
              </Timeline.Item>
            </Timeline>
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col md={24} lg={12}>
          <WeatherCard city="harare" country="zw" days={7} />
        </Col>

        <Col md={24} lg={12}>
          <PostCard
            title="Shrimp and Chorizo Paella"
            subtitle="Yesterday"
            image="/images/unsplash/1.jpg"
            images={[
              '/images/unsplash/1.jpg',
              '/images/unsplash/15.jpg'
            ]}
            imageHeight={365}
            text="Phileas Fogg and Aouda went on board, where they found Fix already installed. Below deck was a square cabin, of which the walls bulged out in the form of cots, above a circular divan; in the centre was a table provided with a swinging lamp."
          />
        </Col>
      </Row>
    </div>
  );
};

export default Overview;
