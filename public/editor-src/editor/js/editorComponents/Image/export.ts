import { getFreeLibs } from "visual/libs";

export default function (node: HTMLElement) {
  const { openLightbox, handleLightBoxZoom } = getFreeLibs();

  node.querySelectorAll<HTMLElement>(".brz-image__lightbox").forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();

      const aTag = item.querySelector("a");

      if (aTag) {
        openLightbox({
          kind: "element",
          target: item,
          options: {
            delegate: "a",
            type: "image",
            gallery: undefined,
            closeOnContentClick: true,
            mainClass: "",
            callbacks: { open: handleLightBoxZoom, close: undefined }
          }
        }).open();
      }
    });
  });
}
