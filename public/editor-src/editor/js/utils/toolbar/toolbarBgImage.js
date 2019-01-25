import { t } from "visual/utils/i18n";
import {
  defaultValueKey,
  defaultValueValue,
  saveOnChanges
} from "visual/utils/onChange";

export function toolbarBgImage({
  v,
  device,
  state,
  disabled = false,
  onChange
}) {
  return {
    id: defaultValueKey({ key: "bgImage", device, state }),
    label: t("Image"),
    type: "imageSetter",
    disabled,
    value: {
      width: defaultValueValue({ v, key: "bgImageWidth", device, state }),
      height: defaultValueValue({ v, key: "bgImageHeight", device, state }),
      src: defaultValueValue({ v, key: "bgImageSrc", device, state }),
      x: defaultValueValue({ v, key: "bgPositionX", device, state }),
      y: defaultValueValue({ v, key: "bgPositionY", device, state })
    },
    onChange: ({ width, height, src, x, y }, { isChanged }) => {
      const values = {
        ...{ v, device, state, onChange },
        ...{ width, height, src, x, y, isChanged }
      };
      return saveOnChanges(values);
    }
  };
}
