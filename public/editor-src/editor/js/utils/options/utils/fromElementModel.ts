import { ElementModel } from "visual/component/Elements/Types";
import { FromElementModel } from "visual/component/Options/Type";
import type { OptionName, OptionValue } from "visual/component/Options/types";
import { createOptionId } from "visual/editorComponents/EditorComponent/utils";
import { BreakpointsNames } from "visual/utils/breakpoints/types";
import { defaultValueValue } from "visual/utils/onChange";
import { fromElementModel as ai } from "visual/utils/options/AiText/converters";
import { fromElementModel as alert } from "visual/utils/options/Alert/converters";
import { fromElementModel as animation } from "visual/utils/options/Animation/converters";
import { fromElementModel as backgroundColor } from "visual/utils/options/BackgroundColor/converters";
import { fromElementModel as border } from "visual/utils/options/Border/converters";
import { fromElementModel as boxShadow } from "visual/utils/options/BoxShadow/converters";
import { fromElementModel as button } from "visual/utils/options/Button/converters";
import { fromElementModel as codeMirror } from "visual/utils/options/CodeMirror/converters";
import { fromElementModel as colorPicker } from "visual/utils/options/ColorPicker/converters";
import { fromElementModel as corners } from "visual/utils/options/Corners/converters";
import { fromElementModel as editableSelect } from "visual/utils/options/EditableSelect/converters";
import { fromElementModel as fileUpload } from "visual/utils/options/FileUpload/converters";
import { fromElementModel as filters } from "visual/utils/options/Filters/converters";
import { fromElementModel as formApps } from "visual/utils/options/FormApps/converters";
import { fromElementModel as gallery } from "visual/utils/options/Gallery/converters";
import { fromElementModel as galleryForGallery } from "visual/utils/options/GalleryForGallery/converters";
import { fromElementModel as gbCondition } from "visual/utils/options/GbCondition/converters";
import { fromElementModel as globalBlock } from "visual/utils/options/GlobalBlock/converters";
import { fromElementModel as grid } from "visual/utils/options/Grid/converters";
import { fromElementModel as group } from "visual/utils/options/Group/converters";
import { fromElementModel as iconPicker } from "visual/utils/options/IconPicker/converters";
import { fromElementModel as iconSetter } from "visual/utils/options/IconSetter/converters";
import { fromElementModel as iconsPicker } from "visual/utils/options/IconsPicker/converters";
import { fromElementModel as imageUpload } from "visual/utils/options/ImageUpload/converters";
import { fromElementModel as inputText } from "visual/utils/options/InputText/converters";
import { fromElementModel as internalLink } from "visual/utils/options/InternalLink/converters";
import { fromElementModel as margin } from "visual/utils/options/Margin/converters";
import { fromElementModel as motion } from "visual/utils/options/Motion/converters";
import { fromElementModel as multiSelect } from "visual/utils/options/MultiSelect2/converters";
import { fromElementModel as number } from "visual/utils/options/Number/converters";
import { fromElementModel as order } from "visual/utils/options/Order/converters";
import { fromElementModel as padding } from "visual/utils/options/Padding/converters";
import { fromElementModel as paypal } from "visual/utils/options/PayPal/converters";
import { fromElementModel as popover } from "visual/utils/options/Popover/converters";
import { fromElementModel as population } from "visual/utils/options/Population/converters";
import { fromElementModel as predefinedPopulation } from "visual/utils/options/PredefinedPopulation/converters";
import { fromElementModel as promptAddPopup } from "visual/utils/options/PromptAddPopup/converters";
import { fromElementModel as radioGroup } from "visual/utils/options/RadioGroup/converters";
import { fromElementModel as range } from "visual/utils/options/Range/converters";
import { fromElementModel as savedBlock } from "visual/utils/options/SavedBlock/converters";
import { fromElementModel as checkGroup } from "visual/utils/options/CheckGroup/converters";
import { fromElementModel as select } from "visual/utils/options/Select/converters";
import { fromElementModel as sidebarTabs } from "visual/utils/options/SidebarTabs/converters";
import { fromElementModel as sidebarTabsButton } from "visual/utils/options/SidebarTabsButton/converters";
import { fromElementModel as slider } from "visual/utils/options/Slider/converters";
import { fromElementModel as stateMode } from "visual/utils/options/StateMode/converters";
import { fromElementModel as _switch } from "visual/utils/options/Switch/converters";
import { fromElementModel as tabs } from "visual/utils/options/Tabs/converters";
import { fromElementModel as textShadow } from "visual/utils/options/TextShadow/converters";
import { fromElementModel as textarea } from "visual/utils/options/Textarea/converters";
import { fromElementModel as toggle } from "visual/utils/options/Toggle/converters";
import { fromElementModel as showOnDevice } from "visual/utils/options/ShowOnDevice/converters";
import { fromElementModel as toggleButton } from "visual/utils/options/ToggleButton/converters";
import { fromElementModel as transform } from "visual/utils/options/Transform/converters";
import { fromElementModel as typography } from "visual/utils/options/Typography/converters";
import { fromElementModel as blockThumbnail } from "visual/utils/options/BlockThumbnail/converters";
import { fromElementModel as popupCondition } from "visual/utils/options/PopupCondition/converters";
import { fromElementModel as fontStyleEditor } from "visual/utils/options/FontStyleEditor/converters";
import { fromElementModel as colorPaletteEditor } from "visual/utils/options/ColorPaletteEditor/converters";
import { fromElementModel as advancedSettings } from "visual/utils/options/AdvancedSettings/converters";
import { read as readObject, replaceNullish } from "visual/utils/reader/object";
import { DESKTOP } from "visual/utils/responsiveMode";
import { NORMAL, State } from "visual/utils/stateMode";
import { Literal } from "visual/utils/types/Literal";
import { MValue } from "visual/utils/value";
import { applyDefaultValueToOption } from "./defaultValue";
import { fromElementModel as symbols } from "visual/utils/options/Symbols/converters";
import { Store } from "visual/redux/store";

type FromElementModelFns = {
  [K in OptionName]: FromElementModel<K>;
};

const fns: FromElementModelFns = {
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
  predefinedPopulation: predefinedPopulation,
  radioGroup: radioGroup,
  range: range,
  select: select,
  sidebarTabs: sidebarTabs,
  sidebarTabsButton: sidebarTabsButton,
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
  toggleButton: toggleButton,
  gbCondition: gbCondition,
  colorPaletteEditor: colorPaletteEditor,
  editableSelect: editableSelect,
  promptAddPopup: promptAddPopup,
  fontStyleEditor: fontStyleEditor,
  showOnDevice: showOnDevice,
  checkGroup: checkGroup,
  advancedSettings: advancedSettings,
  blockThumbnail: blockThumbnail,
  symbols
};

/**
 * Returns a function that creates the option model object from element model
 */
export const fromElementModel = <T extends OptionName>(
  type: T
): FromElementModel<T> => {
  return (getFn): Partial<OptionValue<T>> => {
    const model = fns[type] ?? (() => ({}));

    return applyDefaultValueToOption<Partial<OptionValue<T>>>(
      model(getFn),
      type
    );
  };
};

export const getOptionModel = <T extends OptionName>({
  type,
  id,
  v,
  breakpoint,
  state = NORMAL
}: {
  type: T;
  id: string;
  v: ElementModel;
  breakpoint: BreakpointsNames;
  store: Store;
  state?: State;
}): OptionValue<T> => {
  const getModel = fromElementModel(type);
  const get = (k: string, withoutId = false): MValue<Literal> => {
    // withoutId parameter was added to be able to extract the value for old options that were split in two separate options (example internal-link and select with key `source`).
    const key = withoutId ? k : createOptionId(id, k);
    return defaultValueValue({
      v,
      device: breakpoint,
      state,
      key
    });
  };

  return getModel(get) as OptionValue<T>;
};

// INFO: this function is kind of `dvv` function that return value from desktop if actual is nullish
export const getOptionModelWithDesktopDefaults = <T extends OptionName>({
  type,
  id,
  v,
  breakpoint,
  store,
  state = NORMAL
}: {
  type: T;
  id: string;
  v: ElementModel;
  breakpoint: BreakpointsNames;
  store: Store;
  state?: State;
}): OptionValue<T> => {
  const desktopModel = getOptionModel<T>({
    id,
    type,
    v,
    state,
    store,
    breakpoint: DESKTOP
  });

  const model = getOptionModel<T>({
    id,
    type,
    v,
    state,
    store,
    breakpoint
  });

  const m = readObject(model);
  const desktopM = readObject(desktopModel);

  if (m && desktopM) {
    return replaceNullish(m, desktopM) as OptionValue<T>;
  }

  return (m ?? {}) as OptionValue<T>;
};
