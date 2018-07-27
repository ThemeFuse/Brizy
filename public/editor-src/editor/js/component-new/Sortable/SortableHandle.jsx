import React from "react";

class SortableHandle extends React.Component {
  render() {
    const { children } = this.props;

    if (IS_PREVIEW) {
      return React.Children.only(children);
    }

    return React.cloneElement(React.Children.only(children), {
      "data-sortable-handle": true
    });
  }
}

export default SortableHandle;
