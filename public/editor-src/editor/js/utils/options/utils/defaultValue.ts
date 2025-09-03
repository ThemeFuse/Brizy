import { OptionName, OptionValue } from "visual/component/Options/types";
import { defaultValue as addable } from "visual/utils/options/Addable/converters";
import { defaultValue as advancedSettings } from "visual/utils/options/AdvancedSettings/converters";
import { defaultValue as ai } from "visual/utils/options/AiText/converters";
import { defaultValue as alert } from "visual/utils/options/Alert/converters";
import { defaultValue as animation } from "visual/utils/options/Animation/converters";
import { defaultValue as backgroundColor } from "visual/utils/options/BackgroundColor/converters";
import { defaultValue as blockThumbnail } from "visual/utils/options/BlockThumbnail/converters";
import { defaultValue as border } from "visual/utils/options/Border/converters";
import { defaultValue as boxShadow } from "visual/utils/options/BoxShadow/converters";
import { defaultValue as button } from "visual/utils/options/Button/converters";
import { defaultValue as checkGroup } from "visual/utils/options/CheckGroup/converters";
import { defaultValue as codeMirror } from "visual/utils/options/CodeMirror/converters";
import { defaultValue as colorPaletteEditor } from "visual/utils/options/ColorPaletteEditor/converters";
import { defaultValue as colorPicker } from "visual/utils/options/ColorPicker/converters";
import { defaultValue as corners } from "visual/utils/options/Corners/converters";
import { defaultValue as editableSelect } from "visual/utils/options/EditableSelect/converters";
import { defaultValue as fileUpload } from "visual/utils/options/FileUpload/converters";
import { defaultValue as filters } from "visual/utils/options/Filters/converters";
import { defaultValue as fontStyleEditor } from "visual/utils/options/FontStyleEditor/converters";
import { defaultValue as formApps } from "visual/utils/options/FormApps/converters";
import { defaultValue as gallery } from "visual/utils/options/Gallery/converters";
import { defaultValue as galleryForGallery } from "visual/utils/options/GalleryForGallery/converters";
import { defaultValue as gbCondition } from "visual/utils/options/GbCondition/converters";
import { defaultValue as globalBlock } from "visual/utils/options/GlobalBlock/converters";
import { defaultValue as grid } from "visual/utils/options/Grid/converters";
import { defaultValue as group } from "visual/utils/options/Group/converters";
import { defaultValue as iconPicker } from "visual/utils/options/IconPicker/converters";
import { defaultValue as iconSetter } from "visual/utils/options/IconSetter/converters";
import { defaultValue as iconsPicker } from "visual/utils/options/IconsPicker/converters";
import { defaultValue as imageUpload } from "visual/utils/options/ImageUpload/converters";
import { defaultValue as inputText } from "visual/utils/options/InputText/converters";
import { defaultValue as internalLink } from "visual/utils/options/InternalLink/converters";
import { defaultValue as margin } from "visual/utils/options/Margin/converters";
import { defaultValue as motion } from "visual/utils/options/Motion/converters";
import { defaultValue as multiSelect } from "visual/utils/options/MultiSelect2/converters";
import { defaultValue as number } from "visual/utils/options/Number/converters";
import { defaultValue as order } from "visual/utils/options/Order/converters";
import { defaultValue as padding } from "visual/utils/options/Padding/converters";
import { defaultValue as paypal } from "visual/utils/options/PayPal/converters";
import { defaultValue as popover } from "visual/utils/options/Popover/converters";
import { defaultValue as population } from "visual/utils/options/Population/converters";
import { defaultValue as popupCondition } from "visual/utils/options/PopupCondition/converters";
import { defaultValue as promptAddPopup } from "visual/utils/options/PromptAddPopup/converters";
import { defaultValue as radioGroup } from "visual/utils/options/RadioGroup/converters";
import { defaultValue as range } from "visual/utils/options/Range/converters";
import { defaultValue as savedBlock } from "visual/utils/options/SavedBlock/converters";
import { defaultValue as select } from "visual/utils/options/Select/converters";
import { defaultValue as showOnDevice } from "visual/utils/options/ShowOnDevice/converters";
import { defaultValue as sidebarTabs } from "visual/utils/options/SidebarTabs/converters";
import { defaultValue as slider } from "visual/utils/options/Slider/converters";
import { defaultValue as stateMode } from "visual/utils/options/StateMode/converters";
import { defaultValue as _switch } from "visual/utils/options/Switch/converters";
import { defaultValue as symbols } from "visual/utils/options/Symbols/converters";
import { defaultValue as tabs } from "visual/utils/options/Tabs/converters";
import { defaultValue as textShadow } from "visual/utils/options/TextShadow/converters";
import { defaultValue as textarea } from "visual/utils/options/Textarea/converters";
import { defaultValue as toggle } from "visual/utils/options/Toggle/converters";
import { defaultValue as toggleButton } from "visual/utils/options/ToggleButton/converters";
import { defaultValue as transform } from "visual/utils/options/Transform/converters";
import { defaultValue as typography } from "visual/utils/options/Typography/converters";
import { defaultValue as linkExternal } from "../LinkExternal/converters";

type DefaultValues = {
  [K in OptionName]: OptionValue<K>;
};

export const defaultValues: DefaultValues = {
  aiText: ai,
  popupCondition: popupCondition,
  alert: alert,
  animation: animation,
  backgroundColor: backgroundColor,
  border: border,
  boxShadow: boxShadow,
  button: button,
  codeMirror: codeMirror,
  colorPicker: colorPicker,
  corners: corners,
  filters: filters,
  fileUpload: fileUpload,
  gallery: gallery,
  "gallery-for-gallery": galleryForGallery,
  grid: grid,
  group: group,
  iconPicker: iconPicker,
  iconsPicker: iconsPicker,
  iconSetter: iconSetter,
  imageUpload: imageUpload,
  inputText: inputText,
  internalLink: internalLink,
  margin: margin,
  motion: motion,
  multiSelect: multiSelect,
  number: number,
  order: order,
  padding: padding,
  paypal: paypal,
  popover: popover,
  population: population,
  predefinedPopulation: population,
  radioGroup: radioGroup,
  range: range,
  select: select,
  sidebarTabs: sidebarTabs,
  sidebarTabsButton: sidebarTabs,
  slider: slider,
  stateMode: stateMode,
  switch: _switch,
  tabs: tabs,
  textarea: textarea,
  textShadow: textShadow,
  toggle: toggle,
  transform: transform,
  typography: typography,
  savedBlock: savedBlock,
  globalBlock: globalBlock,
  formApps: formApps,
  gbCondition: gbCondition,
  toggleButton: toggleButton,
  editableSelect: editableSelect,
  colorPaletteEditor: colorPaletteEditor,
  promptAddPopup: promptAddPopup,
  blockThumbnail: blockThumbnail,
  fontStyleEditor: fontStyleEditor,
  checkGroup: checkGroup,
  showOnDevice: showOnDevice,
  advancedSettings: advancedSettings,
  symbols,
  addable,
  linkExternal
};

export function applyDefaultValueToOption<T>(values: T, type: OptionName): T {
  const defaultValue = defaultValues[type];

  if (!defaultValue) return values;

  const valueEntries = Object.entries(
    defaultValue as { [k in keyof T]: T[k] }
  ) as [keyof T, T[keyof T]][];

  return valueEntries.reduce((acc, [key, defaultOptionValue]) => {
    acc[key] = Object.prototype.hasOwnProperty.call(values, key)
      ? values[key]
      : defaultOptionValue;
    return acc;
  }, values);
}
