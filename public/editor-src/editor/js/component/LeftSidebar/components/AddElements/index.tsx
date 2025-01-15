import React from "react";
import { useConfig } from "visual/global/hooks";
import { Shortcodes } from "visual/types";
import { t } from "visual/utils/i18n";
import { Control, Props } from "./Control";
import { Header } from "./Header";

interface Option {
  id: string;
  icon?: string;
  title?: string;
  shortcodes?: Shortcodes;
}

const DrawerComponent = (props: Props) => {
  const config = useConfig();
  return <Control {...props} config={config} />;
};

export const getBaseDrawer = ({
  id,
  icon,
  title,
  shortcodes = {}
}: Option) => ({
  id,
  icon: icon ?? "nc-add",
  type: "drawer",
  drawerTitle: title ?? t("Add Elements"),
  showInDeviceModes: ["desktop"],
  drawerComponent: (props: Props) => (
    <DrawerComponent {...props} shortcodes={shortcodes} />
  ),
  wrapperHeaderComponent: Header
});
