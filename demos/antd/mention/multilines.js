import { Mentions } from 'antd';

const { toString } = Mentions;

function onChange(editorState) {
  console.log(toString(editorState));
}

const Component = () => (
  <Mentions
    style={{ width: '100%', height: 100 }}
    onChange={onChange}
    suggestions={[
      'afc163',
      'benjycui',
      'yiminghe',
      'jljsj33',
      'dqaria',
      'RaoHai'
    ]}
    multiLines
  />
);

export default Component;
