import $ from "jquery";

$(".brz-tabs").each(function() {
  var $this = $(this);
  var $tabsContent = $this
    .children(".brz-tabs__content")
    .children(".brz-tabs__items");

  $this.children(".brz-tabs__nav").on("click", function(e) {
    var $navItem = $(e.target).closest("li");
    var navIndex = $navItem.index();
    var mobileActiveClassName = "brz-tabs__nav--mobile--active";

    if (navIndex !== -1) {
      // removeClass
      $tabsContent.removeClass("brz-tabs__items--active");
      $tabsContent
        .children(".brz-tabs__nav--mobile")
        .removeClass(mobileActiveClassName);
      $navItem.siblings("li").removeClass("brz-tabs__nav--active");

      // addClass
      $navItem.addClass("brz-tabs__nav--active");
      $($tabsContent[navIndex])
        .children(".brz-tabs__nav--mobile")
        .addClass(mobileActiveClassName);
      $($tabsContent[navIndex]).addClass("brz-tabs__items--active");
    }
  });

  // For Mobile
  var $mobileTabsContent = $this.find(".brz-tabs__items");

  $mobileTabsContent.on("click", function() {
    var activeClassName = "brz-tabs__items--active";
    var mobileActiveClassName = "brz-tabs__nav--mobile--active";
    var $item = $(this).closest(".brz-tabs__items");

    $item.siblings().removeClass(activeClassName);
    $item
      .siblings()
      .children(".brz-tabs__nav--mobile")
      .removeClass(mobileActiveClassName);

    $item.addClass(activeClassName);
    $item.children(".brz-tabs__nav--mobile").addClass(mobileActiveClassName);

    $("html, body").animate(
      { scrollTop: $(".brz-tabs__items--active").offset().top },
      200
    );
  });
});
