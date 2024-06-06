import $ from "jquery";

export default function ($node) {
  $node.find(".brz-image__lightbox").each(function () {
    this.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();

      const aTag = this.querySelector("a");

      if (aTag) {
        $(this)
          .magnificPopup({
            delegate: "a",
            type: "image",
            closeOnContentClick: true
          })
          .magnificPopup("open");
      }
    });
  });
}
