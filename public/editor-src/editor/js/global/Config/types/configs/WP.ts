import { Config } from "../index";
import { ConfigCommon } from "./ConfigCommon";
import { DynamicContent } from "../DynamicContent";
import { Pro } from "../Pro";
import { User } from "../User";
import { Urls } from "../Urls";
import { Project } from "../Project";
import { TemplateType } from "../TemplateType";
import { Rule } from "../Rule";
import { Role } from "visual/utils/membership";

export interface Prop {
  [k: string]: unknown;

  templates: { id: string; title: string }[];
  ruleMatches: Rule[];
  postType: string;
  postTypes: { name: string; label: string }[];
  hasSidebars: boolean;
  plugins: Record<string, unknown>;
  api: {
    [k: string]: unknown;
    url: string;
    hash: string;
    getSavedBlockList: string;
    getSavedBlockByUid: string;
    uploadBlocks: string;
    downloadBlocks: string;
    downloadLayouts: string;
    getPostObjects: string;

    // TODO: need completed it
  };

  availableRoles: Role[];
}

export interface WP extends ConfigCommon {
  prefix?: string;
  dynamicContent: DynamicContent<"wp">;
  pro?: Pro<"wp">;
  user: User<"wp">;
  urls: Urls<"wp">;
  project: Project<"wp">;
  template_type?: TemplateType;

  wp: Prop;
}

// @ts-expect-error: unused variable
export const isWp = (config: Config): config is WP => TARGET === "WP";
