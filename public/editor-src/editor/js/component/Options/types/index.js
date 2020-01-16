import AdvancedSettings from "./AdvancedSettings";
import BlockThumbnail from "./BlockThumbnail";
import Button from "./Button";
import ButtonTooltip from "./ButtonTooltip";
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
import { BoxShadow } from "visual/component/Options/types/dev/BoxShadow";

const defaultModel = () => ({});

export const types = {
  advancedSettings: AdvancedSettings,
  blockThumbnail: BlockThumbnail,
  button: Button,
  buttonTooltip: ButtonTooltip,
  codeMirror: CodeMirror,
  colorFields: ColorFields,
  colorPaletteEditor: ColorPaletteEditor,
  colorPalette: ColorPalette,
  colorPalette2: ColorPalette2,
  colorPicker: ColorPicker,
  "colorPicker-dev": ColorPickerDev,
  "boxShadow-dev": BoxShadow,
  colorPicker2: ColorPicker2,
  fontFamily: FontFamily,
  fontStyle: FontStyle,
  fontStyleEditor: FontStyleEditor,
  formApps: FormApps,
  grid: Grid,
  imageSetter: ImageSetter,
  iconSetter: IconSetter,
  multiPicker: MultiPicker,
  multiInput: MultiInput,
  multiInputPicker: MultiInputPickerOptionType,
  input: Input,
  textarea: Textarea,
  popover: Popover,
  popupConditions: PopupConditions,
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
  fileUpload: FileUpload,
  stateMode: StateMode
};

/**
 * Returns a function that creates the option model object from element model
 *
 * @param {string} type
 * @returns {function(get: function(key:string):*):object}
 */
export const getModel = type => (types[type] || {}).getModel || defaultModel;

export default types;
