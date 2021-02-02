import $ from "jquery";
import { collapse, expend } from "./utils";

export default function($node) {
  $node.find(".brz-accordion").each(function() {
    const _this = this;
    const $accordionNavItems = $(_this).find(".brz-accordion__nav");
    const $accordionFilter = $(_this).find(".brz-accordion__filter-wrapper");
    const $collapsible = $accordionNavItems.attr("data-collapsible");
    const duration = Number(_this.dataset.duration || 0);
    const contents = $(_this)
      .find("> .brz-accordion__item > .brz-accordion__content")
      .toArray();

    $accordionNavItems.on("click", function() {
      const activeClassName = "brz-accordion__item--active";
      const $item = $(this).closest(".brz-accordion__item");
      const $itemContent = $item.find(".brz-accordion__content");
      const itemIndex = $accordionFilter.length
        ? $item.index() - 1
        : $item.index();

      // need to calculate inner elements height
      // it's needed for animation
      const heights = contents.map(node => {
        let height = 0;
        [...node.children].forEach(node => {
          height += node.scrollHeight;
        });

        return height;
      });

      if ($collapsible === "on") {
        if ($item.hasClass(activeClassName)) {
          return;
        }

        // animation
        $item
          .siblings()
          .find(".brz-accordion__content")
          .each((idx, node) => {
            const activeNode = node.closest(".brz-accordion__item--active");

            if (activeNode) {
              const height = heights[idx];
              expend(node, { height, duration });
              activeNode.classList.remove(activeClassName);
            }
          });

        const node = $itemContent.get(0);
        const height = heights[itemIndex];
        collapse(node, { height, duration });

        $item.addClass(activeClassName);
      } else {
        const node = $itemContent.get(0);
        const height = heights[itemIndex];

        if ($item.hasClass(activeClassName)) {
          expend(node, { height, duration });
          $item.removeClass(activeClassName);
        } else {
          collapse(node, { height, duration });
          $item.addClass(activeClassName);
        }
      }

      // Emit Accordion Changed
      window.Brizy.emit("elements.accordion.changed", _this, {
        active: $item.get(0),
        tabs: $item.siblings().get()
      });

      setTimeout(function() {
        //verify if content is outside of viewport
        const offsetTop = $accordionNavItems.offset().top;
        if (window.scrollY > offsetTop) {
          $("html, body").animate({ scrollTop: offsetTop }, 200);
        }
      }, 100);
    });

    $accordionFilter.on("click", function({ target }) {
      const $this = $(this);
      const hiddenClassName = "brz-accordion__hidden";
      const $filterItem = $(target).closest(".brz-accordion__filter__item");

      // Active Tag
      if (!$(target).hasClass("brz-accordion__filter__item--active")) {
        $(target).addClass("brz-accordion__filter__item--active");
        $(target)
          .siblings()
          .removeClass("brz-accordion__filter__item--active");
      }

      if ($filterItem.length) {
        const { filter } = $filterItem.data();

        if (filter === "*") {
          $this.siblings().removeClass(hiddenClassName);
        } else {
          $this
            .siblings()
            .addClass(hiddenClassName)
            .siblings(`.${filter}`)
            .removeClass(hiddenClassName);
        }
      }
    });
  });
}
