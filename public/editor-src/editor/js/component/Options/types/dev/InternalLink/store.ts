import { toPosts } from "visual/component/Options/types/dev/InternalLink/utils";
import { getPostObjects } from "visual/utils/api";
import { MValue } from "visual/utils/value";
import { ChoicesSync } from "./types";

let promise: MValue<Promise<ChoicesSync>>;
let timeout = 0;

const updatePosts = (): Promise<ChoicesSync> =>
  (promise = getPostObjects()
    .then(toPosts)
    .then((posts = []) => {
      timeout ||
        setTimeout(() => {
          promise = undefined;
          timeout = 0;
        }, 60000); // cache the posts list for 1 minute
      return posts;
    })
    .catch((e) => {
      promise = undefined;
      throw e;
    }));

export const getPosts = (): Promise<ChoicesSync> => promise || updatePosts();
