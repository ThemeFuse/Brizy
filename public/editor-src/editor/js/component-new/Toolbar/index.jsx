import PortalToolbar from "./PortalToolbar";
import CollapsibleToolbar from "./CollapsibleToolbar";
import ToolbarExtend from "./ToolbarExtend";
import toolbarMonitor from "./monitor";

export default PortalToolbar;

export { PortalToolbar, CollapsibleToolbar, ToolbarExtend };

export const hideToolbar = () => toolbarMonitor.unsetActive();
export const showLastHiddenToolbar = () => toolbarMonitor.activateLastActive();
