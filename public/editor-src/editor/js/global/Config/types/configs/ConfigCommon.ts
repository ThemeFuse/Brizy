import { ElementModel } from "visual/component/Elements/Types";
import { Post } from "visual/component/Options/types/dev/InternalLink/types/Post";
import {
  ChoicesAsync,
  ChoicesSync
} from "visual/component/Options/types/dev/Select/types";
import { ImageDataSize } from "visual/global/Config/types/ImageSize";
import { PostTypesTax } from "visual/global/Config/types/PostTypesTax";
import { Taxonomy } from "visual/global/Config/types/Taxonomy";
import { PageCommon, Project } from "visual/types";
import { DynamicContentOption } from "../DynamicContent";
import { Response } from "./common";

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

export interface PopupSettings {
  displayCondition?: boolean;
  deletePopup?: boolean;
  embedded?: boolean;
  horizontalAlign?: boolean;
  verticalAlign?: boolean;
  scrollPageBehind?: boolean;
  clickOutsideToClose?: boolean;
}

export interface UpdateRes {
  pageData: PageCommon;
  projectData: Project;
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
  };
}

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

  menusConfig?: {
    id: string;
    items: MenuItem[];
  }[];

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
        options?: Array<{
          type: string;
          label: string;
          link: string;
          icon?: string;
          linkTarget?: "_blank" | "_self" | "_parent" | "_top";
          roles?: Array<string>;
        }>;
      };
    };

    //#endregion
    theme?: Theme;
  };

  //#endregion

  //#region DynamicContentOption

  dynamicContentOption?: DynamicContentOption;

  //#endregion

  //#region Events

  onLoad?: VoidFunction;

  onUpdate: (res: UpdateRes, config?: ConfigCommon) => void;

  //#endregion

  //#region API

  api?: {
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
  };

  //#endregion
}

export type ConfigCommon = _ConfigCommon<Mode>;
