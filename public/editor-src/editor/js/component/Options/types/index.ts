import { getOr } from "visual/utils/object/get";
import { FromElementModel, OptionType } from "visual/component/Options/Type";
import { ElementModel } from "visual/component/Elements/Types";

import AdvancedSettings from "./AdvancedSettings";
import BlockThumbnail from "./BlockThumbnail";
import Button from "./Button";
import SavedBlock from "./SavedBlock";
import GlobalBlock from "./GlobalBlock";
import CodeMirror from "./CodeMirror";
import ColorFields from "./ColorFields";
import ColorPalette from "./ColorPalette";
import ColorPalette2 from "./ColorPalette2";
import ColorPaletteEditor from "./ColorPaletteEditor";
import ColorPicker2 from "./ColorPicker2";
import FontFamily from "./FontFamily";
import FontStyle from "./FontStyle";
import FontStyleEditor from "./FontStyleEditor";
import FormApps from "./FormApps";
import Grid from "./Grid";
import ImageSetter from "./ImageSetter";
import IconSetter from "./IconSetter";
import MultiInput from "./MultiInput";
import MultiPicker from "./MultiPicker";
import MultiInputPickerOptionType from "./MultiInputPickerOptionType";

import Input from "./Input";
import Textarea from "./Textarea";
import Popover from "./Popover";
import PopupConditions from "./PopupConditions";
import GBConditions from "./GBConditions";
import PromptAddPopup from "./PromptAddPopup";
import PromptIcon from "./PromptIcon";
import RadioGroup from "./RadioGroup";
import CheckGroup from "./CheckGroup";
import Select from "./Select";
import Slider from "./Slider";
import Stepper from "./Stepper";
import Switch from "./Switch";
import Tabs from "./Tabs";
import Toggle from "./Toggle";
import InputNumber from "./InputNumber";
import Range from "./Range";
import Range2 from "./Range2";
import IntegrationsApps from "./IntegrationsApps";
import FileUpload from "./FileUpload";
import { StateMode } from "./common/StateMode";

// Option types that are in development
import { ColorPicker as ColorPickerDev } from "visual/component/Options/types/dev/ColorPicker";
import { BackgroundColor } from "visual/component/Options/types/dev/BackgroundColor";
import { BoxShadow } from "visual/component/Options/types/dev/BoxShadow";
import { Border } from "visual/component/Options/types/dev/Border";
import { Button as ButtonDev } from "visual/component/Options/types/dev/Button";
import { Grid as GridDev } from "visual/component/Options/types/dev/Grid";
import { Group } from "visual/component/Options/types/dev/Group";
import { Typography } from "visual/component/Options/types/dev/Typography";
import { ImageUpload } from "visual/component/Options/types/dev/ImageUpload";
import { Population } from "visual/component/Options/types/common/Population/Population";
import { InputText } from "visual/component/Options/types/dev/InputText";
import { Margin } from "./dev/Margin";
import { MultiSelect } from "visual/component/Options/types/dev/MultiSelect2";
import { Select as SelectDev } from "visual/component/Options/types/dev/Select";
import { Switch as SwitchDev } from "visual/component/Options/types/dev/Switch";
import { Slider as SliderDev } from "./dev/Slider";
import { Toggle as ToggleDev } from "./dev/Toggle";
import { Padding } from "./dev/Padding";
import { Popover as PopoverDev } from "./dev/Popover";
import { Tabs as TabsDev } from "./dev/Tabs";
import { Textarea as TextareaDev } from "./dev/Textarea";
import { CodeMirror as CodeMirrorDev } from "./dev/CodeMirror";
import { RadioGroup as RadioGroupDev } from "./dev/RadioGroup";
import { Number } from "./dev/Number";
import { InternalLink } from "visual/component/Options/types/dev/InternalLink";
import { Alert } from "./dev/Alert";
import { Corners } from "visual/component/Options/types/dev/Corners";
import { Order } from "visual/component/Options/types/dev/Order";
import { IconPicker } from "visual/component/Options/types/dev/IconPicker";
import { IconsPicker } from "visual/component/Options/types/dev/IconsPicker";
import { Motion } from "visual/component/Options/types/dev/Motion";
import { SidebarTabs } from "visual/component/Options/types/dev/SidebarTabs";
import { SidebarTabsButton } from "visual/component/Options/types/dev/SidebarTabsButton";
import { Animation } from "visual/component/Options/types/dev/Animation";
import { TextShadow } from "visual/component/Options/types/dev/TextShadow";
import { Gallery } from "visual/component/Options/types/dev/Gallery";
import { Filters } from "visual/component/Options/types/dev/Filters";
import { Range as RangeDev } from "visual/component/Options/types/dev/Range";

const newTypes = {
  "alert-dev": Alert,
  "animation-dev": Animation,
  "backgroundColor-dev": BackgroundColor,
  "button-dev": ButtonDev,
  "order-dev": Order,
  "codeMirror-dev": CodeMirrorDev,
  "colorPicker-dev": ColorPickerDev,
  "corners-dev": Corners,
  "boxShadow-dev": BoxShadow,
  "border-dev": Border,
  "filters-dev": Filters,
  "group-dev": Group,
  "grid-dev": GridDev,
  "imageUpload-dev": ImageUpload,
  "iconPicker-dev": IconPicker,
  "iconsPicker-dev": IconsPicker,
  "inputText-dev": InputText,
  "internalLink-dev": InternalLink,
  "margin-dev": Margin,
  "motion-dev": Motion,
  "multiSelect-dev": MultiSelect,
  "number-dev": Number,
  "textarea-dev": TextareaDev,
  "radioGroup-dev": RadioGroupDev,
  "range-dev": RangeDev,
  "padding-dev": Padding,
  "popover-dev": PopoverDev,
  "population-dev": Population,
  "select-dev": SelectDev,
  "sidebarTabs-dev": SidebarTabs,
  "sidebarTabsButton-dev": SidebarTabsButton,
  "slider-dev": SliderDev,
  "switch-dev": SwitchDev,
  "tabs-dev": TabsDev,
  "toggle-dev": ToggleDev,
  "typography-dev": Typography,
  "textShadow-dev": TextShadow,
  "gallery-dev": Gallery,
  "stateMode-dev": StateMode
};

const oldTypes = {
  advancedSettings: AdvancedSettings,
  blockThumbnail: BlockThumbnail,
  button: Button,
  savedBlock: SavedBlock,
  globalBlock: GlobalBlock,
  codeMirror: CodeMirror,
  colorFields: ColorFields,
  colorPaletteEditor: ColorPaletteEditor,
  colorPalette: ColorPalette,
  colorPalette2: ColorPalette2,
  colorPicker2: ColorPicker2,
  fontFamily: FontFamily,
  fontStyle: FontStyle,
  fontStyleEditor: FontStyleEditor,
  formApps: FormApps,
  grid: Grid,
  iconSetter: IconSetter,
  imageSetter: ImageSetter,
  input: Input,
  multiInput: MultiInput,
  multiInputPicker: MultiInputPickerOptionType,
  multiPicker: MultiPicker,
  textarea: Textarea,
  popover: Popover,
  popupConditions: PopupConditions,
  gbConditions: GBConditions,
  promptAddPopup: PromptAddPopup,
  promptIcon: PromptIcon,
  radioGroup: RadioGroup,
  checkGroup: CheckGroup,
  select: Select,
  slider: Slider,
  stepper: Stepper,
  switch: Switch,
  tabs: Tabs,
  toggle: Toggle,
  inputNumber: InputNumber,
  range: Range,
  range2: Range2,
  integrationsApps: IntegrationsApps,
  fileUpload: FileUpload
} as const;

export const types = { ...oldTypes, ...newTypes };

export type OptionTypes = typeof newTypes;
export type OptionName = keyof OptionTypes;

export type OptionValue<
  T extends OptionName
> = OptionTypes[T] extends OptionType<infer M> ? M : unknown;

export function applyDefaultValueToOption<T>(
  values: T,
  type: keyof OptionTypes
): T {
  const option = newTypes[type];

  if (!option.defaultValue) return values;

  const valueEntries = Object.entries(option.defaultValue) as [
    keyof T,
    T[keyof T]
  ][];

  return valueEntries.reduce((acc, [key, defaultOptionValue]) => {
    acc[key] = Object.prototype.hasOwnProperty.call(values, key)
      ? values[key]
      : defaultOptionValue;
    return acc;
  }, values);
}

/**
 * Returns a function that creates the option model object from element model
 */
export const fromElementModel = <T extends OptionName>(
  type: T
): FromElementModel<OptionValue<T>> => {
  return (getFn): Partial<OptionValue<T>> => {
    // @ts-expect-error: remove this when all options will be written in typescript
    const option = types[type] as OptionType<OptionValue<T>>;
    const model = getOr(() => ({}), "fromElementModel", option);

    return applyDefaultValueToOption<Partial<OptionValue<T>>>(
      model(getFn),
      type
    );
  };
};

/**
 * Returns a function that creates the element model object from element model
 */
export const toElementModel = <T extends OptionName>(
  type: T,
  get: (k: string) => string
): ((values: OptionValue<T>) => ElementModel) => {
  return (values): ElementModel => {
    // @ts-expect-error: remove this when all options will be written in typescript
    const option = types[type] as OptionType<OptionValue<T>>;
    const model = getOr(() => ({}), "toElementModel", option);

    return Object.entries(model(values)).reduce((acc, [k, v]) => {
      acc[get(k)] = v;
      return acc;
    }, {} as ElementModel);
  };
};

export default types;
