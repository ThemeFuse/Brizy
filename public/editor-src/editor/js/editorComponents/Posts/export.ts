import $ from "jquery";
import { getProLibs } from "visual/libs";

export default function ($node: JQuery): void {
  const root = $node.get(0);

  root.querySelectorAll<HTMLElement>(".brz-posts").forEach((item) => {
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
                const { filter: postItemFilter = "*" } = postItem.dataset;

                if (filter === "*") {
                  return postItem;
                }
                return filter === postItemFilter;
              }
            );

            if (postsWrapper) {
              // @ts-expect-error TS compiler does not recognize "replaceChildren" method
              (postsWrapper as ParentNode).replaceChildren(
                ...filteredPostsItems
              );
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
        ImagesLoaded(wrapper, function () {
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
          if (isotope && element && element.contains(item)) {
            isotope.arrange({});
          }
        });
      });

      // first tag active by default
      const activeTagClassName = "brz-posts-filter__item--active";
      item
        .querySelector(".brz-posts__filter__item:first-child")
        ?.classList.add(activeTagClassName);

      $(".brz-posts__filter", item).on(
        "click",
        ".brz-posts__filter__item",
        function () {
          const $tag = $(this);

          // switch active tags
          if (!$tag.hasClass(activeTagClassName)) {
            $tag.siblings().removeClass(activeTagClassName);
            $tag.addClass(activeTagClassName);
          }

          // filter
          const filter = this.getAttribute("data-filter") || "*";
          isotope.arrange({
            filter: filter === "*" ? filter : `[data-filter*="${filter}"]`
          });
        }
      );
    }
  });
}
