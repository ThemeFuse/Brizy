import PortalToolbar from "./PortalToolbar";
import CollapsibleToolbar from "./CollapsibleToolbar";
import { monitor as toolbarMonitor, DeactivationOptions } from "./monitor";

export default PortalToolbar;

export { PortalToolbar, CollapsibleToolbar };
export { ToolbarExtendContext, ToolbarExtend } from "./ToolbarExtend";

export const hideToolbar = (options?: DeactivationOptions): void =>
  toolbarMonitor.unsetActive(options);
export const showLastHiddenToolbar = (): void =>
  toolbarMonitor.activateLastActive();
