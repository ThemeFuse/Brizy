import $ from "jquery";

export default function($node) {
  $node.find(".brz-accordion").each(function() {
    const $accordionNavItems = $(this).find(".brz-accordion__nav");
    const $accordionFilter = $(this).find(".brz-accordion__filter-wrapper");
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

      // Need Update Isotope
      $item.find(".brz-image__gallery").each(function() {
        var iso = $(this).data("isotope");

        if (iso) {
          iso.layout();
        }
      });
    });

    $accordionFilter.on("click", function({ target }) {
      const $this = $(this);
      const hiddenClassName = "brz-accordion__hidden";
      const $filterItem = $(target).closest(".brz-accordion__filter__item");

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
