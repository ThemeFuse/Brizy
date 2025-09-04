import {
  OptionMeta,
  OptionName,
  OptionValue
} from "visual/component/Options/types";
import { toMeta as backgroundColor } from "visual/utils/options/BackgroundColor/meta";
import { toMeta as border } from "visual/utils/options/Border/meta";
import { toMeta as boxShadow } from "visual/utils/options/BoxShadow/meta";
import { toMeta as corners } from "visual/utils/options/Corners/meta";
import { toMeta as filters } from "visual/utils/options/Filters/meta";
import { toMeta as margin } from "visual/utils/options/Margin/meta";
import { toMeta as padding } from "visual/utils/options/Padding/meta";
import { toMeta as textShadow } from "visual/utils/options/TextShadow/meta";
import { MValue } from "visual/utils/value";
import { ToMetaFns } from "./types";

const fns: ToMetaFns = {
  border: border,
  margin: margin,
  padding: padding,
  corners: corners,
  boxShadow: boxShadow,
  textShadow: textShadow,
  backgroundColor: backgroundColor,
  filters: filters,
  aiText: undefined,
  alert: undefined,
  animation: undefined,
  button: undefined,
  order: undefined,
  codeMirror: undefined,
  colorPicker: undefined,
  fileUpload: undefined,
  group: undefined,
  grid: undefined,
  imageUpload: undefined,
  iconPicker: undefined,
  population: undefined,
  iconsPicker: undefined,
  iconSetter: undefined,
  inputText: undefined,
  internalLink: undefined,
  motion: undefined,
  multiSelect: undefined,
  number: undefined,
  textarea: undefined,
  radioGroup: undefined,
  range: undefined,
  paypal: undefined,
  popover: undefined,
  predefinedPopulation: undefined,
  select: undefined,
  sidebarTabs: undefined,
  sidebarTabsButton: undefined,
  slider: undefined,
  switch: undefined,
  tabs: undefined,
  toggle: undefined,
  typography: undefined,
  gallery: undefined,
  "gallery-for-gallery": undefined,
  stateMode: undefined,
  transform: undefined,
  savedBlock: undefined,
  globalBlock: undefined,
  formApps: undefined,
  toggleButton: undefined,
  gbCondition: undefined,
  popupCondition: undefined,
  editableSelect: undefined,
  colorPaletteEditor: undefined,
  promptAddPopup: undefined,
  fontStyleEditor: undefined,
  showOnDevice: undefined,
  checkGroup: undefined,
  blockThumbnail: undefined,
  advancedSettings: undefined,
  symbols: undefined,
  addable: undefined,
  linkExternal: undefined
};

export const toMeta = <T extends OptionName>(type: T) => {
  return (v: OptionValue<T>): MValue<Partial<OptionMeta<T>>> => {
    const model = fns[type] ?? (() => undefined);

    return model(v);
  };
};
