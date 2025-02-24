import { makeAttr } from "visual/utils/i18n/attribute";
import { clearFormMessages, validateForm } from "./export";

export const initMultiStep = (item: HTMLElement): void => {
  const form = item.querySelector<HTMLFormElement>("form");
  const formType = form ? form.getAttribute(makeAttr("form-type")) : "";

  if (formType === "multistep" && form) {
    let multistepActive = 1;

    const multistepIndicators = [
      ...form.querySelectorAll<HTMLElement>(".brz-form-ms-indicator")
    ];
    const multistepItems = [
      ...form.querySelectorAll<HTMLElement>(".brz-form-ms-content-item")
    ];

    const multistepButtons = form.querySelector<HTMLElement>(
      ".brz-form-ms-buttons"
    );
    const nextButtonContainer = form.querySelector<HTMLElement>(
      ".brz-form-ms-next-button"
    );
    const prevButtonContainer = form.querySelector<HTMLElement>(
      ".brz-form-ms-prev-button"
    );
    if (nextButtonContainer) {
      const link = nextButtonContainer.querySelector("a");
      if (link) {
        link.removeAttribute("href");
      }
    }
    if (prevButtonContainer) {
      const link = prevButtonContainer.querySelector("a");
      if (link) {
        link.removeAttribute("href");
      }
    }

    const progressBars = [
      ...form.querySelectorAll<HTMLElement>(".brz-form-ms-progress-bar")
    ];
    const progressBarText = [
      ...form.querySelectorAll<HTMLElement>(".brz-form-ms-progress-bar-text")
    ];

    if (progressBars.length) {
      changeProgressState(progressBars, progressBarText, multistepActive);
    }

    if (multistepButtons) {
      const buttons = Array.from(multistepButtons.children) as HTMLElement[];
      changeStepButtons(buttons, multistepActive, multistepItems.length);

      if (nextButtonContainer) {
        nextButtonContainer.addEventListener("click", () => {
          const isValid = validateForm(multistepItems[multistepActive - 1]);
          if (isValid) {
            clearFormMessages(form);
            changeActiveIndicator(multistepIndicators, multistepActive, "next");
            multistepActive += 1;
            changeStepContent(multistepItems, multistepActive);
            changeStepButtons(buttons, multistepActive, multistepItems.length);
            changeProgressState(progressBars, progressBarText, multistepActive);
          }
        });
      }

      if (prevButtonContainer) {
        prevButtonContainer.addEventListener("click", () => {
          changeActiveIndicator(multistepIndicators, multistepActive, "prev");
          multistepActive -= 1;
          changeStepContent(multistepItems, multistepActive);
          changeStepButtons(buttons, multistepActive, multistepItems.length);
          changeProgressState(progressBars, progressBarText, multistepActive);
        });
      }
    }
  }
};

const setHidden = (items: HTMLElement[]): void => {
  Array.from(items).forEach((element) => {
    element.style.display = "none";
  });
};

const resetProgressStyle = (
  progressItems: HTMLElement[],
  progressTextItems: HTMLElement[]
): void => {
  Array.from(progressItems).forEach((element) => {
    element.removeAttribute("style");
  });
  Array.from(progressTextItems).forEach((element) => {
    element.removeAttribute("style");
  });
};

const changeStepContent = (
  multistepItems: HTMLElement[],
  active: number
): void => {
  if (multistepItems.length) {
    setHidden(multistepItems);
    multistepItems[active - 1].style.display = "flex";
  }
};

const changeStepButtons = (
  buttons: HTMLElement[],
  active: number,
  totalItems: number
): void => {
  // we have only 3 buttons : prev, next and submit
  if (buttons.length && totalItems) {
    setHidden(buttons);
    if (active === 1) {
      buttons[1].style.display = "block";
    } else if (active === totalItems) {
      buttons[0].style.display = "block";
      buttons[2].style.display = "block";
    } else {
      buttons[0].style.display = "block";
      buttons[1].style.display = "block";
    }
  }
};

const changeProgressState = (
  progressItems: HTMLElement[],
  progressTextItems: HTMLElement[],
  active: number
): void => {
  if (progressItems.length && progressTextItems.length) {
    resetProgressStyle(progressItems, progressTextItems);

    progressItems.forEach((element, i) => {
      if (active - 1 < i) {
        element.style.backgroundColor = "transparent";
      }
    });

    progressTextItems.forEach((element, i) => {
      if (i !== active - 1) {
        element.style.display = "none";
      }
    });
  }
};

const changeActiveIndicator = (
  indicators: HTMLElement[],
  active: number,
  actionType: string
): void => {
  if (!indicators.length) return;

  if (actionType === "next") {
    indicators[active - 1].classList.remove("brz-form-ms-indicator__active");
    indicators[active].classList.add("brz-form-ms-indicator__active");
  }

  if (actionType === "prev") {
    indicators[active - 1].classList.remove("brz-form-ms-indicator__active");
    indicators[active - 2].classList.add("brz-form-ms-indicator__active");
  }
};
