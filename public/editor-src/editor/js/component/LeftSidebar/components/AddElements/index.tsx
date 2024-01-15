import React, { ReactElement } from "react";
import { LeftSidebarOptionsIds } from "visual/global/Config/types/configs/ConfigCommon";
import Editor from "visual/global/Editor";
import { t } from "visual/utils/i18n";
import { Control, Props } from "./Control";
import { Header } from "./Header";

const BaseDrawer = (props: Props): ReactElement => {
  return <Control {...props} shortcodes={Editor.getShortcodes()} />;
};

const ShopifyDrawer = (props: Props): ReactElement => {
  return <Control {...props} shortcodes={Editor.getShopifyShortcodes()} />;
};

export const Base = {
  id: LeftSidebarOptionsIds.addElements,
  icon: "nc-add",
  type: "drawer",
  drawerTitle: t("Add Elements"),
  showInDeviceModes: ["desktop"],
  drawerComponent: BaseDrawer,
  wrapperHeaderComponent: Header
};

export const Shopify = {
  // TODO: Temporary need review this
  id: `${LeftSidebarOptionsIds.addElements}Shopify`,
  icon: "nc-shopify-logo",
  type: "drawer",
  drawerTitle: t("Add Shopify Elements"),
  showInDeviceModes: ["desktop"],
  drawerComponent: ShopifyDrawer,
  wrapperHeaderComponent: Header
};
