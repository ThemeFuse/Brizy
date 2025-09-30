import { prepareHTML } from "visual/bootstraps/compiler/common/utils/prepareHTML";
import { ChoicesSync } from "visual/component/Options/types/dev/InternalLink/types";
import {
  ChoicesSync as ChoiceSync,
  ChoicesAsync as MultiSelectChoicesAsync
} from "visual/component/Options/types/dev/MultiSelect2/types";
import {
  Choice,
  ChoicesAsync
} from "visual/component/Options/types/dev/Select/types";
import { RuleList } from "visual/component/Prompts/PromptConditions/Rules/types";
import {
  FontFile,
  UploadFont
} from "visual/component/Prompts/PromptFonts/api/types";
import {
  EkklesiaFieldMap,
  EkklesiaKeys,
  EkklesiaParams
} from "visual/editorComponents/MinistryBrands/utils/types";
import { Config } from "visual/global/Config";
import {
  CheckCompatibilityResponse,
  SignIn,
  SignUp
} from "visual/global/Config/types/Authorisation";
import {
  ConfigDCItem,
  DCTypes
} from "visual/global/Config/types/DynamicContent";
import {
  AddAccount,
  AddRecaptcha,
  CreateIntegrationAccount,
  CreateIntegrationList,
  DeleteAccount,
  DeleteSmtpIntegration,
  GetAccount,
  GetForm,
  GetIntegration,
  GetIntegrationAccountApiKey,
  GetSmtpIntegration,
  UpdateForm,
  UpdateIntegration,
  UpdateSmtpIntegration
} from "visual/global/Config/types/Form";
import { GetCollectionItem_collectionItem as CollectionItem } from "visual/global/Config/types/GetCollectionItem";
import { CollectionTypesInfo } from "visual/global/Config/types/Posts";
import { isShopifyShop } from "visual/global/Config/types/configs/Base";
import { Shopify, isCloud } from "visual/global/Config/types/configs/Cloud";
import {
  AutoSave,
  ConditionalTypesData,
  ConfigCommon,
  ExportBlockURLData,
  MenuSimple,
  Sidebar
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
import type {
  Response as APIResponse,
  SuccessResponse
} from "visual/global/Config/types/configs/common";
import {
  AdobeFontData,
  IconUploadData,
  ScreenshotData
} from "visual/global/Config/types/configs/common";
import {
  EkklesiaExtra,
  EkklesiaFields
} from "visual/global/Config/types/configs/modules/ekklesia/Ekklesia";
import { CategoriesList } from "visual/libs/EcwidSdk/categories";
import { ProductsList } from "visual/libs/EcwidSdk/products";
import { Store } from "visual/redux/store";
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
import {
  AdobeAddAccount,
  AdobeFonts,
  BlogSourceItem,
  CollectionSourceItem,
  GetAuthors,
  GetPostTaxonomies,
  GetPosts,
  GetRulePostsGroupList,
  GetTerms,
  GetTermsBy,
  PostsSources,
  Rule as PublishRule,
  SelectedItem,
  UploadIconData
} from "visual/utils/api/types";
import { t } from "visual/utils/i18n";
import {
  editorRuleToApiRule,
  makeBlockMeta,
  stringifyGlobalBlock
} from "./adapter";

export { makeFormEncode, makeUrl, parseJSON } from "./utils";

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
  store: Store;
}

export function publish(data: Publish): Promise<void> {
  return new Promise((res, rej) => {
    const { is_autosave, config } = data;
    const { handler } = config.ui?.publish ?? {};

    if (!handler) {
      rej(t("API: No publish handler found."));
    } else {
      const output = prepareHTML({
        config: data.config,
        globalBlocks: data.needToCompile.globalBlocks,
        page: data.needToCompile.page,
        project: data.needToCompile.project,
        store: data.store
      });

      handler(res, rej, { ...output, is_autosave });
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
  store: Store;
}

export function onChange(data: OnChange): Promise<void> {
  return new Promise((res) => {
    const { config } = data;
    const onChange = config.onChange;

    if (typeof onChange === "function") {
      (async () => {
        const output = prepareHTML({
          config: data.config,
          globalBlocks: data.needToCompile.globalBlocks,
          page: data.needToCompile.page,
          project: data.needToCompile.project,
          store: data.store
        });
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
  config: ConfigCommon,
  fontIds: string[]
): Promise<Array<UploadedFont>> {
  const { get } = config.integrations?.fonts?.upload ?? {};

  return new Promise((res, rej) => {
    if (typeof get === "function") {
      get(res, rej, { ids: fontIds });
    } else {
      rej(t("Missing getUploadedFonts inside api config"));
    }
  });
}

export function uploadFont(
  data: { files: FontFile; name: string; id: string },
  config: ConfigCommon
): Promise<UploadFont> {
  const { upload } = config.integrations?.fonts?.upload ?? {};

  return new Promise((res, rej) => {
    if (typeof upload === "function") {
      upload(res, rej, data);
    } else {
      rej(t("Missing uploadFonts handler inside api config"));
    }
  });
}

export function deleteFont(
  fontId: string,
  config: ConfigCommon
): Promise<string> {
  const { delete: deleteHandler } = config.integrations?.fonts?.upload ?? {};

  return new Promise((res, rej) => {
    if (typeof deleteHandler === "function") {
      deleteHandler(res, rej, fontId);
    } else {
      rej(t("Missing deleteFonts handler inside api config"));
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

export const getCollectionItemById = (
  id: string | number,
  config: ConfigCommon
): Promise<CollectionItem[]> => {
  const get = config.api?.collectionItems?.getCollectionItemById?.handler;

  return new Promise((res, rej) => {
    if (typeof get === "function") {
      get(res, rej, { id });
    } else {
      rej(t("Missing api getCollectionItemById handler in config"));
    }
  });
};

export const getConditionalItems = (
  entityType: string,
  config: ConfigCommon,
  search?: string
): Promise<CollectionItem[]> => {
  const get = config?.api?.collectionItems?.getConditionalItems?.handler;

  return new Promise((res, rej) => {
    if (typeof get === "function") {
      get(res, rej, { entityType, search });
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

export const getCollectionTypesInfo = (
  config: ConfigCommon
): Promise<CollectionTypesInfo> => {
  const get = config?.api?.collectionTypes?.getCollectionTypesInfo?.handler;
  return new Promise((res, rej) => {
    if (typeof get === "function") {
      get(res, rej);
    } else {
      rej(t("Missing api collection types info handler in config"));
    }
  });
};

export const loadCollectionItems = (
  {
    collectionId,
    fieldId
  }: {
    collectionId: string;
    fieldId?: string;
  },
  config: ConfigCommon
): MultiSelectChoicesAsync["load"] => {
  const loadCollectionItems =
    config?.api?.collectionItems?.loadCollectionItems?.handler;

  return (value) => {
    return new Promise((res, rej) => {
      if (typeof loadCollectionItems === "function") {
        loadCollectionItems(res, rej, { collectionId, fieldId, value });
      } else {
        rej("Missing api handler in config");
      }
    });
  };
};

export const searchCollectionItems = (
  {
    collectionId,
    fieldId
  }: {
    collectionId?: string;
    fieldId?: string;
  },
  config: ConfigCommon
): MultiSelectChoicesAsync["search"] => {
  const searchCollectionItems =
    config?.api?.collectionItems?.searchCollectionItems?.handler;

  return (search) => {
    return new Promise((res, rej) => {
      if (typeof searchCollectionItems === "function") {
        searchCollectionItems(res, rej, {
          collectionId: collectionId ?? "",
          fieldId,
          search
        });
      } else {
        rej("Missing api handler in config");
      }
    });
  };
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

export const searchEcwidProducts = (
  config: ConfigCommon
): Promise<ProductsList> => {
  const searchHandler =
    config?.modules?.shop?.api?.searchEcwidProducts?.handler;

  return new Promise((res, rej) => {
    if (typeof searchHandler === "function") {
      searchHandler(res, rej);
    } else {
      rej(t("Missing searchEcwidProducts api handler in config"));
    }
  });
};

export const searchEcwidCategories = (
  config: ConfigCommon
): Promise<CategoriesList> => {
  const searchHandler =
    config?.modules?.shop?.api?.searchEcwidCategories?.handler;

  return new Promise((res, rej) => {
    if (typeof searchHandler === "function") {
      searchHandler(res, rej);
    } else {
      rej(t("Missing searchEcwidCategories api handler in config"));
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
    (res: APIResponse<BlogSourceItem[]>, rej: APIResponse<string>) => {
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

  return new Promise((res: APIResponse<{ message: string }>, rej) => {
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
    (res: APIResponse<{ message: string }>, rej: APIResponse<string>) => {
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

  return new Promise(
    (res: APIResponse<PublishRule[]>, rej: APIResponse<string>) => {
      if (typeof handler === "function") {
        handler(res, rej);
      } else {
        rej(t("Missing getPageRelations api handler in config"));
      }
    }
  );
}

export const getMetafields = (
  sourceType: string,
  config: ConfigCommon
): Promise<ChoicesSync> => {
  const handler = config?.modules?.shop?.api?.getMetafields?.handler;

  return new Promise((res, rej) => {
    if (typeof handler === "function") {
      handler(res, rej, { slug: sourceType });
    } else {
      rej("Missing api handler in config");
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

export const deleteGlobalBlock = (
  uid: string,
  config: ConfigCommon
): Promise<APIGlobalBlock> => {
  return new Promise((res, rej) => {
    const { globalBlocks } = config.api ?? {};
    const deleteFn = globalBlocks?.delete;

    if (!deleteFn) {
      rej(t("API: No globalBlocks delete found."));
    } else {
      deleteFn(res, rej, uid);
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

export function getMenuSimpleDynamicContent() {
  return ({
    placeholders,
    signal,
    config
  }: {
    placeholders: Dictionary<string[]>;
    signal?: AbortSignal;
    config: ConfigCommon;
  }): Promise<Dictionary<string[]>> => {
    const handler = config.elements?.menuSimple?.getPlaceholderData;

    return new Promise((res, rej) => {
      if (typeof handler === "function") {
        handler(res, rej, { placeholders, signal });
      } else {
        rej(t("Missing menuSimple dynamicContent inside api Config"));
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

//#region GetMenus

export const getMenus = (
  config: ConfigCommon["api"]
): Promise<MenuSimple[]> => {
  return new Promise((res, rej) => {
    const { menu } = config ?? {};

    const getMenu = menu?.getMenus?.handler;

    if (!getMenu) {
      rej(t("API: No getMenus found."));
    } else {
      getMenu(res, rej);
    }
  });
};

//#endregion

//#region Featured Image
export async function updateFeaturedImage(
  attachmentId: string,
  config: ConfigCommon
): Promise<unknown> {
  return new Promise((res, rej) => {
    const { api } = config ?? {};

    const updateImage = api?.featuredImage?.updateFeaturedImage;

    if (!updateImage) {
      rej(t("API: No Update Featured Image found."));
    } else {
      updateImage(res, rej, attachmentId);
    }
  });
}

export async function updateFeaturedImageFocalPoint(
  attachmentId: string,
  pointX: string,
  pointY: string,
  config: ConfigCommon
): Promise<unknown> {
  return new Promise((res, rej) => {
    const { api } = config ?? {};

    const updateFeaturedImageFocalPoint =
      api?.featuredImage?.updateFeaturedImageFocalPoint;

    if (!updateFeaturedImageFocalPoint) {
      rej(t("API: No Update Featured Image Focal Point found."));
    } else {
      updateFeaturedImageFocalPoint(res, rej, { attachmentId, pointX, pointY });
    }
  });
}

export async function removeFeaturedImage(
  config: ConfigCommon
): Promise<unknown> {
  return new Promise((res, rej) => {
    const { api } = config ?? {};

    const removeFeaturedImage = api?.featuredImage?.removeFeaturedImage;

    if (!removeFeaturedImage) {
      rej(t("API: No Remove Featured Image found."));
    } else {
      removeFeaturedImage(res, rej);
    }
  });
}

//#endregion

//#region Shortcode Content

export async function shortcodeContent(
  shortcode: string,
  config: ConfigCommon
): Promise<unknown> {
  return new Promise((res, rej) => {
    const { api } = config ?? {};

    const handler = api?.shortcodeContent?.handler;

    if (!handler) {
      rej(t("API: No shortcodeContent found."));
    } else {
      handler(res, rej, shortcode);
    }
  });
}

//#endregion

export const getAuthors: GetAuthors = ({
  include = [],
  search = "",
  abortSignal,
  config
}) => {
  return new Promise((res, rej) => {
    const { api } = config;

    const _getAuthors = api?.authors?.getAuthors;

    if (!_getAuthors) {
      rej(t("API: No authors found."));
    } else {
      _getAuthors(res, rej, {
        include,
        search,
        abortSignal
      });
    }
  });
};

//# region Posts

export const getPosts: GetPosts = async ({
  include,
  search = "",
  postType,
  excludePostType,
  abortSignal,
  config
}) => {
  return new Promise((res, rej) => {
    const { api } = config;

    const handler = api?.posts?.getPosts;

    if (!handler) {
      rej(t("API: No posts found."));
    } else {
      handler(res, rej, {
        include,
        search,
        postType,
        excludePostType,
        abortSignal
      });
    }
  });
};

export const getPostTaxonomies: GetPostTaxonomies = async ({
  taxonomy,
  abortSignal,
  config
}) => {
  return new Promise((res, rej) => {
    const { api } = config;

    const handler = api?.posts?.getPostTaxonomies;

    if (!handler) {
      rej(t("API: No posts taxonomies found."));
    } else {
      handler(res, rej, {
        taxonomy,
        abortSignal
      });
    }
  });
};

export const getRulePostsGroupList: GetRulePostsGroupList = async (
  postType,
  config
) => {
  return new Promise((res, rej) => {
    const { api } = config;

    const handler = api?.posts?.getRulePostsGroupList;

    if (!handler) {
      rej(t("API: No posts group list found."));
    } else {
      handler(res, rej, { postType });
    }
  });
};

//#endregion

//# region Terms

export const getTerms: GetTerms = async (taxonomy, config) => {
  return new Promise((res, rej) => {
    const { api } = config;

    const handler = api?.terms?.getTerms;

    if (!handler) {
      rej(t("API: No terms found."));
    } else {
      handler(res, rej, taxonomy);
    }
  });
};

export const getTermsBy: GetTermsBy = async ({
  include = [],
  search = "",
  abortSignal,
  config
}) => {
  return new Promise((res, rej) => {
    const { api } = config;

    const handler = api?.terms?.getTermsBy;

    if (!handler) {
      rej(t("API: No terms found."));
    } else {
      handler(res, rej, { include, search, abortSignal });
    }
  });
};

//#endregion

//#region Rules

export function getRulesList(config: ConfigCommon): Promise<Array<Rule>> {
  return new Promise((res, rej) => {
    const { conditions } = config.api?.popupConditions ?? {};

    const getRules = conditions?.getRuleList;

    if (!getRules) {
      rej(t("API: No rules list found."));
    } else {
      getRules(res, rej);
    }
  });
}

export function getGroupList(
  type: "block" | "popup",
  config: ConfigCommon
): Promise<Array<RuleList[]>> {
  return new Promise((res, rej) => {
    const { conditions } = config.api?.popupConditions ?? {};

    const handler = conditions?.getGroupList;

    if (!handler) {
      rej(t("API: No group list found."));
    } else {
      handler(res, rej, type);
    }
  });
}

//#endregion

//#region Sidebars

export async function getSidebars(config: ConfigCommon): Promise<Sidebar[]> {
  return new Promise((res, rej) => {
    const { api } = config;

    const _getSidebars = api?.sidebars?.getSidebars;

    if (!_getSidebars) {
      rej(t("API: No sidebars found."));
    } else {
      _getSidebars(res, rej);
    }
  });
}

//#endregion

//#region Authorisation
export async function signIn(
  data: SignIn,
  config: ConfigCommon
): Promise<SuccessResponse> {
  return new Promise((res, rej) => {
    const { api } = config;

    const signInHandler = api?.authorisation?.signIn;

    if (typeof signInHandler !== "function") {
      rej(t("API: No signIn handler found."));
    } else {
      signInHandler(res, rej, data);
    }
  });
}

export async function recoveryEmail(
  email: string,
  config: ConfigCommon
): Promise<SuccessResponse> {
  return new Promise((res, rej) => {
    const { api } = config;

    const recoveryEmailHandler = api?.authorisation?.recoveryEmail;

    if (typeof recoveryEmailHandler !== "function") {
      rej(t("API: No recoveryEmail handler found."));
    } else {
      recoveryEmailHandler(res, rej, { email });
    }
  });
}

export async function signUp(
  data: SignUp,
  config: ConfigCommon
): Promise<SuccessResponse> {
  return new Promise((res, rej) => {
    const { api } = config;

    const signUpHandler = api?.authorisation?.signUp;

    if (typeof signUpHandler !== "function") {
      rej(t("API: No signUp handler found."));
    } else {
      signUpHandler(res, rej, data);
    }
  });
}

export async function logout(config: ConfigCommon): Promise<SuccessResponse> {
  return new Promise((res, rej) => {
    const { api } = config;

    const logoutHandler = api?.authorisation?.logout;

    if (typeof logoutHandler !== "function") {
      rej(t("API: No logout handler found."));
    } else {
      logoutHandler(res, rej);
    }
  });
}

export async function sync(config: ConfigCommon): Promise<SuccessResponse> {
  return new Promise((res, rej) => {
    const { api } = config;

    const syncHandler = api?.authorisation?.sync;

    if (typeof syncHandler !== "function") {
      rej(t("API: No sync handler found."));
    } else {
      syncHandler(res, rej);
    }
  });
}

export async function checkCompatibility(
  config: ConfigCommon
): Promise<CheckCompatibilityResponse> {
  return new Promise<CheckCompatibilityResponse>((res, rej) => {
    const { api } = config;

    const checkCompatibilityHandler = api?.authorisation?.checkCompatibility;

    if (typeof checkCompatibilityHandler !== "function") {
      rej(t("API: No checkCompatibility handler found."));
    } else {
      checkCompatibilityHandler(res, rej);
    }
  });
}

//#endregion

//#region Form
export const getForm: GetForm = async (data, config) => {
  return new Promise((res, rej) => {
    const { integrations } = config;

    const getForm = integrations?.form?.getForm;

    if (typeof getForm !== "function") {
      rej(t("Integrations: No getForm handler found."));
    } else {
      getForm(res, rej, data);
    }
  });
};

export const updateForm: UpdateForm = async (data, config) => {
  return new Promise((res, rej) => {
    const { integrations } = config;

    const updateForm = integrations?.form?.updateForm;

    if (typeof updateForm !== "function") {
      rej(t("Integrations: No updateForm handler found."));
    } else {
      updateForm(res, rej, data);
    }
  });
};

export const getIntegration: GetIntegration = async (data, config) => {
  return new Promise((res, rej) => {
    const { integrations } = config;

    const getIntegration = integrations?.form?.getIntegration;

    if (typeof getIntegration !== "function") {
      rej(t("Integrations: No getIntegration handler found."));
    } else {
      getIntegration(res, rej, data);
    }
  });
};

export const updateIntegration: UpdateIntegration = async (data, config) => {
  return new Promise((res, rej) => {
    const { integrations } = config;

    const updateIntegration = integrations?.form?.updateIntegration;

    if (typeof updateIntegration !== "function") {
      rej(t("Integrations: No updateIntegration handler found."));
    } else {
      updateIntegration(res, rej, data);
    }
  });
};

export const createIntegrationAccount: CreateIntegrationAccount = async (
  data,
  config
) => {
  return new Promise((res, rej) => {
    const { integrations } = config;

    const createIntegrationAccount =
      integrations?.form?.createIntegrationAccount;

    if (typeof createIntegrationAccount !== "function") {
      rej(t("Integrations: No createIntegrationAccount handler found."));
    } else {
      createIntegrationAccount(res, rej, data);
    }
  });
};

export const getIntegrationAccountApiKey: GetIntegrationAccountApiKey = async (
  data,
  config
) => {
  return new Promise((res, rej) => {
    const { integrations } = config;

    const getIntegrationAccountApiKey =
      integrations?.form?.getIntegrationAccountApiKey;

    if (typeof getIntegrationAccountApiKey !== "function") {
      rej(t("Integrations: No getIntegrationAccountApiKey handler found."));
    } else {
      getIntegrationAccountApiKey(res, rej, data);
    }
  });
};

export const createIntegrationList: CreateIntegrationList = async (
  data,
  config
) => {
  return new Promise((res, rej) => {
    const { integrations } = config;

    const createIntegrationList = integrations?.form?.createIntegrationList;

    if (typeof createIntegrationList !== "function") {
      rej(t("Integrations: No createIntegrationList handler found."));
    } else {
      createIntegrationList(res, rej, data);
    }
  });
};

export const addRecaptcha: AddRecaptcha = async (data, config) => {
  return new Promise((res, rej) => {
    const { integrations } = config;

    const addRecaptcha = integrations?.form?.addRecaptcha;

    if (typeof addRecaptcha !== "function") {
      rej(t("Integrations: No addRecaptcha handler found."));
    } else {
      addRecaptcha(res, rej, data);
    }
  });
};

export const getSmtpIntegration: GetSmtpIntegration = async (data, config) => {
  return new Promise((res, rej) => {
    const { integrations } = config;

    const getSmtpIntegration = integrations?.form?.getSmtpIntegration;

    if (typeof getSmtpIntegration !== "function") {
      rej(t("Integrations: No getSmtpIntegration handler found."));
    } else {
      getSmtpIntegration(res, rej, data);
    }
  });
};

export const updateSmtpIntegration: UpdateSmtpIntegration = async (
  data,
  config
) => {
  return new Promise((res, rej) => {
    const { integrations } = config;

    const updateSmtpIntegration = integrations?.form?.updateSmtpIntegration;

    if (typeof updateSmtpIntegration !== "function") {
      rej(t("Integrations: No updateSmtpIntegration handler found."));
    } else {
      updateSmtpIntegration(res, rej, data);
    }
  });
};

export const deleteSmtpIntegration: DeleteSmtpIntegration = async (
  data,
  config
) => {
  return new Promise((res, rej) => {
    const { integrations } = config;

    const deleteIntegration = integrations?.form?.deleteSmtpIntegration;

    if (typeof deleteIntegration !== "function") {
      rej(t("Integrations: No deleteIntegration handler found."));
    } else {
      deleteIntegration(res, rej, data);
    }
  });
};

export const addAccount: AddAccount = async (data, config) => {
  return new Promise((res, rej) => {
    const { integrations } = config;

    const addAccount = integrations?.form?.addAccount;

    if (typeof addAccount !== "function") {
      rej(t("Integrations: No addAccount handler found."));
    } else {
      addAccount(res, rej, data);
    }
  });
};

export const getAccounts: GetAccount = async (data, config) => {
  return new Promise((res, rej) => {
    const { integrations } = config;

    const getAccounts = integrations?.form?.getAccounts;

    if (typeof getAccounts !== "function") {
      rej(t("Integrations: No getAccounts handler found."));
    } else {
      getAccounts(res, rej, data);
    }
  });
};

export const deleteAccount: DeleteAccount = async (id, config) => {
  return new Promise((res, rej) => {
    const { integrations } = config;

    const deleteAccount = integrations?.form?.deleteAccount;

    if (typeof deleteAccount !== "function") {
      rej(t("Integrations: No deleteAccount handler found."));
    } else {
      deleteAccount(res, rej, { id });
    }
  });
};
//#endregion

export const getExportBlockUrl = ({
  isPro,
  config,
  id,
  type
}: ExportBlockURLData & {
  config: ConfigCommon;
}): string => {
  const { api } = config;
  const { getExportBlockUrl } = api?.block ?? {};

  if (typeof getExportBlockUrl !== "function") {
    throw new Error("No getExportBlockUrl handler found.");
  }

  return getExportBlockUrl({
    isPro,
    id,
    type
  });
};
