import { Mentions } from 'antd';

const { toString } = Mentions;

function onChange(contentState) {
  console.log(toString(contentState));
}

function onSelect(suggestion) {
  console.log('onSelect', suggestion);
}

const Component = () => (
  <Mentions
    style={{ width: '100%' }}
    onChange={onChange}
    suggestions={[
      'afc163',
      'benjycui',
      'yiminghe',
      'RaoHai',
      '中文',
      'にほんご'
    ]}
    onSelect={onSelect}
    placement="top"
  />
);

export default Component;
