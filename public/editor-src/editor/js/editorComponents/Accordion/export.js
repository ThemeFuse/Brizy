import $ from "jquery";
import Isotope from "isotope-layout";

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
        var iso = Isotope.data($(this)[0]);

        if (iso) {
          iso.layout();
        }
      });
    });
  });
}
