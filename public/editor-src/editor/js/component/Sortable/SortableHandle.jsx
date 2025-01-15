import React from "react";
import { isView } from "visual/providers/RenderProvider";
import { makeDataAttr } from "visual/utils/i18n/attribute";

class SortableHandle extends React.Component {
  render() {
    const { children, renderContext } = this.props;

    if (isView(renderContext)) {
      return React.Children.only(children);
    }

    return React.cloneElement(React.Children.only(children), {
      ...makeDataAttr({ name: "sortable-handle", value: "true" })
    });
  }
}

export default SortableHandle;
