import type { Role } from "visual/utils/membership";
import type { DynamicContent } from "../DynamicContent";
import type { Module } from "../Module";
import type { Rule } from "../Rule";
import type { TemplateType } from "../TemplateType";
import type { Urls } from "../Urls";
import type { ConfigCommon } from "./ConfigCommon";

type Term = {
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
};
export interface Prop {
  [k: string]: unknown;

  templates: { id: string; title: string }[];
  ruleMatches: Rule[];
  postAuthor: number;
  postTerms: Term[];
  postTermParents: Term[];
  postType: string;
  postTypes: { name: string; label: string }[];
  postLoopSources: { name: string; label: string }[];
  hasSidebars: boolean;
  plugins: Record<string, unknown>;
  api: {
    [k: string]: unknown;
    url: string;
    hash: string;

    getProject: string;
    setProject: string;

    getPage: string;
    updatePage: string;

    getGlobalBlockList: string;
    createGlobalBlock: string;
    updateGlobalBlock: string;
    updateGlobalBlocks: string;

    downloadBlocks: string;
    downloadLayouts: string;

    getPostObjects: string;
    getMediaUid: string;
    setFeaturedImage: string;
    setFeaturedImageFocalPoint: string;
    removeFeaturedImage: string;
    getSidebars: string;
    shortcodeContent: string;
    getFonts: string;
    getAttachmentUid: string;
    getRuleGroupList: string;
    rulePostsGroupList: string;

    // TODO: need completed it
  };

  availableRoles: Role[];
  page: string;
}

export interface WP extends ConfigCommon {
  prefix?: string;
  dynamicContent?: DynamicContent<"wp">;
  urls: Urls<"wp">;
  template_type?: TemplateType;
  modules: Module<"wp">;
  wp: Prop;
}

export const isWp = (_config: ConfigCommon): _config is WP => TARGET === "WP";
