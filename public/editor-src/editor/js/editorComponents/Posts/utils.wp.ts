/* eslint-disable @typescript-eslint/camelcase */
import { difference as diff } from "underscore";
import { isT } from "visual/utils/value";
import * as Union from "visual/utils/reader/union";
import {
  WPQueryArgs,
  WPTaxQuery,
  V,
  WPArchiveQuery,
  WPQuery,
  WPPostsQuery
} from "./types";
import { decodeV } from "./utils.common";

function parseTerms(terms: string[]): [string, string][] {
  return terms
    .map(termTaxonomy => {
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

function postsQuery(v: V): WPPostsQuery {
  const {
    gridRow,
    gridColumn,
    type,
    source,
    offset,
    orderBy,
    order,
    symbols
  } = decodeV(v);

  const query: WPQueryArgs = {
    post_status: "publish",
    post_type: type === "products" ? "product" : source,
    posts_per_page:
      gridRow !== 0 && gridColumn !== 0 ? gridRow * gridColumn : -1,
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
    let includeQuery: WPTaxQuery | undefined;
    let excludeQuery: WPTaxQuery | undefined;

    if (hasIncTerms) {
      includeQuery = {
        relation: "OR"
      };

      let index = 0;
      for (const [taxonomy, terms] of parseTerms(incTerm)) {
        includeQuery[index++] = {
          taxonomy,
          field: "id",
          terms
        };
      }
    }

    if (hasExcTerms) {
      excludeQuery = {
        relation: "OR"
      };

      let index = 0;
      for (const [taxonomy, terms] of parseTerms(excTerm)) {
        excludeQuery[index++] = {
          taxonomy,
          field: "id",
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
      query.tax_query = includeQuery;
    } else if (!includeQuery && excludeQuery) {
      query.tax_query = excludeQuery;
    }
  }

  if (offset > 0) {
    query.offset = offset;
  }

  if (orderBy) {
    query.orderby = normalizeOrderBy(orderBy);
  }

  if (order) {
    query.order = order;
  }

  return {
    query
  };
}

function archiveQuery(v: V): WPArchiveQuery {
  const { gridRow, gridColumn, orderBy, order } = decodeV(v);

  return {
    count: gridRow !== 0 && gridColumn !== 0 ? gridRow * gridColumn : -1,
    orderby: normalizeOrderBy(orderBy || "id"),
    order:
      Union.readWithChoices<WPArchiveQuery["order"]>(["ASC", "DESC"])(order) ??
      "DESC"
  };
}

export function getLoopAttributes(v: V): WPQuery {
  switch (v.type) {
    case "archives":
    case "archives-product":
    case "upsell":
      return archiveQuery(v);
    default:
      return postsQuery(v);
  }
}
