import React, { Component, createRef } from "react";
import classnames from "classnames";

class MenuDropDown extends Component {
  static defaultProps = {
    className: "",
    position: "left",
    target: null
  };

  state = {
    position: this.props.position
  };

  content = createRef();

  componentDidMount() {
    this.node = this.content.current;
    this.reposition();
  }

  componentWillReceiveProps() {
    const { position } = this.props;

    if (this.state.position !== position) {
      this.setState({ position });
    }
  }

  componentDidUpdate() {
    if (this.isReposition) {
      return;
    }

    this.reposition();
  }

  getClassName() {
    const { position } = this.state;
    const { className } = this.props;

    return classnames(
      "brz-menu__dropdown",
      `brz-menu__dropdown-${position}`,
      className
    );
  }

  reposition() {
    let { target } = this.props;

    if (!target) {
      target = window.document.body;
    }

    const { left, right } = this.node.getBoundingClientRect();
    const { width: targetWidth } = target.getBoundingClientRect();

    if (right >= targetWidth) {
      this.isReposition = true;
      this.setState({ position: "right" }, () => (this.isReposition = false));
    }

    if (left <= 0) {
      this.isReposition = true;
      this.setState({ position: "left" }, () => (this.isReposition = false));
    }
  }

  render() {
    return (
      <ul ref={this.content} className={this.getClassName()}>
        {this.props.children}
      </ul>
    );
  }
}

export default MenuDropDown;
