import classNames from "classnames";
import { TimerType } from "visual/types/TimerType";
import { isHTMLElement } from "visual/utils/dom/isHTMLElement";
import { MValue } from "visual/utils/value";
import {
  AnimationStyle,
  Elements,
  HeadlineSettings,
  Options,
  Settings,
  TextEffectTypes
} from "./types";
import { classes, getNextWord, getSvgPaths, selectors } from "./utils";

export class Headline {
  private timeOutId: MValue<TimerType> = undefined;
  private timeOutAnimationId: MValue<TimerType> = undefined;
  private animationFrameId: number | null = null;
  private readonly wrapper: HTMLElement;
  private readonly settings: HeadlineSettings;
  private readonly elements: Elements;
  private readonly selectors = selectors;
  private readonly classes = classes;

  constructor(wrapper: HTMLElement, settings: Settings) {
    this.wrapper = wrapper;
    this.settings = {
      ...this.getDefaultSettings(settings.duration),
      ...settings
    };

    this.contentTemplate();

    this.elements = this.getElements();

    this.initHeadline();
  }

  clearAnimation = (): void => {
    clearTimeout(this.timeOutId);
    clearTimeout(this.timeOutAnimationId);

    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    this.wrapper.firstChild?.remove();
  };

  getDefaultSettings = (duration: number): Options => {
    return {
      animationDelay: duration,
      lettersDelay: duration * 0.02,
      typeLettersDelay: duration * 0.06,
      selectionDuration: duration * 0.2,
      revealDuration: duration * 0.24,
      revealAnimationDelay: duration * 0.6,
      typeAnimationDelay: duration * 0.2 + 800,
      selectors: this.selectors,
      classes: this.classes
    };
  };

  getElements = (): Elements => {
    const { selectors } = this.settings;
    const { wrapper } = this;

    if (!wrapper) {
      return { headline: null, dynamicWrapper: null, dynamicText: [] };
    }

    return {
      headline: wrapper.querySelector(selectors.headline),
      dynamicWrapper: wrapper.querySelector(selectors.dynamicWrapper),
      dynamicText: Array.from(wrapper.querySelectorAll(selectors.dynamicText))
    };
  };

  switchWord(oldWord: HTMLElement, newWord: HTMLElement): void {
    const { classes } = this.settings;
    oldWord.classList.remove(classes.textActive);
    oldWord.classList.add(classes.textInactive);
    newWord.classList.remove(classes.textInactive);
    newWord.classList.add(classes.textActive);
    this.setDynamicWrapperWidth(newWord);
  }

  singleLetters = (): void => {
    const { classes } = this.settings;

    this.elements?.dynamicText?.forEach((word) => {
      const textContent = word.textContent?.trim();
      if (!textContent) return;

      const letters = textContent.split("");
      const isActive = word.classList.contains(classes.textActive);
      const fragment = document.createDocumentFragment();

      letters.forEach((letter) => {
        const span = document.createElement("span");
        span.classList.add(classes.dynamicLetter);
        span.textContent = letter;
        if (isActive) {
          span.classList.add(classes.animationIn);
        }
        fragment.appendChild(span);
      });

      word.textContent = "";
      word.appendChild(fragment);
      word.style.opacity = "1";
    });
  };

  showLetter = (
    letter: HTMLElement,
    word: HTMLElement,
    isLastWord: boolean,
    duration: number
  ): void => {
    const { classes, animationDelay } = this.settings;

    letter.classList.add(classes.animationIn);

    if (!letter.isEqualNode(word.lastElementChild)) {
      this.timeOutId = setTimeout(() => {
        const nextLetter = letter.nextElementSibling;
        if (isHTMLElement(nextLetter)) {
          this.showLetter(nextLetter, word, isLastWord, duration);
        }
      }, duration);
    } else if (!isLastWord) {
      this.timeOutId = setTimeout(() => {
        this.hideWord(word);
      }, animationDelay);
    }
  };

  hideLetter = (
    letter: HTMLElement,
    word: HTMLElement,
    isLastWord: boolean,
    duration: number
  ): void => {
    const { classes, animationDelay } = this.settings;

    letter.classList.remove(classes.animationIn);

    if (!letter.isEqualNode(word.lastElementChild)) {
      this.timeOutId = setTimeout(() => {
        const nextLetter = letter.nextElementSibling;
        if (isHTMLElement(nextLetter)) {
          this.hideLetter(nextLetter, word, isLastWord, duration);
        }
      }, duration);
    } else if (isLastWord) {
      this.timeOutId = setTimeout(() => {
        const nextWord = getNextWord(word);
        if (isHTMLElement(nextWord)) {
          this.hideWord(nextWord);
        }
      }, animationDelay);
    }
  };

  showWord = (word: HTMLElement, duration: number): void => {
    const { settings, elements } = this;
    const { effectType, classes, revealDuration, revealAnimationDelay } =
      settings;

    if (effectType === TextEffectTypes.typing) {
      const firstLetter = word.querySelector(`.${classes.dynamicLetter}`);
      if (isHTMLElement(firstLetter)) {
        this.showLetter(firstLetter, word, false, duration);
      }
      word.classList.add(classes.textActive);
      word.classList.remove(classes.textInactive);
      return;
    }

    if (effectType === TextEffectTypes.clip && elements?.dynamicWrapper) {
      elements.dynamicWrapper.animate(
        [{ width: "2px" }, { width: word.offsetWidth + 10 + "px" }],
        {
          duration: revealDuration,
          easing: "ease",
          fill: "forwards"
        }
      ).onfinish = () => {
        this.timeOutId = setTimeout(() => {
          this.hideWord(word);
        }, revealAnimationDelay);
      };
    }
  };

  hideWord = (word: HTMLElement): void => {
    const { settings, elements } = this;
    const {
      classes,
      effectType,
      selectionDuration,
      typeLettersDelay,
      typeAnimationDelay,
      lettersDelay,
      revealDuration,
      animationDelay,
      loop
    } = settings;

    const nextWord = getNextWord(word);

    if (
      !loop &&
      word.parentNode &&
      word.isEqualNode(word.parentNode.lastElementChild)
    ) {
      return;
    }

    if (effectType === TextEffectTypes.typing) {
      elements?.dynamicWrapper?.classList.add(classes.typeSelected);

      this.timeOutId = setTimeout(() => {
        elements?.dynamicWrapper?.classList.remove(classes.typeSelected);
        word.classList.add(classes.textInactive);
        word.classList.remove(classes.textActive);
        word.querySelectorAll("." + classes.dynamicLetter).forEach((letter) => {
          letter.classList.remove(classes.animationIn);
        });
      }, selectionDuration);
      this.timeOutAnimationId = setTimeout(() => {
        if (isHTMLElement(nextWord)) {
          this.showWord(nextWord, typeLettersDelay);
        }
      }, typeAnimationDelay);
    } else if (elements?.headline?.classList.contains(classes.letters)) {
      const isLastWord =
        word.querySelectorAll(`.${classes.dynamicLetter}`).length >=
        (nextWord?.querySelectorAll("." + classes.dynamicLetter).length || 0);
      const firstLetter = word.querySelector<HTMLElement>(
        `.${classes.dynamicLetter}`
      );
      const nextLetter = nextWord?.querySelector<HTMLElement>(
        `.${classes.dynamicLetter}`
      );
      if (firstLetter && nextLetter && isHTMLElement(nextWord)) {
        this.hideLetter(firstLetter, word, isLastWord, lettersDelay);
        this.showLetter(nextLetter, nextWord, isLastWord, lettersDelay);
      }
      if (isHTMLElement(nextWord)) {
        this.setDynamicWrapperWidth(nextWord);
      }
    } else if (
      effectType === TextEffectTypes.clip &&
      elements?.dynamicWrapper
    ) {
      elements.dynamicWrapper.animate(
        [{ width: word.offsetWidth + "px" }, { width: "2px" }],
        {
          duration: revealDuration,
          easing: "ease",
          fill: "forwards"
        }
      ).onfinish = () => {
        if (isHTMLElement(nextWord)) {
          this.switchWord(word, nextWord);
          this.showWord(nextWord, revealDuration);
        }
      };
    } else {
      if (isHTMLElement(nextWord)) {
        this.switchWord(word, nextWord);
        this.timeOutId = setTimeout(() => {
          this.hideWord(nextWord);
        }, animationDelay);
      }
    }
  };

  setDynamicWrapperWidth = (word: HTMLElement): void => {
    const { effectType } = this.settings;
    if (
      this.elements?.dynamicWrapper &&
      effectType !== TextEffectTypes.clip &&
      effectType !== TextEffectTypes.typing
    ) {
      this.elements.dynamicWrapper.style.width = `${word.offsetWidth}px`;
    }
  };

  addHighlight = (): void => {
    const { animationStyle, effectType } = this.settings;
    const { dynamicWrapper } = this.elements;
    if (animationStyle !== AnimationStyle.svg || !dynamicWrapper) {
      return;
    }
    const svgNamespace = "http://www.w3.org/2000/svg";
    const svgElement = document.createElementNS(svgNamespace, "svg");

    svgElement.setAttribute("xmlns", svgNamespace);
    svgElement.setAttribute("viewBox", "0 0 500 150");
    svgElement.setAttribute("preserveAspectRatio", "none");

    const svgPaths = getSvgPaths(effectType);
    svgElement.innerHTML = svgPaths;

    dynamicWrapper.appendChild(svgElement);
  };

  activateSvgAnimationAnimation = (): void => {
    const { animationStyle } = this.settings;
    const { headline } = this.elements;
    if (animationStyle !== AnimationStyle.svg || !headline) {
      return;
    }

    const { classes, duration, delay, loop } = this.settings;

    let startTime: number | null = null;

    const animationStep = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;

      if (elapsed < duration + delay * 0.8) {
        headline.classList.remove(classes.hideSvgAnimation);
        headline.classList.add(classes.activateSvgAnimation);
      } else if (
        elapsed >= duration + delay * 0.8 &&
        elapsed < duration + delay
      ) {
        headline.classList.remove(classes.activateSvgAnimation);
        headline.classList.add(classes.hideSvgAnimation);
      } else if (loop) {
        startTime = timestamp;
        this.animationFrameId = requestAnimationFrame(animationStep);
        return;
      } else {
        return;
      }

      this.animationFrameId = requestAnimationFrame(animationStep);
    };

    this.animationFrameId = requestAnimationFrame(animationStep);
  };

  initHeadline = (): void => {
    const { animationStyle } = this.settings;

    if (animationStyle === AnimationStyle.svg) {
      this.addHighlight();
      this.activateSvgAnimationAnimation();
      return;
    }

    const { animationDelay, effectType, classes } = this.settings;
    const { dynamicWrapper, dynamicText, headline } = this.elements;

    if (headline?.classList.contains(classes.letters)) {
      this.singleLetters();
    }

    if (effectType === TextEffectTypes.clip && dynamicWrapper) {
      dynamicWrapper.style.width = `${dynamicWrapper.offsetWidth + 10}px`;
    }

    if (effectType !== TextEffectTypes.typing && dynamicText?.[0]) {
      this.setDynamicWrapperWidth(dynamicText[0]);
    }

    if (dynamicText?.[0]) {
      this.timeOutId = setTimeout(() => {
        this.hideWord(dynamicText[0]);
      }, animationDelay);
    }
  };

  isLetterAnimation = (): boolean => {
    const { animationStyle, effectType } = this.settings;

    if (animationStyle === AnimationStyle.text) {
      return [
        TextEffectTypes.typing,
        TextEffectTypes.swirl,
        TextEffectTypes.blinds,
        TextEffectTypes.wave
      ].includes(effectType);
    }

    return false;
  };

  private createSpan = (
    className: string,
    textContent?: string
  ): HTMLSpanElement => {
    const span = document.createElement("span");
    span.className = className;
    if (textContent) span.textContent = textContent;
    return span;
  };

  private createDynamicTextSpans(text: string): HTMLSpanElement[] {
    return text
      .trim()
      .split("\n")
      .map((line, index) => {
        const span = this.createSpan(
          classNames("brz-animatedHeadline-dynamic-text", {
            "brz-animatedHeadline-text-active": index === 0
          }),
          line.replace(" ", "\u00A0")
        );
        return span;
      });
  }

  contentTemplate = () => {
    const { effectType, animationStyle, textBefore, text, textAfter } =
      this.settings;

    const headline = document.createElement("div");

    headline.className = classNames(
      "brz-animatedHeadline",
      `brz-animatedHeadline--style-${animationStyle}`,
      `brz-animatedHeadline-animation-type-${effectType}`
    );

    if (this.isLetterAnimation()) {
      headline.classList.add(this.classes.letters);
    }

    if (textBefore) {
      const beforeText = this.createSpan(
        "brz-animatedHeadline-plain-text brz-animatedHeadline-text-wrapper",
        textBefore
      );
      beforeText.innerHTML += "&nbsp;";
      headline.appendChild(beforeText);
    }

    if (text) {
      const dynamicWrapper = this.createSpan(
        "brz-animatedHeadline-dynamic-wrapper brz-animatedHeadline-text-wrapper"
      );

      if (animationStyle === AnimationStyle.text) {
        const dynamicTextSpans = this.createDynamicTextSpans(text);
        dynamicTextSpans.forEach((span) => dynamicWrapper.appendChild(span));
      } else if (animationStyle === AnimationStyle.svg) {
        const span = this.createSpan(
          "brz-animatedHeadline-dynamic-text brz-animatedHeadline-text-active",
          text
        );
        dynamicWrapper.appendChild(span);
      }

      headline.appendChild(dynamicWrapper);
    }

    if (textAfter) {
      const afterText = this.createSpan(
        "brz-animatedHeadline-plain-text brz-animatedHeadline-text-wrapper",
        textAfter
      );
      afterText.innerHTML = "&nbsp;" + afterText.innerHTML;
      headline.appendChild(afterText);
    }

    if (this.wrapper) {
      this.wrapper.appendChild(headline);
    }
  };
}
