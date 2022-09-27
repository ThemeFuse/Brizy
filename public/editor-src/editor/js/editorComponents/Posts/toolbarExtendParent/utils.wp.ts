import {
  Choice,
  Value
} from "visual/component/Options/types/dev/MultiSelect2/types";
import {
  getAuthors,
  getPosts,
  getPostTaxonomies,
  getTermsBy
} from "visual/utils/api/index.wp";

function split(s: string, sep: string): string[] {
  return s.split(sep).map((s) => s.trim());
}

export async function authorsLoad(
  value: Value,
  abortSignal?: AbortSignal
): Promise<Choice[]> {
  try {
    const include = value.map((v) => `${v}`);
    const authors = await getAuthors({ include, abortSignal });

    return authors.map(({ ID, display_name }) => ({
      title: display_name,
      value: String(ID)
    }));
  } catch (e) {
    if (process.env.NODE_ENV === "development") {
      console.log(e);
    }

    return [];
  }
}

export async function authorsSearch(
  search: string,
  abortSignal?: AbortSignal
): Promise<Choice[]> {
  try {
    const authors = await getAuthors({ search, abortSignal });

    return authors.map(({ ID, display_name }) => ({
      title: display_name,
      value: String(ID)
    }));
  } catch (e) {
    if (process.env.NODE_ENV === "development") {
      console.log(e);
    }

    return [];
  }
}

export async function termsLoad(
  value: Value,
  abortSignal?: AbortSignal
): Promise<Choice[]> {
  const valueParsed = value.map(
    (t) => split(`${t}`, ":") as [string, string] /* {taxonomy}:{term_id} */
  );

  try {
    const terms = await getTermsBy({ include: valueParsed, abortSignal });

    return terms.map(({ term_id, name, taxonomy, taxonomy_name }) => ({
      title: `${name} (${taxonomy_name})`,
      value: taxonomy + ":" + term_id
    }));
  } catch (e) {
    if (process.env.NODE_ENV === "development") {
      console.log(e);
    }

    return [];
  }
}

export async function termsSearch(
  search: string,
  abortSignal?: AbortSignal
): Promise<Choice[]> {
  try {
    const terms = await getTermsBy({ search, abortSignal });

    return terms.map(({ term_id, name, taxonomy, taxonomy_name }) => ({
      title: `${name} (${taxonomy_name})`,
      value: taxonomy + ":" + term_id
    }));
  } catch (e) {
    if (process.env.NODE_ENV === "development") {
      console.log(e);
    }

    return [];
  }
}

export const manualLoad =
  (postType: string[], excludePostType: string[]) =>
  async (value: Value, abortSignal?: AbortSignal): Promise<Choice[]> => {
    try {
      const include = value.map((v) => `${v}`);
      const posts = await getPosts({
        include,
        abortSignal,
        postType,
        excludePostType
      });

      return posts.map(({ ID, title }) => ({
        title,
        value: String(ID)
      }));
    } catch (e) {
      if (process.env.NODE_ENV === "development") {
        console.log(e);
      }

      return [];
    }
  };

export const manualSearch =
  (postType: string[], excludePostType: string[]) =>
  async (search: string, abortSignal?: AbortSignal): Promise<Choice[]> => {
    try {
      const posts = await getPosts({
        search,
        abortSignal,
        postType,
        excludePostType
      });

      return posts.map(({ ID, title }) => ({
        title,
        value: String(ID)
      }));
    } catch (e) {
      if (process.env.NODE_ENV === "development") {
        console.log(e);
      }

      return [];
    }
  };

export const postsManualLoad = manualLoad([], ["product"]);

export const postsManualSearch = manualSearch([], ["product"]);

export const productsManualLoad = manualLoad(["product"], []);

export const productsManualSearch = manualSearch(["product"], []);

export const tagsFilterLoad =
  (value: string) =>
  async (abortSignal?: AbortSignal): Promise<Choice[]> => {
    try {
      const taxonomies = await getPostTaxonomies({
        taxonomy: value,
        abortSignal
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
        console.log(e);
      }

      return [];
    }
  };
