import CollapsibleToolbar from "./CollapsibleToolbar.jsx";

export default class WPCollapsibleToolbar extends CollapsibleToolbar {
  getOutSideExceptions() {
    const { outSideExceptions } = this.props;
    const WORDPRESS = global.wp || global.parent.wp;
    const wpModalClassName = WORDPRESS.media().el.classList[0];

    return [
      ".brz-ed-collapsible__toolbar",
      ".brz-ed-sidebar__right",
      ".brz-ed-tooltip__content-portal",
      `.${wpModalClassName}`,
      ...outSideExceptions
    ];
  }
}
