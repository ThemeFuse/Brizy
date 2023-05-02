import { ResponsiveMode } from "visual/utils/responsiveMode";
import { Hover } from "../../component/HoverAnimation/Hover";
import { getHoverOptions } from "../../component/HoverAnimation/utils";
import { getKeyframe } from "./utils";

interface Settings {
  node: HTMLElement;
}

export type SideEffectCallback = (
  animationId: string,
  setCanHover: (canHover: boolean) => void
) => void;

const getCurrentDevice = (): ResponsiveMode => {
  const { innerWidth } = window;
  let device: ResponsiveMode = "desktop";

  if (innerWidth < 992) {
    device = "tablet";
  }
  if (innerWidth < 768) {
    device = "mobile";
  }

  return device;
};

export class HoverAnimation {
  private canHover: boolean = true;
  private animationId: string | null = null;
  private elementWasHovered: boolean = false;
  private settings: KeyframeEffectOptions = {};
  private keyframes: Keyframe[] = [];

  constructor({ node }: Settings) {
    this.animationId = node.getAttribute("data-animationid");
    const options = node.getAttribute("data-hover-options");

    if (options) {
      this.settings = this.getOptions(options);
    }

    const keyframeEncoded = node.getAttribute("data-hover");
    if (keyframeEncoded) {
      this.keyframes = this.getKeyframesInfo(keyframeEncoded);
    }

    const child = node.querySelector<HTMLElement>(".brz-hover-animation");
    if (child) {
      const controller = new Hover({
        child,
        keyframes: this.keyframes,
        options: this.settings
      });

      this.onMouseLeave({ node, controller });
      this.onMouseEnter({ node, controller });
    }
  }

  public sideEffects = (callbacks: SideEffectCallback[]): void => {
    callbacks.forEach((fn) => {
      if (this.animationId !== null) {
        fn(this.animationId, this.setCanHover);
      }
    });
  };

  private setCanHover = (runAnimation: boolean): void => {
    this.canHover = runAnimation;
  };

  private onMouseEnter = ({
    node,
    controller
  }: {
    node: HTMLElement;
    controller: Hover;
  }): void => {
    node.addEventListener("mouseenter", () => {
      const device = getCurrentDevice();
      if (this.canHover && device === "desktop") {
        controller.setEffectsOnMouseEnter(this.settings);
        controller.play("normal");

        this.elementWasHovered = true;
      }
    });
  };

  private onMouseLeave = ({
    node,
    controller
  }: {
    node: HTMLElement;
    controller: Hover;
  }): void => {
    node.addEventListener("mouseleave", () => {
      if (this.canHover && this.elementWasHovered) {
        controller.setEffectsOnMouseLeave(this.settings);
        controller.play("reverse");
        this.elementWasHovered = false;
      }
    });
  };

  private getOptions = (options: string): KeyframeEffectOptions => {
    let settings: KeyframeEffectOptions = {};

    try {
      settings = getHoverOptions(options);
    } catch (e) {
      if (process.env.NODE_ENV === "development") {
        console.error("ERROR: ", e);
      }
    }

    return settings;
  };

  private getKeyframesInfo = (keyframeEncoded: string): Keyframe[] => {
    let keyframes: Keyframe[] = [];

    try {
      keyframes = getKeyframe(keyframeEncoded);
    } catch (e) {
      if (process.env.NODE_ENV === "development") {
        console.error("ERROR: ", e);
      }
    }

    return keyframes;
  };
}
