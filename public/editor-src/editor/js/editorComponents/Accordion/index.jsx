import classNames from "classnames";
import { noop } from "es-toolkit";
import React from "react";
import ContextMenu from "visual/component/ContextMenu";
import CustomCSS from "visual/component/CustomCSS";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { getTagNameFromFontStyle } from "visual/editorComponents/tools/HtmlTag";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import {
  defaultValueValue,
  validateKeyByProperty
} from "visual/utils/onChange";
import { attachRefs } from "visual/utils/react";
import * as State from "visual/utils/stateMode";
import Items from "./Items";
import contextMenuConfig from "./contextMenu";
import defaultValue from "./defaultValue.json";
import * as sidebarExtendConfig from "./sidebarExtend";
import * as sidebarExtendParentConfig from "./sidebarExtendParent";
import * as sidebarFilterConfig from "./sidebarFilter";
import { style, styleAnimation } from "./styles";
import * as toolbarExtendConfig from "./toolbarExtend";
import * as toolbarExtendParentConfig from "./toolbarExtendParent";
import * as toolbarFilterConfig from "./toolbarFilter";

class Accordion extends EditorComponent {
  static defaultProps = {
    meta: {},
    extendParentToolbar: noop
  };
  static defaultValue = defaultValue;

  static get componentId() {
    return ElementTypes.Accordion;
  }

  handleAllTagChange = (allTag) => {
    this.patchValue({ allTag });
  };

  componentDidMount() {
    const toolbarExtend = this.makeToolbarPropsFromConfig2(
      toolbarExtendParentConfig,
      sidebarExtendParentConfig,
      {
        allowExtend: false,
        allowExtendFromThirdParty: true,
        thirdPartyExtendId: `${this.getComponentId()}Parent`
      }
    );
    this.props.extendParentToolbar(toolbarExtend);
  }

  handleNav = (activeAccordionItem) => {
    this.patchValue({ activeAccordionItem });
  };

  patchValue(patch, meta) {
    const { fontStyle } = patch;

    super.patchValue(
      {
        ...patch,
        ...(fontStyle ? getTagNameFromFontStyle(fontStyle) : {})
      },
      meta
    );
  }

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
      activeAccordionItem,
      filterStyle,
      navIcon,
      collapsible,
      animDuration,
      enableTags,
      tagName,
      allTag,
      sortTags
    } = v;

    const className = classNames(
      "brz-accordion",
      this.css(
        this.getComponentId(),
        this.getId(),
        style({
          v,
          vs,
          vd,
          store: this.getReduxStore(),
          contexts: this.getContexts()
        })
      )
    );

    const animationClassName = this.getAnimationClassName(v, vs, vd);

    const itemProps = this.makeSubcomponentProps({
      allTag,
      sortTags,
      className,
      filterStyle,
      activeAccordionItem,
      navIcon,
      collapsible,
      tagName,
      animDuration,
      enableTags,
      animationClassName,
      bindWithKey: "items",
      handleAllTagChange: this.handleAllTagChange,
      handleNav: this.handleNav,
      meta: this.props.meta,
      toolbarExtend: this.makeToolbarPropsFromConfig2(
        toolbarExtendConfig,
        sidebarExtendConfig,
        {
          allowExtend: false
        }
      ),
      toolbarExtendFilter: this.makeToolbarPropsFromConfig2(
        toolbarFilterConfig,
        sidebarFilterConfig,
        {
          allowExtend: false
        }
      )
    });

    return (
      <CustomCSS selectorName={this.getId()} css={v.customCSS}>
        {({ ref: cssRef }) => (
          <ContextMenu {...this.makeContextMenuProps(contextMenuConfig)}>
            {({ ref: contextMenuRef }) => (
              <Items
                {...itemProps}
                containerRef={(el) => attachRefs(el, [cssRef, contextMenuRef])}
              />
            )}
          </ContextMenu>
        )}
      </CustomCSS>
    );
  }
}

export default Accordion;
