import * as Str from "visual/utils/reader/string";

const setParentListeners = (parent: HTMLElement): void => {
  const iframe = parent.querySelector("iframe");

  if (iframe) {
    parent.addEventListener("click", () => {
      iframe.style.pointerEvents = "auto";
    });

    parent.addEventListener("mouseleave", () => {
      iframe.style.pointerEvents = "none";
    });
  }
};

const insertMapIframe = (parent: HTMLElement, iframeSrc: string): void => {
  const iframe = document.createElement("iframe");
  iframe.src = iframeSrc;
  iframe.classList.add("brz-iframe");
  iframe.classList.add("intrinsic-ignore");

  parent.appendChild(iframe);
  setParentListeners(parent);
};

export default function($node: JQuery): void {
  const node = $node.get(0);

  node.querySelectorAll<HTMLElement>(".brz-map").forEach(item => {
    const isCovered = item.getAttribute("data-cover") === "true";
    const iframeSrc = Str.read(item.getAttribute("data-src")) ?? "";
    const coverImage = item.querySelector<HTMLElement>(".brz-map__cover");
    const mapWrapper = item.querySelector<HTMLElement>(".brz-map-content");

    if (isCovered && coverImage && iframeSrc && mapWrapper) {
      coverImage.addEventListener("click", () => {
        insertMapIframe(mapWrapper, iframeSrc);
        coverImage.remove();
      });
    }

    if (mapWrapper) {
      setParentListeners(mapWrapper);
    }
  });
}
