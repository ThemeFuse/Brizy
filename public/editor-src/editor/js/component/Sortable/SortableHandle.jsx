import React from "react";
import { makeDataAttr } from "visual/utils/i18n/attribute";

class SortableHandle extends React.Component {
  render() {
    const { children } = this.props;

    if (IS_PREVIEW) {
      return React.Children.only(children);
    }

    return React.cloneElement(React.Children.only(children), {
      ...makeDataAttr({ name: "sortable-handle", value: "true" })
    });
  }
}

export default SortableHandle;
