import $ from "jquery";
import ImagesLoaded from "imagesloaded";
import Isotope from "isotope-layout";
import "magnific-popup";

export default function($node) {
  $node.find(".brz-posts--masonry").each(function() {
    let isotope;
    let _this = this;
    const wrapper = this.querySelector(".brz-posts__wrapper");

    if (wrapper !== null) {
      ImagesLoaded(wrapper, function() {
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

    elements.forEach(id => {
      window.Brizy.on(id, element => {
        if (isotope && element && element.contains(_this)) {
          isotope.arrange();
        }
      });
    });

    // first tag active by default
    const activeTagClassName = "brz-posts-filter__item--active";
    this.querySelector(".brz-posts__filter__item:first-child")?.classList.add(
      activeTagClassName
    );

    $(".brz-posts__filter", this).on(
      "click",
      ".brz-posts__filter__item",
      function() {
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
  });
}
