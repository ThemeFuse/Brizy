import $ from "jquery";
import { getProLibs } from "visual/libs";

export default function($node) {
  const { Isotope, ImagesLoaded } = getProLibs();

  if (!Isotope || !ImagesLoaded) {
    return;
  }

  // Isotope
  $node.find(".brz-image__gallery").each(function() {
    const _this = this;
    const wrapper = $(this)
      .children(".brz-image__gallery-wrapper")
      .get(0);
    let iso;

    ImagesLoaded(wrapper, function() {
      // init Isotope after all images have loaded
      iso = new Isotope(wrapper, {
        itemSelector: ".brz-image__gallery-item",
        masonry: {
          columnWidth: ".brz-image__gallery-item"
        }
      });

      // add isotope for data attr uses in tabs and accordion
      $(wrapper).data("isotope", iso);
    });

    _this
      .querySelector("ul.brz-image__gallery-filter")
      ?.firstChild.classList.add("brz-image__gallery-filter__item--active");

    $(".brz-image__gallery--filter-wrapper", _this).on("click", e => {
      const node = e.target.closest(".brz-image__gallery-filter__item");
      const activeClass = "brz-image__gallery-filter__item--active";

      if (!$(node).hasClass(activeClass)) {
        $(node).addClass(activeClass);
        $(node)
          .siblings()
          .removeClass(activeClass);
      }

      if (node?.className.includes("brz-image__gallery-filter__item")) {
        const { filter = "*" } = node.dataset;

        iso.arrange({
          filter: filter === "*" ? "*" : `.${filter}`
        });
      }
    });

    // Need rearrange when changed some of elements [tabs, accordion, ... ]
    const elements = [
      "elements.tabs.changed",
      "elements.accordion.changed",
      "elements.switcher.changed"
    ];

    elements.forEach(id => {
      window.Brz.on(id, element => {
        if (iso && element && element.contains(_this)) {
          iso.arrange();
        }
      });
    });
  });

  // MagnificPopup
  $node.find(".brz-image__gallery-lightbox").each(function() {
    $(this).magnificPopup({
      delegate: "a",
      type: "image",
      gallery: {
        enabled: true
      }
    });
  });
}
