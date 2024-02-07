import {
  HelpVideos,
  HelpVideosData
} from "visual/global/Config/types/configs/ConfigCommon";

export const getUrlVideoId = (
  currentTab: string,
  configIdVideos: HelpVideosData
): string | undefined => {
  const idVideoFonts = configIdVideos?.[HelpVideos.fontsHelpVideo];
  const idVideoForm = configIdVideos?.[HelpVideos.formHelpVideo];

  return currentTab === "upload" || currentTab === "fonts"
    ? idVideoFonts
    : currentTab === "email" ||
      currentTab === "service" ||
      currentTab === "recaptcha"
    ? idVideoForm
    : undefined;
};
