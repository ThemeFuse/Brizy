import { difference as diff } from "es-toolkit";
import {
  Choice,
  Value
} from "visual/component/Options/types/dev/MultiSelect2/types";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import {
  getAuthors,
  getPostTaxonomies,
  getPosts,
  getTermsBy
} from "visual/utils/api";
import * as Union from "visual/utils/reader/union";
import { isT } from "visual/utils/value";
import {
  QueryArgs,
  WPArchiveQuery,
  WPPostsQuery,
  WPQueryArgs,
  WPTaxQuery
} from "./types";

function split(s: string, sep: string): string[] {
  return s.split(sep).map((s) => s.trim());
}

export const authorsLoad =
  (config: ConfigCommon) =>
  async (value: Value, abortSignal?: AbortSignal): Promise<Choice[]> => {
    try {
      const include = value.map((v) => `${v}`);
      const authors = await getAuthors({ include, abortSignal, config });

      return authors.map(({ ID, display_name }) => ({
        title: display_name,
        value: String(ID)
      }));
    } catch (e) {
      if (process.env.NODE_ENV === "development") {
        // eslint-disable-next-line no-console
        console.log(e);
      }

      return [];
    }
  };

export const authorsSearch =
  (config: ConfigCommon) =>
  async (search: string, abortSignal?: AbortSignal): Promise<Choice[]> => {
    try {
      const authors = await getAuthors({ search, abortSignal, config });

      return authors.map(({ ID, display_name }) => ({
        title: display_name,
        value: String(ID)
      }));
    } catch (e) {
      if (process.env.NODE_ENV === "development") {
        // eslint-disable-next-line no-console
        console.log(e);
      }

      return [];
    }
  };

export const termsLoad =
  (config: ConfigCommon) =>
  async (value: Value, abortSignal?: AbortSignal): Promise<Choice[]> => {
    const valueParsed = value.map(
      (t) => split(`${t}`, ":") as [string, string] /* {taxonomy}:{term_id} */
    );

    try {
      const terms = await getTermsBy({
        include: valueParsed,
        abortSignal,
        config
      });

      return terms.map(({ term_id, name, taxonomy, taxonomy_name }) => ({
        title: `${name} (${taxonomy_name})`,
        value: taxonomy + ":" + term_id
      }));
    } catch (e) {
      if (process.env.NODE_ENV === "development") {
        // eslint-disable-next-line no-console
        console.log(e);
      }

      return [];
    }
  };

export const termsSearch =
  (config: ConfigCommon) =>
  async (search: string, abortSignal?: AbortSignal): Promise<Choice[]> => {
    try {
      const terms = await getTermsBy({ search, abortSignal, config });

      return terms.map(({ term_id, name, taxonomy, taxonomy_name }) => ({
        title: `${name} (${taxonomy_name})`,
        value: taxonomy + ":" + term_id
      }));
    } catch (e) {
      if (process.env.NODE_ENV === "development") {
        // eslint-disable-next-line no-console
        console.log(e);
      }

      return [];
    }
  };

export const manualLoad =
  (postType: string[], excludePostType: string[], config: ConfigCommon) =>
  async (value: Value, abortSignal?: AbortSignal): Promise<Choice[]> => {
    try {
      const include = value.map((v) => `${v}`);
      const posts = await getPosts({
        include,
        abortSignal,
        postType,
        excludePostType,
        config
      });

      return posts.map(({ ID, title }) => ({
        title,
        value: String(ID)
      }));
    } catch (e) {
      if (process.env.NODE_ENV === "development") {
        // eslint-disable-next-line no-console
        console.log(e);
      }

      return [];
    }
  };

export const manualSearch =
  (postType: string[], excludePostType: string[], config: ConfigCommon) =>
  async (search: string, abortSignal?: AbortSignal): Promise<Choice[]> => {
    try {
      const posts = await getPosts({
        search,
        abortSignal,
        postType,
        excludePostType,
        config
      });

      return posts.map(({ ID, title }) => ({
        title,
        value: String(ID)
      }));
    } catch (e) {
      if (process.env.NODE_ENV === "development") {
        // eslint-disable-next-line no-console
        console.log(e);
      }

      return [];
    }
  };

export const tagsFilterLoad =
  (value: string, config: ConfigCommon) =>
  async (abortSignal?: AbortSignal): Promise<Choice[]> => {
    try {
      const taxonomies = await getPostTaxonomies({
        taxonomy: value,
        abortSignal,
        config
      });
      // select only tags
      const tags = taxonomies.filter(
        (taxonomy) => taxonomy.public && taxonomy.name !== "post_format"
      );

      return tags.map(({ name, labels }) => ({
        title: `${labels.name}`,
        value: name
      }));
    } catch (e) {
      if (process.env.NODE_ENV === "development") {
        // eslint-disable-next-line no-console
        console.log(e);
      }

      return [];
    }
  };

function parseTerms(terms: string[]): [string, string][] {
  return terms
    .map((termTaxonomy) => {
      const [taxonomy, term] = termTaxonomy.split(":");

      return taxonomy !== undefined &&
        taxonomy !== "" &&
        term !== undefined &&
        term !== ""
        ? ([taxonomy, term] as [string, string])
        : undefined;
    })
    .filter(isT);
}

function normalizeOrderBy(orderBy: string): string {
  return orderBy === "id" ? "ID" : orderBy;
}

export function postsQuery(v: QueryArgs): WPPostsQuery {
  const { count, type, source, offset, orderBy, order, symbols } = v;

  const query: WPQueryArgs = {
    post_status: "publish",
    post_type: type === "products" ? "product" : source,
    posts_per_page: count,
    ignore_sticky_posts: 1
  };

  const excBy = symbols[`${source}_excBy`] ?? [];
  const excManual = symbols[`${source}_exc_manual`] ?? [];
  const excAuthor = symbols[`${source}_exc_author`] ?? [];
  const excTerm = symbols[`${source}_exc_term`] ?? [];

  const incBy = symbols[`${source}_incBy`] ?? [];
  const incManual_ = symbols[`${source}_inc_manual`] ?? [];
  const incManual = excBy.includes("manual")
    ? diff(incManual_, excManual)
    : incManual_;
  const incAuthor_ = symbols[`${source}_inc_author`] ?? [];
  const incAuthor = excBy.includes("author")
    ? diff(incAuthor_, excAuthor)
    : incAuthor_;
  const incTerm_ = symbols[`${source}_inc_term`] ?? [];
  const incTerm = excBy.includes("term") ? diff(incTerm_, excTerm) : incTerm_;

  if (incBy.includes("manual") && incManual.length > 0) {
    query.post__in = incManual;
  }
  if (excBy.includes("manual") && excManual.length > 0) {
    query.post__not_in = excManual;
  }

  if (incBy.includes("author") && incAuthor.length > 0) {
    query.author__in = incAuthor;
  }
  if (excBy.includes("author") && excAuthor.length > 0) {
    query.author__not_in = excAuthor;
  }

  const hasIncTerms = incBy.includes("term") && incTerm.length > 0;
  const hasExcTerms = excBy.includes("term") && excTerm.length > 0;
  if (hasIncTerms || hasExcTerms) {
    let includeQuery: WPTaxQuery | undefined = undefined;
    let excludeQuery: WPTaxQuery | undefined = undefined;

    if (hasIncTerms) {
      includeQuery = {
        relation: "OR"
      };

      let index = 0;
      for (const [taxonomy, terms] of parseTerms(incTerm)) {
        includeQuery[index++] = {
          taxonomy,
          field: "term_id",
          terms
        };
      }
    }

    if (hasExcTerms) {
      excludeQuery = {
        relation: "AND"
      };

      let index = 0;
      for (const [taxonomy, terms] of parseTerms(excTerm)) {
        excludeQuery[index++] = {
          taxonomy,
          field: "term_id",
          terms,
          operator: "NOT IN"
        };
      }
    }

    if (includeQuery && excludeQuery) {
      query.tax_query = {
        relation: "AND",
        0: includeQuery,
        1: excludeQuery
      };
    } else if (includeQuery && !excludeQuery) {
      query.tax_query = [includeQuery];
    } else if (!includeQuery && excludeQuery) {
      query.tax_query = [excludeQuery];
    }
  }

  if (orderBy) {
    query.orderby = normalizeOrderBy(orderBy);
  }

  if (order) {
    query.order = order;
  }

  const attr: WPPostsQuery = {
    query
  };

  if (offset > 0) {
    attr.offset = offset;
  }

  return attr;
}

export function archiveQuery(v: QueryArgs): WPArchiveQuery {
  const { orderBy, offset, count, order } = v;

  const attr: WPArchiveQuery = {
    count,
    orderby: normalizeOrderBy(orderBy || "id"),
    order:
      Union.readWithChoices<WPArchiveQuery["order"]>(["ASC", "DESC"])(order) ??
      "DESC"
  };

  if (offset > 0) {
    attr.offset = offset;
  }

  return attr;
}

// is needed to pass webpack warnings
export const createFieldCollectionId = (): string => "";

export * from "./utils.common";
