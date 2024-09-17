import _ from "underscore";
import type { ElementModel } from "visual/component/Elements/Types";
import type { FormField } from "visual/component/Prompts/common/GlobalApps/type";
import type { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import Config from "visual/global/Config";
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
}

export function toolbarElementForm2Apps({
  v,
  device,
  state,
  devices = "all"
}: Data): ToolbarItemType {
  const items = v?.items?.[0].value.items;

  const fields = Array.isArray(items)
    ? (_.pluck(items, "value") as FormField[])
    : [];
  const dvk = (key: string) => defaultValueKey({ key, device, state });

  const showIntegrations =
    Config.getAll()?.integrations?.form?.showIntegrations ?? false;

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
