import CollapsibleToolbar from "./CollapsibleToolbar";
import PortalToolbar from "./PortalToolbar";
import { DeactivationOptions, monitor as toolbarMonitor } from "./monitor";

export default PortalToolbar;

export { PortalToolbar, CollapsibleToolbar };
export { ToolbarExtendContext, ToolbarExtend } from "./ToolbarExtend";

export const hideToolbar = (options?: DeactivationOptions): void =>
  toolbarMonitor.unsetActive(options);
export const showLastHiddenToolbar = (): void =>
  toolbarMonitor.activateLastActive();
