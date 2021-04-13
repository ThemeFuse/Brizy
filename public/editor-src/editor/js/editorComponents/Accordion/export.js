import $ from "jquery";
import { collapse, expand } from "./utils";

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
        const child = node.firstElementChild;
        return child ? child.getBoundingClientRect().height : 0;
      });

      // when animation is done wee need
      // 1. emit.accordion.changed
      // 2. need to see if offset top of elements is outside of viewport
      const handleAnimationComplete = () => {
        // Emit Accordion Changed
        const offsetTop = $item.offset().top;
        window.Brizy.emit("elements.accordion.changed", _this, {
          active: $item.get(0),
          tabs: $item.siblings().get()
        });

        // verify if content is outside of viewport
        if (window.scrollY > offsetTop) {
          $("html, body").animate({ scrollTop: offsetTop }, 200);
        }
      };

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
              expand(node, {
                height,
                duration,
                onFinish: handleAnimationComplete
              });
              activeNode.classList.remove(activeClassName);
            }
          });

        const node = $itemContent.get(0);
        const height = heights[itemIndex];
        collapse(node, {
          height,
          duration,
          onFinish: handleAnimationComplete
        });

        $item.addClass(activeClassName);
      } else {
        const node = $itemContent.get(0);
        const height = heights[itemIndex];

        if ($item.hasClass(activeClassName)) {
          expand(node, {
            height,
            duration,
            onFinish: handleAnimationComplete
          });
          $item.removeClass(activeClassName);
        } else {
          collapse(node, {
            height,
            duration,
            onFinish: handleAnimationComplete
          });
          $item.addClass(activeClassName);
        }
      }
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
