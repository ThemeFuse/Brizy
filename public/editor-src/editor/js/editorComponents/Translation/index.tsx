import classnames from "classnames";
import React, { ReactElement, ReactNode, RefObject } from "react";
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
import { CMS } from "visual/global/Config/types/configs/Cloud";
import { makePlaceholder } from "visual/utils/dynamicContent";
import { makeDataAttr } from "visual/utils/i18n/attribute";
import { attachRefs } from "visual/utils/react";
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
  customCSS: string;
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
  static defaultValue = defaultValue;
  content = React.createRef<HTMLDivElement>();
  state = { isOpen: false };

  static get componentId(): "Translation" {
    return "Translation";
  }

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

    const config = this.getGlobalConfig() as CMS;
    const flagsUrl = config.urls.flags ?? "";

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
        this.css(
          `${this.getComponentId()}-dropdown`,
          `${this.getId()}-dropdown`,
          styleDropdown({
            v,
            vs,
            vd,
            store: this.getReduxStore(),
            contexts: this.getContexts()
          })
        )
      );

      return (
        <Portal node={content.ownerDocument.body} className={className}>
          <Toolbar {...this.makeToolbarPropsFromConfig2(toolbarExtendSelect)}>
            {({ ref: toolbarRef }) => (
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
                    ref={(el) => {
                      attachRefs(el, [
                        ref as RefObject<HTMLDivElement>,
                        toolbarRef
                      ]);
                    }}
                    className={"brz-translation__select-list"}
                    style={style}
                  >
                    <Scrollbars autoHeight={true}>
                      {langOptions.map((item, index) => (
                        <div
                          key={index}
                          className="brz-translation__select-item"
                        >
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
            )}
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
      this.css(
        `${this.getComponentId()}-current`,
        `${this.getId()}-current`,
        style({
          v,
          vs,
          vd,
          store: this.getReduxStore(),
          contexts: this.getContexts()
        })
      )
    );

    const config = this.getGlobalConfig();

    const flagsUrl = config.urls?.flags ?? "";

    return (
      <>
        <ClickOutside
          exceptions={clickOutsideExceptions}
          onClickOutside={this.handleOutside}
        >
          {({ ref: clickOutsideRef }) => (
            <Toolbar {...this.makeToolbarPropsFromConfig2(toolbar, sidebar)}>
              {({ ref: toolbarRef }) => (
                <CustomCSS selectorName={this.getId()} css={customCSS}>
                  {({ ref: cssRef }) => (
                    <Wrapper
                      {...this.makeWrapperProps({
                        className,
                        ref: (el) => {
                          attachRefs(el, [
                            this.content,
                            clickOutsideRef,
                            toolbarRef,
                            cssRef
                          ]);
                        },
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
                  )}
                </CustomCSS>
              )}
            </Toolbar>
          )}
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
      this.css(
        `${this.getComponentId()}`,
        `${this.getId()}`,
        style({
          v,
          vs,
          vd,
          store: this.getReduxStore(),
          contexts: this.getContexts()
        })
      )
    );
    const placeholder = makePlaceholder({
      content: "{{translation_switcher}}",
      attr: { namedisplay: nameDisplay }
    });

    return (
      <CustomCSS selectorName={this.getId()} css={customCSS}>
        <Wrapper
          {...this.makeWrapperProps({
            className,
            attributes: {
              ...makeDataAttr({ name: "showflags", value: showFlags }),
              ...makeDataAttr({ name: "showname", value: showName })
            }
          })}
        >
          <DynamicContentHelper
            placeholder={placeholder}
            tagName="div"
            props={{ className: "brz-translation__dc h-full" }}
          />
        </Wrapper>
      </CustomCSS>
    );
  }
}
