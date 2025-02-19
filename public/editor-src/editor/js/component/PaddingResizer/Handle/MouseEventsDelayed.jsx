import { noop } from "es-toolkit";
import { Component } from "react";

export default class MouseOverElement extends Component {
  static defaultProps = {
    delay: 1000,
    onEnter: noop,
    onEnterSuccess: noop,
    onLeave: noop,
    onLeaveSuccess: noop
  };

  isMount = true;

  timeoutId = null;

  enterSuccess = false;

  componentDidMount() {
    this.isMount = true;
    const elem = this.props.containerRef?.current;

    if (elem) {
      elem.addEventListener("mouseenter", this.handleMouseEnter);
      elem.addEventListener("mouseleave", this.handleMouseLeave);
    }
  }

  componentWillUnmount() {
    this.isMount = false;

    const elem = this.props.containerRef?.current;

    if (elem) {
      elem.removeEventListener("mouseenter", this.handleMouseEnter);
      elem.removeEventListener("mouseleave", this.handleMouseLeave);
    }
  }

  handleMouseEnter = () => {
    this.props.onEnter();

    this.timeoutId = setTimeout(this.handleMouseEnterTimeout, this.props.delay);
    this.enterSuccess = false;
  };

  handleMouseEnterTimeout = () => {
    if (!this.isMount) {
      return;
    }

    this.enterSuccess = true;

    this.props.onEnterSuccess();
  };

  handleMouseLeave = () => {
    this.props.onLeave();

    clearTimeout(this.timeoutId);

    if (this.enterSuccess) {
      this.props.onLeaveSuccess();
    }
  };

  render() {
    return this.props.children;
  }
}
