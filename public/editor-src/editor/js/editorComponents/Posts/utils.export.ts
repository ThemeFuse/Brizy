import { makeAttr } from "visual/utils/i18n/attribute";
import { easeInOutQuad } from "../../component/Link/export/utils";

const PAGINATION_LINKS = ".brz-posts__pagination a[href]";
const POSTS_ID_ATTR = makeAttr("posts-id");
const SCROLL_DURATION = 600;
const SCROLL_INCREMENT = 20;

const getPostsId = (posts: HTMLElement): string | undefined =>
  posts.getAttribute(POSTS_ID_ATTR) ?? undefined;

const scrollTo = (endLocation: number): void => {
  const element = document.scrollingElement;

  if (!element) {
    return;
  }

  const startLocation = element.scrollTop;
  const distance = endLocation - startLocation;

  let currentTime = 0;

  const animateScroll = (): void => {
    currentTime += SCROLL_INCREMENT;

    element.scrollTop = easeInOutQuad(
      currentTime,
      startLocation,
      distance,
      SCROLL_DURATION
    );

    if (currentTime < SCROLL_DURATION) {
      setTimeout(animateScroll, SCROLL_INCREMENT);
    }
  };

  animateScroll();
};

export function anchorPaginationLinks(posts: HTMLElement): void {
  const id = getPostsId(posts);

  if (!id) {
    return;
  }

  posts
    .querySelectorAll<HTMLAnchorElement>(PAGINATION_LINKS)
    .forEach((link) => {
      link.hash = id;
    });
}

export function scrollToPostsAfterLoad(posts: HTMLElement): void {
  const id = getPostsId(posts);

  if (!id || window.location.hash !== `#${id}`) {
    return;
  }

  const scroll = (): void => {
    scrollTo(
      posts.getBoundingClientRect().top +
        (document.scrollingElement?.scrollTop ?? 0)
    );
  };

  if (document.readyState === "complete") {
    scroll();
  } else {
    window.addEventListener("load", scroll, { once: true });
  }
}
