import CollapsibleToolbar from "./CollapsibleToolbar.jsx";

export default class WPCollapsibleToolbar extends CollapsibleToolbar {
  getOutSideExceptions() {
    const { outSideExceptions } = this.props;

    return [
      ".brz-ed-collapsible__toolbar",
      ".brz-ed-sidebar__right",
      ".brz-ed-tooltip__content-portal",
      ".media-modal", // class of the WP media modal
      ".media-modal-backdrop",
      ...outSideExceptions
    ];
  }
}
