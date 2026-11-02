import { isT } from "fp-utilities";
import {
  type ConfigCommon,
  LeftSidebarPageSettingsOptionsIds
} from "visual/global/Config/types/configs/ConfigCommon";
import { t } from "visual/utils/i18n";
import { pageSettingsOptionIdSchema } from "./schemas";

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
  },
  [LeftSidebarPageSettingsOptionsIds.overlays]: {
    type: LeftSidebarPageSettingsOptionsIds.overlays,
    label: t("Show Widget")
  }
});

export const getPageSettings = (
  ui: ConfigCommon["ui"],
  { showOverlays }: { showOverlays: boolean }
): Array<Option> => {
  const { leftSidebar = {} } = ui ?? {};
  const { options = {} } = leftSidebar.pageSettings ?? {};
  const enabledOptions = Object.entries(options).reduce<
    Array<LeftSidebarPageSettingsOptionsIds>
  >((acc, [type, enable]) => {
    const id = pageSettingsOptionIdSchema.safeParse(type);

    // overlays is appended below on its own, never from config
    if (
      enable &&
      id.success &&
      id.data !== LeftSidebarPageSettingsOptionsIds.overlays
    ) {
      acc.push(id.data);
    }
    return acc;
  }, []);

  const settings = getSettings();
  const configured = enabledOptions.map((type) => settings[type]).filter(isT);

  // The overlays option is not driven by config: it is appended, last, only
  // when an overlay widget (e.g. Cookie Banner) qualifies for the current
  // page — so a page with no other settings keeps the "Page" button disabled.
  return showOverlays
    ? [...configured, settings[LeftSidebarPageSettingsOptionsIds.overlays]]
    : configured;
};
