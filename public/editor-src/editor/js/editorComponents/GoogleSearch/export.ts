import { makeAttr } from "visual/utils/i18n/attribute";
import { clearGoogleSearchParams } from "./utils";

const createScript = (cx: string) => {
  const gcse = document.createElement("script");
  gcse.async = true;
  gcse.src = `https://cse.google.com/cse.js?cx=${cx}`;
  gcse.id = `brz-google-search-script-${cx}`;
  gcse.setAttribute(makeAttr("consent"), "preferences");

  if (document.getElementById(`brz-google-search-script-${cx}`)) {
    return;
  }

  document.head.appendChild(gcse);
};

export default function (root: HTMLElement): void {
  clearGoogleSearchParams();

  function searchGoogle(node: HTMLElement) {
    const query = node
      .querySelector<HTMLInputElement>("#google-search-field")
      ?.value.trim();
    if (!query) return;

    const gname = node.getAttribute(makeAttr("gname")) || "searchresults-only0";

    const google = window.google;
    const elementGetter = google?.search?.cse?.element;

    if (elementGetter && typeof elementGetter.getElement === "function") {
      const element = elementGetter.getElement(gname);
      element.execute(query);
    }
  }

  root
    .querySelectorAll<HTMLElement>(".brz-google-search-form")
    .forEach((form) => {
      const cx = form.getAttribute(makeAttr("cx")) || "";

      if (!cx) {
        return;
      }

      createScript(cx);

      form.addEventListener("submit", (e) => {
        e.preventDefault();
        searchGoogle(form);
      });
    });
}
