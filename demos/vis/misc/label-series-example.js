import {
  FlexibleWidthXYPlot,
  LabelSeries,
  MarkSeries,
  XAxis,
  YAxis
} from 'react-vis';

// Copyright (c) 2016 - 2017 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.
import { Component } from 'react';
import { RedoOutlined } from '@ant-design/icons';
import ShowcaseButton from '../showcase-components/showcase-button';

function generateData() {
  return [
    {
      x: Math.random() * 3,
      y: Math.random() * 20,
      label: 'Wigglytuff',
      size: 30,
      style: { fontSize: 20 }
    },
    { x: Math.random() * 3, y: Math.random() * 20, label: 'Psyduck', size: 10 },
    { x: Math.random() * 3, y: Math.random() * 20, label: 'Geodude', size: 1 },
    {
      x: Math.random() * 3,
      y: Math.random() * 20,
      label: 'red',
      size: 12,
      rotation: 45
    },
    { x: Math.random() * 3, y: Math.random() * 20, label: 'blue', size: 4 }
  ];
}

export default class Example extends Component {
  state = {
    data: [
      {
        x: 3,
        y: 7,
        label: 'Wigglytuff',
        size: 30,
        style: { fontSize: 20 },
        rotation: 45
      },
      { x: 2, y: 4, label: 'Psyduck', size: 10 },
      { x: 1, y: 20, label: 'Geodude', size: 1 },
      { x: 4, y: 12, label: 'Ditto', size: 12, rotation: 45 },
      { x: 1, y: 14, label: 'Snorlax', size: 4 }
    ]
  };
  render() {
    const { data } = this.state;
    return (
      <div>
        <ShowcaseButton
          onClick={() => this.setState({ data: generateData() })}
          buttonContent={<RedoOutlined style={{fontSize: '14px'}} />}
        />
        <FlexibleWidthXYPlot yDomain={[-1, 22]} xDomain={[-1, 5]} height={276}>
          <XAxis />
          <YAxis />
          <MarkSeries
            className="mark-series-example"
            strokeWidth={2}
            sizeRange={[5, 15]}
            data={data}
            color="#007bff"
          />
          <LabelSeries animation allowOffsetToBeReversed data={data} />
        </FlexibleWidthXYPlot>
      </div>
    );
  }
}
