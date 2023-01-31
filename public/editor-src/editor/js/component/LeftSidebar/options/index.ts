import { ComponentType } from "react";
import { insert } from "timm";
import { Config } from "visual/global/Config";
import { isCloud, isShopify } from "visual/global/Config/types/configs/Cloud";
import { LeftSidebarOptionsIds } from "visual/global/Config/types/configs/ConfigCommon";
import { getStore } from "visual/redux/store";
import { t } from "visual/utils/i18n";
import { isExternalStory } from "visual/utils/models";
import { Base, Shopify } from "../components/AddElements";
import { BlocksSortable } from "../components/BlocksSortable";
import { Cms } from "../components/Cms";
import { DeviceModes } from "../components/DeviceModes";
import { Settings } from "../components/Settings";
import { Styling } from "../components/Styling";
import { getPageSettings } from "./pageSettings";

interface Option {
  id: string;
  type: string;
  icon?: string;
  title?: string;
  onClick?: VoidFunction;
  drawerTitle?: string;
  disabled?: boolean;
  showInDeviceModes?: Array<string>;
  drawerComponent?: ComponentType;
  wrapperHeaderComponent?: ComponentType;
  component?: ComponentType;
  options?: Array<unknown>;
}

interface Options {
  top: Option[];
  bottom: Option[];
}

const getItems = (config: Config): Record<LeftSidebarOptionsIds, Option> => {
  const { urls, ui = {} } = config;
  const moreOptions = ui.leftSidebar?.more?.options ?? [];
  const pageSettingsOptions = getPageSettings(config);

  const onClick = (): void => {
    const { collaborationToolUrl: url } = urls;
    const currentDeviceMode = getStore().getState().ui.deviceMode;

    if (url) {
      window.open(`${url}&device=${currentDeviceMode}`, "_blank");
    }
  };

  return {
    [LeftSidebarOptionsIds.cms]: Cms,
    // @ts-expect-error: 'disabledElements' is declared here.
    [LeftSidebarOptionsIds.addElements]: Base,
    [LeftSidebarOptionsIds.reorderBlock]: BlocksSortable,
    [LeftSidebarOptionsIds.globalStyle]: Styling,
    [LeftSidebarOptionsIds.collaboration]: {
      id: LeftSidebarOptionsIds.collaboration,
      type: "link",
      icon: "nc-collab",
      title: t("Collaborate"),
      onClick: onClick
    },
    [LeftSidebarOptionsIds.deviceMode]: DeviceModes,
    [LeftSidebarOptionsIds.pageSettings]: {
      id: LeftSidebarOptionsIds.pageSettings,
      icon: "nc-page",
      title: t("Page"),
      type: "popover",
      disabled: pageSettingsOptions.length === 0,
      options: pageSettingsOptions
    },
    [LeftSidebarOptionsIds.more]: {
      id: LeftSidebarOptionsIds.more,
      icon: "nc-back",
      title: t("More"),
      type: "popover",
      disabled: moreOptions.length === 0,
      options: moreOptions
    }
  };
};

export const getOptions = (config: Config): Options => {
  const { leftSidebar = {} } = config.ui ?? {};
  const { topTabsOrder = [], bottomTabsOrder = [] } = leftSidebar;

  const top: Option[] = [];
  let bottom: Option[] = [];
  const options = getItems(config);

  topTabsOrder.forEach((id) => {
    top.push(options[id]);
  });

  bottomTabsOrder.forEach((id) => {
    bottom.push(options[id]);
  });

  if (isCloud(config) && isShopify(config)) {
    // TODO: need to review this when Shopify will be...
    // @ts-expect-error: 'disabledElements' is declared here.
    top.push(Shopify);
  }

  if (isExternalStory(config)) {
    // TODO: Temporary this code need to be on backend
    bottom = insert(bottom, bottom.length - 1, Settings);
  }

  return {
    top,
    bottom
  };
};
