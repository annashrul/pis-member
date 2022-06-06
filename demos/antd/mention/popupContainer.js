import { Button, Mentions, Popover } from 'antd';

import { Component } from 'react';

const { toString } = Mentions;

function onChange(editorState) {
  console.log(toString(editorState));
}

function onSelect(suggestion) {
  console.log('onSelect', suggestion);
}

class PopoverContainer extends Component {
  getSuggestionContainer = () => {
    return this.popover.getPopupDomNode();
  };

  visibleChange = visible => {
    if (visible && this.mention) {
      this.mention.focus();
    }
  };

  render() {
    const mention = (
      <Mentions
        ref={ele => (this.mention = ele)}
        style={{ width: '100%' }}
        onChange={onChange}
        defaultValue={'@afc163'}
        suggestions={[
          'afc163',
          'benjycui',
          'yiminghe',
          'RaoHai',
          '中文',
          'にほんご'
        ]}
        onSelect={onSelect}
        getSuggestionContainer={this.getSuggestionContainer}
      />
    );
    return (
      <Popover
        trigger="click"
        content={mention}
        title="Title"
        ref={popover => (this.popover = popover)}
        onVisibleChange={this.visibleChange}
      >
        <Button type="primary">Click Me</Button>
      </Popover>
    );
  }
}

export default PopoverContainer;
