import { SideEffectCallback } from "visual/libs/hoveranimation";
import { HoverAnimation } from "visual/libs/hoveranimation";
import { AnimationEvents } from "../Animation/utils";

export default function ($node: JQuery<HTMLElement>) {
  const rootNode = $node.get(0);

  if (!rootNode) return;

  const effectOnEntranceOn: SideEffectCallback = (animationId, setCanHover) => {
    window.Brz.on(AnimationEvents.entranceOn, (_animationId: string) => {
      if (animationId === _animationId) {
        setCanHover(false);
      }
    });
  };

  const effectOnEntranceOff: SideEffectCallback = (
    animationId,
    setCanHover
  ) => {
    window.Brz.on(AnimationEvents.entranceOff, (_animationId: string) => {
      if (animationId === _animationId) {
        setCanHover(true);
      }
    });
  };

  rootNode
    .querySelectorAll<HTMLElement>(".brz-hover-animation__container")
    .forEach((node) => {
      const hoverAnimation = new HoverAnimation({ node });
      hoverAnimation.sideEffects([effectOnEntranceOn, effectOnEntranceOff]);
    });
}
