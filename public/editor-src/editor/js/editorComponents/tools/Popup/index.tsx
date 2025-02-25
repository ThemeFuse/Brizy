import { Block } from "visual/types/Block";

type Value = {
  popups?: Block[];
  linkType: string;
  linkPopup: string;
  linkLightBox: string;
  linkPopupPopups?: Block[];
};

export const shouldRenderPopup = (
  v: Value,
  globalBlocks: Record<string, Block>
): boolean => {
  const { popups, linkType, linkPopup, linkLightBox, linkPopupPopups } = v;

  const _linkType = linkLightBox === "on" ? "lightBox" : linkType;

  const _popups = linkPopupPopups ?? popups ?? [];

  if (_popups.length > 0 && _linkType === "popup" && linkPopup !== "") {
    const normalizePopups: Block[] = _popups.reduce((acc: Block[], popup) => {
      let itemData: Block = popup;

      if (itemData.type === "GlobalBlock" && itemData.value._id) {
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
