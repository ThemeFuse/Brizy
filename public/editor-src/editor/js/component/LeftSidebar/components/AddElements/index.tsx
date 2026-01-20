import React from "react";
import { Scrollbar } from "visual/component/Scrollbar";
import { useConfig } from "visual/providers/ConfigProvider";
import { Shortcodes } from "visual/types";
import { t } from "visual/utils/i18n";
import { Control, Props } from "./Control";

interface Option {
  id: string;
  icon?: string;
  title?: string;
  shortcodes?: Shortcodes;
}

const DrawerComponent = (props: Props) => {
  const config = useConfig();

  return (
    <Scrollbar theme="dark" absolute>
      <Control {...props} config={config} />
    </Scrollbar>
  );
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
  )
});
