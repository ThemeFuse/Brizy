import Popover from "./Popover.jsx";

export default class WPPopover extends Popover {
  getOutSideExceptions = () => {
    let clickOutsideExceptions = [
      ".brz-ed-fixed",
      ".media-modal", // class of the WP media modal
      ".media-modal-backdrop"
    ];

    if (this.props.location === "toolbar") {
      clickOutsideExceptions.push(".brz-ed-sidebar-right-portal");
    }

    return clickOutsideExceptions;
  };
}
