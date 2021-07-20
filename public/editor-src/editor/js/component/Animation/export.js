import { Libs } from "visual/libs";

export default function($node) {
  const { Animation } = Libs;
  if (!Animation) {
    return;
  }

  $node.find(".brz-animated").each(function() {
    new Animation(this);
  });
}
