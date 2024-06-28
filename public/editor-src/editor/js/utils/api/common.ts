import { ChoicesSync } from "visual/component/Options/types/dev/InternalLink/types";
import { ChoicesSync as ChoiceSync } from "visual/component/Options/types/dev/MultiSelect2/types";
import {
  Choice,
  ChoicesAsync
} from "visual/component/Options/types/dev/Select/types";
import {
  EkklesiaFieldMap,
  EkklesiaKeys,
  EkklesiaParams
} from "visual/editorComponents/MinistryBrands/utils/types";
import { Config } from "visual/global/Config";
import {
  ConfigDCItem,
  DCTypes
} from "visual/global/Config/types/DynamicContent";
import {
  AutoSave,
  ConfigCommon
} from "visual/global/Config/types/configs/ConfigCommon";
import { Block as APIGlobalBlock } from "visual/global/Config/types/configs/blocks/GlobalBlocks";
import {
  BlockWithThumbs,
  BlocksArray,
  DefaultBlock,
  DefaultBlockWithID,
  KitItem,
  KitsWithThumbs,
  LayoutsWithThumbs,
  PopupsWithThumbs,
  StoriesWithThumbs
} from "visual/global/Config/types/configs/blocks/PredefinedBlocks";
import {
  CreateSavedBlock,
  CreateSavedLayout,
  DeleteSavedBlock,
  DeleteSavedLayout,
  SavedBlockAPIMeta,
  SavedBlockFilter,
  SavedBlockImport,
  SavedLayoutAPIMeta,
  SavedLayoutFilter,
  SavedLayoutImport,
  UpdateSavedBlock,
  UpdateSavedLayout
} from "visual/global/Config/types/configs/blocks/SavedBlocks";
import { ScreenshotData } from "visual/global/Config/types/configs/common";
import { EkklesiaExtra } from "visual/global/Config/types/configs/modules/ekklesia/Ekklesia";
import { EkklesiaFields } from "visual/global/Config/types/configs/modules/ekklesia/Ekklesia";
import {
  GlobalBlock,
  GlobalBlockNormal,
  GlobalBlockPopup,
  PageCommon,
  Project,
  Rule,
  SavedBlock,
  SavedLayout
} from "visual/types";
import { PostsSources } from "visual/utils/api/types";
import { getCompile } from "visual/utils/compiler";
import { t } from "visual/utils/i18n";
import {
  editorRuleToApiRule,
  makeBlockMeta,
  stringifyGlobalBlock
} from "./adapter";

//#region Common

interface CompileData {
  page: PageCommon;
  project: Project;
  globalBlocks: Array<GlobalBlock>;
}

export function pendingRequest(time = 650): Promise<boolean> {
  return new Promise((res) => {
    setTimeout(() => {
      res(true);
    }, time);
  });
}

//#endregion

//#region Publish

interface Publish {
  is_autosave: 1 | 0;
  config: ConfigCommon;
  needToCompile: Partial<CompileData>;
  state: CompileData;
}

export function publish(data: Publish): Promise<void> {
  return new Promise((res, rej) => {
    const { is_autosave, config } = data;
    const { handler } = config.ui?.publish ?? {};

    if (!handler) {
      rej(t("API: No publish handler found."));
    } else {
      (async () => {
        const output = await getCompile(data);
        handler(res, rej, { ...output, is_autosave });
      })();
    }
  });
}

//#endregion

//#region AutoSave

type _AutoSave = Omit<AutoSave, "globalBlock">;
type Save = _AutoSave & {
  globalBlock?: GlobalBlock;
};

export function autoSave(data: Save, config: ConfigCommon): Promise<void> {
  return new Promise((res) => {
    const onAutoSave = config.onAutoSave;

    if (typeof onAutoSave === "function") {
      const { globalBlock, ...other } = data;

      onAutoSave({
        ...other,
        ...(globalBlock && { globalBlock: stringifyGlobalBlock(globalBlock) })
      });
    }

    res();
  });
}

//#endregion

//#region OnChange

interface OnChange {
  config: ConfigCommon;
  needToCompile: Partial<CompileData>;
  state: CompileData;
}

export function onChange(data: OnChange): Promise<void> {
  return new Promise((res) => {
    const { config } = data;
    const onChange = config.onChange;

    if (typeof onChange === "function") {
      (async () => {
        const output = await getCompile(data);
        onChange(output);
        res();
      })();
    } else {
      res();
    }
  });
}

//#endregion

//#region Saved blocks

export const getSavedBlocks = async (
  config: ConfigCommon,
  filter?: { filterBy: string }
): Promise<Array<SavedBlockAPIMeta>> => {
  return new Promise((res, rej) => {
    const { savedBlocks } = config.api ?? {};
    const get = savedBlocks?.get;

    if (!get) {
      rej(t("API: No savedBlocks get found."));
    } else {
      get(res, rej, filter);
    }
  });
};

export const getSavedBlockById = (
  uid: string,
  config: ConfigCommon
): Promise<SavedBlock> => {
  return new Promise((res, rej) => {
    const { savedBlocks } = config.api ?? {};
    const getSavedBlockById = savedBlocks?.getByUid;

    if (!getSavedBlockById) {
      rej(t("API: No savedBlocks getByUid found."));
    } else {
      getSavedBlockById(res, rej, { uid });
    }
  });
};

interface _SavedBlock extends SavedBlock {
  uid: string;
}

export const createSavedBlock = (
  block: _SavedBlock,
  config: ConfigCommon,
  meta?: { is_autosave: 0 | 1 }
) => {
  return new Promise((res, rej) => {
    const { savedBlocks } = config.api ?? {};
    const create = savedBlocks?.create;

    if (!create) {
      rej(t("API: No savedBlocks create found."));
    } else {
      const { is_autosave = 0 } = meta ?? {};
      const data: CreateSavedBlock = {
        block: { ...block, media: makeBlockMeta(block) },
        is_autosave
      };

      create(res, rej, data);
    }
  });
};

export const deleteSavedBlock = (
  savedBlock: DeleteSavedBlock,
  config: ConfigCommon
) => {
  return new Promise((res, rej) => {
    const { savedBlocks } = config.api ?? {};
    const deleteSavedBlock = savedBlocks?.delete;

    if (!deleteSavedBlock) {
      rej(t("API: No savedBlocks delete found."));
    } else {
      deleteSavedBlock(res, rej, savedBlock);
    }
  });
};

export const updateSavedBlock = (
  savedBlock: UpdateSavedBlock,
  config: ConfigCommon
) => {
  return new Promise((res, rej) => {
    const { savedBlocks } = config.api ?? {};
    const updateSavedBlock = savedBlocks?.update;

    if (!updateSavedBlock) {
      rej(t("API: No savedBlocks update found."));
    } else {
      updateSavedBlock(res, rej, savedBlock);
    }
  });
};

export const importSaveBlocks = async (
  config: ConfigCommon
): Promise<SavedBlockImport> => {
  return new Promise((res, rej) => {
    const { savedBlocks } = config.api ?? {};
    const importSavedBlocks = savedBlocks?.import;

    if (!importSavedBlocks) {
      rej(t("API: No savedBlocks upload found."));
    } else {
      importSavedBlocks(res, rej);
    }
  });
};

export const filterSavedBlocks = (
  config: ConfigCommon
): Promise<SavedBlockFilter> => {
  return new Promise((res, rej) => {
    const { savedBlocks } = config.api ?? {};
    const filterSavedBlocks = savedBlocks?.filter?.handler;

    if (!filterSavedBlocks) {
      rej(t("API: No savedBlocks filter found."));
    } else {
      filterSavedBlocks(res, rej);
    }
  });
};

//#endregion

//#region Saved popups

export const getSavedPopups = async (
  config: ConfigCommon,
  filter?: { filterBy: string }
): Promise<Array<SavedBlockAPIMeta>> => {
  return new Promise((res, rej) => {
    const { savedPopups } = config.api ?? {};
    const get = savedPopups?.get;

    if (!get) {
      rej(t("API: No savedPopups get found."));
    } else {
      get(res, rej, filter);
    }
  });
};

export const getSavedPopupById = (
  uid: string,
  config: ConfigCommon
): Promise<SavedBlock> => {
  return new Promise((res, rej) => {
    const { savedPopups } = config.api ?? {};
    const getSavedPopupById = savedPopups?.getByUid;

    if (!getSavedPopupById) {
      rej(t("API: No savedPopups getByUid found."));
    } else {
      getSavedPopupById(res, rej, { uid });
    }
  });
};

interface _SavedPopup extends SavedBlock {
  uid: string;
}

export const createSavedPopup = (
  block: _SavedPopup,
  config: ConfigCommon,
  meta?: { is_autosave: 0 | 1 }
) => {
  return new Promise((res, rej) => {
    const { savedPopups } = config.api ?? {};
    const create = savedPopups?.create;

    if (!create) {
      rej(t("API: No savedPopups create found."));
    } else {
      const { is_autosave = 0 } = meta ?? {};
      const data: CreateSavedBlock = {
        block: { ...block, media: makeBlockMeta(block) },
        is_autosave
      };

      create(res, rej, data);
    }
  });
};

export const deleteSavedPopup = (
  savedBlock: DeleteSavedBlock,
  config: ConfigCommon
) => {
  return new Promise((res, rej) => {
    const { savedPopups } = config.api ?? {};
    const deleteSavedPopup = savedPopups?.delete;

    if (!deleteSavedPopup) {
      rej(t("API: No savedPopup delete found."));
    } else {
      deleteSavedPopup(res, rej, savedBlock);
    }
  });
};

export const updateSavedPopup = (
  savedBlock: UpdateSavedBlock,
  config: ConfigCommon
) => {
  return new Promise((res, rej) => {
    const { savedPopups } = config.api ?? {};
    const updateSavedPopup = savedPopups?.update;

    if (!updateSavedPopup) {
      rej(t("API: No savedPopup update found."));
    } else {
      updateSavedPopup(res, rej, savedBlock);
    }
  });
};

export const importSavePopups = async (
  config: ConfigCommon
): Promise<SavedBlockImport> => {
  return new Promise((res, rej) => {
    const { savedPopups } = config.api ?? {};
    const importSavedPopups = savedPopups?.import;

    if (!importSavedPopups) {
      rej(t("API: No savedPopups import found."));
    } else {
      importSavedPopups(res, rej);
    }
  });
};

export const filterSavedPopups = (
  config: ConfigCommon
): Promise<SavedBlockFilter> => {
  return new Promise((res, rej) => {
    const { savedPopups } = config.api ?? {};
    const filterSavedPopups = savedPopups?.filter?.handler;

    if (!filterSavedPopups) {
      rej(t("API: No savedPopups filter found."));
    } else {
      filterSavedPopups(res, rej);
    }
  });
};

//#endregion

//#region Saved layouts

export const getSavedLayouts = (
  config: ConfigCommon,
  filter?: { filterBy: string }
): Promise<Array<SavedLayoutAPIMeta>> => {
  return new Promise((res, rej) => {
    const { savedLayouts } = config.api ?? {};
    const get = savedLayouts?.get;

    if (!get) {
      rej(t("API: No savedLayouts get found."));
    } else {
      get(res, rej, filter);
    }
  });
};

export const getSavedLayoutById = (
  id: string,
  config: ConfigCommon
): Promise<SavedLayout> => {
  return new Promise((res, rej) => {
    const { savedLayouts } = config.api ?? {};
    const getByUid = savedLayouts?.getByUid;

    if (!getByUid) {
      rej(t("API: No savedLayouts getByUid found."));
    } else {
      getByUid(res, rej, { uid: id });
    }
  });
};

interface _Layout extends SavedLayout {
  uid: string;
}

export const createSavedLayout = (
  layout: _Layout,
  config: ConfigCommon,
  meta?: { is_autosave: 0 | 1 }
) => {
  return new Promise((res, rej) => {
    const { savedLayouts } = config.api ?? {};
    const create = savedLayouts?.create;

    if (!create) {
      rej(t("API: No savedLayouts create found."));
    } else {
      const { is_autosave = 0 } = meta ?? {};
      const data: CreateSavedLayout = {
        block: { ...layout, media: makeBlockMeta(layout) },
        is_autosave
      };

      create(res, rej, data);
    }
  });
};

export const deleteSavedLayout = (
  savedLayout: DeleteSavedLayout,
  config: ConfigCommon
) => {
  return new Promise((res, rej) => {
    const { savedLayouts } = config.api ?? {};
    const deleteSavedLayout = savedLayouts?.delete;

    if (!deleteSavedLayout) {
      rej(t("API: No savedLayout delete found."));
    } else {
      deleteSavedLayout(res, rej, savedLayout);
    }
  });
};

export const updateSavedLayout = (
  savedLayout: UpdateSavedLayout,
  config: ConfigCommon
) => {
  return new Promise((res, rej) => {
    const { savedLayouts } = config.api ?? {};
    const updateSavedLayout = savedLayouts?.update;

    if (!updateSavedLayout) {
      rej(t("API: No savedLayout update found."));
    } else {
      updateSavedLayout(res, rej, savedLayout);
    }
  });
};

export const importSavedLayout = (
  config: ConfigCommon
): Promise<SavedLayoutImport> => {
  return new Promise((res, rej) => {
    const { savedLayouts } = config.api ?? {};
    const importSavedLayout = savedLayouts?.import;

    if (!importSavedLayout) {
      rej(t("API: No savedLayout import found."));
    } else {
      importSavedLayout(res, rej);
    }
  });
};

export const filterSavedLayouts = (
  config: ConfigCommon
): Promise<SavedLayoutFilter> => {
  return new Promise((res, rej) => {
    const { savedLayouts } = config.api ?? {};
    const filterSavedLayouts = savedLayouts?.filter?.handler;

    if (!filterSavedLayouts) {
      rej(t("API: No savedLayouts filter found."));
    } else {
      filterSavedLayouts(res, rej);
    }
  });
};

//#endregion

//#region PopupConditions

interface PopupRules {
  rules: Array<Rule>;
  dataVersion: number;
}

export function updatePopupRules(
  data: PopupRules,
  config: ConfigCommon
): Promise<unknown> {
  return new Promise((res, rej) => {
    const { popupConditions } = config.api ?? {};
    const save = popupConditions?.conditions?.save;

    if (!save) {
      rej(t("API: No popupConditions save found."));
    } else {
      save(res, rej, {
        rules: data.rules.map(editorRuleToApiRule),
        dataVersion: data.dataVersion
      });
    }
  });
}

//#endregion

//#region default Templates

export const defaultKits = (config: ConfigCommon): Promise<Array<KitItem>> => {
  return new Promise((res, rej) => {
    const { defaultKits } = config.api ?? {};
    const getKits = defaultKits?.getKits;
    if (!getKits) {
      rej(t("API: No Kits getKits() found."));
    } else {
      getKits(res, rej);
    }
  });
};

export const defaultKitsMeta = (
  config: ConfigCommon,
  id: string
): Promise<KitsWithThumbs> => {
  return new Promise((res, rej) => {
    const { defaultKits } = config.api ?? {};
    const getMeta = defaultKits?.getMeta;
    if (!getMeta) {
      rej(t("API: No Kits getMeta() found."));
    } else {
      getMeta(res, rej, id);
    }
  });
};

export const defaultKitsData = (
  config: ConfigCommon,
  kit: BlockWithThumbs
): Promise<DefaultBlock> => {
  return new Promise((res, rej) => {
    const { defaultKits } = config.api ?? {};
    const getData = defaultKits?.getData;
    if (!getData) {
      rej(t("API: No Kits getData() found."));
    } else {
      getData(res, rej, kit);
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

//#region Fonts
export function getUploadedFonts(config: ConfigCommon) {
  const { get } = config.integrations?.fonts?.upload ?? {};

  return new Promise((res, rej) => {
    if (typeof get === "function") {
      get(res, rej);
    } else {
      rej(t("Missing getUploadedFonts inside api config"));
    }
  });
}

//#endregion

//#region  collections

export const getCollectionTypes = (
  config: ConfigCommon,
  extraData?: {
    defaultTitle?: string;
    defaultValue?: string;
  }
): Promise<ChoicesSync> => {
  const collectionTypesHandler =
    config?.api?.collectionTypes?.loadCollectionTypes.handler;

  return new Promise((res, rej) => {
    if (typeof collectionTypesHandler === "function") {
      collectionTypesHandler(res, rej, extraData);
    } else {
      rej(t("Missing api handler in config"));
    }
  });
};

export const getSourceIds = (
  type: string,
  config: ConfigCommon
): Promise<ChoicesSync> => {
  const sourceItemsHandler =
    config?.api?.collectionItems?.getCollectionItemsIds?.handler;

  return new Promise((res, rej) => {
    if (typeof sourceItemsHandler === "function") {
      sourceItemsHandler(res, rej, { id: type });
    } else {
      rej(t("Missing api handler in config"));
    }
  });
};

//#endregion

//#region Screenshots

export const createBlockScreenshot = (
  data: ScreenshotData,
  config: ConfigCommon
): Promise<{ id: string }> => {
  const create = config.api?.screenshots?.create;

  return new Promise((res, rej) => {
    if (typeof create === "function") {
      create(res, rej, data);
    } else {
      rej(t("Missing create screenshots in api config"));
    }
  });
};

export const updateBlockScreenshot = (
  data: ScreenshotData & { id: string },
  config: ConfigCommon
): Promise<{ id: string }> => {
  const update = config.api?.screenshots?.update;

  return new Promise((res, rej) => {
    if (typeof update === "function") {
      update(res, rej, data);
    } else {
      rej(t("Missing update screenshots in api config"));
    }
  });
};

//#endregion

//#region Elements Posts

export const defaultPostsSources = (
  config: ConfigCommon,
  args: {
    page: PageCommon;
    filterManualId?: string;
  }
): Promise<PostsSources> => {
  return new Promise((res, rej) => {
    const { elements } = config;

    if (!elements?.posts?.handler) {
      rej(t("Failed to load sources"));
    } else {
      const { handler } = elements.posts;
      handler(res, rej, args);
    }
  });
};

//#endregion

//#region Ministry Brands

export const getEkklesiaChoiches = <
  T extends keyof EkklesiaFields = keyof EkklesiaFields
>(
  config: Config,
  keys: EkklesiaParams<T>,
  extra?: EkklesiaExtra
): ChoicesAsync | ChoiceSync => {
  const { handler } = config?.api?.modules?.ekklesia?.getEkklesiaFields ?? {};

  if (!handler) {
    if (process.env.NODE_ENV === "development") {
      console.error("Missing Ekklesia handler in api-client");
    }
    return [{ value: "", title: t("None") }];
  }

  return {
    load: () =>
      new Promise((res, rej) => {
        return handler(res, rej, keys, extra);
      }),
    emptyLoad: {
      title: t("There are no choices")
    }
  };
};

export const updateEkklesiaFields = async <
  T extends keyof EkklesiaFields = keyof EkklesiaFields
>(
  config: Config,
  {
    fields
  }: {
    fields: Array<EkklesiaFieldMap[T]>;
  },
  extra?: EkklesiaExtra
): Promise<EkklesiaKeys | undefined> => {
  const { handler } =
    config?.api?.modules?.ekklesia?.updateEkklesiaFields ?? {};
  if (!handler) {
    if (process.env.NODE_ENV === "development") {
      console.error("Missing Ekklesia handler in api-client");
    }
    return undefined;
  }

  return new Promise((res, rej) =>
    handler(
      res,
      rej,
      {
        fields
      },
      extra
    )
  );
};

//#endregion

//#region Leadific

export const getLeadificCustomFields = (
  config: ConfigCommon
): Promise<ChoicesSync> => {
  const { handler } = config?.api?.modules?.leadific?.getCustomFields ?? {};

  return new Promise((res, rej) => {
    if (typeof handler === "function") {
      handler(res, rej);
    } else {
      rej("Missing api handler in config");
    }
  });
};

//#endregion

//#region Ai-Text

export const sendToAi = (
  config: ConfigCommon,
  { prompt, action }: { prompt: string; action?: string }
): Promise<string> => {
  const handler = config.api?.textAI?.handler;

  return new Promise((res, rej) => {
    if (typeof handler === "function") {
      handler(res, rej, { prompt, action });
    } else {
      rej(t("Missing AI handler in api-client"));
    }
  });
};

//#endregion

//#region Ecwid

export const getEcwidProducts = (config: ConfigCommon): Promise<Choice[]> => {
  const get = config?.modules?.shop?.api?.getEcwidProducts?.handler;

  return new Promise((res, rej) => {
    if (typeof get === "function") {
      get(res, rej);
    } else {
      rej(t("Missing getEcwidProducts api handler in config"));
    }
  });
};

//#endregion

//#region Global Blocks

export const createGlobalBlock = (
  block: GlobalBlockNormal,
  config: ConfigCommon
): Promise<APIGlobalBlock> => {
  return new Promise((res, rej) => {
    const { globalBlocks } = config.api ?? {};
    const create = globalBlocks?.create;

    if (!create) {
      rej(t("API: No globalBlocks create found."));
    } else {
      const data = stringifyGlobalBlock(block);
      create(res, rej, data);
    }
  });
};

//#endregion

//#region Global Popups

export const createGlobalPopup = (
  block: GlobalBlockPopup,
  config: ConfigCommon
): Promise<APIGlobalBlock> => {
  return new Promise((res, rej) => {
    const { globalPopups } = config.api ?? {};
    const create = globalPopups?.create;

    if (!create) {
      rej(t("API: No globalPopups create found."));
    } else {
      const data = stringifyGlobalBlock(block);
      create(res, rej, data);
    }
  });
};

//#endregion

//#region Dynamic Content

export const getDynamicContentPlaceholders = async (
  config: ConfigCommon,
  extraData: { entityType: string; groupType: DCTypes }
): Promise<ConfigDCItem[]> => {
  const handler = config.dynamicContent?.handler;

  return new Promise((res, rej) => {
    if (typeof handler === "function") {
      handler(res, rej, extraData);
    } else {
      rej(t("Missing dynamicContent inside config api"));
    }
  });
};

//#endregion

//# region Project HeartBeat

export function sendHeartBeat(config: ConfigCommon): Promise<unknown> {
  const { sendHandler } = config.api?.heartBeat ?? {};
  return new Promise((res, rej) => {
    if (typeof sendHandler === "function") {
      sendHandler(res, rej);
    } else {
      rej(t("Missing sendHandler inside config api"));
    }
  });
}

export function sendHeartBeatTakeOver(config: Config): Promise<unknown> {
  const { takeOverHandler } = config.api?.heartBeat ?? {};
  return new Promise((res, rej) => {
    if (typeof takeOverHandler === "function") {
      takeOverHandler(res, rej);
    } else {
      rej(t("Missing takeOver handler inside config api"));
    }
  });
}

//#endregion
