import { OptionName, OptionValue } from "visual/component/Options/types";
import { defaultValue as population } from "visual/component/Options/types/common/Population/converters";
import { defaultValue as stateMode } from "visual/component/Options/types/common/StateMode/converters";
import { defaultValue as alert } from "visual/component/Options/types/dev/Alert/converters";
import { defaultValue as animation } from "visual/component/Options/types/dev/Animation/converters";
import { defaultValue as backgroundColor } from "visual/component/Options/types/dev/BackgroundColor/converters";
import { defaultValue as border } from "visual/component/Options/types/dev/Border/converters";
import { defaultValue as boxShadow } from "visual/component/Options/types/dev/BoxShadow/converters";
import { defaultValue as button } from "visual/component/Options/types/dev/Button/converters";
import { defaultValue as codeMirror } from "visual/component/Options/types/dev/CodeMirror/converters";
import { defaultValue as colorPicker } from "visual/component/Options/types/dev/ColorPicker/converters";
import { defaultValue as corners } from "visual/component/Options/types/dev/Corners/converters";
import { defaultValue as fileUpload } from "visual/component/Options/types/dev/FileUpload/converters";
import { defaultValue as filters } from "visual/component/Options/types/dev/Filters/converters";
import { defaultValue as formApps } from "visual/component/Options/types/dev/FormApps/converters";
import { defaultValue as gallery } from "visual/component/Options/types/dev/Gallery/converters";
import { defaultValue as galleryForGallery } from "visual/component/Options/types/dev/GalleryForGallery/converters";
import { defaultValue as globalBlock } from "visual/component/Options/types/dev/GlobalBlock/converters";
import { defaultValue as grid } from "visual/component/Options/types/dev/Grid/converters";
import { defaultValue as group } from "visual/component/Options/types/dev/Group/converters";
import { defaultValue as iconPicker } from "visual/component/Options/types/dev/IconPicker/converters";
import { defaultValue as iconSetter } from "visual/component/Options/types/dev/IconSetter/converters";
import { defaultValue as iconsPicker } from "visual/component/Options/types/dev/IconsPicker/converters";
import { defaultValue as imageUpload } from "visual/component/Options/types/dev/ImageUpload/converters";
import { defaultValue as inputText } from "visual/component/Options/types/dev/InputText/converters";
import { defaultValue as internalLink } from "visual/component/Options/types/dev/InternalLink/converters";
import { defaultValue as margin } from "visual/component/Options/types/dev/Margin/converters";
import { defaultValue as motion } from "visual/component/Options/types/dev/Motion/converters";
import { defaultValue as multiSelect } from "visual/component/Options/types/dev/MultiSelect2/converters";
import { defaultValue as number } from "visual/component/Options/types/dev/Number/converters";
import { defaultValue as order } from "visual/component/Options/types/dev/Order/converters";
import { defaultValue as padding } from "visual/component/Options/types/dev/Padding/converters";
import { defaultValue as paypal } from "visual/component/Options/types/dev/PayPal/converters";
import { defaultValue as popover } from "visual/component/Options/types/dev/Popover/converters";
import { defaultValue as radioGroup } from "visual/component/Options/types/dev/RadioGroup/converters";
import { defaultValue as range } from "visual/component/Options/types/dev/Range/converters";
import { defaultValue as savedBlock } from "visual/component/Options/types/dev/SavedBlock/converters";
import { defaultValue as select } from "visual/component/Options/types/dev/Select/converters";
import { defaultValue as sidebarTabs } from "visual/component/Options/types/dev/SidebarTabs/converters";
import { defaultValue as slider } from "visual/component/Options/types/dev/Slider/converters";
import { defaultValue as _switch } from "visual/component/Options/types/dev/Switch/converters";
import { defaultValue as tabs } from "visual/component/Options/types/dev/Tabs/converters";
import { defaultValue as textShadow } from "visual/component/Options/types/dev/TextShadow/converters";
import { defaultValue as textarea } from "visual/component/Options/types/dev/Textarea/converters";
import { defaultValue as toggle } from "visual/component/Options/types/dev/Toggle/converters";
import { defaultValue as transform } from "visual/component/Options/types/dev/Transform/converters";
import { defaultValue as typography } from "visual/component/Options/types/dev/Typography/converters";

type DefaultValues = {
  [K in OptionName]: OptionValue<K>;
};

export const defaultValues: DefaultValues = {
  "alert-dev": alert,
  "animation-dev": animation,
  "backgroundColor-dev": backgroundColor,
  "border-dev": border,
  "boxShadow-dev": boxShadow,
  "button-dev": button,
  "codeMirror-dev": codeMirror,
  "colorPicker-dev": colorPicker,
  "corners-dev": corners,
  "filters-dev": filters,
  "fileUpload-dev": fileUpload,
  "gallery-dev": gallery,
  "gallery-for-gallery-dev": galleryForGallery,
  "grid-dev": grid,
  "group-dev": group,
  "iconPicker-dev": iconPicker,
  "iconsPicker-dev": iconsPicker,
  "iconSetter-dev": iconSetter,
  "imageUpload-dev": imageUpload,
  "inputText-dev": inputText,
  "internalLink-dev": internalLink,
  "margin-dev": margin,
  "motion-dev": motion,
  "multiSelect-dev": multiSelect,
  "number-dev": number,
  "order-dev": order,
  "padding-dev": padding,
  "paypal-dev": paypal,
  "popover-dev": popover,
  "population-dev": population,
  "predefinedPopulation-dev": population,
  "radioGroup-dev": radioGroup,
  "range-dev": range,
  "select-dev": select,
  "sidebarTabs-dev": sidebarTabs,
  "sidebarTabsButton-dev": sidebarTabs,
  "slider-dev": slider,
  "stateMode-dev": stateMode,
  "switch-dev": _switch,
  "tabs-dev": tabs,
  "textarea-dev": textarea,
  "textShadow-dev": textShadow,
  "toggle-dev": toggle,
  "transform-dev": transform,
  "typography-dev": typography,
  "savedBlock-dev": savedBlock,
  "globalBlock-dev": globalBlock,
  "formApps-dev": formApps
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
