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
import { custom } from "../components/Custom";
import { DeviceModes } from "../components/DeviceModes";
import { Settings } from "../components/Settings";
import { Styling } from "../components/Styling";
import { getMoreOptions } from "./moreOptions";
import { getPageSettings } from "./pageSettings";

export interface Option {
  id: string;
  type: string;
  icon?: string;
  title?: string;
  onClick?: (e: MouseEvent) => void;
  roles?: Array<string>;
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
  const { urls } = config;
  const leftSidebar = config.ui?.leftSidebar ?? {};

  const pageSettingsOptions = getPageSettings(config);
  const moreOptions = getMoreOptions(config);

  const onClick = (): void => {
    const { collaborationToolUrl: url } = urls;
    const currentDeviceMode = getStore().getState().ui.deviceMode;

    if (url) {
      window.open(`${url}&device=${currentDeviceMode}`, "_blank");
    }
  };

  return {
    [LeftSidebarOptionsIds.cms]: custom(leftSidebar[LeftSidebarOptionsIds.cms]),
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

    // INFO: is not good how it was made, normally need to work with __VISUAL_CONFIG__ but it goes like this because of necessity of second moduleGroups
    if (id === "addElements" && isCloud(config) && isShopify(config)) {
      // TODO: need to review this when Shopify will be...
      // @ts-expect-error: 'disabledElements' is declared here.
      top.push(Shopify);
    }
  });
  bottomTabsOrder.forEach((id) => {
    bottom.push(options[id]);
  });

  if (isExternalStory(config)) {
    // TODO: Temporary this code need to be on backend
    bottom = insert(bottom, bottom.length - 1, Settings);
  }

  return {
    top,
    bottom
  };
};
