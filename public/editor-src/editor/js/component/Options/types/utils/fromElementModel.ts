import { ElementModel } from "visual/component/Elements/Types";
import { FromElementModel } from "visual/component/Options/Type";
import type { OptionName, OptionValue } from "visual/component/Options/types";
import { fromElementModel as population } from "visual/component/Options/types/common/Population/converters";
import { fromElementModel as stateMode } from "visual/component/Options/types/common/StateMode/converters";
import { fromElementModel as ai } from "visual/component/Options/types/dev/AiText/converters";
import { fromElementModel as alert } from "visual/component/Options/types/dev/Alert/converters";
import { fromElementModel as animation } from "visual/component/Options/types/dev/Animation/converters";
import { fromElementModel as backgroundColor } from "visual/component/Options/types/dev/BackgroundColor/converters";
import { fromElementModel as border } from "visual/component/Options/types/dev/Border/converters";
import { fromElementModel as boxShadow } from "visual/component/Options/types/dev/BoxShadow/converters";
import { fromElementModel as button } from "visual/component/Options/types/dev/Button/converters";
import { fromElementModel as codeMirror } from "visual/component/Options/types/dev/CodeMirror/converters";
import { fromElementModel as colorPicker } from "visual/component/Options/types/dev/ColorPicker/converters";
import { fromElementModel as corners } from "visual/component/Options/types/dev/Corners/converters";
import { fromElementModel as fileUpload } from "visual/component/Options/types/dev/FileUpload/converters";
import { fromElementModel as filters } from "visual/component/Options/types/dev/Filters/converters";
import { fromElementModel as formApps } from "visual/component/Options/types/dev/FormApps/converters";
import { fromElementModel as gallery } from "visual/component/Options/types/dev/Gallery/converters";
import { fromElementModel as galleryForGallery } from "visual/component/Options/types/dev/GalleryForGallery/converters";
import { fromElementModel as globalBlock } from "visual/component/Options/types/dev/GlobalBlock/converters";
import { fromElementModel as grid } from "visual/component/Options/types/dev/Grid/converters";
import { fromElementModel as group } from "visual/component/Options/types/dev/Group/converters";
import { fromElementModel as iconPicker } from "visual/component/Options/types/dev/IconPicker/converters";
import { fromElementModel as iconSetter } from "visual/component/Options/types/dev/IconSetter/converters";
import { fromElementModel as iconsPicker } from "visual/component/Options/types/dev/IconsPicker/converters";
import { fromElementModel as imageUpload } from "visual/component/Options/types/dev/ImageUpload/converters";
import { fromElementModel as inputText } from "visual/component/Options/types/dev/InputText/converters";
import { fromElementModel as internalLink } from "visual/component/Options/types/dev/InternalLink/converters";
import { fromElementModel as margin } from "visual/component/Options/types/dev/Margin/converters";
import { fromElementModel as motion } from "visual/component/Options/types/dev/Motion/converters";
import { fromElementModel as multiSelect } from "visual/component/Options/types/dev/MultiSelect2/converters";
import { fromElementModel as number } from "visual/component/Options/types/dev/Number/converters";
import { fromElementModel as order } from "visual/component/Options/types/dev/Order/converters";
import { fromElementModel as padding } from "visual/component/Options/types/dev/Padding/converters";
import { fromElementModel as paypal } from "visual/component/Options/types/dev/PayPal/converters";
import { fromElementModel as popover } from "visual/component/Options/types/dev/Popover/converters";
import { fromElementModel as predefinedPopulation } from "visual/component/Options/types/dev/PredefinedPopulation/converters";
import { fromElementModel as radioGroup } from "visual/component/Options/types/dev/RadioGroup/converters";
import { fromElementModel as range } from "visual/component/Options/types/dev/Range/converters";
import { fromElementModel as savedBlock } from "visual/component/Options/types/dev/SavedBlock/converters";
import { fromElementModel as select } from "visual/component/Options/types/dev/Select/converters";
import { fromElementModel as sidebarTabs } from "visual/component/Options/types/dev/SidebarTabs/converters";
import { fromElementModel as sidebarTabsButton } from "visual/component/Options/types/dev/SidebarTabsButton/converters";
import { fromElementModel as slider } from "visual/component/Options/types/dev/Slider/converters";
import { fromElementModel as _switch } from "visual/component/Options/types/dev/Switch/converters";
import { fromElementModel as tabs } from "visual/component/Options/types/dev/Tabs/converters";
import { fromElementModel as textShadow } from "visual/component/Options/types/dev/TextShadow/converters";
import { fromElementModel as textarea } from "visual/component/Options/types/dev/Textarea/converters";
import { fromElementModel as toggle } from "visual/component/Options/types/dev/Toggle/converters";
import { fromElementModel as transform } from "visual/component/Options/types/dev/Transform/converters";
import { fromElementModel as typography } from "visual/component/Options/types/dev/Typography/converters";
import { createOptionId } from "visual/editorComponents/EditorComponent/utils";
import { BreakpointsNames } from "visual/utils/breakpoints/types";
import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";
import { NORMAL, State } from "visual/utils/stateMode";
import { Literal } from "visual/utils/types/Literal";
import { MValue } from "visual/utils/value";
import { applyDefaultValueToOption } from "./defaultValue";
import { toElementModel } from "./toElementModel";

type FromElementModelFns = {
  [K in OptionName]: FromElementModel<K>;
};

const fns: FromElementModelFns = {
  "aiText-dev": ai,
  alert: alert,
  animation: animation,
  backgroundColor: backgroundColor,
  border: border,
  boxShadow: boxShadow,
  "button-dev": button,
  "codeMirror-dev": codeMirror,
  colorPicker: colorPicker,
  corners: corners,
  "filters-dev": filters,
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
  "number-dev": number,
  "order-dev": order,
  padding: padding,
  "paypal-dev": paypal,
  popover: popover,
  "population-dev": population,
  predefinedPopulation: predefinedPopulation,
  radioGroup: radioGroup,
  range: range,
  select: select,
  sidebarTabs: sidebarTabs,
  sidebarTabsButton: sidebarTabsButton,
  slider: slider,
  "stateMode-dev": stateMode,
  switch: _switch,
  tabs: tabs,
  textarea: textarea,
  textShadow: textShadow,
  toggle: toggle,
  transform: transform,
  typography: typography,
  "savedBlock-dev": savedBlock,
  globalBlock: globalBlock,
  formApps: formApps
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

export const getOptionModel = ({
  type,
  id,
  v,
  breakpoint,
  state = NORMAL
}: {
  type: OptionName;
  id: string;
  v: ElementModel;
  breakpoint: BreakpointsNames;
  state?: State;
}) => {
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

  return getModel(get);
};

export const getElementModel = ({
  id,
  type,
  v,
  breakpoint,
  state = NORMAL
}: {
  id: string;
  type: OptionName;
  v: ElementModel;
  breakpoint: BreakpointsNames;
  state?: State;
}): ElementModel => {
  const optionModel = getOptionModel({ id, type, v, breakpoint, state });

  const getKey = (id: string, key: string) => {
    return id === "tabsState"
      ? id
      : defaultValueKey({
          key: createOptionId(id, key),
          device: breakpoint,
          state
        });
  };

  const elementModel = toElementModel<typeof type>(type, (key) =>
    getKey(id, key)
  );

  return elementModel(optionModel);
};
