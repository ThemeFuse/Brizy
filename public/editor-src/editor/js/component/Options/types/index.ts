import { ComponentProps } from "react";
import { Meta, Props } from "visual/component/Options/Type";
import { Population } from "visual/component/Options/types/common/Population";
import { Addable } from "visual/component/Options/types/dev/Addable";
import { AdvancedSettings } from "visual/component/Options/types/dev/AdvancedSettings";
import { Animation } from "visual/component/Options/types/dev/Animation";
import { BackgroundColor } from "visual/component/Options/types/dev/BackgroundColor";
import { BlockThumbnail } from "visual/component/Options/types/dev/BlockThumbnail";
import { Border } from "visual/component/Options/types/dev/Border";
import { BoxShadow } from "visual/component/Options/types/dev/BoxShadow";
import { Button as ButtonDev } from "visual/component/Options/types/dev/Button";
import { CheckGroup } from "visual/component/Options/types/dev/CheckGroup";
import { ColorPaletteEditor } from "visual/component/Options/types/dev/ColorPaletteEditor";
import { ColorPicker as ColorPickerDev } from "visual/component/Options/types/dev/ColorPicker";
import { Corners } from "visual/component/Options/types/dev/Corners";
import { FileUpload as FileUploadDev } from "visual/component/Options/types/dev/FileUpload";
import { Filters } from "visual/component/Options/types/dev/Filters";
import { FontStyleEditor } from "visual/component/Options/types/dev/FontStyleEditor";
import { Gallery } from "visual/component/Options/types/dev/Gallery";
import { GalleryForGallery } from "visual/component/Options/types/dev/GalleryForGallery";
import { GbCondition } from "visual/component/Options/types/dev/GbCondition";
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
import { PopupCondition } from "visual/component/Options/types/dev/PopupCondition";
import { PredefinedPopulation } from "visual/component/Options/types/dev/PredefinedPopulation";
import { Range as RangeDev } from "visual/component/Options/types/dev/Range";
import { SavedBlockOption as SavedBlockDev } from "visual/component/Options/types/dev/SavedBlock";
import { Select as SelectDev } from "visual/component/Options/types/dev/Select";
import { ShowOnDevice } from "visual/component/Options/types/dev/ShowOnDevice";
import { SidebarTabs } from "visual/component/Options/types/dev/SidebarTabs";
import { SidebarTabsButton } from "visual/component/Options/types/dev/SidebarTabsButton";
import { Switch as SwitchDev } from "visual/component/Options/types/dev/Switch";
import { TextShadow } from "visual/component/Options/types/dev/TextShadow";
import { ToggleButton } from "visual/component/Options/types/dev/ToggleButton";
import { Transform } from "visual/component/Options/types/dev/Transform";
import { Typography } from "visual/component/Options/types/dev/Typography";
import { StateMode } from "./common/StateMode";
import { Ai } from "./dev/AiText";
import { Alert } from "./dev/Alert";
import { CodeMirror as CodeMirrorDev } from "./dev/CodeMirror";
import { EditableSelect } from "./dev/EditableSelect";
import { FormApps as FormAppsDev } from "./dev/FormApps";
import { GlobalBlockOption as GlobalBlockDev } from "./dev/GlobalBlock";
import { LinkExternal } from "./dev/LinkExternal";
import { Margin } from "./dev/Margin";
import { Number } from "./dev/Number";
import { Padding } from "./dev/Padding";
import { Popover as PopoverDev } from "./dev/Popover";
import { PromptAddPopup } from "./dev/PromptAddPopup";
import { RadioGroup as RadioGroupDev } from "./dev/RadioGroup";
import { Slider as SliderDev } from "./dev/Slider";
import { Symbols } from "./dev/Symbols";
import { Tabs as TabsDev } from "./dev/Tabs";
import { Textarea as TextareaDev } from "./dev/Textarea";
import { Toggle as ToggleDev } from "./dev/Toggle";

export const types = {
  aiText: Ai,
  alert: Alert,
  animation: Animation,
  backgroundColor: BackgroundColor,
  button: ButtonDev,
  toggleButton: ToggleButton,
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
  formApps: FormAppsDev,
  gbCondition: GbCondition,
  editableSelect: EditableSelect,
  popupCondition: PopupCondition,
  colorPaletteEditor: ColorPaletteEditor,
  promptAddPopup: PromptAddPopup,
  fontStyleEditor: FontStyleEditor,
  checkGroup: CheckGroup,
  showOnDevice: ShowOnDevice,
  symbols: Symbols,
  advancedSettings: AdvancedSettings,
  blockThumbnail: BlockThumbnail,
  addable: Addable,
  linkExternal: LinkExternal
};

export type OptionTypes = typeof types;
export type OptionName = keyof OptionTypes;

export type OptionValue<T extends OptionName> =
  ComponentProps<OptionTypes[T]> extends Props<infer M> ? M : unknown;

export type OptionMeta<T extends OptionName> =
  ComponentProps<OptionTypes[T]> extends Meta<infer M> ? M : unknown;

export type OptionPatch<T extends OptionName> =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ComponentProps<OptionTypes[T]> extends Props<any, infer M>
    ? M
    : OptionValue<T>;
