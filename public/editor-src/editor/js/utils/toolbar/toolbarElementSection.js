import { t } from "visual/utils/i18n";
import {
  defaultValueKey,
  defaultValueValue,
  saveOnChanges
} from "visual/utils/onChange";
import Config from "visual/global/Config";
import { isCloud, isShopify } from "visual/global/Config/types/configs/Cloud";

export function toolbarElementSectionBoxShadow({ v, device, state, onChange }) {
  const boxShadowBlurValue = defaultValueValue({
    v,
    key: "boxShadowBlur",
    device,
    state
  });

  const boxShadowVerticalValue = defaultValueValue({
    v,
    key: "boxShadowVertical",
    device,
    state
  });

  return {
    id: defaultValueKey({ key: "boxShadow", device, state }),
    type: "multiInput",
    config: {
      defaultIcon: ["nc-shadow"],
      icons: ["nc-blur", "nc-vertical"]
    },
    value: [boxShadowBlurValue, boxShadowVerticalValue],
    onChange: ([boxShadowBlur, boxShadowVertical]) => {
      const values = {
        ...{ v, device, state, onChange },
        ...{
          boxShadowBlur,
          boxShadowVertical
        }
      };

      return saveOnChanges(values);
    }
  };
}
export function toolbarElementSectionSaved({
  device,
  component,
  state,
  blockType,
  position = 90,
  disabled = false,
  devices = "all"
}) {
  const dvk = key => defaultValueKey({ key, device, state });

  return {
    devices,
    position,
    blockType,
    id: dvk("makeItSaved"),
    type: "savedBlock",
    icon: "nc-save-section",
    disabled,
    title: t("Save"),
    tooltipContent: t("Saved"),
    value: { blockId: component.getId() }
  };
}

const getInstanceParentId = (key, type) => {
  if (key && type === "popup") {
    return key.split("_")[0];
  }

  return undefined;
};

export function toolbarElementSectionGlobal({
  device,
  component,
  state,
  blockType,
  devices = "all"
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const componentId = component.getId();
  const config = Config.getAll();
  const disabled = isCloud(config) && isShopify(config);

  return {
    devices,
    blockType,
    id: dvk("makeItGlobal"),
    label: t("Make it Global"),
    type: "globalBlock",
    disabled,
    position: 125,
    value: {
      _id: componentId,
      parentId: getInstanceParentId(component.props.instanceKey, blockType)
    }
  };
}
