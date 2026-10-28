import type { ComponentType, ElementType } from "react";
import {
  type ConfigCommon,
  type LeftSidebarOption,
  LeftSidebarOptionsIds
} from "visual/global/Config/types/configs/ConfigCommon";
import {
  type EditorMode,
  isPopup,
  isStory
} from "visual/providers/EditorModeProvider";
import { getShortcodeComponents } from "visual/shortcodeComponents";
import type { DeviceMode, Shortcodes } from "visual/types";
import { t } from "visual/utils/i18n";
import { getBaseDrawer } from "../components/AddElements";
import { getBlocksSortable } from "../components/BlocksSortable";
import { custom } from "../components/Custom";
import { getDevicesModes } from "../components/DeviceModes";
import { getStyling } from "../components/Styling";
import { getMoreOptions } from "./moreOptions";
import { getPageSettings } from "./pageSettings";

export interface Option {
  id: string;
  type: string;
  icon?: string;
  iconComponent?: ComponentType;
  title?: string;
  active?: boolean;
  onClick?: (e: MouseEvent) => void;
  roles?: Array<string>;
  drawerTitle?: string;
  disabled?: boolean;
  showInDeviceModes?: Array<string>;
  drawerComponent?: ElementType;
  wrapperHeaderComponent?: ElementType;
  component?: ComponentType;
  options?: Array<unknown>;
}

interface Options {
  top: Option[];
  bottom: Option[];
}

type GetOptionType = (args: {
  id: string;
  title?: string;
  icon?: string;
  shortcodes?: Shortcodes;
}) => Option;

export type OptionType = Option | GetOptionType;

interface GetItemsProps {
  config: ConfigCommon;
  device: DeviceMode;
  editorMode: EditorMode;
  hasOverlays: boolean;
}

const getItems = ({
  config,
  device,
  editorMode,
  hasOverlays
}: GetItemsProps): Record<LeftSidebarOptionsIds, OptionType> => {
  const { ui, urls } = config;
  const _isPopup = isPopup(editorMode);
  const _isStory = isStory(editorMode);

  // Overlays render only on pages (GlobalBlocksOverlays is mounted by the Page
  // editor), so popups and stories never offer "Show Widget".
  const pageSettingsOptions = getPageSettings(ui, {
    showOverlays: hasOverlays && !_isPopup && !_isStory
  });
  const moreOptions = getMoreOptions(ui);

  const onClick = (): void => {
    if (urls?.collaborationToolUrl) {
      window.open(`${urls.collaborationToolUrl}&device=${device}`, "_blank");
    }
  };
  const helpIcon = config?.ui?.help?.showIcon;

  return {
    [LeftSidebarOptionsIds.addElements]: getBaseDrawer,
    [LeftSidebarOptionsIds.reorderBlock]: getBlocksSortable({
      helpIcon,
      disabled: _isPopup || _isStory,
      config
    }),
    [LeftSidebarOptionsIds.globalStyle]: getStyling(),
    [LeftSidebarOptionsIds.collaboration]: {
      id: LeftSidebarOptionsIds.collaboration,
      type: "link",
      icon: "nc-collab",
      title: t("Collaborate"),
      onClick: onClick
    },
    [LeftSidebarOptionsIds.deviceMode]: getDevicesModes({ disabled: _isStory }),
    [LeftSidebarOptionsIds.pageSettings]: {
      id: LeftSidebarOptionsIds.pageSettings,
      icon: "nc-page",
      title: t("Page"),
      type: "popover",
      disabled: pageSettingsOptions.length === 0,
      options: pageSettingsOptions
    },
    [LeftSidebarOptionsIds.custom]: custom,
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

const getTabsOrder = (
  tabOrder: LeftSidebarOption[],
  options: Record<LeftSidebarOptionsIds, OptionType>,
  config: ConfigCommon
): Option[] => {
  const tabs: Option[] = [];
  const shortcodes = getShortcodeComponents(config);

  tabOrder.forEach(({ type, id, title, icon, ...rest }) => {
    const filteredShortcodes =
      shortcodes.find((shortcode) => shortcode.tabId === id)?.shortcodes ?? {};

    const currentOption = options[type];

    let option: Option;

    if (typeof currentOption === "function") {
      option = currentOption({
        id,
        title,
        icon,
        ...rest,
        shortcodes: filteredShortcodes
      });
    } else {
      option = currentOption;
    }

    tabs.push(option);
  });

  return tabs;
};

export const getOptions = (
  config: ConfigCommon,
  device: DeviceMode,
  editorMode: EditorMode,
  hasOverlays: boolean
): Options => {
  const { leftSidebar = {} } = config.ui ?? {};
  const { topTabsOrder = [], bottomTabsOrder = [] } = leftSidebar;

  const options = getItems({
    config,
    device,
    editorMode,
    hasOverlays
  });

  const top = getTabsOrder(topTabsOrder, options, config);
  const bottom = getTabsOrder(bottomTabsOrder, options, config);

  return {
    top,
    bottom
  };
};
