import Popover from "./Popover.jsx";

export default class WPPopover extends Popover {
  getOutSideExceptions = () => {
    const WORDPRESS = global.wp || global.parent.wp;
    const wpModalClassName = WORDPRESS.media().el.classList[0];
    let clickOutsideExceptions = [".brz-ed-fixed", `.${wpModalClassName}`];

    if (this.props.location === "toolbar") {
      clickOutsideExceptions.push(".brz-ed-sidebar-right-portal");
    }

    return clickOutsideExceptions;
  };
}
