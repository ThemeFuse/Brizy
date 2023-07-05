import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import {
  BlocksArray,
  DefaultBlock,
  DefaultBlockWithID,
  KitsWithThumbs,
  LayoutsWithThumbs,
  PopupsWithThumbs,
  StoriesWithThumbs
} from "visual/global/Config/types/configs/templates";
import { t } from "visual/utils/i18n";

//#region default Templates
export const defaultKitsMeta = (
  config: ConfigCommon
): Promise<Array<KitsWithThumbs>> => {
  return new Promise((res, rej) => {
    const { defaultKits } = config.api ?? {};
    const getMeta = defaultKits?.getMeta;
    if (!getMeta) {
      rej(t("API: No Kits getMeta() found."));
    } else {
      getMeta(res, rej);
    }
  });
};

export const defaultKitsData = (
  config: ConfigCommon,
  blockID: string
): Promise<DefaultBlock> => {
  return new Promise((res, rej) => {
    const { defaultKits } = config.api ?? {};
    const getData = defaultKits?.getData;
    if (!getData) {
      rej(t("API: No Kits getData() found."));
    } else {
      getData(res, rej, blockID);
    }
  });
};

export const defaultPopupsMeta = (
  config: ConfigCommon
): Promise<PopupsWithThumbs> => {
  return new Promise((res, rej) => {
    const { defaultPopups } = config.api ?? {};
    const getMeta = defaultPopups?.getMeta;
    if (!getMeta) {
      rej(t("API: No Popups getMeta() found."));
    } else {
      getMeta(res, rej);
    }
  });
};

export const defaultPopupsData = (
  config: ConfigCommon,
  blockID: string
): Promise<DefaultBlockWithID> => {
  return new Promise((res, rej) => {
    const { defaultPopups } = config.api ?? {};
    const getData = defaultPopups?.getData;
    if (!getData) {
      rej(t("API: No Popups getData() found."));
    } else {
      getData(res, rej, blockID);
    }
  });
};

export const defaultLayoutsMeta = (
  config: ConfigCommon
): Promise<LayoutsWithThumbs> => {
  return new Promise((res, rej) => {
    const { defaultLayouts } = config.api ?? {};
    const getMeta = defaultLayouts?.getMeta;
    if (!getMeta) {
      rej(t("API: No Layouts getMeta() found."));
    } else {
      getMeta(res, rej);
    }
  });
};

export const defaultLayoutsData = (
  config: ConfigCommon,
  blockID: string
): Promise<BlocksArray<DefaultBlockWithID>> => {
  return new Promise((res, rej) => {
    const { defaultLayouts } = config.api ?? {};
    const getData = defaultLayouts?.getData;
    if (!getData) {
      rej(t("API: No Layouts getData() found."));
    } else {
      getData(res, rej, blockID);
    }
  });
};

export const defaultStoriesMeta = (
  config: ConfigCommon
): Promise<StoriesWithThumbs> => {
  return new Promise((res, rej) => {
    const { defaultStories } = config.api ?? {};
    const getMeta = defaultStories?.getMeta;
    if (!getMeta) {
      rej(t("API: No Stories getMeta() found."));
    } else {
      getMeta(res, rej);
    }
  });
};

type StoryData = BlocksArray<DefaultBlock> | DefaultBlock;

export const isBlock = (data: StoryData): data is DefaultBlock => {
  return "type" in data && "value" in data;
};

export const defaultStoriesData = (
  config: ConfigCommon,
  blockID: string
): Promise<StoryData> => {
  return new Promise((res, rej) => {
    const { defaultStories } = config.api ?? {};
    const getData = defaultStories?.getData;
    if (!getData) {
      rej(t("API: No Stories getData() found."));
    } else {
      getData(res, rej, blockID);
    }
  });
};

//#endregion
