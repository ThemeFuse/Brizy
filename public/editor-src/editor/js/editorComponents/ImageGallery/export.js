import $ from "jquery";
import ImagesLoaded from "imagesloaded";
import Isotope from "isotope-layout";
import "magnific-popup";

export default function($node) {
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

    $(".brz-image__gallery--filter-wrapper", _this).on("click", e => {
      const node = e.target;

      if (node.className.includes("brz-image__gallery-filter__item")) {
        const { filter = "*" } = node.dataset;

        iso.arrange({
          filter: filter === "*" ? "*" : `.${filter}`
        });
      }
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
