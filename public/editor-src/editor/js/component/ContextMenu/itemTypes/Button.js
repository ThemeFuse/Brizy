import { Item } from "@radix-ui/react-context-menu";
import React from "react";
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
      <Item
        className="brz-ed-context-menu__item"
        onSelect={onChange}
        disabled={inactive}
      >
        {icon && <EditorIcon icon={icon} />}
        <span className="brz-ed-context-menu__item-label">{title}</span>
        <span className="brz-ed-context-menu__item-hint">
          {helperText(meta)}
        </span>
      </Item>
    );
  }
}
