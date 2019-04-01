import React from "react";
import { Item } from "react-contexify";

export default class Button extends React.Component {
  static defaultProps = {
    title: "",
    helperText: () => "",
    inactive: false,
    onChange: () => {}
  };

  render() {
    const { helperText, title, onChange, inactive, meta } = this.props;

    return (
      <Item onClick={onChange} disabled={inactive}>
        <span className="react-contexify__item--title">{title}</span>
        <span className="react-contexify__item--placeholder">
          {helperText(meta)}
        </span>
      </Item>
    );
  }
}
