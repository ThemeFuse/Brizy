import $ from "jquery";

export default function() {
  $(".brz-accordion").each(function() {
    var $accordionNavItems = $(this).find(".brz-accordion__nav");

    $accordionNavItems.on("click", function() {
      var activeClassName = "brz-accordion__item--active";
      var $item = $(this).closest(".brz-accordion__item");
      $item.siblings().removeClass(activeClassName);
      $item.addClass(activeClassName);

      // Need Update Isotope
      $item.find(".brz-image__gallery").each(function() {
        var iso = $(this).data("isotope");

        if (iso) {
          iso.layout();
        }
      });
    });
  });
}
