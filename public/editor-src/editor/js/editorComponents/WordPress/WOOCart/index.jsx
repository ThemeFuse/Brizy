import React from "react";
import classnames from "classnames";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { WPShortcode } from "../common/WPShortcode";
import * as toolbarConfig from "./toolbar";
import * as sidebarConfig from "./sidebar";
import * as toolbarSidebarConfig from "./toolbarSidebar";
import Toolbar from "visual/component/Toolbar";
import defaultValue from "./defaultValue.json";
import { style } from "./styles";
import { css } from "visual/utils/cssStyle";

export default class WOOCart extends EditorComponent {
  static get componentId() {
    return "WOOCart";
  }

  static defaultValue = defaultValue;

  state = {
    renderHTML: false
  };

  contentRef = React.createRef();

  componentDidMount() {
    this.renderToolbar();
  }

  handleClick = e => {
    const sidebar = this.contentRef.current.querySelector(
      ".brz-woocart__sidebar"
    );
    const background = this.contentRef.current.querySelector(
      ".brz-woocart-background"
    );

    if (e.target.closest(".brz-woocartblock")) {
      if (sidebar) {
        sidebar.classList.add("brz-woocart__sidebar-active");
        background.classList.add("brz-woocart-background-active");
      }
    }
    if (e.target.classList.contains("brz-woocart__sidebar-close")) {
      sidebar.classList.remove("brz-woocart__sidebar-active");
      background.classList.remove("brz-woocart-background-active");
    }
  };

  renderToolbar() {
    const toolbarExtend = this.makeToolbarPropsFromConfig2(
      toolbarConfig,
      sidebarConfig,
      {
        allowExtend: false,
        allowExtendFromThirdParty: true,
        thirdPartyExtendId: `${this.constructor.componentId}Parent`
      }
    );
    this.props.extendParentToolbar(toolbarExtend);
  }

  renderForEdit(v, vs, vd) {
    const { className, purchasesType } = v;

    const classNameStyle = classnames(
      "brz-woocart__parent",
      `brz-purchases-${purchasesType}`,
      className,
      css(
        `${this.constructor.componentId}`,
        `${this.getId()}`,
        style(v, vs, vd)
      )
    );

    return (
      <div
        className={classNameStyle}
        id={this.getId()}
        ref={this.contentRef}
        onClick={this.handleClick}
      >
        <div className="brz-woocart-background">
          {IS_EDITOR && (
            <div className="brz-woocart__sidebar-toolbar">
              Cart Settings
              <Toolbar
                {...this.makeToolbarPropsFromConfig2(toolbarSidebarConfig)}
              >
                <div className="brz-woocart-toolbar" />
              </Toolbar>
            </div>
          )}
        </div>
        <WPShortcode
          name="brizy_woo_cart"
          attributes="{attributes}"
          placeholderIcon="woo-2"
          className="brz-woocartblock"
          blocked={false}
        />
      </div>
    );
  }
}
