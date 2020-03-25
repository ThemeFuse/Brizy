import PortalToolbar from "./PortalToolbar";
import CollapsibleToolbar from "./CollapsibleToolbar";
import { monitor as toolbarMonitor } from "./monitor";

export default PortalToolbar;

export { PortalToolbar, CollapsibleToolbar };
export { ToolbarExtendContext, ToolbarExtend } from "./ToolbarExtend";

export const hideToolbar = (): void => toolbarMonitor.unsetActive();
export const showLastHiddenToolbar = (): void =>
  toolbarMonitor.activateLastActive();
