import { BellOutlined, BookOutlined, MessageOutlined, PhoneOutlined } from '@ant-design/icons';
import { Col, Message, Row } from 'antd';

import ImageStatCard from './shared/ImageStatCard';
import MockFeed from '../demos/mock/feed';
import NewsCard from './shared/NewsCard';
import PostCard from './shared/PostCard';
import ProfileCard from './shared/ProfileCard';
import StatCard from './shared/StatCard';
import WeatherCard from './shared/WeatherCard';
import { theme } from './styles/GlobalStyles';
import { useState } from 'react';

const Widgets = () => {
    const [feed] = useState(MockFeed.slice(0, 3));
    const [stats] = useState([
        {
            title: 'Comments',
            value: 24
        },
        {
            title: 'Likes',
            value: 45
        },
        {
            title: 'Shares',
            value: 984
        }
    ]);

    return (
        <>
        <Row gutter={16}>
            {/*
            Stat cards
          */}
          <Col xs={24} sm={12} md={6}>
            <StatCard
                title="Campaigns"
                value={103}
                icon={<BookOutlined style={{ fontSize: '20px'}} />}
                color={theme.primaryColor}
                clickHandler={() => Message.info('Campaign stat button clicked')}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <StatCard
                title="Customers"
                value={230}
                icon={<PhoneOutlined style={{ fontSize: '20px'}}  />}
                color={theme.darkColor}
                clickHandler={() => Message.info('Customer stat button clicked')}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <StatCard
                title="Queries"
                value={323}
                icon={<BellOutlined style={{ fontSize: '20px'}} />}
                color={theme.warningColor}
                clickHandler={() => Message.info('Queries stat button clicked')}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <StatCard
                title="Opens"
                value={870}
                icon={<MessageOutlined style={{ fontSize: '20px'}} />}
                color={theme.errorColor}
                clickHandler={() => Message.info('Opens stat button clicked')}
            />
          </Col>
        </Row>
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
        <Row gutter={16}>
            {/*
            News card
          */}
          <Col xs={24} sm={24} md={8}>
            <NewsCard
                title="Feed"
                subtitle="Last updated 24 mins ago"
                feed={feed}
            />
          </Col>

            {/*
            Image stat card
          */}
          <Col xs={24} sm={12} md={8}>
            <ImageStatCard
                title="image stat card"
                images={[
                    '/images/unsplash/2.jpg',
                    '/images/unsplash/1.jpg',
                    '/images/unsplash/13.jpg'
                ]}
                imageHeight={230}
                stats={stats}
            />
          </Col>

            {/*
            Profile card
          */}
          <Col xs={24} sm={12} md={8}>
            <ProfileCard
                name={'John Doe'}
                avatar="/images/face1.jpg"
                images={[
                    '/images/unsplash/4.jpg',
                    '/images/unsplash/6.jpg'
                ]}
                location={'London, Uk'}
                imageHeight={230}
                stats={stats}
                callHandler={() => Message.info('Call button clicked')}
                messageHandler={() => Message.info('Message button clicked')}
            />
          </Col>
        </Row>
        <Row gutter={16}>
            {/*
            Weather card
          */}
          <Col sm={24} md={12}>
            <WeatherCard city="harare" country="zw" days={7} />
          </Col>

          <Col sm={24} md={12}>
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
        </>
    );
};

export default Widgets;
