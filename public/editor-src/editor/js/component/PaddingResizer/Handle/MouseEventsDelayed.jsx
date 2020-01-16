import { Component } from "react";
import ReactDOM from "react-dom";
import _ from "underscore";

export default class MouseOverElement extends Component {
  static defaultProps = {
    delay: 1000,
    onEnter: _.noop,
    onEnterSuccess: _.noop,
    onLeave: _.noop,
    onLeaveSuccess: _.noop
  };

  isMounted = true;

  timeoutId = null;

  enterSuccess = false;

  componentDidMount() {
    this.isMounted = true;

    // eslint-disable-next-line react/no-find-dom-node
    const elem = ReactDOM.findDOMNode(this);

    elem.addEventListener("mouseenter", this.handleMouseEnter);
    elem.addEventListener("mouseleave", this.handleMouseLeave);
  }

  componentWillUnmount() {
    this.isMounted = false;

    // eslint-disable-next-line react/no-find-dom-node
    const elem = ReactDOM.findDOMNode(this);

    elem.removeEventListener("mouseenter", this.handleMouseEnter);
    elem.removeEventListener("mouseleave", this.handleMouseLeave);
  }

  handleMouseEnter = () => {
    this.props.onEnter();

    this.timeoutId = setTimeout(this.handleMouseEnterTimeout, this.props.delay);
    this.enterSuccess = false;
  };

  handleMouseEnterTimeout = () => {
    if (!this.isMounted) {
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
