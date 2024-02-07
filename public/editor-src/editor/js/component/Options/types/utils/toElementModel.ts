import { ElementModel } from "visual/component/Elements/Types";
import { ToElementModel } from "visual/component/Options/Type";
import { OptionName, OptionValue } from "visual/component/Options/types";
import { toElementModel as population } from "visual/component/Options/types/common/Population/converters";
import { toElementModel as stateMode } from "visual/component/Options/types/common/StateMode/converters";
import { toElementModel as ai } from "visual/component/Options/types/dev/AiText/converters";
import { toElementModel as alert } from "visual/component/Options/types/dev/Alert/converters";
import { toElementModel as animation } from "visual/component/Options/types/dev/Animation/converters";
import { toElementModel as backgroundColor } from "visual/component/Options/types/dev/BackgroundColor/converters";
import { toElementModel as border } from "visual/component/Options/types/dev/Border/converters";
import { toElementModel as boxShadow } from "visual/component/Options/types/dev/BoxShadow/converters";
import { toElementModel as button } from "visual/component/Options/types/dev/Button/converters";
import { toElementModel as codeMirror } from "visual/component/Options/types/dev/CodeMirror/converters";
import { toElementModel as colorPicker } from "visual/component/Options/types/dev/ColorPicker/converters";
import { toElementModel as corners } from "visual/component/Options/types/dev/Corners/converters";
import { toElementModel as fileUpload } from "visual/component/Options/types/dev/FileUpload/converters";
import { toElementModel as filters } from "visual/component/Options/types/dev/Filters/converters";
import { toElementModel as formApps } from "visual/component/Options/types/dev/FormApps/converters";
import { toElementModel as gallery } from "visual/component/Options/types/dev/Gallery/converters";
import { toElementModel as galleryForGallery } from "visual/component/Options/types/dev/GalleryForGallery/converters";
import { toElementModel as globalBlock } from "visual/component/Options/types/dev/GlobalBlock/converters";
import { toElementModel as grid } from "visual/component/Options/types/dev/Grid/converters";
import { toElementModel as group } from "visual/component/Options/types/dev/Group/converters";
import { toElementModel as iconPicker } from "visual/component/Options/types/dev/IconPicker/converters";
import { toElementModel as iconSetter } from "visual/component/Options/types/dev/IconSetter/converters";
import { toElementModel as iconsPicker } from "visual/component/Options/types/dev/IconsPicker/converters";
import { toElementModel as imageUpload } from "visual/component/Options/types/dev/ImageUpload/converters";
import { toElementModel as inputText } from "visual/component/Options/types/dev/InputText/converters";
import { toElementModel as internalLink } from "visual/component/Options/types/dev/InternalLink/converters";
import { toElementModel as margin } from "visual/component/Options/types/dev/Margin/converters";
import { toElementModel as motion } from "visual/component/Options/types/dev/Motion/converters";
import { toElementModel as multiSelect } from "visual/component/Options/types/dev/MultiSelect2/converters";
import { toElementModel as number } from "visual/component/Options/types/dev/Number/converters";
import { toElementModel as order } from "visual/component/Options/types/dev/Order/converters";
import { toElementModel as padding } from "visual/component/Options/types/dev/Padding/converters";
import { toElementModel as paypal } from "visual/component/Options/types/dev/PayPal/converters";
import { toElementModel as popover } from "visual/component/Options/types/dev/Popover/converters";
import { toElementModel as predefinedPopulation } from "visual/component/Options/types/dev/PredefinedPopulation/converters";
import { toElementModel as radioGroup } from "visual/component/Options/types/dev/RadioGroup/converters";
import { toElementModel as range } from "visual/component/Options/types/dev/Range/converters";
import { toElementModel as savedBlock } from "visual/component/Options/types/dev/SavedBlock/converters";
import { toElementModel as select } from "visual/component/Options/types/dev/Select/converters";
import { toElementModel as sidebarTabs } from "visual/component/Options/types/dev/SidebarTabs/converters";
import { toElementModel as sidebarTabsButton } from "visual/component/Options/types/dev/SidebarTabsButton/converters";
import { toElementModel as slider } from "visual/component/Options/types/dev/Slider/converters";
import { toElementModel as _switch } from "visual/component/Options/types/dev/Switch/converters";
import { toElementModel as tabs } from "visual/component/Options/types/dev/Tabs/converters";
import { toElementModel as textShadow } from "visual/component/Options/types/dev/TextShadow/converters";
import { toElementModel as textarea } from "visual/component/Options/types/dev/Textarea/converters";
import { toElementModel as toggle } from "visual/component/Options/types/dev/Toggle/converters";
import { toElementModel as transform } from "visual/component/Options/types/dev/Transform/converters";
import { toElementModel as typography } from "visual/component/Options/types/dev/Typography/converters";

type ToElementModelFns = {
  [K in OptionName]: ToElementModel<K>;
};

const fns: ToElementModelFns = {
  aiText: ai,
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
  formApps: formApps
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
