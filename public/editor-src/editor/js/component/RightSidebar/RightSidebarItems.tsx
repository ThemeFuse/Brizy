import React, { useEffect } from "react";
import { OptionDefinition } from "visual/editorComponents/ToolbarItemType";
import { instance } from "./index";

type RightSidebarItemsProps = {
  getItems: () => OptionDefinition[];
  getTitle?: () => string;
};

export const RightSidebarItems: React.FC<RightSidebarItemsProps> = ({
  getItems,
  getTitle
}) => {
  // update the items on every render
  useEffect(() => {
    getItems && instance && instance.setItems(getItems, getTitle);
  });

  // clear the items when component unmounts
  useEffect(() => {
    return (): void => {
      instance && instance.clearItems();
    };
  }, []);

  if (!getItems) {
    return null;
  }

  return null;
};
