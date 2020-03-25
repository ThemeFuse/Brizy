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
import { style } from "./styles";
import classnames from "classnames";

class Accordion extends EditorComponent {
  static get componentId() {
    return "Accordion";
  }

  static defaultProps = {
    meta: {},
    extendParentToolbar: noop
  };

  static defaultValue = defaultValue;

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

  renderForEdit(v, vs, vd) {
    const className = classnames(
      "brz-accordion",
      css(this.constructor.componentId, this.getId(), style(v, vs, vd))
    );

    const {
      activeAccordionItem,
      filterStyle,
      navIcon,
      collapsible,
      enableTags
    } = v;
    const itemProps = this.makeSubcomponentProps({
      className,
      filterStyle,
      activeAccordionItem,
      navIcon,
      collapsible,
      enableTags,
      bindWithKey: "items",
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
