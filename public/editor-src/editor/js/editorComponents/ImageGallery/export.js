import $ from "jquery";
import ImagesLoaded from "imagesloaded";
import Isotope from "isotope-layout";
import "magnific-popup";

export default function() {
  // Isotope
  $(".brz-image__gallery").each(function() {
    var _this = this;

    ImagesLoaded(_this, function() {
      // init Isotope after all images have loaded
      var iso = new Isotope(_this, {
        itemSelector: ".brz-image__gallery-item",
        masonry: {
          columnWidth: ".brz-image__gallery-item"
        }
      });

      // add isotope for data attr uses in tabs and accordion
      $(_this).data("isotope", iso);
    });
  });

  // MagnificPopup
  $(".brz-image__gallery-lightbox").each(function() {
    $(this).magnificPopup({
      delegate: "a",
      type: "image",
      gallery: {
        enabled: true
      }
    });
  });
}
