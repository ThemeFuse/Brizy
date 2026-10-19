import { anchorPaginationLinks, scrollToPostsAfterLoad } from "./utils.export";

export default function (root: HTMLElement): void {
  root.querySelectorAll<HTMLElement>(".brz-posts").forEach((posts) => {
    anchorPaginationLinks(posts);
    scrollToPostsAfterLoad(posts);
  });
}
