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

export default function ($node: JQuery): void {
  const node = $node.get(0);

  node.querySelectorAll<HTMLElement>(".brz-map").forEach((item) => {
    const mapWrapper = item.querySelector<HTMLElement>(".brz-map-content");

    if (mapWrapper) {
      setParentListeners(mapWrapper);
    }
  });
}
