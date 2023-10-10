import { getFreeLibs } from "visual/libs";
import { AnimationEvents } from "visual/utils/animation";

export default function ($node) {
  const { Animation } = getFreeLibs();
  if (!Animation) {
    return;
  }

  $node.find(".brz-animated").each(function () {
    const animationId = this.getAttribute("data-animationid");
    const onStart = () => {
      if (animationId) window.Brz.emit(AnimationEvents.entranceOn, animationId);
    };

    const onFinish = () => {
      if (animationId)
        window.Brz.emit(AnimationEvents.entranceOff, animationId);
    };

    new Animation(this, { onStart, onFinish });
  });
}
