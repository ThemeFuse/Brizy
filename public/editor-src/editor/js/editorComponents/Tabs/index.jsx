import React from "react";
import classnames from "classnames";
import { noop } from "underscore";
import EditorComponent from "visual/editorComponents/EditorComponent";
import CustomCSS from "visual/component/CustomCSS";
import ContextMenu from "visual/component/ContextMenu";
import { getContainerW } from "visual/utils/meta";
import contextMenuConfig from "./contextMenu";
import Items from "./Items";
import * as toolbarExtend from "./toolbarExtend";
import * as sidebarExtend from "./sidebarExtend";
import * as sidebarExtendParent from "./sidebarExtendParent";
import * as toolbarExtendParent from "./toolbarExtendParent";
import defaultValue from "./defaultValue.json";
import { css } from "visual/utils/cssStyle";
import { styleTabs, styleAnimation } from "./styles";
import { validateKeyByProperty } from "visual/utils/onChange";
import { Wrapper } from "../tools/Wrapper";

export default class Tabs extends EditorComponent {
  static get componentId() {
    return "Tabs";
  }

  static defaultValue = defaultValue;

  static defaultProps = {
    meta: {},
    extendParentToolbar: noop
  };

  getMeta(v) {
    const { meta } = this.props;
    const { w: desktopW, wNoSpacing: desktopWMoSpacing } = getContainerW({
      v,
      w: meta.desktopW,
      wNoSpacing: meta.desktopWNoSpacing,
      device: "desktop"
    });
    const { w: tabletW, wNoSpacing: tabletWMoSpacing } = getContainerW({
      v,
      w: meta.tabletW,
      wNoSpacing: meta.tabletWNoSpacing,
      device: "tablet"
    });
    const { w: mobileW, wNoSpacing: mobileWMoSpacing } = getContainerW({
      v,
      w: meta.mobileW,
      wNoSpacing: meta.mobileWNoSpacing,
      device: "mobile"
    });

    return Object.assign({}, meta, {
      desktopW,
      desktopWMoSpacing,
      tabletW,
      tabletWMoSpacing,
      mobileW,
      mobileWMoSpacing
    });
  }

  componentDidMount() {
    const toolbarExtend = this.makeToolbarPropsFromConfig2(
      toolbarExtendParent,
      sidebarExtendParent,
      {
        allowExtend: false,
        allowExtendFromThirdParty: true,
        thirdPartyExtendId: `${this.constructor.componentId}Parent`
      }
    );
    this.props.extendParentToolbar(toolbarExtend);
  }

  handleNav = activeTab => {
    this.patchValue({ activeTab });
  };

  renderForEdit(v, vs, vd) {
    const {
      activeTab,
      iconName,
      iconType,
      verticalMode,
      navStyle,
      verticalAlign,
      action
    } = v;
    const meta = this.getMeta(v);
    const itemNavProps = this.makeSubcomponentProps({
      activeTab,
      iconName,
      iconType,
      action,
      meta,
      bindWithKey: "items",
      renderType: "nav",
      onChangeNav: this.handleNav,
      toolbarExtend: this.makeToolbarPropsFromConfig2(
        toolbarExtend,
        sidebarExtend,
        {
          allowExtend: false
        }
      )
    });

    const animationClassName = classnames(
      validateKeyByProperty(v, "animationName", "none") &&
        css(
          `${this.constructor.componentId}-wrapper-animation,`,
          `${this.getId()}-animation`,
          styleAnimation(v, vs, vd)
        )
    );

    const itemContentProps = this.makeSubcomponentProps({
      activeTab,
      iconName,
      iconType,
      animationClassName,
      meta,
      bindWithKey: "items",
      renderType: "content",
      onChangeNav: this.handleNav,
      toolbarExtend: this.makeToolbarPropsFromConfig2(
        toolbarExtend,
        sidebarExtend,
        {
          allowExtend: false
        }
      )
    });
    const className = classnames(
      "brz-tabs",
      verticalMode === "on" ? "brz-tabs--vertical" : "brz-tabs--horizontal",
      `brz-tabs--${navStyle}`,
      `brz-tabs--${verticalAlign}`,
      css(this.constructor.componentId, this.getId(), styleTabs(v, vs, vd))
    );
    const classNameNav = classnames(
      "brz-tabs__nav",
      verticalMode === "on"
        ? "brz-tabs__nav--vertical"
        : "brz-tabs__nav--horizontal",
      `brz-tabs__nav--${navStyle}`,
      `brz-tabs__nav--${verticalAlign}`
    );
    const classNameContent = classnames(
      "brz-tabs__content",
      verticalMode === "on"
        ? "brz-tabs__content--vertical"
        : "brz-tabs__content--horizontal",
      `brz-tabs__content--${navStyle}`,
      `brz-tabs__content--${verticalAlign}`
    );

    return (
      <CustomCSS selectorName={this.getId()} css={v.customCSS}>
        <ContextMenu {...this.makeContextMenuProps(contextMenuConfig)}>
          <Wrapper
            {...this.makeWrapperProps({
              className,
              attributes: { "data-action": action }
            })}
          >
            <ul className={classNameNav}>
              <Items {...itemNavProps} />
            </ul>
            <div className={classNameContent}>
              <Items {...itemContentProps} />
            </div>
          </Wrapper>
        </ContextMenu>
      </CustomCSS>
    );
  }
}
