import { DynamicContent } from "../DynamicContent";
import { Pro } from "../Pro";
import { User } from "../User";
import { Urls } from "../Urls";
import { Project } from "../Project";
import { Config } from "visual/global/Config/types";
import { ConfigCommon } from "./ConfigCommon";
import { Rule } from "../Rule";

export interface Prop {
  [k: string]: unknown;

  ruleMatches: Rule[];
  postType: string;
  postTypes: { name: string; label: string }[];
}

export interface WP extends ConfigCommon {
  branding: {
    brizy: string;
  };
  dynamicContent: DynamicContent<"wp">;
  pro: Pro<"wp">;
  user: User<"wp">;
  urls: Urls<"wp">;
  project: Project<"wp">;

  wp: Prop;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const isWp = (config: Config): config is WP => TARGET === "WP";
