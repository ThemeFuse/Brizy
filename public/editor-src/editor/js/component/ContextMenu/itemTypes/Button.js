import React from "react";
import { Item } from "react-contexify";
import EditorIcon from "visual/component/EditorIcon";

export default class Button extends React.Component {
  static defaultProps = {
    title: "",
    helperText: () => "",
    inactive: false,
    onChange: () => {}
  };

  render() {
    const { helperText, title, onChange, inactive, meta, icon } = this.props;

    return (
      <Item onClick={onChange} disabled={inactive}>
        {icon && <EditorIcon icon={icon} />}
        <span className="contexify_item-title">{title}</span>
        <span className="contexify_item-placeholder">{helperText(meta)}</span>
      </Item>
    );
  }
}
