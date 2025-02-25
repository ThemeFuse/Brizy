import classnames from "classnames";
import { noop } from "es-toolkit";
import React from "react";
import ContextMenu from "visual/component/ContextMenu";
import CustomCSS from "visual/component/CustomCSS";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { makeDataAttr } from "visual/utils/i18n/attribute";
import { getContainerW } from "visual/utils/meta";
import {
  defaultValueValue,
  validateKeyByProperty
} from "visual/utils/onChange";
import { attachRefs } from "visual/utils/react";
import * as State from "visual/utils/stateMode";
import { Wrapper } from "../tools/Wrapper";
import Items from "./Items";
import contextMenuConfig from "./contextMenu";
import defaultValue from "./defaultValue.json";
import * as sidebarExtend from "./sidebarExtend";
import * as sidebarExtendParent from "./sidebarExtendParent";
import { styleAnimation, styleTabs } from "./styles";
import * as toolbarExtend from "./toolbarExtend";
import * as toolbarExtendParent from "./toolbarExtendParent";

export default class Tabs extends EditorComponent {
  static defaultValue = defaultValue;
  static defaultProps = {
    meta: {},
    extendParentToolbar: noop
  };

  static get componentId() {
    return "Tabs";
  }

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
        thirdPartyExtendId: `${this.getComponentId()}Parent`
      }
    );
    this.props.extendParentToolbar(toolbarExtend);
  }

  handleNav = (activeTab) => {
    this.patchValue({ activeTab });
  };

  dvv = (key) => {
    const v = this.getValue();
    const device = this.getDeviceMode();
    const state = State.mRead(v.tabsState);

    return defaultValueValue({ v, key, device, state });
  };

  getAnimationClassName = (v, vs, vd) => {
    if (!validateKeyByProperty(v, "animationName", "none")) {
      return undefined;
    }

    const animationName = this.dvv("animationName");
    const animationDuration = this.dvv("animationDuration");
    const animationDelay = this.dvv("animationDelay");
    const animationInfiniteAnimation = this.dvv("animationInfiniteAnimation");

    const slug = `${animationName}-${animationDuration}-${animationDelay}-${animationInfiniteAnimation}`;

    return this.css(
      `${this.getComponentId()}-animation-${slug}`,
      `${this.getId()}-animation-${slug}`,
      styleAnimation({
        v,
        vs,
        vd,
        store: this.getReduxStore(),
        contexts: this.getContexts()
      })
    );
  };

  renderForEdit(v, vs, vd) {
    const {
      activeTab,
      iconName,
      iconType,
      verticalMode,
      navStyle,
      verticalAlign,
      action,
      customCSS
    } = v;

    const meta = this.getMeta(v);
    const itemNavProps = this.makeSubcomponentProps({
      activeTab,
      iconName,
      iconType,
      action,
      meta,
      verticalMode,
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

    const animationClassName = this.getAnimationClassName(v, vs, vd);

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
      this.css(
        this.getComponentId(),
        this.getId(),
        styleTabs({
          v,
          vs,
          vd,
          store: this.getReduxStore(),
          contexts: this.getContexts()
        })
      )
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
      <CustomCSS selectorName={this.getId()} css={customCSS}>
        {({ ref: cssRef }) => (
          <ContextMenu {...this.makeContextMenuProps(contextMenuConfig)}>
            {({ ref: contextMenuRef }) => {
              const ref = (el) => attachRefs(el, [cssRef, contextMenuRef]);

              return (
                <Wrapper
                  {...this.makeWrapperProps({
                    className,
                    attributes: makeDataAttr({ name: "action", value: action })
                  })}
                >
                  <ul className={classNameNav} ref={ref}>
                    <Items {...itemNavProps} />
                  </ul>
                  <div className={classNameContent}>
                    <Items {...itemContentProps} />
                  </div>
                </Wrapper>
              );
            }}
          </ContextMenu>
        )}
      </CustomCSS>
    );
  }
}
