import { ElementModel } from "visual/component/Elements/Types";
import { ImageDataSize } from "visual/global/Config/types/ImageSize";
import { PostTypesTax } from "visual/global/Config/types/PostTypesTax";
import { Taxonomy } from "visual/global/Config/types/Taxonomy";
import { PageCommon, Project } from "visual/types";

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
}

export interface UpdateRes {
  pageData: PageCommon;
  projectData: Project;
}

interface _ConfigCommon<Mode> {
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
  };

  //#endregion

  //#region Events

  onLoad?: VoidFunction;

  onUpdate: (res: UpdateRes, config?: ConfigCommon) => void;

  //#endregion
}

export type ConfigCommon = _ConfigCommon<Mode>;
