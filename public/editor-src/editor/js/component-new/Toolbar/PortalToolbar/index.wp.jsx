import PortalToolbar from "./index.jsx";

export default class WPPortalToolbar extends PortalToolbar {
  getOutSideExceptions = () => {
    const WORDPRESS = global.wp || global.parent.wp;
    const wpModalClassName = WORDPRESS.media().el.classList[0];

    return [
      ".brz-ed-sidebar__right",
      ".brz-ed-tooltip__content-portal",
      ".brz-ed-fixed",
      `.${wpModalClassName}`,
      this.clickOutsideException // makes the toolbar not rerender when clicking repeatedly on the same node
    ];
  };
}
