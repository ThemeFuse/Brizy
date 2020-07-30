import React from "react";
import classnames from "classnames";
import EditorComponent from "visual/editorComponents/EditorComponent";
import CustomCSS from "visual/component/CustomCSS";
import { css } from "visual/utils/cssStyle";
import { style, styleAnimation } from "./styles";
import ContextMenu from "visual/component/ContextMenu";
import contextMenuConfig from "./contextMenu";
import defaultValue from "./defaultValue.json";
import Items from "./items";
import * as toolbarExtendParentConfig from "./toolbarExtendParent";
import * as sidebarExtendParentConfig from "./sidebarExtendParent";
import * as toolbarConfig from "./toolbar";
import * as sidebarConfig from "./sidebar";
import Toolbar from "visual/component/Toolbar";
import { TextEditor } from "visual/component/Controls/TextEditor";
import { Wrapper } from "../tools/Wrapper";
import { validateKeyByProperty } from "visual/utils/onChange";

class Switcher extends EditorComponent {
  static get componentId() {
    return "Switcher";
  }

  static defaultProps = {
    meta: {}
  };

  static defaultValue = defaultValue;

  componentDidMount() {
    const toolbarExtend = this.makeToolbarPropsFromConfig2(
      toolbarExtendParentConfig,
      sidebarExtendParentConfig,
      {
        allowExtend: false
      }
    );
    this.props.extendParentToolbar(toolbarExtend);
    this.handleChangeNav(0);
  }

  handleChangeNav = activeTab => {
    this.patchValue({ activeTab });
  };

  handleLabelChange1 = labelText1 => {
    this.patchValue({ labelText1 });
  };

  handleLabelChange2 = labelText2 => {
    this.patchValue({ labelText2 });
  };

  renderNav(v, vs, vd) {
    const { activeTab, labelText1, labelText2 } = v;
    const className = classnames(
      "brz-switcher__nav2--control",
      { "brz-switcher__nav2--control--active": activeTab === 0 },
      css(this.constructor.componentId, this.getId(), style(v, vs, vd))
    );

    return (
      <Toolbar
        {...this.makeToolbarPropsFromConfig2(toolbarConfig, sidebarConfig, {
          allowExtend: false
        })}
      >
        <div className="brz-switcher__nav2">
          <TextEditor value={labelText1} onChange={this.handleLabelChange1} />
          <div
            onClick={() => {
              this.handleChangeNav(activeTab === 0 ? 1 : 0);
            }}
            className={className}
          />
          <TextEditor value={labelText2} onChange={this.handleLabelChange2} />
        </div>
      </Toolbar>
    );
  }

  renderForEdit(v, vs, vd) {
    const { activeTab, customCSS, switcherStyle } = v;
    const classNameSwitcher = classnames(
      "brz-switcher",
      { "brz-switcher--style2": switcherStyle === "style-2" },
      css(this.constructor.componentId, this.getId(), style(v, vs, vd))
    );
    const classNameNav = classnames("brz-switcher__nav", {
      "brz-switcher__nav--active": activeTab === 0
    });
    const animationClassName = classnames(
      validateKeyByProperty(v, "animationName", "none") &&
        css(
          `${this.constructor.componentId}-wrapper-animation,`,
          `${this.getId()}-animation`,
          styleAnimation(v, vs, vd)
        )
    );

    const itemNavProps = this.makeSubcomponentProps({
      activeTab,
      bindWithKey: "items",
      renderType: "nav",
      meta: this.props.meta,
      toolbarExtend: this.makeToolbarPropsFromConfig2(
        toolbarConfig,
        sidebarConfig,
        {
          allowExtend: false
        }
      ),
      onChangeNav: this.handleChangeNav
    });
    const itemContentProps = this.makeSubcomponentProps({
      activeTab,
      animationClassName,
      bindWithKey: "items",
      renderType: "content",
      meta: this.props.meta
    });

    return (
      <CustomCSS selectorName={this.getId()} css={customCSS}>
        <ContextMenu {...this.makeContextMenuProps(contextMenuConfig)}>
          <Wrapper {...this.makeWrapperProps({ className: classNameSwitcher })}>
            {switcherStyle === "style-2" ? (
              this.renderNav(v, vs, vd)
            ) : (
              <div className={classNameNav}>
                <Items {...itemNavProps} />
              </div>
            )}
            <Items {...itemContentProps} />
          </Wrapper>
        </ContextMenu>
      </CustomCSS>
    );
  }
}

export default Switcher;
