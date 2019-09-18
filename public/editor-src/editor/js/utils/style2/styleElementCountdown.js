import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";
import { getOptionFontByGlobal } from "visual/utils/options";

export function styleTypographyElementCountdownLabelFontSize({
  v,
  device,
  state
}) {
  const fontSize = getOptionFontByGlobal(
    defaultValueKey({ key: "fontSize", device, state }),
    defaultValueValue({ v, key: "fontSize", device, state }),
    defaultValueValue({ v, key: "fontStyle", device, state })
  );

  const getLabelSize = fontSize => {
    return fontSize <= 24 ? 20 : fontSize > 24 && fontSize <= 32 ? 40 : 60;
  };

  const labelFontSize = getLabelSize(fontSize);

  return `calc(${fontSize}px - ${labelFontSize}%)`;
}
