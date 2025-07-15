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
        console.log(e);
      }

      return [];
    }
  };

// is needed to pass webpack warnings
export const createFieldCollectionId = (): string => "";
