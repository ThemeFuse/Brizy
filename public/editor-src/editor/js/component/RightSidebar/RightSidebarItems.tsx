import { useEffect } from "react";
import type { OptionDefinition } from "visual/editorComponents/ToolbarItemType";
import { instance } from "./index";

type RightSidebarItemsProps = {
  getItems: () => OptionDefinition[];
  getTitle?: () => string;
};

export const RightSidebarItems = ({
  getItems,
  getTitle
}: RightSidebarItemsProps): null => {
  // update the items on every render
  useEffect(() => {
    if (getItems && instance) instance.setItems(getItems, getTitle);
  });

  // clear the items when component unmounts
  useEffect(() => {
    return (): void => {
      if (instance) instance.clearItems();
    };
  }, []);

  if (!getItems) {
    return null;
  }

  return null;
};
