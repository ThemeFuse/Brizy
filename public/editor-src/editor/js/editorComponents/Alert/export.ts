import { makeAttr } from "visual/utils/i18n/attribute";

export default function ($node: JQuery): void {
  const node = $node.get(0);
  if (!node) return;

  node.querySelectorAll(".brz-alert").forEach((item) => {
    const closeButton = item.querySelector(".brz-alert-close");
    const showCloseButtonAfter = item.getAttribute(makeAttr("delay"));
    const delay = showCloseButtonAfter ? Number(showCloseButtonAfter) : 0;

    if (delay && delay > 0) {
      const closeButtonTimeout = setTimeout(() => {
        closeButton?.classList.remove("brz-hidden");
        clearTimeout(closeButtonTimeout);
      }, delay * 1000);
    }

    closeButton?.addEventListener("click", () => {
      item.parentElement?.classList.add("brz-hidden");
    });
  });
}
