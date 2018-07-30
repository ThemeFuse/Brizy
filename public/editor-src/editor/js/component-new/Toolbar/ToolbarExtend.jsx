import React from "react";
import PropTypes from "prop-types";

export default class ToolbarExtend extends React.Component {
  static childContextTypes = {
    position: PropTypes.string
  };

  static defaultProps = {
    position: "absolute" // absolute | fixed
  };

  getChildContext() {
    const { position } = this.props;

    return { position };
  }

  render() {
    return this.props.children;
  }
}
