import { Align } from "visual/component/Controls/RightSidebarTabs/types";

export const nextAlign = (a: Align): Align => {
  switch (a) {
    case "right":
      return "left";
    case "left":
      return "right";
  }
};
