import { Taxonomy } from "visual/global/Config/types/Taxonomy";
import { PostTypesTax } from "visual/global/Config/types/PostTypesTax";
import { ImageDataSize } from "visual/global/Config/types/ImageSize";
import { ElementModel } from "visual/component/Elements/Types";

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

export interface ConfigCommon {
  branding: {
    name: string;
  };
  editorVersion: string;
  mode?: string; // add literal type "page" | ...smth else

  taxonomies: Taxonomy[]; // is this property common or just wp?
  postTypesTaxs: PostTypesTax[]; // is this property common or just wp?

  imageSizes: ImageDataSize[];

  server: {
    maxUploadFileSize: number;
  };

  menusConfig?: {
    id: string;
    items: MenuItem[];
  }[];
}
