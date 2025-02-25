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
import { isShopifyShop } from "visual/global/Config/types/configs/Base";
import { Shopify, isCloud } from "visual/global/Config/types/configs/Cloud";
import {
  AutoSave,
  ConditionalTypesData,
  ConfigCommon
} from "visual/global/Config/types/configs/ConfigCommon";
import { Block as APIGlobalBlock } from "visual/global/Config/types/configs/blocks/GlobalBlocks";
import {
  BlockWithThumbs,
  BlocksArray,
  CustomTemplatePage,
  DefaultBlock,
  DefaultBlockWithID,
  KitItem,
  KitsWithThumbs,
  LayoutsPages,
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
import type { Response } from "visual/global/Config/types/configs/common";
import {
  AdobeFontData,
  IconUploadData,
  ScreenshotData
} from "visual/global/Config/types/configs/common";
import {
  EkklesiaExtra,
  EkklesiaFields
} from "visual/global/Config/types/configs/modules/ekklesia/Ekklesia";
import { SavedBlock, SavedLayout } from "visual/types";
import { UploadedFont } from "visual/types/Fonts";
import {
  GlobalBlock,
  GlobalBlockNormal,
  GlobalBlockPopup
} from "visual/types/GlobalBlock";
import { Page, PageCommon, ShopifyPage } from "visual/types/Page";
import { Project } from "visual/types/Project";
import { Rule } from "visual/types/Rule";
import { FontStyle, Palette } from "visual/types/Style";
import { Dictionary } from "visual/types/utils";
import { GetCollectionItem_collectionItem as CollectionItem } from "visual/utils/api/cms/graphql/types/GetCollectionItem";
import {
  AdobeAddAccount,
  AdobeFonts,
  BlogSourceItem,
  CollectionSourceItem,
  PostsSources,
  Rule as PublishRule,
  SelectedItem,
  UploadIconData
} from "visual/utils/api/types";
import { getCompile } from "visual/utils/compiler";
import { t } from "visual/utils/i18n";
import {
  editorRuleToApiRule,
  makeBlockMeta,
  stringifyGlobalBlock
} from "./adapter";

//#region Common

interface CompileData {
  page: Page;
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
  api: ConfigCommon["api"],
  filter?: { filterBy: string }
): Promise<Array<SavedBlockAPIMeta>> => {
  return new Promise((res, rej) => {
    const { savedBlocks } = api ?? {};
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
  api: ConfigCommon["api"]
): Promise<SavedBlock> => {
  return new Promise((res, rej) => {
    const { savedBlocks } = api ?? {};
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
  api: ConfigCommon["api"]
) => {
  return new Promise((res, rej) => {
    const { savedBlocks } = api ?? {};
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
  api: ConfigCommon["api"]
) => {
  return new Promise((res, rej) => {
    const { savedBlocks } = api ?? {};
    const updateSavedBlock = savedBlocks?.update;

    if (!updateSavedBlock) {
      rej(t("API: No savedBlocks update found."));
    } else {
      updateSavedBlock(res, rej, savedBlock);
    }
  });
};

export const importSaveBlocks = async (
  api: ConfigCommon["api"]
): Promise<SavedBlockImport> => {
  return new Promise((res, rej) => {
    const { savedBlocks } = api ?? {};
    const importSavedBlocks = savedBlocks?.import;

    if (!importSavedBlocks) {
      rej(t("API: No savedBlocks upload found."));
    } else {
      importSavedBlocks(res, rej);
    }
  });
};

export const filterSavedBlocks = (
  api: ConfigCommon["api"]
): Promise<SavedBlockFilter> => {
  return new Promise((res, rej) => {
    const { savedBlocks } = api ?? {};
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
  api: ConfigCommon["api"],
  filter?: { filterBy: string }
): Promise<Array<SavedBlockAPIMeta>> => {
  return new Promise((res, rej) => {
    const { savedPopups } = api ?? {};
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
  api: ConfigCommon["api"]
): Promise<SavedBlock> => {
  return new Promise((res, rej) => {
    const { savedPopups } = api ?? {};
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
  api: ConfigCommon["api"]
) => {
  return new Promise((res, rej) => {
    const { savedPopups } = api ?? {};
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
  api: ConfigCommon["api"]
) => {
  return new Promise((res, rej) => {
    const { savedPopups } = api ?? {};
    const updateSavedPopup = savedPopups?.update;

    if (!updateSavedPopup) {
      rej(t("API: No savedPopup update found."));
    } else {
      updateSavedPopup(res, rej, savedBlock);
    }
  });
};

export const importSavePopups = async (
  api: ConfigCommon["api"]
): Promise<SavedBlockImport> => {
  return new Promise((res, rej) => {
    const { savedPopups } = api ?? {};
    const importSavedPopups = savedPopups?.import;

    if (!importSavedPopups) {
      rej(t("API: No savedPopups import found."));
    } else {
      importSavedPopups(res, rej);
    }
  });
};

export const filterSavedPopups = (
  api: ConfigCommon["api"]
): Promise<SavedBlockFilter> => {
  return new Promise((res, rej) => {
    const { savedPopups } = api ?? {};
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
  api: ConfigCommon["api"],
  filter?: { filterBy: string }
): Promise<Array<SavedLayoutAPIMeta>> => {
  return new Promise((res, rej) => {
    const { savedLayouts } = api ?? {};
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
  api: ConfigCommon["api"]
): Promise<SavedLayout> => {
  return new Promise((res, rej) => {
    const { savedLayouts } = api ?? {};
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
  api: ConfigCommon["api"]
) => {
  return new Promise((res, rej) => {
    const { savedLayouts } = api ?? {};
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
  api: ConfigCommon["api"]
) => {
  return new Promise((res, rej) => {
    const { savedLayouts } = api ?? {};
    const updateSavedLayout = savedLayouts?.update;

    if (!updateSavedLayout) {
      rej(t("API: No savedLayout update found."));
    } else {
      updateSavedLayout(res, rej, savedLayout);
    }
  });
};

export const importSavedLayout = (
  api: ConfigCommon["api"]
): Promise<SavedLayoutImport> => {
  return new Promise((res, rej) => {
    const { savedLayouts } = api ?? {};
    const importSavedLayout = savedLayouts?.import;

    if (!importSavedLayout) {
      rej(t("API: No savedLayout import found."));
    } else {
      importSavedLayout(res, rej);
    }
  });
};

export const filterSavedLayouts = (
  api: ConfigCommon["api"]
): Promise<SavedLayoutFilter> => {
  return new Promise((res, rej) => {
    const { savedLayouts } = api ?? {};
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
      const _isCloud = isCloud(config);

      save(res, rej, {
        rules: data.rules.map((rule) => editorRuleToApiRule(rule, _isCloud)),
        dataVersion: data.dataVersion
      });
    }
  });
}

//#endregion

//#region default Templates

export const defaultKits = (
  config: ConfigCommon["api"]
): Promise<Array<KitItem>> => {
  return new Promise((res, rej) => {
    const { defaultKits } = config ?? {};
    const getKits = defaultKits?.getKits;
    if (!getKits) {
      rej(t("API: No Kits getKits() found."));
    } else {
      getKits(res, rej);
    }
  });
};

export const defaultKitsMeta = (
  config: ConfigCommon["api"],
  id: string
): Promise<KitsWithThumbs> => {
  return new Promise((res, rej) => {
    const { defaultKits } = config ?? {};
    const getMeta = defaultKits?.getMeta;
    if (!getMeta) {
      rej(t("API: No Kits getMeta() found."));
    } else {
      getMeta(res, rej, id);
    }
  });
};

export const defaultKitsData = (
  config: ConfigCommon["api"],
  kit: BlockWithThumbs
): Promise<DefaultBlock> => {
  return new Promise((res, rej) => {
    const { defaultKits } = config ?? {};
    const getData = defaultKits?.getData;
    if (!getData) {
      rej(t("API: No Kits getData() found."));
    } else {
      getData(res, rej, kit);
    }
  });
};

export const defaultPopupsMeta = (
  config: ConfigCommon["api"]
): Promise<PopupsWithThumbs> => {
  return new Promise((res, rej) => {
    const { defaultPopups } = config ?? {};
    const getMeta = defaultPopups?.getMeta;
    if (!getMeta) {
      rej(t("API: No Popups getMeta() found."));
    } else {
      getMeta(res, rej);
    }
  });
};

export const defaultPopupsData = (
  config: ConfigCommon["api"],
  blockID: string
): Promise<DefaultBlockWithID> => {
  return new Promise((res, rej) => {
    const { defaultPopups } = config ?? {};
    const getData = defaultPopups?.getData;
    if (!getData) {
      rej(t("API: No Popups getData() found."));
    } else {
      getData(res, rej, blockID);
    }
  });
};

export const defaultLayoutsMeta = (
  config: ConfigCommon["api"]
): Promise<LayoutsWithThumbs> => {
  return new Promise((res, rej) => {
    const { defaultLayouts } = config ?? {};

    const getMeta = defaultLayouts?.getMeta;

    if (!getMeta) {
      rej(t("API: No Layouts getMeta() found."));
    } else {
      getMeta(res, rej);
    }
  });
};

export const defaultLayoutPages = (
  config: ConfigCommon["api"],
  id: string
): Promise<LayoutsPages> => {
  return new Promise((res, rej) => {
    const { defaultLayouts } = config ?? {};

    const getPages = defaultLayouts?.getPages;

    if (!getPages) {
      rej(t("API: No Layouts getPages() found."));
    } else {
      getPages(res, rej, id);
    }
  });
};

export const defaultLayoutsData = (
  config: ConfigCommon["api"],
  page: CustomTemplatePage
): Promise<BlocksArray<DefaultBlockWithID>> => {
  return new Promise((res, rej) => {
    const { defaultLayouts } = config ?? {};

    const getData = defaultLayouts?.getData;

    if (!getData) {
      rej(t("API: No Layouts getData() found."));
    } else {
      getData(res, rej, page);
    }
  });
};

export const defaultStoriesMeta = (
  config: ConfigCommon["api"]
): Promise<StoriesWithThumbs> => {
  return new Promise((res, rej) => {
    const { defaultStories } = config ?? {};
    const getMeta = defaultStories?.getMeta;
    if (!getMeta) {
      rej(t("API: No Stories getMeta() found."));
    } else {
      getMeta(res, rej);
    }
  });
};

export const defaultStoriesPages = (
  config: ConfigCommon["api"],
  id: string
): Promise<LayoutsPages> => {
  return new Promise((res, rej) => {
    const { defaultStories } = config ?? {};
    const getPages = defaultStories?.getPages;
    if (!getPages) {
      rej(t("API: No Stories getPages() found."));
    } else {
      getPages(res, rej, id);
    }
  });
};

type StoryData = BlocksArray<DefaultBlock> | DefaultBlock;

export const isBlock = (data: StoryData): data is DefaultBlock => {
  return "type" in data && "value" in data;
};

export const defaultStoriesData = (
  config: ConfigCommon["api"],
  story: CustomTemplatePage
): Promise<StoryData> => {
  return new Promise((res, rej) => {
    const { defaultStories } = config ?? {};
    const getData = defaultStories?.getData;
    if (!getData) {
      rej(t("API: No Stories getData() found."));
    } else {
      getData(res, rej, story);
    }
  });
};

//#endregion

//#region Fonts
export function getUploadedFonts(
  config: ConfigCommon
): Promise<Array<UploadedFont>> {
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
  config?: ConfigCommon["api"],
  extraData?: {
    defaultTitle?: string;
    defaultValue?: string;
  }
): Promise<ChoicesSync> => {
  const collectionTypesHandler =
    config?.collectionTypes?.loadCollectionTypes.handler;

  return new Promise((res, rej) => {
    if (typeof collectionTypesHandler === "function") {
      collectionTypesHandler(res, rej, extraData);
    } else {
      rej(
        t("Missing api collectionTypes.loadCollectionTypes.handler in config")
      );
    }
  });
};

export const getCollectionItems = (
  type: string,
  config: ConfigCommon,
  extraChoices?: ChoiceSync
): Promise<ChoiceSync> => {
  const get = config.api?.collectionItems?.getCollectionItems?.handler;

  return new Promise((res, rej) => {
    if (typeof get === "function") {
      get(res, rej, { id: type, extraChoices });
    } else {
      rej(t("Missing api collectionItems handler in config"));
    }
  });
};

export const getConditionalItems = (
  entityType: string,
  config: ConfigCommon
): Promise<CollectionItem[]> => {
  const get = config?.api?.collectionItems?.getConditionalItems?.handler;

  return new Promise((res, rej) => {
    if (typeof get === "function") {
      get(res, rej, { entityType });
    } else {
      rej(t("Missing api conditional items handler in config"));
    }
  });
};

export const getConditionalTypes = (
  config: ConfigCommon
): Promise<ConditionalTypesData> => {
  const get = config?.api?.collectionTypes?.getConditionalTypes?.handler;

  return new Promise((res, rej) => {
    if (typeof get === "function") {
      get(res, rej);
    } else {
      rej(t("Missing api conditional types handler in config"));
    }
  });
};

export function getCollectionSourceItemsById(
  templateType: Shopify["templateType"],
  api: Shopify["api"]
): Promise<CollectionSourceItem[]> {
  const { id } = templateType;
  const { handler } = api?.collectionItems?.getCollectionSourceItems ?? {};

  return new Promise((res, rej) => {
    if (typeof handler === "function") {
      handler(res, rej, {
        searchCriteria: "id",
        searchValue: id
      });
    } else {
      rej(t("Missing getCollectionSourceItems in config"));
    }
  });
}

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
    collectionFilters?: string;
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

//#region Adobe Fonts

export const getAdobeFonts = (
  api: ConfigCommon["api"]
): Promise<AdobeFonts> => {
  return new Promise((res, rej) => {
    const get = api?.fonts?.adobeFont?.get;
    if (typeof get === "function") {
      get(res, rej);
    } else {
      rej(t("Missing adobe fonts in api config"));
    }
  });
};

export const addAdobeFonts = (
  api: ConfigCommon["api"],
  data: AdobeFontData
): Promise<AdobeAddAccount> => {
  const add = api?.fonts?.adobeFont?.add;
  return new Promise((res, rej) => {
    if (typeof add === "function") {
      add(res, rej, data);
    } else {
      rej(t("Missing adobe fonts in api config"));
    }
  });
};

//#endregion

//#region Ministry Brands

export const getEkklesiaChoiches = <
  T extends keyof EkklesiaFields = keyof EkklesiaFields
>(
  config: ConfigCommon,
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
  config: ConfigCommon,
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

//#region Ai Global Styles

export const getGlobalColors = (
  config: ConfigCommon
): Promise<Array<Palette>> => {
  return new Promise((res, rej) => {
    const { styles } = config.ui?.leftSidebar ?? {};
    const get = styles?.regenerateColors;

    if (!get) {
      rej(t("API: No regenerate color found."));
    } else {
      get(res, rej);
    }
  });
};

export const getGlobalTypography = (
  config: ConfigCommon
): Promise<Array<FontStyle>> => {
  return new Promise((res, rej) => {
    const { styles } = config.ui?.leftSidebar ?? {};
    const get = styles?.regenerateTypography;

    if (!get) {
      rej(t("API: No regenerate typography found."));
    } else {
      get(res, rej);
    }
  });
};

//#endregion

//#region Shop
//Ecwid
export const getEcwidProducts = (config: ConfigCommon): Promise<Choice[]> => {
  const get = config?.modules?.shop?.api?.getEcwidProducts?.handler;
  const id = config?.modules?.shop?.ecwidProductTypeId;

  return new Promise((res, rej) => {
    if (typeof get === "function" && id) {
      get(res, rej, { id });
    } else {
      rej(t("Missing getEcwidProducts api handler in config"));
    }
  });
};

// Shopify
export function shopifySyncRules({
  page,
  modules,
  rules,
  title,
  layout
}: {
  page: Shopify["page"];
  modules: Shopify["modules"];
  rules: SelectedItem[];
  title: string;
  layout: ShopifyPage["layout"]["value"];
}) {
  const { id } = page;
  const { shop } = modules ?? {};
  const handler = isShopifyShop(shop) && shop.api?.shopifySyncRules?.handler;

  return new Promise((res, rej) => {
    if (typeof handler === "function") {
      handler(res, rej, { id, rules, title, layout });
    } else {
      rej(t("Missing shopifySyncRules handler"));
    }
  });
}

export function shopifyBlogItems(config: Shopify) {
  const { shop } = config.modules ?? {};

  const handler = isShopifyShop(shop) && shop.api?.shopifyBlogItems?.handler;

  return new Promise(
    (res: Response<BlogSourceItem[]>, rej: Response<string>) => {
      if (typeof handler === "function") {
        handler(res, rej);
      } else {
        rej(t("Missing shopifyBlogItems handler"));
      }
    }
  );
}

export function shopifyUnpublishPage(config: Shopify) {
  const { shop } = config.modules ?? {};

  const handler =
    isShopifyShop(shop) && shop.api?.shopifyUnpublishPage?.handler;

  return new Promise((res: Response<{ message: string }>, rej) => {
    if (typeof handler === "function") {
      handler(res, rej);
    } else {
      rej(t("Missing shopifyUnpublishPage handler"));
    }
  });
}

export function shopifySyncArticle(props: {
  config: Shopify;
  blogId: string;
  blogTitle: string;
  title: string;
  layout: ShopifyPage["layout"]["value"];
}) {
  const { config, ...extra } = props;
  const {
    page: { id }
  } = config;
  const { shop } = config.modules ?? {};

  const handler = isShopifyShop(shop) && shop.api?.shopifySyncArticle?.handler;

  return new Promise((res, rej) => {
    if (typeof handler === "function") {
      handler(res, rej, { id, ...extra });
    } else {
      rej(t("Missing shopifySyncArticle handler"));
    }
  });
}

export function shopifySyncPage(props: {
  modules: Shopify["modules"];
  page: Shopify["page"];
  title: string;
  isHomePage: boolean;
  layout: ShopifyPage["layout"]["value"];
}) {
  const { modules, page, ...extra } = props;

  const { shop } = modules ?? {};

  const handler = isShopifyShop(shop) && shop.api?.shopifySyncPage?.handler;

  return new Promise(
    (res: Response<{ message: string }>, rej: Response<string>) => {
      if (typeof handler === "function") {
        handler(res, rej, { id: page.id, ...extra });
      } else {
        rej(t("Missing shopifySyncPage handler"));
      }
    }
  );
}

export function getPageRelations(modules: Shopify["modules"]) {
  const { shop } = modules ?? {};
  const handler = isShopifyShop(shop) && shop?.api?.getPageRelations?.handler;

  return new Promise((res: Response<PublishRule[]>, rej: Response<string>) => {
    if (typeof handler === "function") {
      handler(res, rej);
    } else {
      rej(t("Missing getPageRelations api handler in config"));
    }
  });
}

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

//#region CustomIcons

export const getCustomIcons = (
  config: ConfigCommon
): Promise<IconUploadData[]> => {
  const { get } = config?.api?.customIcon ?? {};

  return new Promise((res, rej) => {
    if (typeof get === "function") {
      get(res, rej);
    } else {
      rej("Missing api getIcons in config");
    }
  });
};

export const addCustomIcon = (
  api: ConfigCommon["api"],
  { acceptedExtensions }: UploadIconData
): Promise<IconUploadData[]> => {
  const { add } = api?.customIcon ?? {};

  return new Promise((res, rej) => {
    if (typeof add === "function") {
      add(res, rej, { acceptedExtensions });
    } else {
      rej("Missing api addIcon in config");
    }
  });
};

export const deleteCustomIcon = (
  uid: string,
  api: ConfigCommon["api"]
): Promise<string> => {
  const { delete: deleteIcon } = api?.customIcon ?? {};

  return new Promise((res, rej) => {
    if (typeof deleteIcon === "function") {
      deleteIcon(res, rej, { uid });
    } else {
      rej("Missing api deleteIcon in config");
    }
  });
};

//#endregion

//#region Dynamic Content

export const getDynamicContentPlaceholders = async (
  dynamicContent: ConfigCommon["dynamicContent"],
  extraData: { entityType: string; groupType: DCTypes }
): Promise<ConfigDCItem[]> => {
  const handler = dynamicContent?.handler;

  return new Promise((res, rej) => {
    if (typeof handler === "function") {
      handler(res, rej, extraData);
    } else {
      rej(t("Missing dynamicContent inside config api"));
    }
  });
};

export function getDynamicContent() {
  return ({
    placeholders,
    signal,
    config
  }: {
    placeholders: Dictionary<string[]>;
    signal?: AbortSignal;
    config: ConfigCommon;
  }): Promise<Dictionary<string[]>> => {
    const handler = config.dynamicContent?.getPlaceholderData;

    return new Promise((res, rej) => {
      if (typeof handler === "function") {
        handler(res, rej, { placeholders, signal });
      } else {
        rej(t("Missing getDynamicContent inside api Config"));
      }
    });
  };
}

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

export function sendHeartBeatTakeOver(api: Config["api"]): Promise<unknown> {
  const { takeOverHandler } = api?.heartBeat ?? {};
  return new Promise((res, rej) => {
    if (typeof takeOverHandler === "function") {
      takeOverHandler(res, rej);
    } else {
      rej(t("Missing takeOver handler inside config api"));
    }
  });
}

//#endregion
