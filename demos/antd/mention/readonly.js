import { Mentions } from 'antd';

const { toString } = Mentions;

function onChange(editorState) {
  console.log(toString(editorState));
}

const users = ['afc163', 'benjycui', 'yiminghe', 'jljsj33', 'dqaria', 'RaoHai'];

function App() {
  return (
    <div>
      <div style={{ marginBottom: 10 }}>
        <Mentions
          style={{ width: '100%' }}
          onChange={onChange}
          placeholder="this is disabled Mention"
          suggestions={users}
          disabled
        />
      </div>
      <Mentions
        style={{ width: '100%' }}
        onChange={onChange}
        placeholder="this is readOnly Mention"
        suggestions={users}
        readOnly
      />
    </div>
  );
}

export default App;
