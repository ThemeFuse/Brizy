import { DeviceMode } from "visual/types";

export const getCurrentDevice = (): DeviceMode => {
  const { innerWidth } = window;
  let device: DeviceMode = "desktop";

  if (innerWidth < 992) {
    device = "tablet";
  }
  if (innerWidth < 768) {
    device = "mobile";
  }

  return device;
};
