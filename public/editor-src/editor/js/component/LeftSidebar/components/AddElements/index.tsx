import React, { ReactElement } from "react";
import { t } from "visual/utils/i18n";
import Editor from "visual/global/Editor";

import { Control, Props } from "./Control";
import { Header } from "./Header";

const BaseDrawer = (props: Props): ReactElement => {
  return <Control {...props} shortcodes={Editor.getShortcodes()} />;
};

const ShopifyDrawer = (props: Props): ReactElement => {
  return <Control {...props} shortcodes={Editor.getShopifyShortcodes()} />;
};

export const Base = {
  id: "addBaseElements",
  icon: "nc-add",
  type: "drawer",
  drawerTitle: t("Add Elements"),
  showInDeviceModes: ["desktop"],
  drawerComponent: BaseDrawer,
  wrapperHeaderComponent: Header
};

export const Shopify = {
  id: "addShopifyElements",
  icon: "nc-shopify-logo",
  type: "drawer",
  drawerTitle: t("Add Shopify Elements"),
  showInDeviceModes: ["desktop"],
  drawerComponent: ShopifyDrawer,
  wrapperHeaderComponent: Header
};
