import React from "react";
import classnames from "classnames";
import { noop } from "underscore";
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
import * as toolbarSecondConfig from "./toolbarSecond";
import Toolbar from "visual/component/Toolbar";
import { ThemeIcon } from "visual/component/ThemeIcon";
import { TextEditor } from "visual/component/Controls/TextEditor";
import { Wrapper } from "../tools/Wrapper";
import {
  defaultValueValue,
  validateKeyByProperty
} from "visual/utils/onChange";
import classNames from "classnames";

class Switcher extends EditorComponent {
  static get componentId() {
    return "Switcher";
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
      { allowExtend: false,
        allowExtendFromThirdParty: true,
        thirdPartyExtendId: `${this.constructor.componentId}Parent`
      }
    );
    this.props.extendParentToolbar(toolbarExtend);
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

  renderNav(v, vs, vd) {
    const {
      activeTab,
      labelText1,
      labelText2,
      firstIconName,
      firstIconType,
      secondIconName,
      secondIconType
    } = v;
    const className = classnames(
      "brz-switcher__nav2--control",
      { "brz-switcher__nav2--control--active": activeTab === 0 },
      css(this.constructor.componentId, this.getId(), style(v, vs, vd))
    );

    const classNameActive1 = classnames("brz-switcher__nav2__item", {
      "brz-switcher__nav2__item--active": activeTab === 0
    });
    const classNameActive2 = classnames("brz-switcher__nav2__item", {
      "brz-switcher__nav2__item--active": activeTab === 1
    });

    return (
      <div className="brz-switcher__nav2">
        <Toolbar
          {...this.makeToolbarPropsFromConfig2(toolbarConfig, sidebarConfig, {
            allowExtend: false
          })}
        >
          <div className="brz-switcher__nav2--button">
            {firstIconName && firstIconType && (
              <ThemeIcon name={firstIconName} type={firstIconType} />
            )}
            <TextEditor
            className={classNameActive1}
            value={labelText1}
            onChange={this.handleLabelChange1}
          />
          </div>
        </Toolbar>

        <div
          onClick={() => {
            this.handleChangeNav(activeTab === 0 ? 1 : 0);
          }}
          className={className}
        />
        <Toolbar
          {...this.makeToolbarPropsFromConfig2(
            toolbarSecondConfig,
            sidebarConfig,
            {
              allowExtend: false
            }
          )}
        >
          <div className="brz-switcher__nav2--button">
            {secondIconName && secondIconType && (
              <ThemeIcon name={secondIconName} type={secondIconType} />
            )}
            <TextEditor
            className={classNameActive2}
            value={labelText2}
            onChange={this.handleLabelChange2}
          />
          </div>
        </Toolbar>
      </div>
    );
  }

  renderForEdit(v, vs, vd) {
    const { activeTab, customCSS, switcherStyle, iconName, iconType } = v;
    const itemNavProps = this.makeSubcomponentProps({
      activeTab,
      iconName,
      iconType,
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

    const animationClassName = this.getAnimationClassName(v, vs, vd);

    const itemContentProps = this.makeSubcomponentProps({
      activeTab,
      iconName,
      iconType,
      animationClassName,
      bindWithKey: "items",
      renderType: "content",
      meta: this.props.meta
    });
    const classNameSwitcher = classnames(
      "brz-switcher",
      { "brz-switcher--style2": switcherStyle === "style-2" },
      css(this.constructor.componentId, this.getId(), style(v, vs, vd))
    );
    const classNameNav = classnames("brz-switcher__nav", {
      "brz-switcher__nav--active": activeTab === 0
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
