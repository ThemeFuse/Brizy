import { ElementModel } from "editor/js/component/Elements/Types";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { GetConfig } from "visual/providers/ConfigProvider/types";
import { EditorMode } from "visual/providers/EditorModeProvider";
import { RenderType } from "visual/providers/RenderProvider";
import { Store } from "visual/redux/store";
import { ErrorCodes } from "visual/utils/errors";
import { Block } from "./Block";
import { BlockMetaType } from "./GlobalBlock";
import { PageCommon } from "./Page";
import { ExtraFontStyle, Style } from "./Style";
import { Dictionary } from "./utils";

export type V = Dictionary<unknown>;

// blocks

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

// style

export interface StylesContexts {
  renderContext: RenderType;
  mode: EditorMode;
  getConfig: GetConfig;
}

export interface DynamicStylesProps<V> {
  v: V;
  vs: V;
  vd: V;
  store: Store;
  contexts: StylesContexts;
}

// Shortcodes

export type Shortcode = {
  component: {
    title: string;
    icon: string;
    id: string;
    resolve: ElementModel;
    truncate?: boolean;
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
interface ProjectUnlocked {
  locked: false;
  lockedBy: false;
}

export interface ProjectLocked {
  locked: true;
  lockedBy: { user_email: string };
}

export type ProjectLockStatus = ProjectLocked | ProjectUnlocked;

type ProjectLockError = {
  code: typeof ErrorCodes.PROJECT_LOCKED_ERROR;
  data: ProjectLockStatus;
};

type ProjectDataError = {
  code: typeof ErrorCodes.PROJECT_DATA_VERSION_ERROR;
  data: string;
};

type HeartBeatError = {
  code: typeof ErrorCodes.HEART_BEAT_ERROR;
  data: ProjectLocked | { statusText: string };
};

type SyncError = {
  code: typeof ErrorCodes.SYNC_ERROR;
  data: {
    upgradeToProUrl?: string;
  };
};

type RemoveGlobalBlockError = {
  code: typeof ErrorCodes.REMOVE_GLOBAL_BLOCK;
  data: {
    text: string;
    handleDelete: (data: { onAfterResponse: VoidFunction }) => void;
  };
};

export type Error =
  | ProjectLockError
  | HeartBeatError
  | ProjectDataError
  | SyncError
  | RemoveGlobalBlockError;

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
