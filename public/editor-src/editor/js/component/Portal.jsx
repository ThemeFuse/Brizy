import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";

class Portal extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    node: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    const { node, className } = this.props;
    const nodeDocument = node.ownerDocument;

    this.el = nodeDocument.createElement("div");

    if (className) {
      this.el.className = className;
    }

    node.appendChild(this.el);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.className !== this.props.className) {
      this.el.className = nextProps.className;
    }
  }

  componentWillUnmount() {
    this.props.node.removeChild(this.el);
  }

  render() {
    return ReactDOM.createPortal(this.props.children, this.el);
  }
}

export default Portal;
