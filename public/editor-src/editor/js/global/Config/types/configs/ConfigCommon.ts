import { ElementModel } from "visual/component/Elements/Types";
import { Post } from "visual/component/Options/types/dev/InternalLink/types/Post";
import {
  ChoicesAsync,
  ChoicesSync
} from "visual/component/Options/types/dev/Select/types";
import { DynamicContent } from "visual/global/Config/types/DynamicContent";
import { ImageDataSize } from "visual/global/Config/types/ImageSize";
import { PostTypesTax } from "visual/global/Config/types/PostTypesTax";
import { Taxonomy } from "visual/global/Config/types/Taxonomy";
import { ShopifyTemplate } from "visual/global/Config/types/shopify/ShopifyTemplate";
import { PageCommon, Project, SavedBlock, SavedLayout } from "visual/types";
import { Literal } from "visual/utils/types/Literal";
import {
  AddFileData,
  AddFileExtra,
  AddImageData,
  AddImageExtra,
  Response
} from "./common";

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

export interface UpdateRes {
  pageData: PageCommon;
  projectData: Project;
}

export interface PublishData {
  // TODO  Currently only projectData is used
  //  Need to add pageData and globalBlocks
  projectData?: Project;
  is_autosave: 1 | 0;
  // pageData: PageCommon;
  // globalBlocks: Array<GlobalBlock>;
}

export interface AutoSave {
  // TODO  Currently only projectData is used
  //  Need to add pageData and globalBlocks
  projectData: Project;
  // pageData: PageCommon;
  // globalBlocks: Array<GlobalBlock>;
}

export interface OnChange {
  // TODO  Currently only projectData is used
  //  Need to add pageData and globalBlocks
  projectData: Project;
  // pageData: PageCommon;
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

export const isElementTypes = (type: string): type is ElementTypes => {
  return Object.values(ElementTypes).includes(type as ElementTypes);
};

export enum ElementTypes {
  Image = "Image",
  Map = "Map",
  Video = "Video",
  ImageGallery = "ImageGallery",
  Quantity = "Quantity",
  ProductMetafield = "ProductMetafield",
  BlogPostMeta = "BlogPostMeta",
  Price = "Price",
  Posts = "Posts",
  ProductList = "ProductList",
  CollectionList = "CollectionList",
  BlogPostList = "BlogPostList"
}

//#region Base Saved Block

type SyncBlock<T> = T & {
  synchronizable: boolean;
  synchronized: boolean;
  isCloudEntity: boolean;
};
type WithUid<T> = T & { uid: string };
type Filters = Array<{ id: string; label: string }>;

//#endregion

//#region Saved Block

export type SavedBlockAPI = SyncBlock<WithUid<SavedBlock>>;
export type SavedBlockAPIMeta = Omit<SavedBlockAPI, "data">;
interface SavedBlockExtra {
  uid: string;
}
export type UpdateSavedBlock = WithUid<
  Pick<SavedBlock, "dataVersion" | "tags" | "title">
>;
export type DeleteSavedBlock = WithUid<Pick<SavedBlock, "dataVersion">>;

export interface SavedBlockImport {
  success: Array<WithUid<SavedBlock>>;
  errors: Array<{ uid: string; message: string }>;
}

export interface CreatedSavedBlock extends SavedBlock {
  uid: string;
  media: {
    images: Array<string>;
    uploads: Array<string>;
    fonts: Array<string>;
  };
}

export interface CreateSavedBlock {
  block: CreatedSavedBlock;
  is_autosave: 1 | 0;
}

export type SavedBlockFilter = Filters;

//#endregion

//#region Saved Layout

export type SavedLayoutAPI = SyncBlock<WithUid<SavedLayout>>;
export type SavedLayoutAPIMeta = Omit<SavedLayoutAPI, "data">;
export type UpdateSavedLayout = WithUid<
  Pick<SavedLayout, "dataVersion" | "tags" | "title">
>;
export type DeleteSavedLayout = WithUid<Pick<SavedLayout, "dataVersion">>;

export interface SavedLayoutImport {
  success: Array<WithUid<SavedLayout>>;
  errors: Array<{ uid: string; message: string }>;
}

export interface CreatedSavedLayout extends SavedLayout {
  uid: string;
  media: {
    images: Array<string>;
    uploads: Array<string>;
    fonts: Array<string>;
  };
}

export interface CreateSavedLayout {
  block: CreatedSavedLayout;
  is_autosave: 1 | 0;
}

export type SavedLayoutFilter = Filters;

//#endregion

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
    };

    //#endregion

    theme?: Theme;

    //#region Help

    help?: {
      showIcon?: boolean;
    };

    //#endregion

    //#region Publish

    publish: {
      label?: string;
      handler: (
        res: Response<PublishData>,
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
  onUpdate: (res: Response<UpdateRes>, config?: ConfigCommon) => void;

  //#endregion

  //#region API

  api?: {
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

    // Link Pages
    linkPages?: {
      label?: string;
      defaultSelected?: string;
      handler: (res: Response<Post[]>, rej: Response<string>) => void;
      handlerSearch: (
        res: Response<Post[]>,
        rej: Response<string>,
        args: {
          id: string;
          search: string;
        }
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
    };

    // SavedBlocks
    savedBlocks?: {
      get?: (
        res: Response<Array<SavedBlockAPIMeta>>,
        rej: Response<string>,
        extra?: { filterBy: string }
      ) => void;
      getByUid?: (
        res: Response<SavedBlock>,
        rej: Response<string>,
        extra: SavedBlockExtra
      ) => void;
      create?: (
        res: Response<SavedBlock>,
        rej: Response<string>,
        extra: CreateSavedBlock
      ) => void;
      update?: (
        res: Response<UpdateSavedBlock>,
        rej: Response<string>,
        extra: UpdateSavedBlock
      ) => void;
      delete?: (
        res: Response<DeleteSavedBlock>,
        rej: Response<string>,
        extra: DeleteSavedBlock
      ) => void;
      import?: (res: Response<SavedBlockImport>, rej: Response<string>) => void;
      filter?: {
        label?: string;
        defaultSelected?: string;
        handler: (
          res: Response<SavedBlockFilter>,
          ref: Response<string>
        ) => void;
      };
    };

    // SavedLayouts
    savedLayouts?: {
      get?: (
        res: Response<Array<SavedLayoutAPIMeta>>,
        rej: Response<string>,
        extra?: { filterBy: string }
      ) => void;
      getByUid?: (
        res: Response<SavedLayout>,
        rej: Response<string>,
        extra: SavedBlockExtra
      ) => void;
      create?: (
        res: Response<SavedLayout>,
        rej: Response<string>,
        extra: CreateSavedLayout
      ) => void;
      update?: (
        res: Response<UpdateSavedLayout>,
        rej: Response<string>,
        extra: UpdateSavedLayout
      ) => void;
      delete?: (
        res: Response<DeleteSavedLayout>,
        rej: Response<string>,
        extra: DeleteSavedLayout
      ) => void;
      import?: (
        res: Response<SavedLayoutImport>,
        rej: Response<string>
      ) => void;
      filter?: {
        label?: string;
        defaultSelected?: string;
        handler: (
          res: Response<SavedLayoutFilter>,
          ref: Response<string>
        ) => void;
      };
    };

    // SavedPopups
    savedPopups?: {
      get?: (
        res: Response<Array<SavedBlockAPIMeta>>,
        rej: Response<string>,
        extra?: { filterBy: string }
      ) => void;
      getByUid?: (
        res: Response<SavedBlock>,
        rej: Response<string>,
        extra: SavedBlockExtra
      ) => void;
      create?: (
        res: Response<SavedBlock>,
        rej: Response<string>,
        extra: CreateSavedBlock
      ) => void;
      update?: (
        res: Response<UpdateSavedBlock>,
        rej: Response<string>,
        extra: UpdateSavedBlock
      ) => void;
      delete?: (
        res: Response<DeleteSavedBlock>,
        rej: Response<string>,
        extra: DeleteSavedBlock
      ) => void;
      import?: (res: Response<SavedBlockImport>, rej: Response<string>) => void;
      filter?: {
        label?: string;
        defaultSelected?: string;
        handler: (
          res: Response<SavedBlockFilter>,
          ref: Response<string>
        ) => void;
      };
    };
  };

  //#endregion

  //#region contentDefaults

  contentDefaults?: {
    Quantity?: {
      linkSource?: string;
    };
    Price?: {
      sourceType?: ShopifyTemplate.Product;
    };
    ProductMetafield?: {
      linkSource: string;
    };
    BlogPostMeta?: {
      linkSource?: string;
    };
    ProductList?: {
      type?: string;
      source?: ShopifyTemplate.Product;
      showSource?: boolean;
      orderBy?: string;
      order?: string;
      excludeCurrentProductOption?: boolean;
    };
    CollectionList?: {
      type?: string;
      source?: ShopifyTemplate.Collection;
      showSource?: boolean;
      orderBy?: string;
      order?: string;
    };
    BlogPostList?: {
      type?: string;
      source?: ShopifyTemplate.Article;
      showSource?: boolean;
      orderBy?: string;
      order?: string;
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

    header?: {
      multilanguage: boolean;
    };

    posts?: {
      includeQueryMultiOptions?: boolean;
      exclude?: boolean;
      offset?: boolean;
      orderBy?: boolean;
      order?: boolean;
    };
  };

  //#endregion
}

export type ConfigCommon = _ConfigCommon<Mode>;
