import { ComponentProps } from "react";
import { Props } from "visual/component/Options/Type";
import { Population } from "visual/component/Options/types/common/Population/Population";
import { Animation } from "visual/component/Options/types/dev/Animation";
import { BackgroundColor } from "visual/component/Options/types/dev/BackgroundColor";
import { Border } from "visual/component/Options/types/dev/Border";
import { BoxShadow } from "visual/component/Options/types/dev/BoxShadow";
import { Button as ButtonDev } from "visual/component/Options/types/dev/Button";
// Option types that are in development
import { ColorPicker as ColorPickerDev } from "visual/component/Options/types/dev/ColorPicker";
import { Corners } from "visual/component/Options/types/dev/Corners";
import { FileUpload as FileUploadDev } from "visual/component/Options/types/dev/FileUpload";
import { Filters } from "visual/component/Options/types/dev/Filters";
import { Gallery } from "visual/component/Options/types/dev/Gallery";
import { GalleryForGallery } from "visual/component/Options/types/dev/GalleryForGallery";
import { Grid as GridDev } from "visual/component/Options/types/dev/Grid";
import { Group } from "visual/component/Options/types/dev/Group";
import { IconPicker } from "visual/component/Options/types/dev/IconPicker";
import { IconSetter as IconSetterDev } from "visual/component/Options/types/dev/IconSetter";
import { IconsPicker } from "visual/component/Options/types/dev/IconsPicker";
import { ImageUpload } from "visual/component/Options/types/dev/ImageUpload";
import { InputText } from "visual/component/Options/types/dev/InputText";
import { InternalLink } from "visual/component/Options/types/dev/InternalLink";
import { Motion } from "visual/component/Options/types/dev/Motion";
import { MultiSelect } from "visual/component/Options/types/dev/MultiSelect2";
import { Order } from "visual/component/Options/types/dev/Order";
import { PayPal } from "visual/component/Options/types/dev/PayPal";
import { Range as RangeDev } from "visual/component/Options/types/dev/Range";
import { SavedBlockOption as SavedBlockDev } from "visual/component/Options/types/dev/SavedBlock";
import { Select as SelectDev } from "visual/component/Options/types/dev/Select";
import { SidebarTabs } from "visual/component/Options/types/dev/SidebarTabs";
import { SidebarTabsButton } from "visual/component/Options/types/dev/SidebarTabsButton";
import { Switch as SwitchDev } from "visual/component/Options/types/dev/Switch";
import { TextShadow } from "visual/component/Options/types/dev/TextShadow";
import { Transform } from "visual/component/Options/types/dev/Transform";
import { Typography } from "visual/component/Options/types/dev/Typography";
import AdvancedSettings from "./AdvancedSettings";
import BlockThumbnail from "./BlockThumbnail";
import Button from "./Button";
import CheckGroup from "./CheckGroup";
import ColorFields from "./ColorFields";
import ColorPalette2 from "./ColorPalette2";
import ColorPaletteEditor from "./ColorPaletteEditor";
import ColorPicker2 from "./ColorPicker2";
import FontFamily from "./FontFamily";
import FontStyle from "./FontStyle";
import FontStyleEditor from "./FontStyleEditor";
import FormApps from "./FormApps";
import GBConditions from "./GBConditions";
import GlobalBlock from "./GlobalBlock";
import Grid from "./Grid";
import ImageSetter from "./ImageSetter";
import Input from "./Input";
import IntegrationsApps from "./IntegrationsApps";
import MultiInput from "./MultiInput";
import MultiInputPickerOptionType from "./MultiInputPickerOptionType";
import MultiPicker from "./MultiPicker";
import Popover from "./Popover";
import PopupConditions from "./PopupConditions";
import PromptAddPopup from "./PromptAddPopup";
import PromptIcon from "./PromptIcon";
import RadioGroup from "./RadioGroup";
import Range2 from "./Range2";
import SavedBlock from "./SavedBlock";
import Select from "./Select";
import Slider from "./Slider";
import Stepper from "./Stepper";
import Toggle from "./Toggle";
import Tabs from "./Tabs";
import { StateMode } from "./common/StateMode";
import { Alert } from "./dev/Alert";
import { CodeMirror as CodeMirrorDev } from "./dev/CodeMirror";
import { GlobalBlockOption as GlobalBlockDev } from "./dev/GlobalBlock";
import { Margin } from "./dev/Margin";
import { Number } from "./dev/Number";
import { Padding } from "./dev/Padding";
import { Popover as PopoverDev } from "./dev/Popover";
import { RadioGroup as RadioGroupDev } from "./dev/RadioGroup";
import { Slider as SliderDev } from "./dev/Slider";
import { Tabs as TabsDev } from "./dev/Tabs";
import { Textarea as TextareaDev } from "./dev/Textarea";
import { Toggle as ToggleDev } from "./dev/Toggle";

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
  "fileUpload-dev": FileUploadDev,
  "group-dev": Group,
  "grid-dev": GridDev,
  "imageUpload-dev": ImageUpload,
  "iconPicker-dev": IconPicker,
  "iconsPicker-dev": IconsPicker,
  "iconSetter-dev": IconSetterDev,
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
  "paypal-dev": PayPal,
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
  "gallery-for-gallery-dev": GalleryForGallery,
  "stateMode-dev": StateMode,
  "transform-dev": Transform,
  "savedBlock-dev": SavedBlockDev,
  "globalBlock-dev": GlobalBlockDev
};

const oldTypes = {
  advancedSettings: AdvancedSettings,
  blockThumbnail: BlockThumbnail,
  button: Button,
  savedBlock: SavedBlock,
  globalBlock: GlobalBlock,
  colorFields: ColorFields,
  colorPaletteEditor: ColorPaletteEditor,
  colorPalette2: ColorPalette2,
  colorPicker2: ColorPicker2,
  fontFamily: FontFamily,
  fontStyle: FontStyle,
  fontStyleEditor: FontStyleEditor,
  formApps: FormApps,
  grid: Grid,
  imageSetter: ImageSetter,
  input: Input,
  multiInput: MultiInput,
  multiInputPicker: MultiInputPickerOptionType,
  multiPicker: MultiPicker,
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
  toggle: Toggle,
  tabs: Tabs,
  range2: Range2,
  integrationsApps: IntegrationsApps
} as const;

export const types = { ...oldTypes, ...newTypes };

export type OptionTypes = typeof newTypes;
export type OptionName = keyof OptionTypes;

export type OptionValue<T extends OptionName> = ComponentProps<
  OptionTypes[T]
> extends Props<infer M>
  ? M
  : unknown;

export type OptionPatch<
  T extends OptionName
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
> = ComponentProps<OptionTypes[T]> extends Props<any, infer M>
  ? M
  : OptionValue<T>;

export default types;
