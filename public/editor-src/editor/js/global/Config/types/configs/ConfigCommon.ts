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
import { BlockTypes } from "visual/component/Prompts/PromptBlocks/types";
import { RuleList } from "visual/component/Prompts/PromptConditions/Rules/types";
import { Ref } from "visual/component/Prompts/PromptConditions/Rules/utils/api";
import {
  FontFile,
  UploadFont
} from "visual/component/Prompts/PromptFonts/api/types";
import { FormInputTypesName } from "visual/editorComponents/Form2/Form2Field/types";
import {
  EkklesiaFieldMap,
  EkklesiaKeys,
  EkklesiaParams
} from "visual/editorComponents/MinistryBrands/utils/types";
import { VideoTypes } from "visual/editorComponents/Video/types";
import {
  DynamicContent,
  GetPlaceholderData
} from "visual/global/Config/types/DynamicContent";
import { ImageDataSize } from "visual/global/Config/types/ImageSize";
import { PostTypesTax } from "visual/global/Config/types/PostTypesTax";
import { Taxonomy } from "visual/global/Config/types/Taxonomy";
import { UrlsCommon } from "visual/global/Config/types/Urls";
import { EcwidProductId, EcwidStoreId } from "visual/global/Ecwid/types";
import { CategoriesList } from "visual/libs/EcwidSdk/categories";
import { ProductsList } from "visual/libs/EcwidSdk/products";
import { UploadedFont } from "visual/types/Fonts";
import { GlobalBlock } from "visual/types/GlobalBlock";
import { Page, PageCommon } from "visual/types/Page";
import { Project } from "visual/types/Project";
import { Rule } from "visual/types/Rule";
import { FontStyle, Palette } from "visual/types/Style";
import {
  AdobeAddAccount,
  AdobeFonts,
  CollectionSourceItem,
  PostsSources,
  RulePostGroupList
} from "visual/utils/api/types";
import { Literal } from "visual/utils/types/Literal";
import { GetCollectionItem_collectionItem as CollectionItem } from "../../types/GetCollectionItem";
import { CollectionTypesInfo } from "../../types/Posts";
import { Authorisation } from "../Authorisation";
import { Form } from "../Form";
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

  template = "template",

  archive = "archive"
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
  more = "more",
  custom = "custom"
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

export interface LeftSidebarCustomType extends LeftSidebarOptionBase {
  type: LeftSidebarOptionsIds.custom;
  href?: string;
  onOpen?: (close: VoidFunction) => void;
  onClose?: VoidFunction;
  icon?: string;
}

export type LeftSidebarOption =
  | LeftSidebarCommonOption
  | LeftSidebarAddElementsType
  | LeftSidebarCustomType;

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

type BlockOutput = Partial<Output> & {
  id: string;
};

export type PublishedPage = Page & {
  compiled?: {
    rootClassNames?: Array<string>;
    rootAttributes?: Record<string, string | boolean>;
    blocks: Array<BlockOutput>;
  };
};

export interface PublishedGlobalBlock extends APIGlobalBlock {
  compiled?: {
    blocks: Array<BlockOutput>;
  };
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

export interface ExportBlockURLData {
  isPro: boolean;
  type: BlockTypes;
  id: string;
}

export interface Theme {
  colors: {
    "--ui-main-color"?: string; // UI main color
    "--active-color"?: string; // Highlight color
    "--icons-color"?: string; // Icons color
    "--toolbars-icons-separators"?: string; // Toolbar icons separators

    "--sidebar-background"?: string; // Sidebars left and right background
    "--sidebar-header"?: string; // Sidebars left and right headers
    "--sidebar-separators"?: string; // Sidebars separators
    "--borders"?: string; // Borders for the elements in the left sidebar

    "--inputs-bg"?: string; // All inputs background
    "--input-placeholder-text"?: string; // Placeholder default text in inputs
    "--text-labels"?: string; // Text labels

    "--column-lvl1-border"?: string; // Border for the lvl 1 column in the editor (optional)
    "--column-lvl2-border"?: string; // Border for the lvl 2 column in the editor (optional)
    "--row-and-default-elements-border"?: string; // Border for the row and default elements in the editor (optional)
    "--draggable-block-padding-bg"?: string; // Block top and bottom draggable padding in editor (optional)

    "--ui-shadows"?: string; // UI shadows for toolbars and sidebars
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

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
}

export interface CustomerGroup {
  id: string;
  name: string;
}

export interface ConditionalTypesData {
  collectionTypes: ConditionCollectionType[];
  customers: Customer[];
  customerGroups: CustomerGroup[];
}

export interface Media {
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
}

export interface API {
  // Used only in Posts(Migration) & GlobalBlocks PopupConditions
  /** @deprecated */
  brizyApiUrl?: string;

  //Authorisation
  authorisation?: Authorisation;

  //AI
  textAI?: {
    handler: (
      res: Response<string>,
      rej: Response<string>,
      data: { prompt: string; action?: string }
    ) => void;
  };

  // Media
  media?: Media;

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
    compileIconUrl?: string;
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
    getCollectionTypesInfo: {
      handler: (
        res: Response<CollectionTypesInfo>,
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
    getRulePostsGroupList: (
      res: Response<RulePostGroupList[]>,
      rej: Response<string>,
      data: {
        postType: string;
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

  block?: {
    getExportBlockUrl?: (data: ExportBlockURLData) => string;
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

  isRTL?: boolean;

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
    form?: Form;
    fonts?: {
      upload?: {
        get(res: Response<Array<UploadedFont>>, rej: Response<string>): void;
        upload(
          res: Response<UploadFont>,
          rej: Response<string>,
          data: {
            files: FontFile;
            name: string;
            id: string;
          }
        ): void;
        delete(
          res: Response<string>,
          rej: Response<string>,
          fontId: string
        ): void;
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
    menuSimple?: {
      getPlaceholderData?: GetPlaceholderData;
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

        searchEcwidProducts?: {
          handler?: (
            res: Response<ProductsList>,
            rej: Response<string>
          ) => void;
        };

        searchEcwidCategories?: {
          handler?: (
            res: Response<CategoriesList>,
            rej: Response<string>
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
