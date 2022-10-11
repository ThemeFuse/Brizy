import classnames from "classnames";
import React, { ReactElement, ReactNode } from "react";
import Scrollbars from "react-custom-scrollbars";
import { Popper } from "react-popper";
import ClickOutside from "visual/component/ClickOutside";
import CustomCSS from "visual/component/CustomCSS";
import { ElementModel } from "visual/component/Elements/Types";
import Portal from "visual/component/Portal";
import { ThemeIcon } from "visual/component/ThemeIcon";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { Wrapper } from "visual/editorComponents/tools/Wrapper";
import Config from "visual/global/Config";
import { CMS, isCloud, isCMS } from "visual/global/Config/types/configs/Cloud";
import { css } from "visual/utils/cssStyle";
import { DynamicContentHelper } from "../WordPress/common/DynamicContentHelper";
import defaultValue from "./defaultValue.json";
import * as sidebar from "./sidebar";
import { style, styleDropdown } from "./styles";
import * as toolbar from "./toolbar";
import * as toolbarExtendSelect from "./toolbarSelect";
import { getFlagUrl } from "./utils";

export interface Value extends ElementModel {
  nameDisplay: "full" | "code";
  showFlags: "on" | "off";
  showName: "on" | "off";
}

type Props = ElementModel;

interface State {
  isOpen: boolean;
}

const renderOption = (
  showName: "on" | "off",
  showFlags: "on" | "off",
  nameDisplay: "full" | "code",
  item: { name: string; code: string },
  flagsUrl: string
): ReactNode => {
  return (
    <>
      {showName === "on" && (
        <span className="brz-span" title={item.name}>
          {nameDisplay === "full" ? item.name : item.code}
        </span>
      )}
      {showFlags === "on" && flagsUrl && (
        <img
          className="brz-translation__flag"
          src={getFlagUrl(flagsUrl, item.code)}
        />
      )}
    </>
  );
};

export default class Translation extends EditorComponent<Value, Props, State> {
  static get componentId(): "Translation" {
    return "Translation";
  }

  static defaultValue = defaultValue;

  content = React.createRef<HTMLDivElement>();

  state = { isOpen: false };

  handleOutside = (): void => {
    if (this.state.isOpen) {
      this.setState({ isOpen: false });
    }
  };

  handleOpen = (): void => {
    this.setState(({ isOpen }) => ({ isOpen: !isOpen }), this.forceUpdate);
  };

  renderDropdown(v: Value, vs: Value, vd: Value): ReactNode {
    const content = this.content.current;

    const { nameDisplay, showName, showFlags } = v;

    const config = Config.getAll() as CMS;
    const flagsUrl = isCloud(config) && isCMS(config) ? config.urls.flags : "";

    const fakeLangs = [
      { name: "French", code: "fr" },
      { name: "Italian", code: "it" }
    ];

    const langOptions =
      config.availableTranslations.length !== 0
        ? config.availableTranslations
        : fakeLangs;

    if (content) {
      const className = classnames(
        "brz-portal-translation__select",
        { "brz-translation__code": nameDisplay === "code" },
        css(
          `${this.getComponentId()}-dropdown`,
          `${this.getId()}-dropdown`,
          styleDropdown(v, vs, vd)
        )
      );

      return (
        <Portal node={content.ownerDocument.body} className={className}>
          <Toolbar {...this.makeToolbarPropsFromConfig2(toolbarExtendSelect)}>
            <Popper
              referenceElement={content}
              placement="bottom-start"
              modifiers={[
                {
                  name: "sameWidth",
                  enabled: true,
                  fn: ({ state }) => {
                    state.styles.popper.width = `${state.rects.reference.width}px`;
                  },
                  phase: "beforeWrite",
                  requires: ["computeStyles"]
                }
              ]}
            >
              {({ ref, style }): ReactElement => (
                <div
                  ref={ref}
                  className={"brz-translation__select-list"}
                  style={style}
                >
                  <Scrollbars autoHeight={true}>
                    {langOptions.map((item, index) => (
                      <div key={index} className="brz-translation__select-item">
                        {renderOption(
                          showName,
                          showFlags,
                          nameDisplay,
                          item,
                          flagsUrl
                        )}
                      </div>
                    ))}
                  </Scrollbars>
                </div>
              )}
            </Popper>
          </Toolbar>
        </Portal>
      );
    }

    return null;
  }

  renderForEdit(v: Value, vs: Value, vd: Value): ReactNode {
    const { isOpen } = this.state;
    const { customCSS, nameDisplay, showName, showFlags } = v;

    const clickOutsideExceptions = [
      ".brz-portal-translation__select",
      ".brz-ed-toolbar",
      ".brz-ed-tooltip__content-portal",
      ".brz-translation"
    ];

    const className = classnames(
      "brz-translation",
      { "brz-translation__code": nameDisplay === "code" },
      css(
        `${this.getComponentId()}-current`,
        `${this.getId()}-current`,
        style(v, vs, vd)
      )
    );

    const config = Config.getAll();
    const flagsUrl = isCloud(config) && isCMS(config) ? config.urls.flags : "";

    return (
      <>
        <ClickOutside
          exceptions={clickOutsideExceptions}
          onClickOutside={this.handleOutside}
        >
          <Toolbar {...this.makeToolbarPropsFromConfig2(toolbar, sidebar)}>
            <CustomCSS selectorName={this.getId()} css={customCSS}>
              <Wrapper
                {...this.makeWrapperProps({
                  className,
                  ref: this.content,
                  onClick: this.handleOpen
                })}
              >
                {renderOption(
                  showName,
                  showFlags,
                  nameDisplay,
                  { name: "English", code: "en" },
                  flagsUrl
                )}

                <ThemeIcon
                  className="brz-translation__arrow"
                  name="triangle-down-20"
                  type="glyph"
                />
              </Wrapper>
            </CustomCSS>
          </Toolbar>
        </ClickOutside>
        {isOpen && this.renderDropdown(v, vs, vd)}
      </>
    );
  }

  renderForView(v: Value, vs: Value, vd: Value): ReactNode {
    const { showFlags, showName, nameDisplay, customCSS } = v;

    const className = classnames(
      "brz-translation",
      { "brz-translation__code": nameDisplay === "code" },
      css(`${this.getComponentId()}`, `${this.getId()}`, style(v, vs, vd))
    );

    return (
      <CustomCSS selectorName={this.getId()} css={customCSS}>
        <Wrapper
          {...this.makeWrapperProps({
            className,
            attributes: {
              "data-showflags": showFlags,
              "data-showname": showName
            }
          })}
        >
          <DynamicContentHelper
            placeholder={`{{translation_switcher namedisplay="${nameDisplay}"}}`}
            tagName="div"
            props={{ className: "brz-translation__dc" }}
          />
        </Wrapper>
      </CustomCSS>
    );
  }
}
