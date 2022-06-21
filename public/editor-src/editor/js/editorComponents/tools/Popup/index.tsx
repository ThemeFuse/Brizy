import { Block } from "visual/types";

type Value = {
  popups: Block[];
  linkType: string;
  linkPopup: string;
  linkLightBox: string;
};

export const shouldRenderPopup = (v: Value, globalBlocks: Block[]): boolean => {
  const { popups, linkType, linkPopup, linkLightBox } = v;

  const _linkType = linkLightBox === "on" ? "lightBox" : linkType;

  if (popups.length > 0 && _linkType === "popup" && linkPopup !== "") {
    const normalizePopups: Block[] = popups.reduce((acc: Block[], popup) => {
      let itemData: Block = popup;

      if (itemData.type === "GlobalBlock") {
        // TODO: some kind of error handling
        itemData = globalBlocks[itemData.value._id];
      }

      if (itemData) {
        acc.push(itemData);
      }
      return acc;
    }, []);

    return normalizePopups.length > 0;
  }

  return false;
};
