import { getOr } from "visual/utils/object/get";
import { GetModel, OptionType } from "visual/component/Options/Type";

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
import ColorPicker from "./ColorPicker";
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
import StateMode from "./common/StateMode";

// Option types that are in development
import { ColorPicker as ColorPickerDev } from "visual/component/Options/types/dev/ColorPicker";
import { BackgroundColor } from "visual/component/Options/types/dev/BackgroundColor";
import { BoxShadow } from "visual/component/Options/types/dev/BoxShadow";
import { Border } from "visual/component/Options/types/dev/Border";
import { Group } from "visual/component/Options/types/dev/Group";
import { Typography } from "visual/component/Options/types/dev/Typography";
import { ImageUpload } from "visual/component/Options/types/dev/ImageUpload";
import { Population } from "visual/component/Options/types/common/Population/Population";
import { InputText } from "visual/component/Options/types/dev/InputText";
import { MultiSelect } from "visual/component/Options/types/dev/MultiSelect";
import { Select as SelectDev } from "visual/component/Options/types/dev/Select";
import { Switch as SwitchDev } from "visual/component/Options/types/dev/Switch";
import { Slider as SliderDev } from "./dev/Slider";
import { Toggle as ToggleDev } from "./dev/Toggle";
import { Popover as PopoverDev } from "./dev/Popover";
import { Tabs as TabsDev } from "./dev/Tabs";
import { Textarea as TextareaDev } from "./dev/Textarea";
import { CodeMirror as CodeMirrorDev } from "./dev/CodeMirror";
import { RadioGroup as RadioGroupDev } from "./dev/RadioGroup";
import { Number } from "./dev/Number";
import { InternalLink } from "visual/component/Options/types/dev/InternalLink";
import { Alert } from "./dev/Alert";

export const types = {
  advancedSettings: AdvancedSettings,
  "alert-dev": Alert,
  "backgroundColor-dev": BackgroundColor,
  blockThumbnail: BlockThumbnail,
  button: Button,
  savedBlock: SavedBlock,
  globalBlock: GlobalBlock,
  codeMirror: CodeMirror,
  "codeMirror-dev": CodeMirrorDev,
  colorFields: ColorFields,
  colorPaletteEditor: ColorPaletteEditor,
  colorPalette: ColorPalette,
  colorPalette2: ColorPalette2,
  colorPicker: ColorPicker,
  "colorPicker-dev": ColorPickerDev,
  "boxShadow-dev": BoxShadow,
  "border-dev": Border,
  colorPicker2: ColorPicker2,
  fontFamily: FontFamily,
  fontStyle: FontStyle,
  fontStyleEditor: FontStyleEditor,
  formApps: FormApps,
  grid: Grid,
  "group-dev": Group,
  iconSetter: IconSetter,
  imageSetter: ImageSetter,
  "imageUpload-dev": ImageUpload,
  input: Input,
  "inputText-dev": InputText,
  "internalLink-dev": InternalLink,
  multiInput: MultiInput,
  multiInputPicker: MultiInputPickerOptionType,
  multiPicker: MultiPicker,
  "multiSelect-dev": MultiSelect,
  "number-dev": Number,
  textarea: Textarea,
  "textarea-dev": TextareaDev,
  "radioGroup-dev": RadioGroupDev,
  popover: Popover,
  "popover-dev": PopoverDev,
  "population-dev": Population,
  popupConditions: PopupConditions,
  gbConditions: GBConditions,
  promptAddPopup: PromptAddPopup,
  promptIcon: PromptIcon,
  radioGroup: RadioGroup,
  checkGroup: CheckGroup,
  select: Select,
  "select-dev": SelectDev,
  slider: Slider,
  "slider-dev": SliderDev,
  stepper: Stepper,
  switch: Switch,
  "switch-dev": SwitchDev,
  tabs: Tabs,
  "tabs-dev": TabsDev,
  toggle: Toggle,
  "toggle-dev": ToggleDev,
  "typography-dev": Typography,
  inputNumber: InputNumber,
  range: Range,
  range2: Range2,
  integrationsApps: IntegrationsApps,
  fileUpload: FileUpload,
  stateMode: StateMode
};

export type OptionTypes = typeof types;

export type OptionName = keyof OptionTypes;

/**
 * Returns a function that creates the option model object from element model
 */
export const getModel = (type: keyof OptionTypes): GetModel<unknown> =>
  getOr(() => ({}), "getModel", types[type] as OptionType<unknown>);

export default types;
