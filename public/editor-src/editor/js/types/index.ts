import { ElementModel } from "editor/js/component/Elements/Types";
import { Layout } from "visual/component/Prompts/common/PromptPage/types";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { isWp } from "visual/global/Config/types/configs/WP";
import { EcwidCategoryId, EcwidProductId } from "visual/global/Ecwid";
import { RenderType } from "visual/providers/RenderProvider";
import { Store } from "visual/redux/store";
import { NewType } from "visual/types/NewType";
import { GetCollectionItem_collectionItem as CollectionItem } from "visual/utils/api/cms/graphql/types/GetCollectionItem";
import { checkValue2 } from "visual/utils/checkValue";
import { Hex } from "visual/utils/color/Hex";
import { Palette as ColorPalette } from "visual/utils/color/Palette";
import {
  HEART_BEAT_ERROR,
  PROJECT_DATA_VERSION_ERROR,
  PROJECT_LOCKED_ERROR,
  SYNC_ERROR
} from "visual/utils/errors";
import { FontFamilyType } from "visual/utils/fonts/familyType";
import { pass } from "visual/utils/fp";
import * as Obj from "visual/utils/reader/object";
import { Dictionary } from "./utils";

export type V = Dictionary<unknown>;

// blocks

export type BlockMetaType = "normal" | "popup";

export type Block = {
  type: string;
  value: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  blockId: string;
  deleted?: boolean;
  meta?: Screenshot;
};

type Dependency = string;

export enum BlockTypeRule {
  include = 1,
  exclude = 2
}

export interface AllRule {
  type: BlockTypeRule;
}

export interface CollectionTypeRule extends AllRule {
  appliedFor: number;
  entityType: string;
}

export type CloudReferenceEntity = NewType<string, "reference">;

export type CloudReferenceAllEntity = NewType<string, "allReference">;

export type CloudReference =
  | CloudReferenceEntity
  | CloudReferenceAllEntity
  | string;

export type WPReferenceAllAuthor = NewType<string, "author|">;

export type WPReferenceSpecificAuthor = NewType<string, "author|id">;

export type WPReferenceAuthorEntity =
  | WPReferenceAllAuthor
  | WPReferenceSpecificAuthor;

export type WPReferenceAllInEntity = NewType<string, "in|taxonomy|">;

export type WPReferenceSpecificInEntity = NewType<string, "in|taxonomy|id">;

export type WPReferenceInEntity =
  | WPReferenceAllInEntity
  | WPReferenceSpecificInEntity;

export type WPReferenceChildEntity = NewType<string, "child|postId">;

export type WPReference =
  | WPReferenceAuthorEntity
  | WPReferenceInEntity
  | WPReferenceChildEntity
  | number;

export type EntityTypeRule =
  | CloudReference
  | WPReference
  | EcwidProductId
  | EcwidCategoryId;

export interface CollectionItemRule extends AllRule {
  appliedFor: number | null;
  entityType: string;
  mode: "reference" | "specific";
  entityValues: Array<EntityTypeRule>;
}

export type Rule = AllRule | CollectionTypeRule | CollectionItemRule;

export interface GlobalBlockBase {
  uid: string;
  data: Block & { deleted?: boolean };
  status: "draft" | "publish";
  rules: Rule[];
  position: GlobalBlockPosition | null;
  dataVersion: number;
  title?: string;
  tags?: string;

  // Used for Internal Global Popup(GlobalBlock -> Button -> GlobalPopup)
  dependencies: Array<Dependency>;
}

export interface ExtraFontData {
  adobeKitId?: string;
}

export interface GlobalBlockNormal extends GlobalBlockBase {
  meta: {
    type: "normal";
    extraFontStyles: ExtraFontStyle[];
    _thumbnailSrc?: string;
    _thumbnailWidth?: number;
    _thumbnailHeight?: number;
    _thumbnailTime?: number;
  };
}

export interface GlobalBlockPopup extends GlobalBlockBase {
  meta: {
    type: "popup";
    extraFontStyles: ExtraFontStyle[];
    _thumbnailSrc?: string;
    _thumbnailWidth?: number;
    _thumbnailHeight?: number;
    _thumbnailTime?: number;
  };
}

export type GlobalBlock = GlobalBlockNormal | GlobalBlockPopup;

export type SavedBlock = {
  data: Block;
  dataVersion: number;
  title?: string;
  tags?: string;
  meta: {
    type: BlockMetaType;
    extraFontStyles: ExtraFontStyle[];
    _thumbnailSrc?: string;
    _thumbnailWidth?: number;
    _thumbnailHeight?: number;
    _thumbnailTime?: number;
  };
};

export type SavedLayout = {
  data: PageCommon["data"];
  dataVersion: number;
  title?: string;
  tags?: string;
  meta: {
    type: BlockMetaType;
    extraFontStyles: ExtraFontStyle[];
    _thumbnailSrc?: string;
    _thumbnailWidth?: number;
    _thumbnailHeight?: number;
    _thumbnailTime?: number;
  };
  globalStyles?: Style;
};

export type GlobalBlockPosition = {
  align: "top" | "bottom";
  top: number;
  bottom: number;
};

//#region Project

export interface Project {
  id: string;
  dataVersion: number;
  data: {
    selectedKit: string;
    selectedStyle: string;
    styles: Style[];
    extraStyles: Style[];
    extraFontStyles: ExtraFontStyle[];
    font: string;
    fonts: Fonts;
    disabledElements: string[];
    pinnedElements: string[];
  };
}

//#endregion

//#region Page

export interface DataCommon {
  id: string;
  matchingItemId?: string;
  data: {
    items: Block[];
    [k: string]: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  };
  dataVersion: number;
  status: "draft" | "publish" | "future" | "private"; // The future status is used for scheduled pages .
  dependencies: Array<Dependency>;
}

interface DataWithTitle extends DataCommon {
  title: string;
}

export interface PageCommon extends DataWithTitle {
  slug: string;
}

export interface PageWP extends PageCommon {
  _kind: "wp";
  is_index: boolean; // TODO: would be nice if WP and cloud types would match
  template: string;
}

export interface InternalPopupCloud extends DataWithTitle {
  rules: Rule[];
  project: number;
}

export interface PageCollection extends PageCommon {
  collectionType: {
    id: string;
    title: string;
  };
  fields: CollectionItem["fields"] | null;
}

export interface CloudPopup extends PageCollection {
  rules: Rule[];
}

export type ExternalPopupCloud = DataCommon;

export interface ShopifyPage extends PageCommon {
  layout: {
    id: string;
    value: Layout | undefined;
    isHomePage: string | null;
  };
}

export interface EcwidProductPage extends DataWithTitle {
  __type: "ecwid-product";
  productId: EcwidProductId;
}

export interface EcwidCategoryPage extends DataWithTitle {
  __type: "ecwid-product-category";
  categoryId: EcwidCategoryId;
}

// @ts-expect-error: is declared but its value is never read.
export const isWPPage = (page: Page, config: ConfigCommon): page is PageWP => {
  return isWp(config);
};

export type Page =
  | PageWP
  | PageCollection
  | ShopifyPage
  | EcwidProductPage
  | EcwidCategoryPage
  | InternalPopupCloud
  | ExternalPopupCloud
  | CloudPopup;

//#endregion

//#region Fonts

export type GoogleFont = {
  kind: "webfonts#webfont";
  family: string;
  category: string;
  variants: string[];
  subsets: string[];
  version: string;
  lastModified: string;
  files: {
    [k: string]: string;
  };
  brizyId: string;
  deleted?: boolean;
};

export type AdobeFont = {
  brizyId?: string;
  id: string;
  family: string;
  category: string;
  subsets: string[];
  variants: string[];
};

export type SystemFont = {
  brizyId: string;
  id: string;
  family: string;
  category: string;
  weights: string[];
};

export type UploadedFont = {
  id: string;
  family: string;
  type: "uploaded";
  weights: string[];
  brizyId: string;
  deleted?: boolean;
  variations?: VariationFont[];
};

export type Font = GoogleFont | UploadedFont | AdobeFont | SystemFont;

export type VariationFont = {
  tag: string;
  min: number;
  max: number;
};

export interface Fonts {
  config?: {
    data: GoogleFont[];
  };
  blocks?: {
    data: GoogleFont[];
  };
  google?: {
    data: GoogleFont[];
  };
  adobe?: {
    id: string;
    data: AdobeFont[];
  };
  system?: {
    data: SystemFont[];
  };
  upload?: {
    data: UploadedFont[];
  };
}

//#endregion

// authorized

export type Authorized = "pending" | "connected" | "disconnect";

// syncAllowed

export type SyncAllowed = boolean;

/// TODO: review later when breakpoints will be on fixes
export enum DeviceMode2 {
  Widescreen = "widescreen",
  Desktop = "desktop",
  Laptop = "laptop",
  TabletHorizontal = "tabletHorizontal",
  Tablet = "tablet",
  MobileHorizontal = "mobileHorizontal",
  Mobile = "mobile"
}

export interface Breakpoint {
  value: DeviceMode2;
  title: string;
  enabled: boolean;
  breakpoint: number;
  content: number;
}

// activeElement

export type ActiveElement = Element | null;

// deviceMode

export type DeviceMode = "desktop" | "tablet" | "mobile";

// screenshot

export type Screenshot = {
  _thumbnailSrc: string;
  _thumbnailWidth: number;
  _thumbnailHeight: number;
  _thumbnailTime: number;
};

// style

export interface FontStyle extends FontTransform {
  deletable: "off" | "on";
  deleted?: boolean;
  id: string;
  title: string;
  fontFamily: string;
  fontFamilyType: FontFamilyType;
  fontSize: number;
  fontWeight: number;
  lineHeight: number;
  letterSpacing: number;
  variableFontWeight?: number;
  fontWidth?: number;
  fontSoftness?: number;
  tabletFontSize: number;
  tabletFontWeight: number;
  tabletLineHeight: number;
  tabletLetterSpacing: number;
  tabletVariableFontWeight?: number;
  tabletFontWidth?: number;
  tabletFontSoftness?: number;
  mobileFontSize: number;
  mobileFontWeight: number;
  mobileLineHeight: number;
  mobileLetterSpacing: number;
  mobileVariableFontWeight?: number;
  mobileFontWidth?: number;
  mobileFontSoftness?: number;
  fontSizeSuffix?: string;
  tabletFontSizeSuffix?: string;
  mobileFontSizeSuffix?: string;
}

export enum TextScripts {
  "None" = "",
  "Super" = "super",
  "Sub" = "sub"
}

const isScript = (v: string): v is TextScripts =>
  !!checkValue2<TextScripts>(TextScripts)(v);

export const fromStringToScript = pass(isScript);

export interface FontTransform {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  strike: boolean;
  uppercase: boolean;
  lowercase: boolean;
  script?: TextScripts;
}

export const isFontStyle = (item: unknown): item is ExtraFontStyle =>
  Obj.isObject(item) &&
  Obj.hasKeys(
    [
      "id",
      "title",
      "fontFamily",
      "fontFamilyType",
      "fontSize",
      "fontWeight",
      "lineHeight",
      "letterSpacing",
      "tabletFontSize",
      "tabletFontWeight",
      "tabletLineHeight",
      "tabletLetterSpacing",
      "mobileFontSize",
      "mobileFontWeight",
      "mobileLineHeight",
      "mobileLetterSpacing",
      "deletable"
    ],
    item
  );

export interface Palette {
  id: ColorPalette;
  hex: Hex;
}

export interface Style {
  id: string;
  title: string;
  fontStyles: FontStyle[];
  colorPalette: Palette[];
}

export const isStyle = (item: unknown): item is Style =>
  Obj.isObject(item) &&
  Obj.hasKeys(["id", "title", "fontStyles", "colorPalette"], item);

export interface ExtraFontStyle extends FontStyle {
  deletable: "on";
}

export const isExtraFontStyle = (item: unknown): item is ExtraFontStyle =>
  isFontStyle(item) && item.deletable === "on";

export type FontStyles = FontStyle | ExtraFontStyle;

export interface DynamicStylesProps<V> {
  v: V;
  vs: V;
  vd: V;
  store: Store;
  renderContext: RenderType;
}

// Shortcodes

export type Shortcode = {
  component: {
    title: string;
    icon: string;
    id: string;
    resolve: ElementModel;
    position?: number;
    hidden?: boolean;
    config?: Record<string, unknown>;
    upgradeMessage?: string;
    upgradeActionMessage?: string;
  };
  keywords?: string;
  pro: boolean | ((c: ConfigCommon) => boolean);
};

export type Shortcodes = {
  [k: string]: Shortcode[];
};

export interface ShortcodeComponent {
  tabId: string;
  shortcodes: Shortcodes;
}

export type ShortcodeComponents = ShortcodeComponent[];

export type UserRole = string;

export type ExportFunction = ($el: JQuery) => void;

// region CustomerId
declare const _customerId: unique symbol;

export type CustomerId = string & { [_customerId]: "CustomerId" };
// endregion

// region CollectionItemId
declare const _collectionItemId: unique symbol;

export type CollectionItemId = string & {
  [_collectionItemId]: "CollectionItemId";
};
// endregion

//#region Error

type ProjectLockError = {
  code: typeof PROJECT_LOCKED_ERROR;
  data: {
    locked: boolean;
    lockedBy: boolean | { user_email: string };
  };
};

type ProjectDataError = {
  code: typeof PROJECT_DATA_VERSION_ERROR;
  data: string;
};

type HeartBeatError = {
  code: typeof HEART_BEAT_ERROR;
  data: string;
};

type SyncError = {
  code: typeof SYNC_ERROR;
  data: {
    upgradeToProUrl?: string;
  };
};

export type Error =
  | ProjectLockError
  | HeartBeatError
  | ProjectDataError
  | SyncError;

//#endregion

//#region Popup Triggers

export enum TriggerType {
  PageLoad = "pageLoad",
  Scrolling = "scrolling",
  Click = "click",
  Inactivity = "inactivity",
  ExitIntent = "exitIntent",
  Showing = "showing",
  Referrer = "referrer",
  Devices = "devices",
  CurrentUrl = "currentUrl",
  CurrentDate = "currentDate",
  LastVisitDate = "lastVisitDate",
  TimeFrom = "timeFrom",
  Cookie = "cookie",
  OS = "os",
  OtherPopups = "otherPopups",
  SpecificPopup = "specificPopup",
  LoggedIn = "LoggedIn"
}

interface Base {
  active: boolean;
}

interface PageLoadTrigger extends Base {
  id: TriggerType.PageLoad;
  value: string;
}

interface ScrollingTrigger extends Base {
  id: TriggerType.Scrolling;
  value: {
    value: string;
    within: string;
    toElement: string;
  };
}

interface ClickTrigger extends Base {
  id: TriggerType.Click;
  value: string;
}

interface InactivityTrigger extends Base {
  id: TriggerType.Inactivity;
  value: string;
}

interface ExitIntentTrigger extends Base {
  id: TriggerType.ExitIntent;
  value: boolean;
}

interface ShowingTrigger extends Base {
  id: TriggerType.Showing;
  value: {
    // TODO: Below types are not completed.
    //  They need to be completed when the
    //  Triggers from PromptConditions will be rewritten to TS
    value: "views";
    type: "equals";
    views: number;
    sessions: number;
  };
}

interface ReferrerTrigger extends Base {
  id: TriggerType.Referrer;
  value: {
    // TODO: Below types are not completed.
    //  They need to be completed when the
    //  Triggers from PromptConditions will be rewritten to TS
    type: "is";
    value: "show";
    url: string;
    source: "search_engines";
  };
}

interface DevicesTrigger extends Base {
  id: TriggerType.Devices;
  value: "desktop" | "tablet" | "mobile";
}

interface CurrentUrlTrigger extends Base {
  id: TriggerType.CurrentUrl;
  value: {
    // TODO: Below types are not completed.
    //  They need to be completed when the
    //  Triggers from PromptConditions will be rewritten to TS
    type: "matches";
    value: string;
  };
}

interface CurrentDateTrigger extends Base {
  id: TriggerType.CurrentDate;
  value: {
    // TODO: Below types are not completed.
    //  They need to be completed when the
    //  Triggers from PromptConditions will be rewritten to TS
    type: "matches";
    value: string;
  };
}

interface LastVisitDateTrigger extends Base {
  id: TriggerType.LastVisitDate;
  value: {
    // TODO: Below types are not completed.
    //  They need to be completed when the
    //  Triggers from PromptConditions will be rewritten to TS
    type: "matches";
    value: string;
  };
}

interface TimeFromTrigger extends Base {
  id: TriggerType.TimeFrom;
  value: {
    // TODO: Below types are not completed.
    //  They need to be completed when the
    //  Triggers from PromptConditions will be rewritten to TS
    type: "greater";
    visit: "first";
    time: "days";
    value: string;
  };
}

interface CookieTrigger extends Base {
  id: TriggerType.Cookie;
  value: {
    // TODO: Below types are not completed.
    //  They need to be completed when the
    //  Triggers from PromptConditions will be rewritten to TS
    type: "matches";
    param: string;
    value: string;
  };
}

interface OSTrigger extends Base {
  id: TriggerType.OS;
  value: {
    // TODO: Below types are not completed.
    //  They need to be completed when the
    //  Triggers from PromptConditions will be rewritten to TS
    type: "is";
    value: "windows";
  };
}

interface OtherPopupsTrigger extends Base {
  id: TriggerType.OtherPopups;
  value: {
    // TODO: Below types are not completed.
    //  They need to be completed when the
    //  Triggers from PromptConditions will be rewritten to TS
    type: "was";
    value: "page";
  };
}

interface SpecificPopupTrigger extends Base {
  id: TriggerType.SpecificPopup;
  value: {
    // TODO: Below types are not completed.
    //  They need to be completed when the
    //  Triggers from PromptConditions will be rewritten to TS
    type: "was";
    value: string;
  };
}

interface LoggedInTrigger extends Base {
  id: TriggerType.LoggedIn;
  value: {
    // TODO: Below types are not completed.
    //  They need to be completed when the
    //  Triggers from PromptConditions will be rewritten to TS
    value: "all";
    user: string;
  };
}

export type Trigger =
  | PageLoadTrigger
  | ScrollingTrigger
  | ClickTrigger
  | InactivityTrigger
  | ExitIntentTrigger
  | ShowingTrigger
  | ReferrerTrigger
  | DevicesTrigger
  | CurrentUrlTrigger
  | CurrentDateTrigger
  | LastVisitDateTrigger
  | TimeFromTrigger
  | CookieTrigger
  | OSTrigger
  | OtherPopupsTrigger
  | SpecificPopupTrigger
  | LoggedInTrigger;

export type Triggers = Array<Trigger>;

//#endregion
