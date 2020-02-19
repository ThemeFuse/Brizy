import React, { useEffect } from "react";
import { OptionDefinition } from "visual/component/Options/Type";
import { instance } from "./index";

type RightSidebarItemsProps = {
  items: OptionDefinition[];
  title?: string;
};

export const RightSidebarItems: React.FC<RightSidebarItemsProps> = ({
  items,
  title
}) => {
  // update the items on every render
  useEffect(() => {
    instance && instance.setItems(items, title);
  });

  // clear the items when component unmounts
  useEffect(() => {
    return (): void => {
      instance && instance.clearItems();
    };
  }, []);

  return null;
};
