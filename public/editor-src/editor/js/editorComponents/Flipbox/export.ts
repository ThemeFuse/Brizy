import { throttle } from "underscore";
import type { DeviceMode } from "visual/types";
import { getCurrentDevice } from "visual/utils/export";
import type { FlipboxType } from "./types";
import type { ClickEvent } from "./types/types.export";
import {
  changeFlipboxState,
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

    item.addEventListener("click", (e: ClickEvent) => {
      if (!e.fromFlipbox) {
        currentState = changeFlipboxState(item, currentState);
      }
      e.fromFlipbox = true;
    });

    const handleResize = throttle(() => {
      const device = getCurrentDevice();

      if (lastDevice !== device) {
        increaseFlipboxHeight(item);

        if (device === "desktop") {
          resetFlipboxState(item);
          currentState = "front";
        }
        lastDevice = device;
      }
    }, 200);

    window.addEventListener("resize", handleResize);
  });
}
