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
    const _device = device !== "desktop" ? device : "";
    // Keys is lowercase because have problems in backend export HTML
    return `var(--brz-${fontStyle}${_device}${key})`.toLowerCase();
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
    const _device = device !== "desktop" ? device : "";
    // Keys is lowercase because have problems in backend export HTML
    return `var(--brz-${fontStyle}${_device}${key})`.toLowerCase();
  }
};
