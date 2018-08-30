import $ from "jquery";

// Grid
$(window).on("load", function() {
  $(".brz-image__gallery").isotope({
    itemSelector: ".brz-image__gallery-item",
    masonry: {
      columnWidth: ".brz-image__gallery-item"
    }
  });
});

// LightBox
$(".brz-image__gallery-lightbox").each(function() {
  $(this).magnificPopup({
    delegate: "a",
    type: "image",
    gallery: {
      enabled: true
    }
  });
});
