import { ReactNode } from "react";
import { ElementModel } from "visual/component/Elements/Types";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import { getBackgroundValue } from "visual/editorComponents/Flipbox/utils";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";

class FlipboxItems extends EditorArrayComponent {
  static get componentId(): ElementTypes.FlipboxItems {
    return ElementTypes.FlipboxItems;
  }

  getItemProps(
    itemData: ElementModel,
    itemIndex: number,
    items: ElementModel[]
  ): ReactNode {
    const props = super.getItemProps(itemData, itemIndex, items);

    const type = itemIndex === 0 ? "front" : itemIndex === 1 ? "back" : "front";
    const backgroundValue = getBackgroundValue(type, props.v);

    return {
      ...props,
      type,
      meta: this.props.meta,
      backgroundValue
    };
  }
}

export default FlipboxItems;
