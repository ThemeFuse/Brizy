import { getFreeLibs } from "visual/libs";
import { AnimationEvents } from "visual/utils/animation";

function initAnimation(node, Animation) {
  node.find(".brz-animated").each(function () {
    const animationId = this.getAttribute("data-animationid");
    const onStart = () => {
      if (animationId) window.Brz.emit(AnimationEvents.entranceOn, animationId);
    };

    const onFinish = () => {
      if (animationId)
        window.Brz.emit(AnimationEvents.entranceOff, animationId);
    };

    // Cloned carousel slides don't trigger at default threshold 0,
    // so we use threshold: [0.01] to detect when they are visible
    const isInsideCarousel = !!this.closest(".brz-carousel");
    const options = {
      onStart,
      onFinish,
      ...(isInsideCarousel ? { threshold: [0.01] } : {})
    };

    new Animation(this, options);
  });
}

export default function ($node) {
  const { Animation } = getFreeLibs();
  if (!Animation) {
    return;
  }

  const isAnimatedCarouselInPage = $node.find(".brz-carousel .brz-animated").length > 0;


  initAnimation($node, Animation);

  if (isAnimatedCarouselInPage) {
    window.Brz.onAlways("elements.carousel.ready", ($carousel) => {
      initAnimation($carousel, Animation);
    });
  }
}
