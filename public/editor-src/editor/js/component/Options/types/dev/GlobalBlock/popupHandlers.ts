import { SectionPopup2Instances } from "visual/editorComponents/SectionPopup2/instances";
import { SectionPopupInstances } from "visual/editorComponents/SectionPopup/instances";

export const getOpenedPopupId = (): string => {
  let id = "";

  new Map([...SectionPopupInstances, ...SectionPopup2Instances]).forEach(
    (popup) => {
      if (popup.state.isOpened) {
        id = popup.instanceKey;
      }
    }
  );

  return id;
};

export const openPopupById = (id: string): void => {
  const popup = new Map([
    ...SectionPopupInstances,
    ...SectionPopup2Instances
  ]).get(id);

  popup && popup.open();
};
