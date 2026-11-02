import CollapsibleToolbar from "./CollapsibleToolbar";
import { type DeactivationOptions, monitor as toolbarMonitor } from "./monitor";
import PortalToolbar from "./PortalToolbar";

export default PortalToolbar;

export { ToolbarExtend, ToolbarExtendContext } from "./ToolbarExtend";
export { CollapsibleToolbar, PortalToolbar };

export const hideToolbar = (options?: DeactivationOptions): void =>
  toolbarMonitor.unsetActive(options);
export const showLastHiddenToolbar = (): void =>
  toolbarMonitor.activateLastActive();
