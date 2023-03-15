import { Role } from "visual/utils/membership";
import { DynamicContent } from "../DynamicContent";
import { Module } from "../Module";
import { Pro } from "../Pro";
import { Project } from "../Project";
import { Rule } from "../Rule";
import { TemplateType } from "../TemplateType";
import { Urls } from "../Urls";
import { User } from "../User";
import { Config } from "../index";
import { ConfigCommon } from "./ConfigCommon";

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

    createSavedBlock: string;
    deleteSavedBlock: string;
    getSavedBlockList: string;
    getSavedBlockByUid: string;
    downloadBlocks: string;

    createLayout: string;
    getLayoutList: string;
    getLayoutByUid: string;
    deleteLayout: string;
    uploadBlocks: string;
    downloadLayouts: string;

    getPostObjects: string;
    getMediaUid: string;
    setFeaturedImage: string;
    setFeaturedImageFocalPoint: string;
    removeFeaturedImage: string;
    getSidebars: string;
    shortcodeContent: string;
    getMenus: string;
    getFonts: string;
    getAttachmentUid: string;
    getRuleGroupList: string;
    rulePostsGroupList: string;

    // TODO: need completed it
  };

  availableRoles: Role[];
  page: string;
  l10n?: Record<string, string>;
}

export interface WP extends ConfigCommon {
  prefix?: string;
  dynamicContent: DynamicContent<"wp">;
  pro?: Pro<"wp">;
  user: User<"wp">;
  urls: Urls<"wp">;
  project: Project<"wp">;
  template_type?: TemplateType;
  modules: Module<"wp">;
  wp: Prop;
}

// @ts-expect-error: unused variable
export const isWp = (config: Config): config is WP => TARGET === "WP";
