import { isHTMLElement } from "visual/utils/dom/isHTMLElement";
import { Headline } from "./Headline";
import { getHeadlineOptions } from "./utils";

const initHeadlineOnViewport = (
  headline: HTMLElement,
  onInit: () => void
): void => {
  if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
    onInit();
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      const isInViewport = entries.some((entry) => entry.isIntersecting);

      if (!isInViewport) {
        return;
      }

      observer.disconnect();
      onInit();
    },
    { threshold: 0.5 }
  );

  observer.observe(headline);
};

export default function ($node: JQuery<HTMLElement>) {
  const rootNode = $node.get(0);

  if (!rootNode) return;

  const headLineWrapper = rootNode.querySelectorAll<HTMLElement>(
    ".brz-animatedHeadline--wrapper"
  );

  headLineWrapper.forEach((headline) => {
    if (isHTMLElement(headline)) {
      const headLineOptions = getHeadlineOptions(headline);

      if (headLineOptions.loop) {
        new Headline(headline, headLineOptions);
        return;
      }

      initHeadlineOnViewport(headline, () => {
        new Headline(headline, headLineOptions);
      });
    }
  });
}
