import { getProLibs } from "visual/libs";
import { onBodyClick } from "visual/utils/export/delegate";
import { makeAttr } from "visual/utils/i18n/attribute";
import { anchorPaginationLinks, scrollToPostsAfterLoad } from "./utils.export";

export default function (root: HTMLElement): void {
  const masonryFilters = new Map<Element, (tag: Element) => void>();

  root.querySelectorAll<HTMLElement>(".brz-posts").forEach((item) => {
    anchorPaginationLinks(item);
    scrollToPostsAfterLoad(item);

    const filtersWrapper = item.querySelector<HTMLElement>(
      ".brz-posts__filter-wrapper"
    );

    // if filters wrapper exists in page means that tags is on
    if (!filtersWrapper) {
      return;
    }

    const isMasonryArrangement = item.classList.contains("brz-posts--masonry");
    const postsWrapper = item.querySelector(".brz-posts__wrapper");
    const postsItems =
      item.querySelectorAll<HTMLDivElement>(".brz-posts__item");

    if (!isMasonryArrangement) {
      const activeTagClassName = "brz-posts-filter__item--active";
      item
        .querySelector(".brz-posts__filter__item:first-child")
        ?.classList.add(activeTagClassName);

      filtersWrapper
        .querySelectorAll<HTMLElement>(".brz-posts__filter__item")
        .forEach((filterItem: HTMLElement) => {
          filterItem.addEventListener("click", () => {
            const { filter = "*" } = filterItem.dataset;

            const filteredPostsItems = Array.from(postsItems).filter(
              (postItem) => {
                const { brzFilter: postItemFilter = "*" } = postItem.dataset;

                if (filter === "*") {
                  return postItem;
                }

                return postItemFilter.includes(filter);
              }
            );

            if (postsWrapper) {
              postsWrapper.replaceChildren(...filteredPostsItems);
            }

            if (!filterItem.classList.contains(activeTagClassName)) {
              const currentActive = filtersWrapper.querySelector(
                `.${activeTagClassName}`
              );

              if (currentActive) {
                currentActive.classList.remove(activeTagClassName);
              }

              filterItem.classList.add(activeTagClassName);
            }
          });
        });
    } else {
      const { ImagesLoaded, Isotope } = getProLibs();

      if (!ImagesLoaded || !Isotope) {
        return;
      }

      let isotope: Isotope;
      const wrapper = item.querySelector<HTMLElement>(".brz-posts__wrapper");

      if (wrapper !== null) {
        ImagesLoaded(wrapper, () => {
          isotope = new Isotope(wrapper, {
            layoutMode: "masonry"
          });
        });
      }

      // Need rearrange when changed some of elements [tabs, accordion, ... ]
      const elements = [
        "elements.tabs.changed",
        "elements.accordion.changed",
        "elements.switcher.changed"
      ];

      elements.forEach((id) => {
        window.Brz.on(id, (element: HTMLElement) => {
          if (isotope && element?.contains(item)) {
            isotope.arrange({});
          }
        });
      });

      // first tag active by default
      const activeTagClassName = "brz-posts-filter__item--active";

      item
        .querySelector(".brz-posts__filter__item:first-child")
        ?.classList.add(activeTagClassName);

      masonryFilters.set(item, (tag) => {
        // switch active tags
        if (!tag.classList.contains(activeTagClassName)) {
          Array.from(tag.parentElement?.children ?? []).forEach((sibling) => {
            sibling.classList.remove(activeTagClassName);
          });
          tag.classList.add(activeTagClassName);
        }

        // filter
        const filter = tag.getAttribute("data-filter") || "*";

        isotope.arrange({
          filter:
            filter === "*" ? filter : `[${makeAttr("filter")}*="${filter}"]`
        });
      });
    }
  });

  onBodyClick([
    {
      selector: ".brz-posts__filter",
      handler: (filters, { target }) => {
        const posts = filters.closest(".brz-posts") ?? undefined;
        const selectTag = posts ? masonryFilters.get(posts) : undefined;
        const tag =
          target instanceof Element
            ? (target.closest(".brz-posts__filter__item") ?? undefined)
            : undefined;

        if (!selectTag || !tag || !filters.contains(tag)) {
          return;
        }

        selectTag(tag);
      }
    }
  ]);
}
