import { Post } from "visual/component/Options/types/dev/InternalLink/types/Post";
import { getPostObjects } from "visual/utils/api/editor";
import { toPosts } from "visual/component/Options/types/dev/InternalLink/utils";
import { MValue } from "visual/utils/value";

let promise: MValue<Promise<Post[]>>;
let timeout = 0;

const updatePosts = (): Promise<Post[]> =>
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
    .catch(e => {
      promise = undefined;
      throw e;
    }));

export const getPosts = (): Promise<Post[]> => promise || updatePosts();
