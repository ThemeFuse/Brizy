import React from "react";
import { Item } from "react-contexify";

export default class Button extends React.Component {
  static defaultProps = {
    title: "",
    onChange: () => {}
  };

  render() {
    const { title, onChange } = this.props;

    return (
      <Item onClick={onChange}>
        <span className="react-contexify__item--title">{title}</span>
      </Item>
    );
  }
}
