import { ExportFunction } from "visual/types";

const fn: ExportFunction = async ($node) => {
  const node = $node.get(0);
  if (!node) return;

  const feedItems = node.querySelectorAll<HTMLElement>(".brz-linkedin-feed");

  feedItems.forEach((item) => {
    const iframe = item.querySelector("iframe.linkedin-post");

    if (iframe && iframe instanceof HTMLIFrameElement) {
      iframe.addEventListener("load", () => {
        const tempDiv = item.querySelector(".rsme-linkedin-embed div");
        tempDiv?.remove();

        iframe.setAttribute("height", "500");
        iframe.style.display = "block";
      });
    }
  });
};

export default fn;
