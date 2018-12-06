import React from "react";
import ReactDOM from "react-dom";
import classnames from "classnames";

class MenuDropDown extends React.Component {
  static defaultProps = {
    className: "",
    position: "left",
    target: null
  };

  state = {
    position: this.props.position
  };

  componentDidMount() {
    this.node = ReactDOM.findDOMNode(this);
    this.reposition();
  }

  componentWillReceiveProps() {
    if (this.state.position !== this.props.position) {
      this.setState({
        position: this.props.position
      });
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
      this.setState(
        {
          position: "right"
        },
        () => (this.isReposition = false)
      );
    }

    if (left <= 0) {
      this.isReposition = true;
      this.setState(
        {
          position: "left"
        },
        () => (this.isReposition = false)
      );
    }
  }

  render() {
    return <ul className={this.getClassName()}>{this.props.children}</ul>;
  }
}

export default MenuDropDown;
