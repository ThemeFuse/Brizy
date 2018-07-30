import $ from "jquery";

$(".brz-accordion").each(function() {
  var accordionNavItems = $(this).find(".brz-accordion__nav");

  accordionNavItems.on("click", function() {
    var activeClassName = "brz-accordion__item--active";
    var item = $(this).closest('.brz-accordion__item');
    item.siblings().removeClass(activeClassName);
    item.addClass(activeClassName)
  });
});
