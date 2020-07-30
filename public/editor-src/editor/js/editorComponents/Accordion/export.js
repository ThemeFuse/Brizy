import $ from "jquery";

export default function($node) {
  $node.find(".brz-accordion").each(function() {
    const _this = this;
    const $accordionNavItems = $(_this).find(".brz-accordion__nav");
    const $accordionFilter = $(_this).find(".brz-accordion__filter-wrapper");
    const $collapsible = $accordionNavItems.attr("data-collapsible");

    $accordionNavItems.on("click", function() {
      const activeClassName = "brz-accordion__item--active";
      const $item = $(this).closest(".brz-accordion__item");
      if ($collapsible === "on") {
        $item.siblings().removeClass(activeClassName);
        $item.addClass(activeClassName);
      } else {
        $item.hasClass(activeClassName)
          ? $item.removeClass(activeClassName)
          : $item.addClass(activeClassName);
      }

      // Emit Accordion Changed
      window.Brizy.emit("elements.accordion.changed", _this);
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
