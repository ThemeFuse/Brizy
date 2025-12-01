import classNames from "classnames";
import { noop } from "es-toolkit";
import React from "react";
import ContextMenu from "visual/component/ContextMenu";
import { TextEditor } from "visual/component/Controls/TextEditor";
import CustomCSS from "visual/component/CustomCSS";
import { ThemeIcon } from "visual/component/ThemeIcon";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import {
  defaultValueValue,
  validateKeyByProperty
} from "visual/utils/onChange";
import { attachRefs } from "visual/utils/react";
import * as State from "visual/utils/stateMode";
import { Wrapper } from "../tools/Wrapper";
import contextMenuConfig from "./contextMenu";
import defaultValue from "./defaultValue.json";
import Items from "./items";
import * as sidebarConfig from "./sidebar";
import * as sidebarExtendParentConfig from "./sidebarExtendParent";
import { style, styleAnimation } from "./styles";
import * as toolbarConfig from "./toolbar";
import * as toolbarExtendParentConfig from "./toolbarExtendParent";
import * as toolbarSecondConfig from "./toolbarSecond";

class Switcher extends EditorComponent {
  static defaultProps = {
    meta: {},
    extendParentToolbar: noop
  };
  static defaultValue = defaultValue;

  static get componentId() {
    return ElementTypes.Switcher;
  }

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

  handleChange = (patch) => {
    this.patchValue(patch);
  };

  handleChangeNav = (activeTab) => {
    this.handleChange({ activeTab });
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

  renderNav(v, vs, vd, ref) {
    const {
      activeTab,
      labelText1,
      labelText2,
      firstIconName,
      firstIconType,
      firstIconFilename,
      secondIconName,
      secondIconType,
      secondIconFilename
    } = v;
    const className = classNames(
      "brz-switcher__nav2--control",
      { "brz-switcher__nav2--control--active": activeTab === 0 },
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

    return (
      <div className="brz-switcher__nav2" ref={ref}>
        {Array(2)
          .fill()
          .map((_, index) => {
            const classNameNavButton = classNames(
              "brz-switcher__nav2--button",
              {
                "brz-switcher__nav2__item--active": activeTab === index
              }
            );

            return (
              <React.Fragment key={index}>
                <Toolbar
                  {...this.makeToolbarPropsFromConfig2(
                    index === 0 ? toolbarConfig : toolbarSecondConfig,
                    sidebarConfig,
                    {
                      allowExtend: false
                    }
                  )}
                >
                  {({ ref }) => (
                    <div className={classNameNavButton} ref={ref}>
                      {index === 0 && firstIconName && firstIconType && (
                        <ThemeIcon
                          name={firstIconName}
                          type={firstIconType}
                          filename={firstIconFilename}
                        />
                      )}
                      {index === 0 && (
                        <TextEditor
                          className="brz-switcher__nav2__item"
                          value={labelText1}
                          onChange={(text) =>
                            this.handleChange({ labelText1: text })
                          }
                        />
                      )}
                      {index === 1 && secondIconName && secondIconType && (
                        <ThemeIcon
                          name={secondIconName}
                          type={secondIconType}
                          filename={secondIconFilename}
                        />
                      )}
                      {index === 1 && (
                        <TextEditor
                          className="brz-switcher__nav2__item"
                          value={labelText2}
                          onChange={(text) =>
                            this.handleChange({ labelText2: text })
                          }
                        />
                      )}
                    </div>
                  )}
                </Toolbar>
                {index === 0 && (
                  <div
                    onClick={() => {
                      this.handleChangeNav(activeTab === 0 ? 1 : 0);
                    }}
                    className={className}
                  />
                )}
              </React.Fragment>
            );
          })}
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
    const classNameSwitcher = classNames(
      "brz-switcher",
      { "brz-switcher--style2": switcherStyle === "style-2" },
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
    const classNameNav = classNames("brz-switcher__nav", {
      "brz-switcher__nav--active": activeTab === 0
    });

    return (
      <CustomCSS selectorName={this.getId()} css={customCSS}>
        {({ ref: cssRef }) => (
          <ContextMenu {...this.makeContextMenuProps(contextMenuConfig)}>
            {({ ref: contextMenuRef }) => {
              const ref = (el) => attachRefs(el, [cssRef, contextMenuRef]);

              return (
                <Wrapper
                  {...this.makeWrapperProps({
                    className: classNameSwitcher
                  })}
                >
                  {switcherStyle === "style-2" ? (
                    this.renderNav(v, vs, vd, ref)
                  ) : (
                    <div className={classNameNav} ref={ref}>
                      <Items {...itemNavProps} />
                    </div>
                  )}
                  <Items {...itemContentProps} />
                </Wrapper>
              );
            }}
          </ContextMenu>
        )}
      </CustomCSS>
    );
  }
}

export default Switcher;
