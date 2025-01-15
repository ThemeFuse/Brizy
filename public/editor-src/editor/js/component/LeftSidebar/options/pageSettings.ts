import { isT } from "fp-utilities";
import {
  ConfigCommon,
  LeftSidebarPageSettingsOptionsIds
} from "visual/global/Config/types/configs/ConfigCommon";
import { t } from "visual/utils/i18n";

interface Option {
  type: LeftSidebarPageSettingsOptionsIds;
  label: string;
  roles?: Array<string>;
}

const getSettings = (): Record<LeftSidebarPageSettingsOptionsIds, Option> => ({
  [LeftSidebarPageSettingsOptionsIds.featuredImage]: {
    type: LeftSidebarPageSettingsOptionsIds.featuredImage,
    label: t("Featured Image")
  },
  [LeftSidebarPageSettingsOptionsIds.template]: {
    type: LeftSidebarPageSettingsOptionsIds.template,
    label: t("Page Template"),
    roles: ["admin"]
  },
  [LeftSidebarPageSettingsOptionsIds.membership]: {
    type: LeftSidebarPageSettingsOptionsIds.membership,
    label: t("View as")
  },
  [LeftSidebarPageSettingsOptionsIds.language]: {
    type: LeftSidebarPageSettingsOptionsIds.language,
    label: t("Show If Language")
  }
});

export const getPageSettings = (ui: ConfigCommon["ui"]): Array<Option> => {
  const { leftSidebar = {} } = ui ?? {};
  const { options = {} } = leftSidebar.pageSettings ?? {};
  const enabledOptions = Object.entries(options).reduce<
    Array<LeftSidebarPageSettingsOptionsIds>
  >((acc, [type, enable]) => {
    if (enable) {
      //@ts-expect-error Argument of type 'string' is not assignable to parameter of type 'LeftSidebarPageSettingsOptionsIds'.
      acc.push(type);
    }
    return acc;
  }, []);

  if (enabledOptions.length === 0) {
    return [];
  }
  const settings = getSettings();
  return enabledOptions.map((type) => settings[type]).filter(isT);
};
