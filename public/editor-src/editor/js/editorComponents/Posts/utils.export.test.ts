import { makeAttr } from "visual/utils/i18n/attribute";
import { anchorPaginationLinks, scrollToPostsAfterLoad } from "./utils.export";

const POSTS_ID_ATTR = makeAttr("posts-id");

const makeRect = (top: number): DOMRect => {
  const rect = {
    x: 0,
    y: top,
    top,
    right: 0,
    bottom: top,
    left: 0,
    width: 0,
    height: 0
  };

  return { ...rect, toJSON: () => rect };
};

const makePosts = (id: string, innerHTML: string): HTMLElement => {
  const posts = document.createElement("div");
  posts.className = "brz-posts";

  if (id !== "") {
    posts.setAttribute(POSTS_ID_ATTR, id);
  }

  posts.innerHTML = innerHTML;

  return posts;
};

describe("anchorPaginationLinks", () => {
  const pagination = (links: string): string =>
    `<div class="brz-posts__pagination"><ul class="page-numbers">${links}</ul></div>`;

  it.each([
    {
      case: "appends the element id to relative pagination links",
      id: "posts-1",
      html: pagination(
        [
          '<li><a class="page-numbers" href="https://example.com/blog/?bpage=2">2</a></li>',
          '<li><a class="page-numbers" href="https://example.com/blog/?bpage=3">3</a></li>'
        ].join("")
      ),
      selector: ".brz-posts__pagination a",
      hrefs: [
        "https://example.com/blog/?bpage=2#posts-1",
        "https://example.com/blog/?bpage=3#posts-1"
      ]
    },
    {
      case: "appends the element id to an absolute pagination link",
      id: "posts-1",
      html: pagination(
        '<li><a class="page-numbers" href="https://example.com/blog/bpage/2/">2</a></li>'
      ),
      selector: ".brz-posts__pagination a",
      hrefs: ["https://example.com/blog/bpage/2/#posts-1"]
    },
    {
      case: "leaves the links untouched when the element has no data attribute",
      id: "",
      html: pagination(
        '<li><a class="page-numbers" href="https://example.com/blog/?bpage=2">2</a></li>'
      ),
      selector: ".brz-posts__pagination a",
      hrefs: ["https://example.com/blog/?bpage=2"]
    },
    {
      case: "leaves links outside the pagination untouched",
      id: "posts-1",
      html: `<a class="brz-a" href="https://example.com/post-1">Post 1</a>${pagination(
        '<li><a class="page-numbers" href="https://example.com/blog/?bpage=2">2</a></li>'
      )}`,
      selector: "a.brz-a",
      hrefs: ["https://example.com/post-1"]
    },
    {
      case: "ignores a current page marker that has no href",
      id: "posts-1",
      html: pagination(
        [
          '<li><span class="page-numbers current">1</span></li>',
          '<li><a class="page-numbers" href="https://example.com/blog/?bpage=2">2</a></li>'
        ].join("")
      ),
      selector: ".brz-posts__pagination a",
      hrefs: ["https://example.com/blog/?bpage=2#posts-1"]
    }
  ])("$case", ({ id, html, selector, hrefs }) => {
    const posts = makePosts(id, html);

    anchorPaginationLinks(posts);

    expect(
      Array.from(posts.querySelectorAll<HTMLAnchorElement>(selector)).map(
        (link) => link.href
      )
    ).toEqual(hrefs);
  });
});

describe("scrollToPostsAfterLoad", () => {
  const setReadyState = (readyState: string): void => {
    Object.defineProperty(document, "readyState", {
      value: readyState,
      configurable: true
    });
  };

  let scrollingElement: HTMLElement = document.createElement("div");

  beforeEach(() => {
    jest.useFakeTimers();

    scrollingElement = document.createElement("div");

    Object.defineProperty(document, "scrollingElement", {
      value: scrollingElement,
      configurable: true
    });
  });

  afterEach(() => {
    jest.useRealTimers();
    setReadyState("complete");
    window.location.hash = "";
    Reflect.deleteProperty(document, "scrollingElement");
  });

  it.each([
    {
      case: "scrolls right away when the hash matches and the page is loaded",
      id: "posts-1",
      hash: "#posts-1",
      readyState: "complete",
      scrollTopBeforeLoad: 500,
      scrollTopAfterLoad: 500
    },
    {
      case: "waits for load when the hash matches and the page is still loading",
      id: "posts-1",
      hash: "#posts-1",
      readyState: "loading",
      scrollTopBeforeLoad: 0,
      scrollTopAfterLoad: 500
    },
    {
      case: "does nothing when the hash points at another element",
      id: "posts-1",
      hash: "#posts-2",
      readyState: "complete",
      scrollTopBeforeLoad: 0,
      scrollTopAfterLoad: 0
    },
    {
      case: "does nothing when there is no hash",
      id: "posts-1",
      hash: "",
      readyState: "loading",
      scrollTopBeforeLoad: 0,
      scrollTopAfterLoad: 0
    },
    {
      case: "does nothing when the element has no data attribute",
      id: "",
      hash: "",
      readyState: "complete",
      scrollTopBeforeLoad: 0,
      scrollTopAfterLoad: 0
    }
  ])(
    "$case",
    ({ id, hash, readyState, scrollTopBeforeLoad, scrollTopAfterLoad }) => {
      window.location.hash = hash;
      setReadyState(readyState);

      const posts = makePosts(id, "");
      posts.getBoundingClientRect = jest.fn(() => makeRect(500));

      scrollToPostsAfterLoad(posts);

      jest.advanceTimersByTime(600);

      expect(scrollingElement.scrollTop).toBe(scrollTopBeforeLoad);

      window.dispatchEvent(new Event("load"));

      jest.advanceTimersByTime(600);

      expect(scrollingElement.scrollTop).toBe(scrollTopAfterLoad);
    }
  );
});
