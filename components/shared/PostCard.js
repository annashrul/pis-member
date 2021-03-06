import { Card, Carousel,Tooltip  } from 'antd';
import { SafetyOutlined,HeartTwoTone, PushpinTwoTone, StarTwoTone } from '@ant-design/icons';
const { Meta } = Card;

import PropTypes from 'prop-types';
import styled from 'styled-components';
import Helper from "../../helper/general_helper";

const StyledCard = styled.div`
  .ant-card-cover {
    position: relative;
  }
`;

const Cover = styled.div`
  position: relative;
  width: 100%;
  .ant-carousel {
    position: absolute;
    width: 100%;
    height: 100%;
  }
  .slick-slider {
    width: 100%;
    height: 100%;
  }
  .slick-slide > div {
    display: flex;
  }
  .image {
    position: relative;
    background-size: cover;
    background-position: top center;
    width: 100%;
  }
  .weakColor & .image {
    -webkit-filter: invert(100%);
    filter: invert(100%);
  }
  .content {
    position: relative;
    z-index: 9;
  }
  .title {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    background-image: linear-gradient(
      to bottom,
      transparent 0,
      rgb(29, 29, 29) 100%
    );
  }
`;

const Content = styled.div`
  position: relative;
  height: 4.5em;
  overflow: hidden;
  &:after {
    content: '';
    text-align: right;
    position: absolute;
    bottom: 0;
    right: 0;
    width: 10%;
    height: 1.5em;
    background: linear-gradient(
      to right,
      rgba(255, 255, 255, 0),
      rgba(255, 255, 255, 1) 50%
    );
  }
`;

const PostCard = ({ title, subtitle, text, images, imageHeight,price,handleClick }) => (
    <StyledCard>
        <Card
            hoverable
            cover={
                <Cover style={{ height: imageHeight }}>
                    <div>
                        <div className="image" css={`background-image: url(${images});height: ${imageHeight}px;`}/>
                    </div>

                    <div className="title p-4">
                        <h6 className="mb-0 text-white">{title}</h6>
                        <small className="mb-0 text-white-50">{subtitle}</small>
                    </div>
                </Cover>
            }
            actions={handleClick?[
                <Tooltip title="Checkout">
                    <SafetyOutlined style={{fontSize: '24px'}} key={"checkout"} onClick={handleClick} />
                </Tooltip>
            ]:[]}
        >
            <Meta title={Helper.toRp(price)}/>
            <Content>{Helper.rmHtml(text)}</Content>
        </Card>
    </StyledCard>
);

PostCard.propTypes = {
    title: PropTypes.string,
    subtitle: PropTypes.string,
    text: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    imageHeight: PropTypes.number.isRequired
};

export default PostCard;
