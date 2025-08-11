import $ from "jquery";
import { handleLightBoxZoom } from "visual/utils/export/lightbox";

export default function ($node: JQuery) {
  const node = $node.get(0);

  if (!node) {
    return;
  }

  node.querySelectorAll(".brz-image__lightbox").forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();

      const aTag = item.querySelector("a");

      if (aTag) {
        $(item)
          // @ts-expect-error magnificPopup have no types
          .magnificPopup({
            delegate: "a",
            type: "image",
            closeOnContentClick: true,
            callbacks: {
              open: handleLightBoxZoom
            }
          })
          .magnificPopup("open");
      }
    });
  });
}
