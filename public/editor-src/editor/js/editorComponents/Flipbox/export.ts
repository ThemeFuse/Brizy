import { throttle } from "es-toolkit";
import type { DeviceMode } from "visual/types";
import { getCurrentDevice } from "visual/utils/export";
import { makeAttr } from "visual/utils/i18n/attribute";
import { FlipboxType, Trigger } from "./types";
import type { ClickEvent } from "./types/types.export";
import { readTrigger } from "./utils";
import {
  activeClassName,
  changeFlipboxState,
  getFrontItem,
  increaseFlipboxHeight,
  resetFlipboxState
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

    const trigger =
      readTrigger(item.getAttribute(makeAttr("trigger"))) ?? Trigger.Hover;

    item.addEventListener("click", (e: ClickEvent) => {
      if (!e.fromFlipbox) {
        currentState = changeFlipboxState(item, currentState, trigger);
      }
      e.fromFlipbox = true;
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
        }
        lastDevice = device;
      }
    }, 200);

    window.addEventListener("resize", handleResize);
  });
}
