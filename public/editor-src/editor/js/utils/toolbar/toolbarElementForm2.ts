import { mPipe } from "fp-utilities";
import _, { flatten } from "underscore";
import {
  ElementModel,
  ElementModelType2
} from "visual/component/Elements/Types";
import type { FormField } from "visual/component/Prompts/common/GlobalApps/type";
import type { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import type { DeviceMode } from "visual/types";
import type { Device } from "visual/utils/devices";
import { defaultValueKey } from "visual/utils/onChange";
import * as Str from "visual/utils/reader/string";
import { State } from "visual/utils/stateMode";

interface Data {
  v: ElementModel;
  devices: Device;
  device: DeviceMode;
  state: State;
  showIntegrations: boolean;
}

const repeatFunc = mPipe(
  (items: ElementModel["items"]) => items?.map((item) => item.value.items),
  flatten
);

const getForm2Fields = (data: ElementModelType2[]) =>
  mPipe(
    (items: ElementModelType2[]) =>
      items.find((item) => item.type === ElementTypes.Form2Steps),
    (item: ElementModelType2) => item.value.items,
    repeatFunc,
    repeatFunc
  )(data);

export function toolbarElementForm2Apps({
  v,
  device,
  state,
  devices = "all",
  showIntegrations
}: Data): ToolbarItemType {
  const items =
    v.multistep === "on" && v.items
      ? getForm2Fields(v.items as ElementModelType2[])
      : v.items?.[0].value.items;

  const fields = Array.isArray(items)
    ? (_.pluck(items, "value") as FormField[])
    : [];
  const dvk = (key: string) => defaultValueKey({ key, device, state });

  return {
    devices,
    id: dvk("apps"),
    type: "formApps",
    disabled: !showIntegrations,
    config: {
      id: Str.read(v._id) ?? "",
      fields,
      icon: "nc-extensions-2"
    }
  };
}
