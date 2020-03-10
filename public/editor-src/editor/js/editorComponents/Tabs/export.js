import $ from "jquery";

export default function() {
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

        // Need Update Isotope
        $tabsContent.find(".brz-image__gallery").each(function() {
          var iso = $(this).data("isotope");

          if (iso) {
            iso.layout();
          }
        });
      }
    });

    // For Mobile
    var $mobileTabsContent = $this.find(".brz-tabs__nav--mobile");

    $mobileTabsContent.on("click", function() {
      var $navMobile = $(this);
      var activeClassName = "brz-tabs__items--active";
      var mobileActiveClassName = "brz-tabs__nav--mobile--active";
      var $item = $navMobile.closest(".brz-tabs__items");

      $item.siblings().removeClass(activeClassName);
      $item
        .siblings()
        .children(".brz-tabs__nav--mobile")
        .removeClass(mobileActiveClassName);

      $item.addClass(activeClassName);
      $item.children(".brz-tabs__nav--mobile").addClass(mobileActiveClassName);

      setTimeout(function() {
        $("html, body").animate({ scrollTop: $navMobile.offset().top }, 200);
      }, 100);

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
