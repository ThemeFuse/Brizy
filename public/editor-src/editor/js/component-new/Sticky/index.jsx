import React from "react";
import { observer } from "./utils";

export default class Sticky extends React.Component {
  static defaultProps = {
    refSelector: "",
    type: "animated", // animated | fixed
    render: () => null,
    onChange: () => null
  };

  state = {
    isSticky: false
  };

  refNode = null;

  componentDidMount() {
    observer.addListener(this.checkSticky);
    this.checkSticky();
  }

  componentWillUnmount() {
    this.refNode = null;
    observer.removeListener(this.checkSticky);
  }

  handleChange = () => {
    this.props.onChange(this.state.isSticky);
  };

  checkSticky = () => {
    const { refSelector, type } = this.props;

    if (!this.refNode) {
      this.refNode = document.querySelector(refSelector);
    }

    const refNodeRect = this.refNode.getBoundingClientRect();
    const isSticky =
      type === "animated"
        ? -refNodeRect.top >= refNodeRect.height
        : refNodeRect.top <= 0;

    if (isSticky !== this.state.isSticky) {
      this.setState({ isSticky }, this.handleChange);
    }
  };

  render() {
    return this.props.render(this.state.isSticky);
  }
}
