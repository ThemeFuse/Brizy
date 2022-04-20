import { capitalize } from "../string";

export const getFontCssStyle = ({
  fontStyle,
  key,
  device
}: {
  fontStyle: string;
  key: string;
  device: string;
}): string | undefined => {
  if (fontStyle) {
    const _device = device !== "desktop" ? capitalize(device) : "";

    return `var(--brz-${fontStyle}${_device}${capitalize(key)})`;
  }
};

export const getFontCssStyleOldType = ({
  fontStyle,
  key,
  device
}: {
  fontStyle: string;
  key: string;
  device: string;
}): string | undefined => {
  if (fontStyle) {
    const _device = device !== "desktop" ? capitalize(device) : "";

    return `var(--brz-${fontStyle}${_device}${capitalize(key)})`;
  }
};
