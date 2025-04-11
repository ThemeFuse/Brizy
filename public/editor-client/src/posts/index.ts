import { getPosts, getPostTaxonomies, getRulePosts } from "@/api";
import { t } from "@/utils/i18n";
import { Posts } from "./types";

export const posts: Posts = {
  async getPosts(res, rej, data) {
    try {
      const content = await getPosts(data);

      res(content);
    } catch (e) {
      rej(t("Fail to find posts"));
    }
  },
  async getPostTaxonomies(res, rej, data) {
    try {
      const content = await getPostTaxonomies(data);

      res(content);
    } catch (e) {
      rej(t("Fail to find posts taxonomies"));
    }
  },
  async getRulePostsGroupList(res, rej, { postType }) {
    try {
      const data = await getRulePosts(postType);

      res(data);
    } catch (e) {
      rej(t("Fail to find post rules groups"));
    }
  }
};
