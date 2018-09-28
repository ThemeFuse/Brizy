import $ from "jquery";

$(".brz-image__lightbox").each(function() {
  $(this).magnificPopup({
    delegate: "a",
    type: "image",
    closeOnContentClick: true
  });
});
