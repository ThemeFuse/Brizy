import React from "react";

class SortableElement extends React.Component {
  static defaultProps = {
    type: "",
    subtype: "",
    useHandle: false
  };

  constructor(props) {
    super(props);

    if (!this.props.type) {
      throw new Error("SortableElement must receive a non-empty type");
    }
  }

  render() {
    const { children, type, subtype, useHandle } = this.props;

    if (IS_PREVIEW) {
      return React.Children.only(children);
    }

    let dataProps = {
      "data-sortable-element": true,
      "data-sortable-type": type,
      ...(subtype ? { "data-sortable-subtype": subtype } : {})
    };

    if (useHandle) {
      dataProps["data-sortable-use-handle"] = true;
    }

    return React.cloneElement(React.Children.only(children), dataProps);
  }
}

export default SortableElement;
