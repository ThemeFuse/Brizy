import { ExportFunction } from "visual/types";

const initCalendly = (doc: Document, id: string): void => {
  if (doc.getElementById(id)) {
    return;
  }

  const js = doc.createElement("script");
  js.setAttribute("id", id);
  js.setAttribute("async", "true");
  js.setAttribute(
    "src",
    "https://assets.calendly.com/assets/external/widget.js"
  );
  doc.body.appendChild(js);
};

const fn: ExportFunction = ($node) => {
  const node = $node.get(0);
  const callendlyes = node.querySelectorAll(".brz-calendly");

  if (callendlyes.length) {
    initCalendly(document, "brz-calendly-wjs");
    callendlyes.forEach((node) => {
      const link = node.getAttribute("data-url");

      if (link) {
        const calendly = document.createElement("div");
        calendly.setAttribute("data-url", link);
        calendly.className = "calendly-inline-widget";

        node?.appendChild(calendly);
      }
    });
  }
};

export default fn;
