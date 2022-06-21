import React from "react";
import { noop } from "underscore";
import EditorComponent from "visual/editorComponents/EditorComponent";
import CustomCSS from "visual/component/CustomCSS";
import ContextMenu from "visual/component/ContextMenu";
import contextMenuConfig from "./contextMenu";
import Items from "./Items";
import * as toolbarExtendParentConfig from "./toolbarExtendParent";
import * as sidebarExtendParentConfig from "./sidebarExtendParent";
import * as toolbarExtendConfig from "./toolbarExtend";
import * as sidebarExtendConfig from "./sidebarExtend";
import * as toolbarFilterConfig from "./toolbarFilter";
import * as sidebarFilterConfig from "./sidebarFilter";
import defaultValue from "./defaultValue.json";
import { css } from "visual/utils/cssStyle";
import { style, styleAnimation } from "./styles";
import classnames from "classnames";
import {
  defaultValueValue,
  validateKeyByProperty
} from "visual/utils/onChange";
import classNames from "classnames";
import { getTagNameFromFontStyle } from "visual/editorComponents/tools/HtmlTag";

class Accordion extends EditorComponent {
  static get componentId() {
    return "Accordion";
  }

  static defaultProps = {
    meta: {},
    extendParentToolbar: noop
  };

  static defaultValue = defaultValue;

  handleAllTagChange = allTag => {
    this.patchValue({ allTag });
  };

  componentDidMount() {
    const toolbarExtend = this.makeToolbarPropsFromConfig2(
      toolbarExtendParentConfig,
      sidebarExtendParentConfig,
      {
        allowExtend: false,
        allowExtendFromThirdParty: true,
        thirdPartyExtendId: `${this.constructor.componentId}Parent`
      }
    );
    this.props.extendParentToolbar(toolbarExtend);
  }

  handleNav = activeAccordionItem => {
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

  getAnimationClassName = (v, vs, vd) => {
    if (!validateKeyByProperty(v, "animationName", "none")) {
      return undefined;
    }

    const animationName = defaultValueValue({ v, key: "animationName" });
    const animationDuration = defaultValueValue({
      v,
      key: "animationDuration"
    });
    const animationDelay = defaultValueValue({ v, key: "animationDelay" });
    const slug = `${animationName}-${animationDuration}-${animationDelay}`;

    return classNames(
      css(
        `${this.getComponentId()}-animation-${slug}`,
        `${this.getId()}-animation-${slug}`,
        styleAnimation(v, vs, vd)
      )
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
      allTag
    } = v;

    const className = classnames(
      "brz-accordion",
      css(this.constructor.componentId, this.getId(), style(v, vs, vd))
    );

    const animationClassName = this.getAnimationClassName(v, vs, vd);

    const itemProps = this.makeSubcomponentProps({
      allTag,
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
        <ContextMenu {...this.makeContextMenuProps(contextMenuConfig)}>
          <Items {...itemProps} />
        </ContextMenu>
      </CustomCSS>
    );
  }
}

export default Accordion;
