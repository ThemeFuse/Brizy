import React, { createRef, ReactNode } from "react";
import { uniqueId } from "underscore";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { Wrapper } from "visual/editorComponents/tools/Wrapper";
import Config from "visual/global/Config";
import { isCloud } from "visual/global/Config/types/configs/Cloud";
import { EcwidService } from "visual/libs/Ecwid";
import CustomCSS from "visual/component/CustomCSS";
import { ElementModel } from "visual/component/Elements/Types";
import Toolbar from "visual/component/Toolbar";
import { css } from "visual/utils/cssStyle";
import classnames from "classnames";
import { style } from "./styles";
import defaultValue from "./defaultValue.json";
import * as sidebarExtendParent from "./sidebar";
import * as sidebarInput from "./sidebarInput";
import * as sidebarDisable from "./sidebarDisable";
import * as toolbarExtendParent from "./toolbar";
import * as toolbarTitle from "./toolbarTitle";
import * as toolbarTitle2 from "./toolbarTitle2";
import * as toolbarFooter from "./toolbarFooter";
import * as toolbarButton from "./toolbarButton";
import * as toolbarSubtitles from "./toolbarSubtitles";
import * as toolbarEmail from "./toolbarEmail";
import * as toolbarCheckbox from "./toolbarCheckbox";
import * as toolbarNext from "./toolbarNext";
import * as toolbarPayment from "./toolbarPayment";
import * as toolbarInput from "./toolbarInput";
import * as toolbarProductName from "./toolbarProductName";
import * as toolbarProductSize from "./toolbarProductSize";

export interface Value extends ElementModel {
  productId: string;

  customCSS: string;
}

export class EcwidCart extends EditorComponent<Value> {
  static get componentId(): "EcwidCart" {
    return "EcwidCart";
  }
  static defaultValue = defaultValue;

  private uniqueId = `${EcwidCart.componentId}-${uniqueId()}`;

  private containerRef = createRef<HTMLDivElement>();

  componentDidMount(): void {
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

    if (!IS_EDITOR) {
      return;
    }

    const config = Config.getAll();

    if (
      this.containerRef.current &&
      isCloud(config) &&
      config.modules?.shop?.type === "ecwid"
    ) {
      EcwidService.init(config.modules.shop.storeId).cart(
        this.containerRef.current
      );
    }
  }

  renderForEdit(v: Value, vs: Value, vd: Value): React.ReactNode {
    const { customCSS } = v;

    const className = classnames(
      "brz-ecwid-wrapper",
      "brz-ecwid-cart-wrapper",
      css(`${this.getComponentId()}`, `${this.getId()}`, style(v, vs, vd))
    );

    return (
      <Toolbar
        {...this.makeToolbarPropsFromConfig2(toolbarTitle, sidebarDisable)}
        selector=".ec-cart__sidebar-inner .ec-page-title h1.page-title__name.ec-header-h1"
      >
        <Toolbar
          {...this.makeToolbarPropsFromConfig2(toolbarTitle2, sidebarDisable)}
          selector=".ec-cart__body-inner .ec-page-title .page-title__name.ec-header-h1"
        >
          <Toolbar
            {...this.makeToolbarPropsFromConfig2(
              toolbarProductName,
              sidebarDisable
            )}
            selector="a.ec-cart-item__title"
          >
            <Toolbar
              {...this.makeToolbarPropsFromConfig2(
                toolbarProductSize,
                sidebarDisable
              )}
              selector=".ec-cart-item__options.ec-text-muted"
            >
              <Toolbar
                {...this.makeToolbarPropsFromConfig2(
                  toolbarEmail,
                  sidebarDisable
                )}
                selector=".ec-cart-email__text"
              >
                <Toolbar
                  {...this.makeToolbarPropsFromConfig2(
                    toolbarCheckbox,
                    sidebarDisable
                  )}
                  selector=".form-control--checkbox.form-control"
                >
                  <Toolbar
                    {...this.makeToolbarPropsFromConfig2(
                      toolbarButton,
                      sidebarDisable
                    )}
                    selector=".form-control__button"
                  >
                    <Toolbar
                      {...this.makeToolbarPropsFromConfig2(
                        toolbarSubtitles,
                        sidebarDisable
                      )}
                      selector=".ec-cart__cert.ec-text-muted, .ec-cart-next__text.ec-text-muted"
                    >
                      <Toolbar
                        {...this.makeToolbarPropsFromConfig2(
                          toolbarInput,
                          sidebarInput
                        )}
                        selector=".ec-cart-email__input"
                      >
                        <Toolbar
                          {...this.makeToolbarPropsFromConfig2(
                            toolbarNext,
                            sidebarDisable
                          )}
                          selector=".ec-cart-next__header.ec-header-h4"
                        >
                          <Toolbar
                            {...this.makeToolbarPropsFromConfig2(
                              toolbarPayment,
                              sidebarDisable
                            )}
                            selector=".ec-cart-next__title"
                          >
                            <Toolbar
                              {...this.makeToolbarPropsFromConfig2(
                                toolbarFooter,
                                sidebarDisable
                              )}
                              selector=".ec-footer"
                            >
                              <CustomCSS
                                selectorName={this.getId()}
                                css={customCSS}
                              >
                                <Wrapper
                                  {...this.makeWrapperProps({ className })}
                                >
                                  <div
                                    className="brz-ecwid-cart"
                                    id={this.uniqueId}
                                    ref={this.containerRef}
                                  />
                                </Wrapper>
                              </CustomCSS>
                            </Toolbar>
                          </Toolbar>
                        </Toolbar>
                      </Toolbar>
                    </Toolbar>
                  </Toolbar>
                </Toolbar>
              </Toolbar>
            </Toolbar>
          </Toolbar>
        </Toolbar>
      </Toolbar>
    );
  }

  renderForView(v: Value, vs: Value, vd: Value): ReactNode {
    const className = classnames(
      "brz-ecwid-wrapper",
      "brz-ecwid-cart-wrapper",
      css(`${this.getComponentId()}`, `${this.getId()}`, style(v, vs, vd))
    );

    return (
      <Wrapper {...this.makeWrapperProps({ className })}>
        <div className="brz-ecwid-cart" data-store-id="{{ecwid_store_id}}" />
      </Wrapper>
    );
  }
}
