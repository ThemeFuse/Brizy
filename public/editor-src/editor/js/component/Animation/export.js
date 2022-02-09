import { getFreeLibs } from "visual/libs";

export default function($node) {
  const { Animation } = getFreeLibs();
  if (!Animation) {
    return;
  }

  $node.find(".brz-animated").each(function() {
    new Animation(this);
  });
}
