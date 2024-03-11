import { ElementModel } from "visual/component/Elements/Types";
import {
  ChoicesAsync,
  ChoicesSync
} from "visual/component/Options/types/dev/Select/types";
import {
  EkklesiaFieldMap,
  EkklesiaKeys,
  EkklesiaParams
} from "visual/editorComponents/MinistryBrands/utils/types";
import { DynamicContent } from "visual/global/Config/types/DynamicContent";
import { ImageDataSize } from "visual/global/Config/types/ImageSize";
import { PostTypesTax } from "visual/global/Config/types/PostTypesTax";
import { Taxonomy } from "visual/global/Config/types/Taxonomy";
import { EcwidProductId, EcwidStoreId } from "visual/global/Ecwid";
import { PageCommon, Project, Rule } from "visual/types";
import { PostsSources } from "visual/utils/api/types";
import { Literal } from "visual/utils/types/Literal";
import type { Compiler } from "./Compiler";
import { ElementTypes } from "./ElementTypes";
import { ThirdPartyComponents } from "./ThirdParty";
import {
  BlocksArray,
  DefaultBlock,
  DefaultBlockWithID,
  DefaultTemplate,
  DefaultTemplateKits,
  KitItem,
  KitsWithThumbs,
  LayoutsWithThumbs,
  PopupsWithThumbs,
  StoriesWithThumbs
} from "./blocks/PredefinedBlocks";
import {
  APISavedBlocks,
  APISavedLayouts,
  APISavedPopups
} from "./blocks/SavedBlocks";
import {
  AddFileData,
  AddFileExtra,
  AddImageData,
  AddImageExtra,
  Response,
  ScreenshotData
} from "./common";
import { EkklesiaFields, EkklesiaModules } from "./modules/ekklesia/Ekklesia";

export enum Mode {
  page = "page",

  single = "single",

  product = "product",

  external_popup = "external_popup",
  internal_popup = "internal_popup",

  external_story = "external_story",
  internal_story = "internal_story",

  template = "template"
}

export interface MenuItem {
  type: "MenuItem";
  value: {
    id: string;
    title: string;
    url: string;
    target: string;
    items: MenuItem[];
    megaMenuItems: ElementModel[];
    attrTitle: string;
    classes: string[];
    current: boolean;
  };
}

export enum LeftSidebarOptionsIds {
  cms = "cms",
  addElements = "addElements",
  reorderBlock = "reorderBlock",
  globalStyle = "globalStyle",
  collaboration = "collaboration",
  deviceMode = "deviceMode",
  pageSettings = "pageSettings",
  more = "more"
}

export enum LeftSidebarPageSettingsOptionsIds {
  membership = "membership",
  language = "language",
  template = "template",
  featuredImage = "featuredImage"
}

export enum LeftSidebarMoreOptionsIds {
  link = "link",
  shortcuts = "shortcuts"
}

export interface LeftSidebarMoreOptions {
  type: LeftSidebarMoreOptionsIds;
  label: string;
  link: string;
  icon?: string;
  linkTarget?: "_blank" | "_self" | "_parent" | "_top";
  roles?: Array<string>;
}

export interface PopupSettings {
  displayCondition?: boolean;
  deletePopup?: boolean;
  embedded?: boolean;
  horizontalAlign?: boolean;
  verticalAlign?: boolean;
  scrollPageBehind?: boolean;
  clickOutsideToClose?: boolean;
  backgroundPreviewUrl?: string;
}

export interface PublishData {
  // TODO  Currently only projectData and pageData is used
  //  Need to add globalBlocks
  projectData?: Project;
  pageData?: PageCommon;
  html?: string;
  styles?: Array<string>;
  scripts?: Array<string>;
  // globalBlocks: Array<GlobalBlock>;
}

export interface AutoSave {
  // TODO  Currently only projectData and pageData is used
  //  Need to add globalBlocks
  projectData?: Project;
  pageData?: PageCommon;
  // globalBlocks: Array<GlobalBlock>;
}

export interface OnChange {
  // TODO  Currently only projectData and pageData is used
  //  Need to add globalBlocks
  projectData?: Project;
  pageData?: PageCommon;
  // globalBlocks: Array<GlobalBlock>;
}

export interface Theme {
  colors: {
    "--primary-dark"?: string;
    "--secondary-dark"?: string;
    "--tertiary-dark"?: string;
    "--primary-white"?: string;
    "--secondary-white"?: string;
    "--tertiary-white"?: string;
    "--primary-gray"?: string;
    "--secondary-gray"?: string;
    "--tertiary-gray"?: string;
    "--active-color"?: string;
    "--light-gray"?: string;
  };
}

export interface Video {
  category: string;
  id: string;
  items: {
    id: string;
    title: string;
    url: string;
  }[];
}

export interface Header {
  src: string;
  url: string;
}

export const isElementTypes = (type: string): type is ElementTypes => {
  return Object.values(ElementTypes).includes(type as ElementTypes);
};

export enum HelpVideos {
  addElementsHelpVideo = "addElementsHelpVideo",
  blocksLayoutsHelpVideo = "blocksLayoutsHelpVideo",
  fontsHelpVideo = "fontsHelpVideo",
  formHelpVideo = "formHelpVideo"
}

type HelpVideosKeys = keyof typeof HelpVideos;

export type HelpVideosData = {
  [k in HelpVideosKeys]: string;
};

interface _ConfigCommon<Mode> {
  tokenV1?: string;

  auth?: {
    token: string;
  };

  branding: {
    name: string;
  };
  editorVersion: string;

  mode?: Mode;

  taxonomies: Taxonomy[]; // is this property common or just wp?
  postTypesTaxs: PostTypesTax[]; // is this property common or just wp?

  imageSizes: ImageDataSize[];

  server?: {
    maxUploadFileSize: number;
  };

  menuData?: {
    id: string;
    name: string;
    items: MenuItem[];
  }[];

  projectData?: Project;

  pageData?: PageCommon;

  cloud?: {
    isSyncAllowed: boolean;
  };

  // HTML Compilation: inside Browser or External Server

  compiler?: Compiler;

  //#region Third Party

  thirdPartyComponents?: ThirdPartyComponents;

  //#endregion

  //#region UI

  ui?: {
    //#region Popup

    popupSettings?: PopupSettings;

    //#endregion

    //#region LeftSidebar

    leftSidebar?: {
      topTabsOrder?: Array<LeftSidebarOptionsIds>;
      bottomTabsOrder?: Array<LeftSidebarOptionsIds>;

      [LeftSidebarOptionsIds.pageSettings]?: {
        options?: {
          [LeftSidebarPageSettingsOptionsIds.membership]?: boolean;
          [LeftSidebarPageSettingsOptionsIds.template]?: boolean;
          [LeftSidebarPageSettingsOptionsIds.featuredImage]?: boolean;
          [LeftSidebarPageSettingsOptionsIds.language]?: boolean;
        };
      };
      [LeftSidebarOptionsIds.more]?: {
        options?: Array<LeftSidebarMoreOptions>;
      };
      [LeftSidebarOptionsIds.cms]?: {
        onOpen: (res: VoidFunction) => void;
        onClose: VoidFunction;
        icon?: string;
      };

      moduleGroups?: Array<{
        label: string;
        moduleNames: Array<ElementTypes>;
      }>;
    };

    //#endregion

    //#region Theme

    theme?: Theme;

    //#endregion

    //#region Help

    help?: {
      showIcon?: boolean;
      video?: Video[];
      header: Header;
      idHelpVideosIcons: HelpVideosData;
    };

    //#endregion

    //#region Publish

    publish?: {
      label?: string;
      handler: (
        res: Response<void>,
        rej: Response<string>,
        extra: PublishData
      ) => void;
    };

    //#endregion
  };

  //#endregion

  //#region DynamicContentOption

  dynamicContent?: DynamicContent<"wp"> | DynamicContent<"cloud">;

  //#endregion

  //#region Events

  onLoad?: VoidFunction;

  onAutoSave?: (res: AutoSave) => void;

  // Triggered when the user change the
  // pageData, globalBlocks or projectData
  onChange?: (res: OnChange) => void;

  // OnUpdate are triggered outside the editor when
  // the thirty party app want to update the page
  onUpdate: (res: Response<PublishData>, config?: ConfigCommon) => void;

  //#endregion

  //#region API

  api?: {
    // Used only in Posts(Migration) & GlobalBlocks PopupConditions
    /** @deprecated */
    brizyApiUrl?: string;

    //AI
    textAI?: {
      handler: (
        res: Response<string>,
        rej: Response<string>,
        data: { prompt: string; action?: string }
      ) => void;
    };

    // Media
    media?: {
      mediaResizeUrl?: string;

      addMedia?: {
        label?: string;
        handler: (
          res: Response<AddImageData>,
          rej: Response<string>,
          extra: AddImageExtra
        ) => void;
      };

      // Image Gallery
      addMediaGallery?: {
        label?: string;
        handler: (
          res: Response<Array<AddImageData>>,
          rej: Response<string>,
          extra: AddImageExtra
        ) => void;
      };
    };

    // File
    customFile?: {
      fileUrl?: string;

      addFile?: {
        label?: string;
        handler: (
          res: Response<AddFileData>,
          rej: Response<string>,
          extra: AddFileExtra
        ) => void;
      };
    };

    sourceTypes?: {
      getSourceChoices: () => ChoicesAsync;
    };

    sourceItems?: {
      handler: (
        res: Response<ChoicesSync>,
        rej: Response<string>,
        args: {
          id: string;
        }
      ) => void;
    };

    // Collection Items
    collectionItems?: {
      loadCollectionItems: {
        handler: (
          res: Response<ChoicesSync>,
          rej: Response<string>,
          extra: { collectionId: string; value: Literal[]; fieldId?: string }
        ) => void;
      };

      searchCollectionItems: {
        handler: (
          res: Response<ChoicesSync>,
          rej: Response<string>,
          extra: { collectionId: string; search: string; fieldId?: string }
        ) => void;
      };

      getCollectionItemsIds: {
        handler: (
          res: Response<ChoicesSync>,
          rej: Response<string>,
          extra: { id: string }
        ) => void;
      };
    };

    // Collection Types
    collectionTypes?: {
      loadCollectionTypes: {
        handler: (
          res: Response<ChoicesSync>,
          rej: Response<string>,
          extraData?: { defaultTitle?: string; defaultValue?: string }
        ) => void;
      };
    };

    // SavedBlocks
    savedBlocks?: APISavedBlocks;

    // SavedLayouts
    savedLayouts?: APISavedLayouts;

    // SavedPopups
    savedPopups?: APISavedPopups;

    defaultKits?: DefaultTemplateKits<
      KitsWithThumbs,
      DefaultBlock,
      Array<KitItem>
    >;
    defaultPopups?: DefaultTemplate<PopupsWithThumbs, DefaultBlockWithID>;
    defaultLayouts?: DefaultTemplate<
      LayoutsWithThumbs,
      BlocksArray<DefaultBlockWithID>
    >;
    defaultStories?: DefaultTemplate<
      StoriesWithThumbs,
      BlocksArray<DefaultBlock> | DefaultBlock
    >;

    // Popup Conditions
    popupConditions?: {
      conditions?: {
        save: (
          res: Response<Array<Rule>>,
          rej: Response<string>,
          extra: { rules: Array<Rule>; dataVersion: number }
        ) => void;
      };
    };

    modules?: {
      leadific?: {
        getCustomFields?: {
          handler: (res: Response<ChoicesSync>, rej: Response<string>) => void;
        };
      };
      ekklesia?: {
        getEkklesiaFields?: {
          handler: <T extends keyof EkklesiaFields = keyof EkklesiaFields>(
            res: Response<ChoicesSync | ChoicesSync>,
            rej: Response<string>,
            keys: EkklesiaParams<T>
          ) => void;
        };
        updateEkklesiaFields?: {
          handler: <T extends keyof EkklesiaFields = keyof EkklesiaFields>(
            res: Response<EkklesiaKeys>,
            rej: Response<string>,
            keys: {
              fields: Array<EkklesiaFieldMap[T]>;
            }
          ) => EkklesiaKeys;
        };
      };
    };

    // Screenshots
    screenshots?: {
      create?: (
        res: Response<{ id: string }>,
        rej: Response<string>,
        extra: ScreenshotData
      ) => void;
      update?: (
        res: Response<{ id: string }>,
        rej: Response<string>,
        extra: ScreenshotData & { id: string }
      ) => void;
    };
  };

  //#endregion

  //#region contentDefaults

  contentDefaults?: {
    PostTitle?: {
      textPopulation?: string;
      textPopulationEntityType?: string;
      textPopulationEntityId?: string;
      linkSource?: string;
      linkType?: string;
    };
    ShopifyImage?: {
      imagePopulation?: string;
    };
    PostContent?: {
      textPopulation?: string;
      textPopulationEntityType?: string;
      textPopulationEntityId?: string;
    };
    Quantity?: {
      linkSource?: string;
      linkType?: string;
    };
    Price?: {
      sourceType?: string;
    };
    ProductMetafield?: {
      linkSource: string;
      linkType?: string;
    };
    BlogPostMeta?: {
      linkSource?: string;
      sourceType?: string;
      linkType?: string;
    };
    AddToCart?: {
      sourceType?: string;
    };
    Vendor?: {
      sourceType?: string;
      linkSource?: string;
      linkType?: string;
    };
    BlogPostExcerpt?: {
      textPopulation?: string;
      textPopulationEntityType?: string;
      textPopulationEntityId?: string;
    };
    PostExcerpt?: {
      textPopulationEntityType?: string;
      textPopulation: string;
      textPopulationEntityId: string;
      linkSource?: string;
      linkType?: string;
    };
    Variant?: {
      sourceType?: string;
    };
    ShopifyDescription?: {
      textPopulation?: string;
      textPopulationEntityId?: string;
    };
    ShopifyTitle?: {
      textPopulation?: string;
      textPopulationEntityId?: string;
      linkType?: string;
      linkSource?: string;
    };
    ProductList?: {
      type?: string;
      source?: string;
      showSource?: boolean;
      orderBy?: string;
      order?: string;
      excludeCurrentProductOption?: boolean;
    };
    CollectionList?: {
      type?: string;
      source?: string;
      showSource?: boolean;
      orderBy?: string;
      order?: string;
    };
    BlogPostList?: {
      type?: string;
      source?: string;
      showSource?: boolean;
      orderBy?: string;
      order?: string;
    };
    Button?: {
      linkSource?: string;
      linkType?: string;
    };
    RichText?: {
      linkSource?: string;
      linkType?: string;
    };
    Column?: {
      linkSource?: string;
      linkType?: string;
    };
    Row?: {
      linkSource?: string;
      linkType?: string;
    };
    Icon?: {
      linkSource?: string;
      linkType?: string;
    };
    Image?: {
      linkSource?: string;
      linkType?: string;
    };
    Lottie?: {
      linkSource?: string;
      linkType?: string;
    };
    Posts?: {
      order?: string;
      orderBy?: string;
      source?: string;
    };
    FeaturedImage?: {
      linkSource?: string;
      linkType?: string;
    };
    AssetsPosts?: {
      source?: string;
      querySource?: string;
    };
    ShopCategories?: {
      source?: string;
      querySource?: string;
    };
    ShopPosts?: {
      source?: string;
      querySource?: string;
    };
  };

  //#endregion

  //#region Elements

  elements?: {
    section?: {
      multilanguage: boolean;
    };

    footer?: {
      multilanguage: boolean;
    };

    postExcerpt?: {
      predefinedPopulation?: boolean;
      sourceTypeOption?: boolean;
    };

    header?: {
      multilanguage: boolean;
    };

    posts?: {
      includeQueryMultiOptions?: boolean;
      exclude?: boolean;
      offset?: boolean;
      orderBy?: boolean;
      order?: boolean;
      querySource?: boolean;
      handler: (
        res: Response<PostsSources>,
        ref: Response<string>,
        args: {
          page: PageCommon;
          filterManualId?: string;
        }
      ) => void;
    };

    postTitle?: {
      predefinedPopulation?: boolean;
    };

    postContent?: {
      predefinedPopulation?: boolean;
    };
  };

  //#endregion

  // #region Localisation

  l10n?: Record<string, string>;

  // #endregion

  //#region modules

  modules?: {
    shop?: {
      type?: "shopify" | "ecwid";

      //#region ecwid

      storeId?: EcwidStoreId;
      defaultProductId?: EcwidProductId;
      productId?: EcwidProductId;
      subscriptionType?: "free" | "pro";
      daysLeft?: number;
      userSessionUrl?: string;
      apiUrl?: string;
      productCollectionTypeSlug?: string;
      categoryCollectionTypeSlug?: string;
      ecwidCategoryTypeId?: string;

      //#endregion

      //#region Shopify

      publishedPages?: number;
      maxPublishedPages?: number;
      upgradeToProUrl?: string;

      //#endregion

      api?: {
        //#region shopify api handlers

        metafieldsLoad?: {
          handler: (
            res: Response<ChoicesSync>,
            rej: Response<string>,
            args: {
              sourceType: string;
            }
          ) => void;
        };
        blogPostMetaLoad?: {
          handler: (
            res: Response<ChoicesSync>,
            rej: Response<string>,
            args: {
              sourceType: string;
            }
          ) => void;
        };

        //#endregion

        //#region ecwid api handlers

        getEcwidProducts?: {
          handler?: (res: Response<ChoicesSync>, rej: Response<string>) => void;
        };

        //#endregion
      };
    };

    //#endregion

    ekklesia?: EkklesiaModules;

    //#endregion
  };
}

export type ConfigCommon = _ConfigCommon<Mode>;
