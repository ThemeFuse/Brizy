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
import { PredefinedPopulation } from "visual/component/Options/types/dev/PredefinedPopulation";
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
import ColorPalette2 from "./ColorPalette2";
import ColorPaletteEditor from "./ColorPaletteEditor";
import FontStyleEditor from "./FontStyleEditor";
import GBConditions from "./GBConditions";
import PopupConditions from "./PopupConditions";
import PromptAddPopup from "./PromptAddPopup";
import Toggle from "./Toggle";
import { StateMode } from "./common/StateMode";
import { Ai } from "./dev/AiText";
import { Alert } from "./dev/Alert";
import { CodeMirror as CodeMirrorDev } from "./dev/CodeMirror";
import { FormApps as FormAppsDev } from "./dev/FormApps";
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
  aiText: Ai,
  alert: Alert,
  animation: Animation,
  backgroundColor: BackgroundColor,
  button: ButtonDev,
  order: Order,
  codeMirror: CodeMirrorDev,
  colorPicker: ColorPickerDev,
  corners: Corners,
  boxShadow: BoxShadow,
  border: Border,
  filters: Filters,
  fileUpload: FileUploadDev,
  group: Group,
  grid: GridDev,
  imageUpload: ImageUpload,
  iconPicker: IconPicker,
  iconsPicker: IconsPicker,
  iconSetter: IconSetterDev,
  inputText: InputText,
  internalLink: InternalLink,
  margin: Margin,
  motion: Motion,
  multiSelect: MultiSelect,
  number: Number,
  textarea: TextareaDev,
  radioGroup: RadioGroupDev,
  range: RangeDev,
  padding: Padding,
  paypal: PayPal,
  popover: PopoverDev,
  population: Population,
  predefinedPopulation: PredefinedPopulation,
  select: SelectDev,
  sidebarTabs: SidebarTabs,
  sidebarTabsButton: SidebarTabsButton,
  slider: SliderDev,
  switch: SwitchDev,
  tabs: TabsDev,
  toggle: ToggleDev,
  typography: Typography,
  textShadow: TextShadow,
  gallery: Gallery,
  "gallery-for-gallery": GalleryForGallery,
  stateMode: StateMode,
  transform: Transform,
  savedBlock: SavedBlockDev,
  globalBlock: GlobalBlockDev,
  formApps: FormAppsDev
};

const oldTypes = {
  "legacy-advancedSettings": AdvancedSettings,
  "legacy-blockThumbnail": BlockThumbnail,
  "legacy-button": Button,
  "legacy-colorPaletteEditor": ColorPaletteEditor,
  "legacy-colorPalette2": ColorPalette2,
  "legacy-fontStyleEditor": FontStyleEditor,
  "legacy-popupConditions": PopupConditions,
  "legacy-gbConditions": GBConditions,
  "legacy-promptAddPopup": PromptAddPopup,
  "legacy-checkGroup": CheckGroup,
  "legacy-toggle": Toggle
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
