import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import type {
  ArrayItem,
  ItemProps
} from "visual/editorComponents/EditorArrayComponent/types";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { DESKTOP, MOBILE, TABLET } from "visual/utils/responsiveMode";
import { backgroundValueGetter } from "./utils";

class FlipboxItems extends EditorArrayComponent {
  static get componentId(): ElementTypes.FlipboxItems {
    return ElementTypes.FlipboxItems;
  }

  getItemProps(
    itemData: ArrayItem,
    itemIndex: number,
    items: ArrayItem[]
  ): ItemProps {
    const props = super.getItemProps(itemData, itemIndex, items);

    const type = itemIndex === 0 ? "front" : itemIndex === 1 ? "back" : "front";

    // @ts-expect-error the parent does not type the props it gives to the items
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
