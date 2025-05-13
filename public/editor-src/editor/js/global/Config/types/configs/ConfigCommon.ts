import {
  Output,
  ProjectOutput
} from "visual/bootstraps/compiler/browser/types";
import { ElementModel } from "visual/component/Elements/Types";
import { ChoicesSync as ChoiceSync } from "visual/component/Options/types/dev/MultiSelect2/types";
import {
  ChoicesAsync,
  ChoicesSync
} from "visual/component/Options/types/dev/Select/types";
import { RuleList } from "visual/component/Prompts/PromptConditions/Rules/types";
import { Ref } from "visual/component/Prompts/PromptConditions/Rules/utils/api";
import { ConfigTab as PromptFormTab } from "visual/component/Prompts/PromptForm/types";
import { FormInputTypesName } from "visual/editorComponents/Form2/Form2Field/types";
import {
  EkklesiaFieldMap,
  EkklesiaKeys,
  EkklesiaParams
} from "visual/editorComponents/MinistryBrands/utils/types";
import { VideoTypes } from "visual/editorComponents/Video/types";
import { DynamicContent } from "visual/global/Config/types/DynamicContent";
import { ImageDataSize } from "visual/global/Config/types/ImageSize";
import { PostTypesTax } from "visual/global/Config/types/PostTypesTax";
import { Taxonomy } from "visual/global/Config/types/Taxonomy";
import { UrlsCommon } from "visual/global/Config/types/Urls";
import { EcwidProductId, EcwidStoreId } from "visual/global/Ecwid/types";
import { UploadedFont } from "visual/types/Fonts";
import { GlobalBlock } from "visual/types/GlobalBlock";
import { Page, PageCommon } from "visual/types/Page";
import { Project } from "visual/types/Project";
import { Rule } from "visual/types/Rule";
import { FontStyle, Palette } from "visual/types/Style";
import { GetCollectionItem_collectionItem as CollectionItem } from "visual/utils/api/cms/graphql/types/GetCollectionItem";
import {
  AdobeAddAccount,
  AdobeFonts,
  CollectionSourceItem,
  PostsSources
} from "visual/utils/api/types";
import { Literal } from "visual/utils/types/Literal";
import { Pro } from "../Pro";
import { User } from "../User";
import type { Compiler } from "./Compiler";
import { ElementTypes } from "./ElementTypes";
import {
  ThirdPartyComponents,
  ThirdPartyComponentsHosts,
  ThirdPartyUrls
} from "./ThirdParty";
import {
  Block as APIGlobalBlock,
  APIGlobalBlocks,
  APIGlobalPopups
} from "./blocks/GlobalBlocks";
import {
  BlocksArray,
  DefaultBlock,
  DefaultBlockWithID,
  DefaultTemplate,
  DefaultTemplateKits,
  DefaultTemplateWithPages,
  KitItem,
  KitsWithThumbs,
  LayoutsPages,
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
  AdobeFontData,
  FormFieldsOption,
  IconPattern,
  IconUploadData,
  ImagePatterns,
  Response,
  ScreenshotData,
  SizeType
} from "./common";
import {
  EkklesiaExtra,
  EkklesiaFields,
  EkklesiaModules
} from "./modules/ekklesia/Ekklesia";

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
    liClasses: string[];
    current: boolean;
  };
}

export interface MenuData {
  id: string;
  name: string;
  items: MenuItem[];
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

export interface LeftSidebarOptionBase {
  id: string;
  icon?: string;
  title?: string;
}

interface LeftSidebarCommonOption extends LeftSidebarOptionBase {
  type:
    | LeftSidebarOptionsIds.cms
    | LeftSidebarOptionsIds.reorderBlock
    | LeftSidebarOptionsIds.globalStyle
    | LeftSidebarOptionsIds.collaboration
    | LeftSidebarOptionsIds.deviceMode
    | LeftSidebarOptionsIds.pageSettings
    | LeftSidebarOptionsIds.more;
}

export interface LeftSidebarAddElementsType extends LeftSidebarOptionBase {
  type: LeftSidebarOptionsIds.addElements;
  elements: {
    label: string;
    moduleNames: Array<ElementTypes>;
  }[];
}

export type LeftSidebarOption =
  | LeftSidebarCommonOption
  | LeftSidebarAddElementsType;

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

export interface PublishedProject extends Project {
  compiled?: ProjectOutput;
}

export type PublishedPage = Page & {
  compiled?: Output;
};

export interface PublishedGlobalBlock extends APIGlobalBlock {
  compiled?: Output;
}

export interface PublishData {
  is_autosave: 1 | 0;
  projectData?: PublishedProject;
  pageData?: PublishedPage;
  globalBlocks?: Array<PublishedGlobalBlock>;
  error?: string;
}

export interface AutoSave {
  projectData?: Project;
  pageData?: PageCommon;
  globalBlock?: APIGlobalBlock;
}

export interface OnChange {
  projectData?: PublishedProject;
  pageData?: PublishedPage;
  globalBlocks?: Array<PublishedGlobalBlock>;
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

export interface MenuSimple {
  count: number;
  description: string;
  filter: string;
  name: string;
  parent: number;
  slug: string;
  taxonomy: string;
  term_group: number;
  term_id: number;
  term_taxonomy_id: number;
}

export interface Sidebar {
  id: string;
  title: string;
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

export interface CustomFile {
  fileUrl?: string;

  addFile?: {
    label?: string;
    handler: (
      res: Response<AddFileData>,
      rej: Response<string>,
      extra: AddFileExtra
    ) => void;
  };
}

interface ColllectionBase {
  id: string;
  title: string;
}

type RefById = Omit<Ref, "value"> & {
  id: string;
  __typename: string;
  label: string;
  settings: {
    collectionType: {
      id: string;
    };
  };
};

export interface ConditionCollectionType extends ColllectionBase {
  fields: RefById[];
}

export interface ConditionalTypesData {
  collectionTypes: ConditionCollectionType[];
  customers: ColllectionBase[];
  customerGroups: ColllectionBase[];
}

export interface API {
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
    isOldImage?: boolean;

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

    imagePatterns?: ImagePatterns;
  };

  fonts?: {
    adobeFont?: {
      get: (res: Response<AdobeFonts>, rej: Response<string>) => void;
      add: (
        res: Response<AdobeAddAccount>,
        rej: Response<string>,
        extra: AdobeFontData
      ) => void;
    };
  };

  // File
  customFile?: CustomFile;

  // Icon
  customIcon?: {
    iconUrl?: string;
    iconPattern?: IconPattern;
    add?: (
      res: Response<IconUploadData[]>,
      rej: Response<string>,
      extra: Pick<AddFileExtra, "acceptedExtensions">
    ) => void;
    get?: (res: Response<IconUploadData[]>, rej: Response<string>) => void;
    delete?: (
      res: Response<string>,
      rej: Response<string>,
      extra: { uid: string }
    ) => void;
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

    getCollectionItems: {
      handler: (
        res: Response<ChoicesSync>,
        rej: Response<string>,
        extra: {
          id: string;
          search?: string;
          populationPermalink?: "1" | "0";
          extraChoices?: ChoiceSync;
        }
      ) => void;
    };

    getCollectionSourceItems: {
      handler: (
        res: Response<CollectionSourceItem[]>,
        rej: Response<string>,
        extra: {
          searchCriteria: "id" | "slug";
          searchValue: string;
        }
      ) => void;
    };

    getConditionalItems?: {
      handler: (
        res: Response<CollectionItem[]>,
        rej: Response<string>,
        args: { entityType: string }
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

    getConditionalTypes: {
      handler: (
        res: Response<ConditionalTypesData>,
        rej: Response<string>
      ) => void;
    };
  };

  // SavedBlocks
  savedBlocks?: APISavedBlocks;

  // SavedLayouts
  savedLayouts?: APISavedLayouts;

  // SavedPopups
  savedPopups?: APISavedPopups;

  // GlobalBlocks
  globalBlocks?: APIGlobalBlocks;

  // GlobalPopups
  globalPopups?: APIGlobalPopups;

  defaultKits?: DefaultTemplateKits<
    KitsWithThumbs,
    DefaultBlock,
    Array<KitItem>
  >;
  defaultPopups?: DefaultTemplate<PopupsWithThumbs, DefaultBlockWithID>;
  defaultLayouts?: DefaultTemplateWithPages<
    LayoutsWithThumbs,
    BlocksArray<DefaultBlockWithID>,
    LayoutsPages
  >;
  defaultStories?: DefaultTemplateWithPages<
    StoriesWithThumbs,
    BlocksArray<DefaultBlock> | DefaultBlock,
    LayoutsPages
  >;

  // Popup Conditions
  popupConditions?: {
    conditions?: {
      save: (
        res: Response<Array<Rule>>,
        rej: Response<string>,
        extra: { rules: Array<Rule>; dataVersion: number }
      ) => void;
      getRuleList?: (res: Response<Array<Rule>>, rej: Response<string>) => void;
      getGroupList?: (
        res: Response<Array<RuleList[]>>,
        rej: Response<string>,
        type: "block" | "popup"
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
          keys: EkklesiaParams<T>,
          extra?: EkklesiaExtra
        ) => void;
      };
      updateEkklesiaFields?: {
        handler: <T extends keyof EkklesiaFields = keyof EkklesiaFields>(
          res: Response<EkklesiaKeys>,
          rej: Response<string>,
          keys: {
            fields: Array<EkklesiaFieldMap[T]>;
          },
          extra?: EkklesiaExtra
        ) => EkklesiaKeys;
      };
    };
  };

  heartBeat?: {
    sendHandler?: (
      res: Response<{
        locked: boolean;
        lockedBy: boolean | { user_email: string };
      }>,
      rej: Response<string>
    ) => void;
    takeOverHandler?: (res: Response<unknown>, rej: Response<string>) => void;
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

  menu?: {
    getMenus?: {
      handler: (res: Response<MenuSimple[]>, rej: Response<string>) => void;
    };
  };

  featuredImage?: {
    updateFeaturedImage?: (
      res: Response<{ uid: string }>,
      rej: Response<string>,
      attachmentId: string
    ) => void;
    updateFeaturedImageFocalPoint?: (
      res: Response<[]>,
      rej: Response<string>,
      data: {
        attachmentId: string;
        pointX: string;
        pointY: string;
      }
    ) => void;
    removeFeaturedImage?: (
      res: Response<undefined>,
      rej: Response<string>
    ) => void;
  };

  shortcodeContent?: {
    handler: (
      res: Response<string>,
      rej: Response<string>,
      shortcode: string
    ) => void;
  };

  authors?: {
    getAuthors?: (
      res: Response<{ ID: number; display_name: string }[]>,
      rej: Response<string>,
      props: { search?: string; include?: string[]; abortSignal?: AbortSignal }
    ) => void;
  };

  posts?: {
    getPosts?: (
      res: Response<{ ID: number; title: string; permalink: string }[]>,
      rej: Response<string>,
      data: {
        search?: string;
        include?: string[];
        postType?: string[];
        excludePostType?: string[];
        abortSignal?: AbortSignal;
      }
    ) => void;
    getPostTaxonomies?: (
      res: Response<
        {
          name: string;
          label: string;
          public: boolean;
          hierarchical: boolean;
          labels: { name: string; singular_name: string };
        }[]
      >,
      rej: Response<string>,
      data: {
        taxonomy: string;
        abortSignal?: AbortSignal;
      }
    ) => void;
  };

  terms?: {
    getTerms: (
      res: Response<
        {
          name: string;
          term_id: number;
          slug: string;
        }[]
      >,
      rej: Response<string>,
      taxonomy: string
    ) => void;
    getTermsBy: (
      res: Response<
        {
          term_id: number;
          name: string;
          taxonomy: string;
          taxonomy_name: string;
        }[]
      >,
      rej: Response<string>,
      data: {
        include?: [string, string][];
        search?: string;
        abortSignal?: AbortSignal;
      }
    ) => void;
  };

  sidebars?: {
    getSidebars?: (res: Response<Sidebar[]>, rej: Response<string>) => void;
  };
}

interface _ConfigCommon<Mode> {
  tokenV1?: string;

  /**
   * @deprecated The token will not be in the future
   */
  tokenV2?: {
    token_type: string;
    access_token: string;
  };

  auth?: {
    token: string;
  };

  project: {
    id: Literal;
    apiVersion?: number;
    heartBeatInterval?: number;
    protectedPagePassword?: string;
    status?: {
      locked: boolean;
      lockedBy: boolean | { user_email: string };
    };
  };

  container: {
    id: number;
  };

  user?: User;

  branding?: {
    name: string;
  };
  editorVersion: string;

  /**
   * @deprecated mode is deprecated; in future it will be deleted from the config,
   * this value must be passed as props or from contextProvider to relevant components.
   */
  mode: Mode;

  taxonomies?: Taxonomy[]; // is this property common or just wp?
  postTypesTaxs?: PostTypesTax[]; // is this property common or just wp?

  imageSizes?: ImageDataSize[];

  multilanguage?: boolean;
  membership?: boolean;

  server?: {
    maxUploadFileSize: number;
  };

  menuData?: MenuData[];

  projectData?: Project;

  pageData?: PageCommon;

  globalBlocks?: Array<GlobalBlock>;

  cloud?: {
    isSyncAllowed: boolean;
  };

  // HTML Compilation
  compiler?: Compiler;

  //#region Pro

  pro?: Pro;

  //#endregion

  //#region Third Party

  thirdPartyUrls?: ThirdPartyUrls;
  thirdPartyComponents?: ThirdPartyComponents;
  thirdPartyComponentsHosts?: ThirdPartyComponentsHosts;

  //#endregion

  //#region UI

  ui?: {
    //#region Features

    features?: {
      imagePointer?: boolean;
      imageZoom?: boolean;
      backgroundPointer?: boolean;
      internalLink?: boolean;
      linkUpload?: boolean;
      link?: {
        internalLink?: boolean;
        linkExternal?: boolean;
        linkUpload?: boolean;
        linkAnchor?: boolean;
        linkPopup?: boolean;
      };
    };

    //#endregion Features

    //#region Popup

    popupSettings?: PopupSettings;

    //#endregion

    //#region LeftSidebar

    leftSidebar?: {
      topTabsOrder?: Array<LeftSidebarOption>;
      bottomTabsOrder?: Array<LeftSidebarOption>;

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

      styles?: {
        regenerateColors: (
          res: Response<Palette[]>,
          rej: Response<string>
        ) => void;
        regenerateTypography: (
          res: Response<FontStyle[]>,
          rej: Response<string>
        ) => void;
        label: string;
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

    //#region Elements

    elements?: {
      image?: {
        imageZoom: boolean;
        imagePointer: boolean;
      };
      audio?: {
        backgroundPointer: boolean;
      };
      column?: {
        backgroundPointer: boolean;
      };
      menu?: {
        backgroundPointer: boolean;
      };
      sectionMegaMenu?: {
        backgroundPointer: boolean;
      };
      richText?: {
        backgroundPointer: boolean;
      };
      row?: {
        backgroundPointer: boolean;
      };
      section?: {
        backgroundPointer: boolean;
      };
      sectionFooter?: {
        backgroundPointer: boolean;
      };
      sectionHeader?: {
        backgroundPointer: boolean;
      };
      sectionPopup?: {
        backgroundPointer: boolean;
      };
      sectionPopup2?: {
        backgroundPointer: boolean;
      };
      story?: {
        backgroundPointer: boolean;
      };
      videoPlaylist?: {
        backgroundPointer: boolean;
      };
      video?: {
        backgroundPointer: boolean;
      };
    };

    //#endregion Elements

    //#region Prompts

    prompts?: {
      blockAdder?: {
        activeTab?: string;
        category?: string;
      };
    };

    //#endregion
  };

  //#endregion

  //#region DynamicContentOption

  dynamicContent?: DynamicContent<"wp"> | DynamicContent<"cloud">;

  //#endregion

  //#region Integrations

  integrations?: {
    form?: {
      showIntegrations?: boolean;
      action?: string;
      recaptcha?: {
        siteKey: string;
      };
      fields?: {
        label?: string;
        handler: (
          res: Response<Array<FormFieldsOption>>,
          rej: Response<string>
        ) => void;
      };
      tabs?: PromptFormTab[];
    };
    fonts?: {
      upload?: {
        get(res: Response<Array<UploadedFont>>, rej: Response<string>): void;
      };
    };
  };

  //#endregion

  //#region Events

  onStartLoad?: VoidFunction;

  onLoad?: VoidFunction;

  onAutoSave?: (res: AutoSave) => void;
  autoSaveInterval?: number;

  // Triggered when the user change the
  // pageData, globalBlocks or projectData
  onChange?: (res: OnChange) => void;

  // OnUpdate are triggered outside the editor when
  // the thirty party app want to update the page
  onUpdate: (res: Response<PublishData>, config?: ConfigCommon) => void;

  // `OnCompile` is triggered from outside the editor
  // when a third-party app wants to compile the page, ignoring
  // comparisons between the initial data and modified data.
  // `OnCompile` forces the page, project to compile, bypassing state comparisons.
  onCompile: (res: Response<PublishData>) => void;

  //#endregion

  //#region API

  api?: API;

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
      sizeType?: SizeType;
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
      component?: string;
    };
    ShopPosts?: {
      source?: string;
      querySource?: string;
      component?: string;
    };
  };

  //#endregion

  //#region Elements

  elements?: {
    form?: {
      inputTypes?: Array<FormInputTypesName>;
    };
    postExcerpt?: {
      predefinedPopulation?: boolean;
      sourceTypeOption?: boolean;
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

    video?: {
      types?: Array<VideoTypes>;
    };

    menu?: {
      onOpen?: VoidFunction;
      createMenuLabel?: string;
    };
  };

  //#endregion

  //#region modules

  modules?: {
    shop?: {
      type?: "shopify" | "ecwid";

      //#region Ecwid

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
      ecwidProductTypeId?: string;

      //#endregion

      //#region Shopify

      publishedPages?: number;
      maxPublishedPages?: number;
      upgradeToProUrl?: string;

      //#endregion

      api?: {
        //#region shopify api handlers

        getMetafields?: {
          handler: (
            res: Response<ChoicesSync>,
            rej: Response<string>,
            args: {
              slug: string;
            }
          ) => void;
        };

        //#endregion

        //#region ecwid api handlers

        getEcwidProducts?: {
          handler?: (
            res: Response<ChoicesSync>,
            rej: Response<string>,
            args: { id: string }
          ) => void;
        };

        //#endregion
      };
    };

    //#endregion

    ekklesia?: EkklesiaModules;

    //#endregion
  };

  urls?: UrlsCommon;
}

export type ConfigCommon = _ConfigCommon<Mode>;
