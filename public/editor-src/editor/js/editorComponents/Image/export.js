import $ from "jquery";
import "magnific-popup";

export default function() {
  $(".brz-image__lightbox").each(function() {
    $(this).magnificPopup({
      delegate: "a",
      type: "image",
      closeOnContentClick: true
    });
  });
}
