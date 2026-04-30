import { getCurrentDevice } from "visual/utils/export";
import { makeAttr } from "visual/utils/i18n/attribute";
import {
  ChangeFlipboxState,
  IncreaseFlipboxHeight,
  ResetFlipboxState,
  ToggleActive
} from "./types/types.export";
import { FlipboxType } from "./types";
import { getHeight } from "./utils";

export const animationClassName = "brz-flipbox-back-active";
export const activeClassName = "brz-flipbox-item--active";
const flipboxFrontSideClassName = "brz-flipbox-item-front";
const flipboxBackSideClassName = "brz-flipbox-item-back";
const flipboxWrapperClassName = "brz-flipbox-content";

export const getFrontItem = (node: HTMLElement): HTMLElement | null =>
  node.querySelector<HTMLDivElement>(
    `:scope > .brz-flipbox-content > .${flipboxFrontSideClassName}`
  );

export const getBackItem = (node: HTMLElement): HTMLElement | null =>
  node.querySelector<HTMLDivElement>(
    `:scope > .brz-flipbox-content > .${flipboxBackSideClassName}`
  );

const toggleActive: ToggleActive = (node, currentState) => {
  const itemFront = getFrontItem(node);
  const itemBack = getBackItem(node);

  if (itemFront && itemBack) {
    switch (currentState) {
      case "front":
        itemFront.classList.add(activeClassName);
        itemBack.classList.remove(activeClassName);
        break;
      case "back":
        itemBack.classList.add(activeClassName);
        itemFront.classList.remove(activeClassName);
        break;
    }
  }
};

export const setFlipboxState = (
  node: HTMLDivElement,
  currentState: FlipboxType
): void => {
  if (currentState === "back") {
    node.classList.add(animationClassName);
  } else {
    node.classList.remove(animationClassName);
  }

  toggleActive(node, currentState);
};

export const changeFlipboxState: ChangeFlipboxState = (
  node,
  currentState,
  trigger
) => {
  const device = getCurrentDevice();
  const _trigger = device === "desktop" ? trigger : "click";

  if (_trigger === "click") {
    currentState = currentState === "front" ? "back" : "front";
    setFlipboxState(node, currentState);
  }

  return currentState;
};

export const resetFlipboxState: ResetFlipboxState = (node) => {
  setFlipboxState(node, "front");
};

export const increaseFlipboxHeight: IncreaseFlipboxHeight = (item) => {
  const flipboxesAsChildren =
    item.querySelectorAll<HTMLDivElement>(".brz-flipbox");

  if (flipboxesAsChildren.length) {
    flipboxesAsChildren.forEach(increaseFlipboxHeight);
  }

  const frontSideNode = item.querySelector<HTMLDivElement>(
    `:scope > .brz-flipbox-content > .${flipboxFrontSideClassName}`
  );
  const backSideNode = item.querySelector<HTMLDivElement>(
    `:scope > .brz-flipbox-content > .${flipboxBackSideClassName}`
  );
  const wrapper = item.querySelector<HTMLDivElement>(
    `:scope > .${flipboxWrapperClassName}`
  );

  if (wrapper && frontSideNode && backSideNode) {
    const transition = item.getAttribute(makeAttr("transition"));

    const settings =
      transition === "zoomIn" || transition === "zoomOut"
        ? { resetTransition: true, resetTransform: true }
        : undefined;
    const frontSideHeight = getHeight(frontSideNode);
    const backSideHeight = getHeight(backSideNode, settings);

    if (backSideHeight > frontSideHeight) {
      wrapper.style.minHeight = `${backSideHeight}px`;
    }
  }
};
