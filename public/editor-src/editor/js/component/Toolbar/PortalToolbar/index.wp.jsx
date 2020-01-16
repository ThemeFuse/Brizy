import PortalToolbar from "./index.jsx";

export default class WPPortalToolbar extends PortalToolbar {
  getOutSideExceptions = () => {
    return [
      ".brz-ed-sidebar__right",
      ".brz-ed-tooltip__content-portal",
      ".brz-ed-fixed",
      ".media-modal", // class of the WP media modal
      ".media-modal-backdrop",
      this.clickOutsideException // makes the toolbar not rerender when clicking repeatedly on the same node
    ];
  };
}
