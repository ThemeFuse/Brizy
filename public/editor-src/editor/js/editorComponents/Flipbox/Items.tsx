import { ReactNode } from "react";
import { ElementModel } from "visual/component/Elements/Types";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { DESKTOP, MOBILE, TABLET } from "visual/utils/responsiveMode";
import { backgroundValueGetter } from "./utils";

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

    const get = backgroundValueGetter({ type, v: props.v });

    const desktopBackgroundValue = get(DESKTOP);
    const tabletBackgroundValue = get(TABLET);
    const mobileBackgroundValue = get(MOBILE);

    const backgroundValue = {
      ...desktopBackgroundValue,
      ...tabletBackgroundValue,
      ...mobileBackgroundValue
    };

    return {
      ...props,
      type,
      meta: this.props.meta,
      backgroundValue
    };
  }
}

export default FlipboxItems;
