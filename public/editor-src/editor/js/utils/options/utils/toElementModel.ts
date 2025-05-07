import { ElementModel } from "visual/component/Elements/Types";
import { ToElementModel } from "visual/component/Options/Type";
import { OptionName, OptionValue } from "visual/component/Options/types";
import { toElementModel as addable } from "visual/utils/options/Addable/converters";
import { toElementModel as advancedSettings } from "visual/utils/options/AdvancedSettings/converters";
import { toElementModel as ai } from "visual/utils/options/AiText/converters";
import { toElementModel as alert } from "visual/utils/options/Alert/converters";
import { toElementModel as animation } from "visual/utils/options/Animation/converters";
import { toElementModel as backgroundColor } from "visual/utils/options/BackgroundColor/converters";
import { toElementModel as blockThumbnail } from "visual/utils/options/BlockThumbnail/converters";
import { toElementModel as border } from "visual/utils/options/Border/converters";
import { toElementModel as boxShadow } from "visual/utils/options/BoxShadow/converters";
import { toElementModel as button } from "visual/utils/options/Button/converters";
import { toElementModel as checkGroup } from "visual/utils/options/CheckGroup/converters";
import { toElementModel as codeMirror } from "visual/utils/options/CodeMirror/converters";
import { toElementModel as colorPaletteEditor } from "visual/utils/options/ColorPaletteEditor/converters";
import { toElementModel as colorPicker } from "visual/utils/options/ColorPicker/converters";
import { toElementModel as corners } from "visual/utils/options/Corners/converters";
import { toElementModel as editableSelect } from "visual/utils/options/EditableSelect/converters";
import { toElementModel as fileUpload } from "visual/utils/options/FileUpload/converters";
import { toElementModel as filters } from "visual/utils/options/Filters/converters";
import { toElementModel as fontStyleEditor } from "visual/utils/options/FontStyleEditor/converters";
import { toElementModel as formApps } from "visual/utils/options/FormApps/converters";
import { toElementModel as gallery } from "visual/utils/options/Gallery/converters";
import { toElementModel as galleryForGallery } from "visual/utils/options/GalleryForGallery/converters";
import { toElementModel as gbCondition } from "visual/utils/options/GbCondition/converters";
import { toElementModel as globalBlock } from "visual/utils/options/GlobalBlock/converters";
import { toElementModel as grid } from "visual/utils/options/Grid/converters";
import { toElementModel as group } from "visual/utils/options/Group/converters";
import { toElementModel as iconPicker } from "visual/utils/options/IconPicker/converters";
import { toElementModel as iconSetter } from "visual/utils/options/IconSetter/converters";
import { toElementModel as iconsPicker } from "visual/utils/options/IconsPicker/converters";
import { toElementModel as imageUpload } from "visual/utils/options/ImageUpload/converters";
import { toElementModel as inputText } from "visual/utils/options/InputText/converters";
import { toElementModel as internalLink } from "visual/utils/options/InternalLink/converters";
import { toElementModel as margin } from "visual/utils/options/Margin/converters";
import { toElementModel as motion } from "visual/utils/options/Motion/converters";
import { toElementModel as multiSelect } from "visual/utils/options/MultiSelect2/converters";
import { toElementModel as number } from "visual/utils/options/Number/converters";
import { toElementModel as order } from "visual/utils/options/Order/converters";
import { toElementModel as padding } from "visual/utils/options/Padding/converters";
import { toElementModel as paypal } from "visual/utils/options/PayPal/converters";
import { toElementModel as popover } from "visual/utils/options/Popover/converters";
import { toElementModel as population } from "visual/utils/options/Population/converters";
import { toElementModel as popupCondition } from "visual/utils/options/PopupCondition/converters";
import { toElementModel as predefinedPopulation } from "visual/utils/options/PredefinedPopulation/converters";
import { toElementModel as promptAddPopup } from "visual/utils/options/PromptAddPopup/converters";
import { toElementModel as radioGroup } from "visual/utils/options/RadioGroup/converters";
import { toElementModel as range } from "visual/utils/options/Range/converters";
import { toElementModel as savedBlock } from "visual/utils/options/SavedBlock/converters";
import { toElementModel as select } from "visual/utils/options/Select/converters";
import { toElementModel as showOnDevice } from "visual/utils/options/ShowOnDevice/converters";
import { toElementModel as sidebarTabs } from "visual/utils/options/SidebarTabs/converters";
import { toElementModel as sidebarTabsButton } from "visual/utils/options/SidebarTabsButton/converters";
import { toElementModel as slider } from "visual/utils/options/Slider/converters";
import { toElementModel as stateMode } from "visual/utils/options/StateMode/converters";
import { toElementModel as _switch } from "visual/utils/options/Switch/converters";
import { toElementModel as symbols } from "visual/utils/options/Symbols/converters";
import { toElementModel as tabs } from "visual/utils/options/Tabs/converters";
import { toElementModel as textShadow } from "visual/utils/options/TextShadow/converters";
import { toElementModel as textarea } from "visual/utils/options/Textarea/converters";
import { toElementModel as toggle } from "visual/utils/options/Toggle/converters";
import { toElementModel as toggleButton } from "visual/utils/options/ToggleButton/converters";
import { toElementModel as transform } from "visual/utils/options/Transform/converters";
import { toElementModel as typography } from "visual/utils/options/Typography/converters";

type ToElementModelFns = {
  [K in OptionName]: ToElementModel<K>;
};

const fns: ToElementModelFns = {
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
  editableSelect: editableSelect,
  colorPaletteEditor: colorPaletteEditor,
  promptAddPopup: promptAddPopup,
  showOnDevice: showOnDevice,
  checkGroup: checkGroup,
  advancedSettings: advancedSettings,
  blockThumbnail: blockThumbnail,
  fontStyleEditor: fontStyleEditor,
  symbols,
  addable
};

/**
 * Returns a function that creates the element model object from element model
 */
export const toElementModel = <T extends OptionName>(
  type: T,
  get: (k: string) => string
): ((values: OptionValue<T>) => ElementModel) => {
  return (values): ElementModel => {
    const model = fns[type] ?? (() => ({}));

    // @ts-expect-error, need to overview why ts behaviours like this
    return Object.entries(model(values)).reduce((acc, [k, v]) => {
      acc[get(k)] = v;
      return acc;
    }, {} as ElementModel);
  };
};
