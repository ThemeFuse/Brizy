import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";
import { getOptionFontByGlobal } from "visual/utils/options";

export function styleTypographyElementCountdownLabelFontSize({
  v,
  device,
  state,
  store
}) {
  const fontSize = getOptionFontByGlobal({
    key: defaultValueKey({ key: "fontSize", device, state }),
    value: defaultValueValue({ v, key: "fontSize", device, state }),
    style: defaultValueValue({ v, key: "fontStyle", device, state }),
    store
  });

  const getLabelSize = (fontSize) => {
    return fontSize <= 24 ? 20 : fontSize > 24 && fontSize <= 32 ? 40 : 60;
  };

  const labelFontSize = getLabelSize(fontSize);

  return `calc(${fontSize}px - ${labelFontSize}%)`;
}

export function styleElementCountdown2Spacing({ v, device }) {
  return `${defaultValueValue({ v, key: "spacing", device })}px`;
}
