import { initHoverAnimation } from "visual/libs/hoveranimation/utils";

export default function ($node: JQuery<HTMLElement>) {
  const rootNode = $node.get(0);

  if (!rootNode) return;
  initHoverAnimation(rootNode);
}
