import React, { useEffect } from "react";
import { instance } from "./index";
import { OptionDefinition } from "visual/editorComponents/ToolbarItemType";

type RightSidebarItemsProps = {
  getItems: () => OptionDefinition[];
  getTitle?: () => string;
};

export const RightSidebarItems: React.FC<RightSidebarItemsProps> = ({
  getItems,
  getTitle
}) => {
  if (!getItems) {
    return null;
  }

  // update the items on every render
  useEffect(() => {
    instance && instance.setItems(getItems, getTitle);
  });

  // clear the items when component unmounts
  useEffect(() => {
    return (): void => {
      instance && instance.clearItems();
    };
  }, []);

  return null;
};
