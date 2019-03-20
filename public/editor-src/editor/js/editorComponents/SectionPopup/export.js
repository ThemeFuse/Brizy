import $ from "jquery";

export default function() {
  $(document).on("click", '[data-brz-link-type="popup"]', function(e) {
    e.preventDefault();

    var popupId = this.getAttribute("href").slice(1); // without the `#`

    if (popupId) {
      $('[data-brz-popup="' + popupId + '"]').addClass("brz-popup--opened");
      $("html").addClass("brz-ow-hidden");
    }
  });

  $(".brz-popup").on("click", function(e) {
    var clickedInsideContent =
      $(e.target).closest(".brz-container").length === 0;

    if (clickedInsideContent) {
      $(this).removeClass("brz-popup--opened");
      $("html").removeClass("brz-ow-hidden");

      var video = $(".brz-video .brz-iframe").attr("src");
      $(".brz-video .brz-iframe").attr("src", "");
      $(".brz-video .brz-iframe").attr("src", video);
    }
  });
}
