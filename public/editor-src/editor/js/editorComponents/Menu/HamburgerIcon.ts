import { throttle } from "es-toolkit";
import { DeviceMode } from "visual/types";
import { getCurrentDevice } from "visual/utils/export";
import { DESKTOP } from "visual/utils/responsiveMode";
import { MMenuAnimationTypes } from "./types";

interface AnimatedHamburgerIconOptions {
  animation?: MMenuAnimationTypes;
  onOpen?: VoidFunction;
}

const LINES = 3; // Number of lines in the burger icon
const DURATION = 0.4;
const SPACE = 0.5;
const TRANSLATE = 4.6325;
const EASING = "cubic-bezier(0,0,0,1)";
const BORDER_RADIUS = 10;

type AnimationFn = (toggled: boolean) => void;

export class AnimatedHamburgerIcon {
  private size = 0;
  private readonly animation: MMenuAnimationTypes;
  private readonly container: HTMLElement;
  private bars: HTMLElement[] = [];
  private wrappers: HTMLDivElement[] = [];
  private toggled = false;
  private barHeight = 0;
  private margin = 0;
  private topOffset = 0;
  private move = 0;
  private readonly onOpen?: VoidFunction;
  private currentDevice: DeviceMode = DESKTOP;

  constructor(
    container: HTMLElement,
    options: AnimatedHamburgerIconOptions = {}
  ) {
    this.animation = options.animation ?? MMenuAnimationTypes.OFF;
    this.container = container;
    this.init();
    this.onOpen = options.onOpen;
  }

  // ----------------- Setup -----------------
  private init() {
    this.size = this.container.getBoundingClientRect().width;
    const width = Math.max(12, this.size);
    const barHeightRaw = width / 12;
    this.barHeight = Math.round(barHeightRaw);
    this.margin = Math.round(width / (LINES * (SPACE + 1)));

    const height = this.barHeight * LINES + this.margin * (LINES - 1);
    this.topOffset = Math.round((this.size - height) / 2);
    this.move = parseFloat((width / TRANSLATE).toFixed(2));

    this.setupContainer();
    this.createBars(width);
    this.container.addEventListener("click", this.handleClick);
    window.addEventListener("resize", this.handleResponsiveMode);
    this.update();
  }

  handleResponsiveMode = throttle(() => {
    const device = getCurrentDevice();

    if (this.currentDevice !== device) {
      this.currentDevice = device;
      this.reinit();
    }
  }, 300);

  private setupContainer() {
    Object.assign(this.container, {
      role: "button",
      ariaLabel: "Toggle menu"
    });
    this.container.setAttribute("aria-expanded", String(this.toggled));
    this.container.style.cssText = `
      position: relative;
      width: ${this.size}px;
      height: ${this.size}px;
      user-select: none;
      outline: none;
      transition: ${DURATION}s ${EASING};
    `;
  }

  private createBars(width: number) {
    const room = Math.round((this.size - width) / 2);
    for (
      let i = 0;
      i < (this.animation === MMenuAnimationTypes.DIVIDE ? 6 : LINES);
      i++
    ) {
      const bar = document.createElement("span");
      bar.style.cssText = `
        position: absolute;
        left: ${room}px;
        width: ${width}px;
        height: ${this.barHeight}px;
        border-radius: ${BORDER_RADIUS}px;
        transition: ${DURATION}s ${EASING};
        background: currentColor;
      `;
      if (i < 3)
        bar.style.top = `${this.topOffset + i * (this.barHeight + this.margin)}px`;
      this.container.appendChild(bar);
      this.bars.push(bar);
    }
  }

  // ----------------- Public API -----------------
  toggle() {
    this.toggled = !this.toggled;

    if (this.toggled && this.onOpen) {
      this.onOpen();
    }

    this.update();
  }

  destroy() {
    this.container.removeEventListener("click", this.handleClick);
    this.bars.forEach((bar) => bar.remove());
    this.bars = [];
    this.wrappers = [];
    this.container.removeAttribute("style");
    window.removeEventListener("resize", this.handleResponsiveMode);
  }

  getToggled() {
    return this.toggled;
  }

  close() {
    if (this.toggled) {
      this.toggled = false;
      this.update();
    }
  }

  reinit() {
    this.destroy();
    this.init();
  }

  // ----------------- Update -----------------
  private handleClick = () => this.toggle();

  private update() {
    this.container.setAttribute("aria-expanded", String(this.toggled));
    if (
      this.animation !== MMenuAnimationTypes.SQUASH &&
      this.animation !== MMenuAnimationTypes.TWIRL
    ) {
      this.removeWrappers();
    }

    const animations: Record<MMenuAnimationTypes, AnimationFn | null> = {
      [MMenuAnimationTypes.TILT]: this.animateTilt,
      [MMenuAnimationTypes.FADE]: this.animateFade,
      [MMenuAnimationTypes.TURN]: this.animateTurn,
      [MMenuAnimationTypes.SPIN]: this.animateSpin,
      [MMenuAnimationTypes.SQUASH]: this.animateSquash,
      [MMenuAnimationTypes.SLING]: this.animateSling,
      [MMenuAnimationTypes.DIVIDE]: this.animateDivide,
      [MMenuAnimationTypes.TWIRL]: this.animateTwirl,
      [MMenuAnimationTypes.OFF]: null
    } as const;

    const animationFn = animations[this.animation];

    if (typeof animationFn === "function") {
      animationFn(this.toggled);
    }
  }

  // ----------------- Wrappers -----------------
  private prepareWrappers() {
    if (this.wrappers.length) return;
    this.bars.forEach((bar) => {
      const wrapper = document.createElement("div");
      bar.parentElement?.replaceChild(wrapper, bar);
      wrapper.appendChild(bar);
      this.wrappers.push(wrapper);
    });
  }

  private removeWrappers() {
    this.wrappers.forEach((wrapper, i) => {
      const bar = this.bars[i];
      wrapper.parentElement?.replaceChild(bar, wrapper);
    });
    this.wrappers = [];
  }

  // ----------------- Animations -----------------
  private animateTilt: AnimationFn = (on) => {
    this.container.style.transform = on ? "rotate(90deg)" : "none";
    this.bars[0].style.transform = on
      ? `rotate(45deg) translate(${this.move}px, ${this.move}px)`
      : "none";
    this.bars[1].style.transform = on ? "scaleX(0)" : "none";
    this.bars[2].style.transform = on
      ? `rotate(-45deg) translate(${this.move}px, -${this.move}px)`
      : "none";
  };

  private animateFade: AnimationFn = (on) => {
    this.bars[0].style.transform = on
      ? `rotate(45deg) translate(${this.move}px, ${this.move}px)`
      : "none";
    this.bars[1].style.opacity = on ? "0" : "1";
    this.bars[2].style.transform = on
      ? `rotate(-45deg) translate(${this.move}px, -${this.move}px)`
      : "none";
  };

  private animateTurn: AnimationFn = (on) => {
    this.bars[0].style.transform = on
      ? `rotate(45deg) translate(${this.move}px, ${this.move}px)`
      : "none";
    this.bars[1].style.transitionDuration = `${DURATION / 2}s`;
    this.bars[1].style.transform = on ? "scaleX(0)" : "none";
    this.bars[2].style.transform = on
      ? `rotate(-45deg) translate(${this.move}px, -${this.move}px)`
      : "none";
  };

  private animateSpin: AnimationFn = (on) => {
    this.container.style.transform = on ? "rotate(180deg)" : "none";
    this.animateFade(on);
  };

  private animateSling: AnimationFn = (on) => {
    this.container.style.transform = on ? "rotateY(180deg)" : "none";

    const m = this.move;

    this.bars[0].style.transform = on
      ? `rotate(45deg) translate(${m}px, ${m}px)`
      : "none";

    this.bars[1].style.transform = on
      ? `scale(0,1) translate(${m * 20}px, 0)`
      : "none";

    this.bars[2].style.transform = on
      ? `rotate(-45deg) translate(${m}px, ${-m}px)`
      : "none";
  };

  private animateSquash: AnimationFn = (on) => {
    this.prepareWrappers();
    const half = DURATION / 2;
    const dy = this.barHeight + this.margin;

    this.bars.forEach((bar, i) => {
      const wrapper = this.wrappers[i];
      wrapper.style.transition = `transform ${half}s ${EASING} ${on ? "0s" : `${half}s`}`;
      bar.style.transition = `transform ${half}s ${EASING} ${on ? `${half}s` : "0s"}`;
    });

    requestAnimationFrame(() => {
      this.wrappers[0].style.transform = on ? `translateY(${dy}px)` : "none";
      this.bars[0].style.transform = on ? "rotate(45deg)" : "none";

      this.wrappers[1].style.opacity = on ? "0" : "1";

      this.wrappers[2].style.transform = on ? `translateY(-${dy}px)` : "none";
      this.bars[2].style.transform = on ? "rotate(-45deg)" : "none";
    });
  };

  private animateDivide: AnimationFn = (on) => {
    if (this.bars.length < 6) return;

    const halfWidth = this.size / 2;
    const leftRadius = `${BORDER_RADIUS}px 0 0 ${BORDER_RADIUS}px`;
    const rightRadius = `0 ${BORDER_RADIUS}px ${BORDER_RADIUS}px 0`;

    const topY = this.topOffset;
    const midY = this.topOffset + this.barHeight + this.margin;
    const botY = this.topOffset + this.barHeight * 2 + this.margin * 2;

    const cfg = [
      {
        i: 0,
        side: "L" as const,
        top: topY,
        on: `translate(${this.move * 0.48}px, ${this.move * 0.73}px) rotate(45deg)`
      },
      {
        i: 1,
        side: "R" as const,
        top: topY,
        on: `translate(-${this.move * 0.48}px, ${this.move * 0.73}px) rotate(-45deg)`
      },
      {
        i: 2,
        side: "L" as const,
        top: midY,
        on: `translate(-${this.move * 1.25}px, 0)`,
        fade: true
      },
      {
        i: 3,
        side: "R" as const,
        top: midY,
        on: `translate(${this.move * 1.25}px, 0)`,
        fade: true
      },
      {
        i: 4,
        side: "L" as const,
        top: botY,
        on: `translate(${this.move * 0.48}px, -${this.move * 0.73}px) rotate(-45deg)`
      },
      {
        i: 5,
        side: "R" as const,
        top: botY,
        on: `translate(-${this.move * 0.48}px, -${this.move * 0.73}px) rotate(45deg)`
      }
    ];

    for (const { i, side, top, on: onTransform, fade } of cfg) {
      const bar = this.bars[i];
      if (!bar) continue;

      bar.style.width = `${halfWidth}px`;
      bar.style.top = `${top}px`;
      bar.style.borderRadius = side === "L" ? leftRadius : rightRadius;

      if (side === "R") {
        bar.style.left = "50%";
      }

      if (fade) {
        bar.style.opacity = on ? "0" : "1";
      }

      bar.style.transform = on ? onTransform : "none";
    }
  };

  private animateTwirl: AnimationFn = (on) => {
    this.prepareWrappers();
    const half = DURATION / 2;
    const dy = this.barHeight + this.margin;

    this.bars.forEach((bar, i) => {
      const wrapper = this.wrappers[i];
      wrapper.style.transition = `transform ${half}s ${EASING} ${on ? "0s" : `${half}s`}`;
      bar.style.transition = `transform ${half}s ${EASING} ${on ? `${half}s` : "0s"}`;
    });

    requestAnimationFrame(() => {
      this.container.style.transform = on ? "rotate(90deg)" : "none";

      this.wrappers[0].style.transform = on ? `translateY(${dy}px)` : "none";
      this.bars[0].style.transform = on ? "rotate(-45deg)" : "none";

      this.wrappers[1].style.opacity = on ? "0" : "1";

      this.wrappers[2].style.transform = on ? `translateY(-${dy}px)` : "none";
      this.bars[2].style.transform = on ? "rotate(45deg)" : "none";
    });
  };
}
