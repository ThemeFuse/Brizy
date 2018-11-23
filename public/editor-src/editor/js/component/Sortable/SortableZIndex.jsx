import React from "react";

class SortableZIndex extends React.Component {
  static defaultProps = {
    zindex: 0
  };

  render() {
    const { children, zindex } = this.props;

    if (IS_PREVIEW) {
      return React.Children.only(children);
    }

    return React.cloneElement(React.Children.only(children), {
      "data-sortable-zindex": zindex
    });
  }
}

export default SortableZIndex;
