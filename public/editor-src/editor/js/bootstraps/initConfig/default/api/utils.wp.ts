import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";

export function request(
  url: string,
  config: RequestInit = {}
): Promise<Response> {
  // will see later if we'll have to hardcode
  // some settings into config like we do for brizy cloud
  // In WP referer must be root window not iframe
  const { fetch } = window.parent || window;
  return fetch(url, config);
}

export type GetPosts = (
  data: {
    search?: string;
    include?: string[];
    postType?: string[];
    excludePostType?: string[];
    abortSignal?: AbortSignal;
  },
  config: ConfigCommon
) => Promise<{ ID: number; title: string; permalink: string }[]>;

export const getPosts: GetPosts = async (
  { include, search = "", postType, excludePostType, abortSignal },
  config
) => {
  const {
    api: { url, hash, searchPosts }
    // @ts-expect-error: Temporary
  } = config.wp;
  const version = config.editorVersion;
  const body = new URLSearchParams({
    hash,
    version,
    action: searchPosts
  });

  if (search !== "") {
    body.append("search", search);
  }
  if (include !== undefined) {
    for (const i of include) {
      body.append("include[]", i);
    }
  }
  if (postType !== undefined) {
    for (const p of postType) {
      body.append("post_type[]", p);
    }
  }
  if (excludePostType !== undefined) {
    for (const p of excludePostType) {
      body.append("exclude_post_type[]", p);
    }
  }

  const r = await request(url, {
    method: "POST",
    body,
    signal: abortSignal
  });
  const rj = await r.json();

  if (rj.success) {
    return rj.data;
  } else {
    throw rj;
  }
};
