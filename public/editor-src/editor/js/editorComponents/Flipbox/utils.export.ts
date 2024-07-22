import { getCurrentDevice } from "visual/utils/export";
import { makeAttr } from "visual/utils/i18n/attribute";
import * as Str from "visual/utils/reader/string";
import {
  ChangeFlipboxState,
  IncreaseFlipboxHeight,
  ResetFlipboxState,
  ToggleActive
} from "./types/types.export";
import { getHeight } from "./utils";

const animationClassName = "brz-flipbox-back-active";
const activeClassName = "brz-flipbox-item--active";
const flipboxFrontSideClassName = "brz-flipbox-item-front";
const flipboxBackSideClassName = "brz-flipbox-item-back";
const flipboxWrapperClassName = "brz-flipbox-content";

const toggleActive: ToggleActive = (node, currentState) => {
  const itemFront = node.querySelector<HTMLDivElement>(
    `:scope > .brz-flipbox-content > .${flipboxFrontSideClassName}`
  );
  const itemBack = node.querySelector<HTMLDivElement>(
    `:scope > .brz-flipbox-content > .${flipboxBackSideClassName}`
  );

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

export const changeFlipboxState: ChangeFlipboxState = (node, currentState) => {
  const device = getCurrentDevice();

  const trigger = Str.read(node.getAttribute(makeAttr("trigger"))) ?? "hover";
  const _trigger = device === "desktop" ? trigger : "click";

  if (_trigger === "click") {
    if (currentState === "front") {
      node.classList.add(animationClassName);
      currentState = "back";
    } else {
      node.classList.remove(animationClassName);
      currentState = "front";
    }

    toggleActive(node, currentState);
  }

  return currentState;
};

export const resetFlipboxState: ResetFlipboxState = (node) => {
  node.classList.remove(animationClassName);
  toggleActive(node, "front");
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
