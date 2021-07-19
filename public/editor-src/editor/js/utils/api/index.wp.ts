export * from "./index-legacy";

import Config from "visual/global/Config";
import { persistentRequest, request2 } from "./index-legacy";
import * as Obj from "visual/utils/reader/object";
import * as Arr from "visual/utils/reader/array";
import * as Str from "visual/utils/reader/string";

import {
  CreateSavedLayout,
  CreateSavedBlock,
  CreateScreenshot,
  DeleteSavedLayoutById,
  DeleteSavedBlockById,
  GetSavedLayoutById,
  GetSavedLayoutsMeta,
  GetSavedBlockById,
  GetSavedBlocksMeta,
  UpdateScreenshot,
  GetAuthors,
  GetTermsBy,
  GetTerms,
  GetPosts,
  GetDynamicContent,
  GetPostTaxonomies
} from "./types";
import {
  makeBlockMeta,
  parseMetaSavedBlock,
  parseSavedBlock,
  parseSavedLayout,
  stringifySavedBlock
} from "./adapter";

// dynamic content

export const getDynamicContent: GetDynamicContent = async ({
  placeholders,
  signal
}) => {
  const {
    api: { url, hash, placeholdersContent }
  } = Config.get("wp");
  const version = Config.get("editorVersion");
  const body = new URLSearchParams({
    hash,
    version,
    action: placeholdersContent
  });

  for (const [postId, placeholders_] of Object.entries(placeholders)) {
    if (placeholders_) {
      for (const p of placeholders_) {
        body.append(`p[${postId}][]`, p);
      }
    }
  }

  const r = await request2(url, {
    method: "POST",
    body,
    signal
  });

  if (!r.ok) {
    throw new Error("fetch dynamic content error");
  }

  const { data } = await r.json();

  if (data === undefined || data.placeholders === undefined) {
    throw new Error("fetch dynamic content error");
  }

  const dc = Obj.readWithValueReader(Arr.readWithItemReader(Str.read))(
    data.placeholders
  );

  if (dc === undefined) {
    throw new Error("fetch dynamic content error");
  }

  return dc;
};

// screenshots

export const createBlockScreenshot: CreateScreenshot = ({
  base64,
  blockType
}) => {
  const {
    page,
    api: { url, hash, createBlockScreenshot }
  } = Config.get("wp");
  const version = Config.get("editorVersion");
  const attachment = base64.replace(/data:image\/.+;base64,/, "");

  return request2(url, {
    method: "POST",
    body: new URLSearchParams({
      action: createBlockScreenshot,
      post: page,
      version,
      hash,
      block_type: blockType, // eslint-disable-line @typescript-eslint/camelcase
      ibsf: attachment // ibsf - image base64
    })
  })
    .then(r => r.json())
    .then(rj => {
      if (rj.success) {
        return rj.data;
      }

      throw rj;
    });
};

export const updateBlockScreenshot: UpdateScreenshot = ({
  id,
  base64,
  blockType
}) => {
  const {
    page,
    api: { url, hash, updateBlockScreenshot }
  } = Config.get("wp");
  const version = Config.get("editorVersion");
  const attachment = base64.replace(/data:image\/.+;base64,/, "");

  return request2(url, {
    method: "POST",
    body: new URLSearchParams({
      action: updateBlockScreenshot,
      post: page,
      version,
      hash,
      block_type: blockType, // eslint-disable-line @typescript-eslint/camelcase
      id,
      ibsf: attachment
    })
  })
    .then(r => r.json())
    .then(rj => {
      if (rj.success) {
        return rj.data;
      }

      throw rj;
    });
};

// saved blocks

export const getSavedBlocks: GetSavedBlocksMeta = () => {
  const { getSavedBlockList } = Config.get("wp").api;

  return persistentRequest({
    type: "POST",
    dataType: "json",
    data: {
      action: getSavedBlockList,
      fields: ["uid", "meta", "synchronized", "synchronizable"]
    }
  }).then(({ data }) => data.map(parseMetaSavedBlock));
};

export const getSavedBlockById: GetSavedBlockById = uid => {
  const { getSavedBlockByUid } = Config.get("wp").api;

  return persistentRequest({
    type: "POST",
    dataType: "json",
    data: { uid, action: getSavedBlockByUid }
  }).then(({ data }) => parseSavedBlock(data));
};

export const createSavedBlock: CreateSavedBlock = savedBlock => {
  const { createSavedBlock } = Config.get("wp").api;
  const { uid, data, dataVersion, meta } = stringifySavedBlock(savedBlock);
  const media = makeBlockMeta(savedBlock);

  return persistentRequest({
    type: "POST",
    dataType: "json",
    data: {
      uid,
      data,
      meta,
      media,
      dataVersion,
      action: createSavedBlock
    }
  });
};

export const deleteSavedBlock: DeleteSavedBlockById = uid => {
  const { deleteSavedBlock } = Config.get("wp").api;

  return persistentRequest({
    type: "POST",
    dataType: "json",
    data: { uid, action: deleteSavedBlock }
  });
};

// saved layouts

export const getSavedLayouts: GetSavedLayoutsMeta = () => {
  const { getLayoutList } = Config.get("wp").api;

  return persistentRequest({
    type: "POST",
    dataType: "json",
    data: {
      action: getLayoutList,
      fields: ["uid", "meta", "synchronized", "synchronizable"]
    }
  }).then(({ data }) => data.map(parseMetaSavedBlock));
};

export const getSavedLayoutById: GetSavedLayoutById = uid => {
  const { getLayoutByUid } = Config.get("wp").api;

  return persistentRequest({
    type: "POST",
    dataType: "json",
    data: { uid, action: getLayoutByUid }
  }).then(({ data }) => parseSavedLayout(data));
};

export const createSavedLayout: CreateSavedLayout = savedLayout => {
  const { createLayout } = Config.get("wp").api;
  const { data, dataVersion, uid, meta } = stringifySavedBlock(savedLayout);
  const media = makeBlockMeta(savedLayout);

  return persistentRequest({
    type: "POST",
    dataType: "json",
    data: {
      uid,
      data,
      meta,
      media,
      dataVersion,
      action: createLayout
    }
  });
};

export const deleteSavedLayout: DeleteSavedLayoutById = uid => {
  const { deleteLayout } = Config.get("wp").api;

  return persistentRequest({
    type: "POST",
    dataType: "json",
    data: { uid, action: deleteLayout }
  });
};

export const getAuthors: GetAuthors = async ({
  include = [],
  search = "",
  abortSignal
} = {}) => {
  const {
    api: { url, hash, getUsers }
  } = Config.get("wp");
  const version = Config.get("editorVersion");
  const body = new URLSearchParams({
    hash,
    version,
    action: getUsers
  });

  if (search !== "") {
    body.append("search", search);
  }
  for (const i of include) {
    body.append("include[]", i);
  }

  const r = await request2(url, {
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

export const getTerms: GetTerms = async taxonomy => {
  const { url, hash, getTerms } = Config.get("wp").api;
  const version = Config.get("editorVersion");

  return request2(url, {
    method: "POST",
    body: new URLSearchParams({ hash, version, taxonomy, action: getTerms })
  })
    .then(r => r.json())
    .then(({ data }) => data);
};

export const getTermsBy: GetTermsBy = async ({
  include = [],
  search = "",
  abortSignal
} = {}) => {
  const {
    api: { url, hash, getTermsBy }
  } = Config.get("wp");
  const version = Config.get("editorVersion");
  const body = new URLSearchParams({
    hash,
    version,
    action: getTermsBy
  });

  if (search !== "") {
    body.append("search", search);
  }
  for (let i = 0; i < include.length; i++) {
    const [taxonomy, termId] = include[i];

    body.append("taxonomy[]", taxonomy);
    body.append("include[]", termId);
  }

  const r = await request2(url, {
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

export const getPosts: GetPosts = async ({
  include,
  search = "",
  postType,
  excludePostType,
  abortSignal
} = {}) => {
  const {
    api: { url, hash, searchPosts }
  } = Config.get("wp");
  const version = Config.get("editorVersion");
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

  const r = await request2(url, {
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

export const getPostTaxonomies: GetPostTaxonomies = async ({
  taxonomy,
  abortSignal
}) => {
  const { url, hash, getPostTaxonomies } = Config.get("wp").api;
  const version = Config.get("editorVersion");

  return request2(url, {
    method: "POST",
    body: new URLSearchParams({
      hash,
      version,
      // eslint-disable-next-line @typescript-eslint/camelcase
      post_type: taxonomy,
      action: getPostTaxonomies
    }),
    signal: abortSignal
  })
    .then(r => r.json())
    .then(({ data }) => data);
};
