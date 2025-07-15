import { isHTMLElement } from "visual/utils/dom/isHTMLElement";
import { Headline } from "./Headline";
import { getHeadlineOptions } from "./utils";

export default function ($node: JQuery<HTMLElement>) {
  const rootNode = $node.get(0);

  if (!rootNode) return;

  const headLineWrapper = rootNode.querySelectorAll<HTMLElement>(
    ".brz-animatedHeadline--wrapper"
  );

  headLineWrapper.forEach((headline) => {
    const target = headline.firstElementChild;

    if (isHTMLElement(target)) {
      const headLineOptions = getHeadlineOptions(headline);
      new Headline(target, headLineOptions);
    }
  });
}
