import { t } from "visual/utils/i18n";
import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";
import type { ElementModel } from "visual/component/Elements/Types";
import type { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import type { DeviceMode } from "visual/types";
import type { Device } from "visual/utils/devices";
import { State } from "visual/utils/stateMode";

interface Data {
  v: ElementModel;
  device: DeviceMode;
  state: State;
  devices?: Device;
  disabled?: boolean;
}

export function toolbarLinkAnchor({
  v,
  device,
  state,
  devices = "all",
  disabled = false
}: Data): ToolbarItemType {
  const dvk = (key: string): string => defaultValueKey({ key, device, state });
  const dvv = (key: string): string =>
    defaultValueValue({ v, key, device, state });

  return {
    id: dvk("linkAnchor"),
    label: t("Block"),
    type: "blockThumbnail",
    devices,
    disabled,
    // @ts-expect-error wrong typing, 'value' does not exist in type GenericToolbarItemType<"blockThumbnail">
    value: dvv("linkAnchor")
  };
}
