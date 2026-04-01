import { throttle } from "es-toolkit";
import type { DeviceMode } from "visual/types";
import { getCurrentDevice } from "visual/utils/export";
import { makeAttr } from "visual/utils/i18n/attribute";
import { FlipboxAccessibility, focusableSelector } from "../accessibility";
import { FlipboxType, Trigger } from "./types";
import type { ClickEvent } from "./types/types.export";
import { readTrigger } from "./utils";
import {
  activeClassName,
  changeFlipboxState,
  getBackItem,
  getFrontItem,
  increaseFlipboxHeight,
  resetFlipboxState,
  setFlipboxState
} from "./utils.export";

export default function ($node: JQuery): void {
  const node = $node.get(0);

  if (!node) {
    return;
  }

  let lastDevice: DeviceMode = getCurrentDevice();

  node.querySelectorAll<HTMLDivElement>(".brz-flipbox").forEach((item) => {
    increaseFlipboxHeight(item);

    let currentState: FlipboxType = "front";
    const frontItem = getFrontItem(item);
    const backItem = getBackItem(item);

    const trigger =
      readTrigger(item.getAttribute(makeAttr("trigger"))) ?? Trigger.Hover;
    const flipboxAccessibility =
      frontItem && backItem
        ? new FlipboxAccessibility({
            item: {
              item,
              front: frontItem,
              back: backItem,
              api: {
                open: () => {
                  currentState = "back";
                  setFlipboxState(item, currentState);
                },
                close: () => {
                  currentState = "front";
                  setFlipboxState(item, currentState);
                },
                toggle: () => {
                  currentState = currentState === "front" ? "back" : "front";
                  setFlipboxState(item, currentState);
                },
                isOpen: () => currentState === "back"
              }
            }
          })
        : null;

    flipboxAccessibility?.init();

    if (trigger === Trigger.Hover) {
      item.addEventListener("mouseenter", () => {
        if (getCurrentDevice() === "desktop") {
          currentState = "back";
          setFlipboxState(item, currentState);
          flipboxAccessibility?.sync();
        }
      });

      item.addEventListener("mouseleave", () => {
        if (getCurrentDevice() === "desktop") {
          currentState = "front";
          setFlipboxState(item, currentState);
          flipboxAccessibility?.sync();
        }
      });
    }

    item.addEventListener("click", (e: ClickEvent) => {
      const clickedInteractiveElement =
        e.target instanceof Element
          ? e.target.closest(focusableSelector)
          : null;
      const isAccessibilityClick =
        e.detail === 0 && document.activeElement === item;

      if (clickedInteractiveElement && clickedInteractiveElement !== item) {
        e.fromFlipbox = true;
        return;
      }

      if (!e.fromFlipbox) {
        currentState = isAccessibilityClick
          ? currentState === "front"
            ? "back"
            : "front"
          : changeFlipboxState(item, currentState, trigger);

        if (isAccessibilityClick) {
          setFlipboxState(item, currentState);
        }
      }
      e.fromFlipbox = true;
      flipboxAccessibility?.sync();
    });

    const handleResize = throttle(() => {
      const device = getCurrentDevice();

      if (lastDevice !== device) {
        increaseFlipboxHeight(item);

        if (device === "desktop") {
          resetFlipboxState(item);

          if (trigger === Trigger.Hover) {
            const itemFront = getFrontItem(item);
            itemFront?.classList.remove(activeClassName);
          }
          currentState = "front";
          flipboxAccessibility?.sync();
        }
        lastDevice = device;
      }
    }, 200);

    window.addEventListener("resize", handleResize);
  });
}
