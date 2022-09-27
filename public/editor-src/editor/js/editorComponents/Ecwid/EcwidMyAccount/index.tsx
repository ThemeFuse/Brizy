import classNames from "classnames";
import React, { createRef, ReactNode } from "react";
import { uniqueId } from "underscore";
import CustomCSS from "visual/component/CustomCSS";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { Wrapper } from "visual/editorComponents/tools/Wrapper";
import Config from "visual/global/Config";
import { isCloud } from "visual/global/Config/types/configs/Cloud";
import { EcwidService } from "visual/libs/Ecwid";
import { eq } from "visual/libs/Ecwid/types/EcwidConfig";
import { css } from "visual/utils/cssStyle";
import defaultValue from "./defaultValue.json";
import * as sidebarExtendParent from "./sidebar";
import * as sidebarButton from "./sidebarButton";
import * as sidebarDisable from "./sidebarDisable";
import * as sidebarImage from "./sidebarImage";
import * as sidebarInput from "./sidebarInput";
import * as sidebarUser from "./sidebarUser";
import { style } from "./styles";
import * as toolbarExtendParent from "./toolbar";
import * as toolbarAccountTitle from "./toolbarAccountTitle";
import * as toolbarAgreement from "./toolbarAgreement";
import * as toolbarBreadcrumbs from "./toolbarBreadcrumbs";
import * as toolbarButton from "./toolbarButton";
import * as toolbarConnectLink from "./toolbarConnectLink";
import * as toolbarDescription from "./toolbarDescription";
import * as toolbarEmpty from "./toolbarEmpty";
import * as toolbarFooter from "./toolbarFooter";
import * as toolbarInput from "./toolbarInput";
import * as toolbarProducts from "./toolbarProducts";
import * as toolbarShopTitle from "./toolbarShopTitle";
import * as toolbarTitle from "./toolbarTitle";
import * as toolbarTitle2 from "./toolbarTitle2";
import * as toolbarUser from "./toolbarUser";
import { Value } from "./types/Value";
import { valueToEciwdConfig } from "./utils";

export class EcwidMyAccount extends EditorComponent<Value> {
  private uniqueId = `${EcwidMyAccount.componentId}-${uniqueId()}`;

  private containerRef = createRef<HTMLDivElement>();

  private ecwid: EcwidService | undefined;

  static get componentId(): "EcwidMyAccount" {
    return "EcwidMyAccount";
  }
  static defaultValue = defaultValue;

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
      const v = this.getDBValue();
      const cnf = valueToEciwdConfig(v);

      this.ecwid = EcwidService.init(config.modules.shop.storeId, cnf);
      this.ecwid.myAccount(this.containerRef.current);
    }
  }

  componentDidUpdate(): void {
    const newConfig = valueToEciwdConfig(this.getDBValue());
    const oldConfig = this.ecwid?.getConfig();

    if (!oldConfig || !eq(oldConfig, newConfig)) {
      this.ecwid?.updateConfig(newConfig);
    }
  }

  renderForEdit(v: Value, vs: Value, vd: Value): React.ReactNode {
    const { customCSS } = v;

    const className = classNames(
      "brz-ecwid-wrapper",
      "brz-ecwid-my-account-wrapper",
      css(`${this.getComponentId()}`, `${this.getId()}`, style(v, vs, vd))
    );

    return (
      <Toolbar
        {...this.makeToolbarPropsFromConfig2(toolbarTitle, sidebarDisable)}
        selector=".page-title__name.ec-header-h1"
        selectorSearchStrategy="dom-tree"
      >
        {({ open: openTitle }) => {
          return (
            <Toolbar
              {...this.makeToolbarPropsFromConfig2(toolbarUser, sidebarUser, {
                allowExtend: false
              })}
              selector=".ec-cart-step__icon.ec-cart-step__icon--custom"
              selectorSearchStrategy="dom-tree"
            >
              {({ open: openUser }) => {
                return (
                  <Toolbar
                    {...this.makeToolbarPropsFromConfig2(
                      toolbarAccountTitle,
                      sidebarDisable
                    )}
                    selector=".ec-cart-step__title.ec-header-h6"
                    selectorSearchStrategy="dom-tree"
                  >
                    {({ open: openAccountTitle }) => {
                      return (
                        <Toolbar
                          {...this.makeToolbarPropsFromConfig2(
                            toolbarBreadcrumbs,
                            sidebarDisable
                          )}
                          selector=".ec-breadcrumbs"
                          selectorSearchStrategy="dom-tree"
                        >
                          {({ open: openBreadcrumbs }) => {
                            return (
                              <Toolbar
                                {...this.makeToolbarPropsFromConfig2(
                                  toolbarConnectLink,
                                  sidebarDisable
                                )}
                                selector=".ec-cart-step__text, .ec-cart-step__change.ec-link"
                                selectorSearchStrategy="dom-tree"
                              >
                                {({ open: openConnectLink }) => {
                                  return (
                                    <Toolbar
                                      {...this.makeToolbarPropsFromConfig2(
                                        toolbarShopTitle,
                                        sidebarDisable
                                      )}
                                      selector=".ec-cart-step__title.ec-header-h4"
                                      selectorSearchStrategy="dom-tree"
                                    >
                                      {({ open: openShopTitle }) => {
                                        return (
                                          <Toolbar
                                            {...this.makeToolbarPropsFromConfig2(
                                              toolbarProducts,
                                              sidebarImage,
                                              {
                                                allowExtend: false
                                              }
                                            )}
                                            selector=".ec-cart__products"
                                            selectorSearchStrategy="dom-tree"
                                          >
                                            {({ open: openProducts }) => {
                                              return (
                                                <Toolbar
                                                  {...this.makeToolbarPropsFromConfig2(
                                                    toolbarTitle2,
                                                    sidebarDisable
                                                  )}
                                                  selector="h3.page-title__name.ec-header-h4"
                                                  selectorSearchStrategy="dom-tree"
                                                >
                                                  {({ open: openTitle2 }) => {
                                                    return (
                                                      <Toolbar
                                                        {...this.makeToolbarPropsFromConfig2(
                                                          toolbarDescription,
                                                          sidebarDisable
                                                        )}
                                                        selector=".ec-cart-email__text"
                                                        selectorSearchStrategy="dom-tree"
                                                      >
                                                        {({
                                                          open: openDescription
                                                        }) => {
                                                          return (
                                                            <Toolbar
                                                              {...this.makeToolbarPropsFromConfig2(
                                                                toolbarInput,
                                                                sidebarInput,
                                                                {
                                                                  allowExtend:
                                                                    false
                                                                }
                                                              )}
                                                              selector=".ec-cart-email__input"
                                                              selectorSearchStrategy="dom-tree"
                                                            >
                                                              {({
                                                                open: openInput
                                                              }) => {
                                                                return (
                                                                  <Toolbar
                                                                    {...this.makeToolbarPropsFromConfig2(
                                                                      toolbarAgreement,
                                                                      sidebarDisable
                                                                    )}
                                                                    selector=".ec-cart__agreement"
                                                                    selectorSearchStrategy="dom-tree"
                                                                  >
                                                                    {({
                                                                      open: openAgreement
                                                                    }) => {
                                                                      return (
                                                                        <Toolbar
                                                                          {...this.makeToolbarPropsFromConfig2(
                                                                            toolbarButton,
                                                                            sidebarButton,
                                                                            {
                                                                              allowExtend:
                                                                                false
                                                                            }
                                                                          )}
                                                                          selector=".form-control__button"
                                                                          selectorSearchStrategy="dom-tree"
                                                                        >
                                                                          {({
                                                                            open: openButton
                                                                          }) => {
                                                                            return (
                                                                              <Toolbar
                                                                                {...this.makeToolbarPropsFromConfig2(
                                                                                  toolbarFooter,
                                                                                  sidebarDisable
                                                                                )}
                                                                                selector=".ec-footer__row"
                                                                                selectorSearchStrategy="dom-tree"
                                                                              >
                                                                                {({
                                                                                  open: openFooter
                                                                                }) => {
                                                                                  return (
                                                                                    <Toolbar
                                                                                      {...this.makeToolbarPropsFromConfig2(
                                                                                        toolbarEmpty,
                                                                                        sidebarDisable
                                                                                      )}
                                                                                      selector=".ec-cart-step__body .ec-cart-step__section .ec-cart-step__text"
                                                                                      selectorSearchStrategy="dom-tree"
                                                                                    >
                                                                                      {({
                                                                                        open: openEmpty
                                                                                      }) => {
                                                                                        return (
                                                                                          <CustomCSS
                                                                                            selectorName={this.getId()}
                                                                                            css={
                                                                                              customCSS
                                                                                            }
                                                                                          >
                                                                                            <Wrapper
                                                                                              {...this.makeWrapperProps(
                                                                                                {
                                                                                                  className
                                                                                                }
                                                                                              )}
                                                                                            >
                                                                                              <div
                                                                                                onClickCapture={(
                                                                                                  e
                                                                                                ) => {
                                                                                                  e.stopPropagation();
                                                                                                  e.preventDefault();

                                                                                                  if (
                                                                                                    (
                                                                                                      e.target as HTMLElement | null
                                                                                                    )?.closest(
                                                                                                      ".page-title__name.ec-header-h1"
                                                                                                    )
                                                                                                  ) {
                                                                                                    openTitle(
                                                                                                      e.nativeEvent
                                                                                                    );
                                                                                                  } else if (
                                                                                                    (
                                                                                                      e.target as HTMLElement | null
                                                                                                    )?.closest(
                                                                                                      ".ec-cart-step__icon.ec-cart-step__icon--custom"
                                                                                                    )
                                                                                                  ) {
                                                                                                    openUser(
                                                                                                      e.nativeEvent
                                                                                                    );
                                                                                                  } else if (
                                                                                                    (
                                                                                                      e.target as HTMLElement | null
                                                                                                    )?.closest(
                                                                                                      ".ec-cart-step__title.ec-header-h6"
                                                                                                    )
                                                                                                  ) {
                                                                                                    openAccountTitle(
                                                                                                      e.nativeEvent
                                                                                                    );
                                                                                                  } else if (
                                                                                                    (
                                                                                                      e.target as HTMLElement | null
                                                                                                    )?.closest(
                                                                                                      ".ec-breadcrumbs"
                                                                                                    )
                                                                                                  ) {
                                                                                                    openBreadcrumbs(
                                                                                                      e.nativeEvent
                                                                                                    );
                                                                                                  } else if (
                                                                                                    (
                                                                                                      e.target as HTMLElement | null
                                                                                                    )?.closest(
                                                                                                      ".ec-cart-step__text, .ec-cart-step__change.ec-link"
                                                                                                    )
                                                                                                  ) {
                                                                                                    openConnectLink(
                                                                                                      e.nativeEvent
                                                                                                    );
                                                                                                  } else if (
                                                                                                    (
                                                                                                      e.target as HTMLElement | null
                                                                                                    )?.closest(
                                                                                                      ".ec-cart-step__title.ec-header-h4"
                                                                                                    )
                                                                                                  ) {
                                                                                                    openShopTitle(
                                                                                                      e.nativeEvent
                                                                                                    );
                                                                                                  } else if (
                                                                                                    (
                                                                                                      e.target as HTMLElement | null
                                                                                                    )?.closest(
                                                                                                      ".ec-cart__products"
                                                                                                    )
                                                                                                  ) {
                                                                                                    openProducts(
                                                                                                      e.nativeEvent
                                                                                                    );
                                                                                                  } else if (
                                                                                                    (
                                                                                                      e.target as HTMLElement | null
                                                                                                    )?.closest(
                                                                                                      "h3.page-title__name.ec-header-h4"
                                                                                                    )
                                                                                                  ) {
                                                                                                    openTitle2(
                                                                                                      e.nativeEvent
                                                                                                    );
                                                                                                  } else if (
                                                                                                    (
                                                                                                      e.target as HTMLElement | null
                                                                                                    )?.closest(
                                                                                                      ".ec-cart-email__text"
                                                                                                    )
                                                                                                  ) {
                                                                                                    openDescription(
                                                                                                      e.nativeEvent
                                                                                                    );
                                                                                                  } else if (
                                                                                                    (
                                                                                                      e.target as HTMLElement | null
                                                                                                    )?.closest(
                                                                                                      ".ec-cart-email__input"
                                                                                                    )
                                                                                                  ) {
                                                                                                    openInput(
                                                                                                      e.nativeEvent
                                                                                                    );
                                                                                                  } else if (
                                                                                                    (
                                                                                                      e.target as HTMLElement | null
                                                                                                    )?.closest(
                                                                                                      ".ec-cart__agreement"
                                                                                                    )
                                                                                                  ) {
                                                                                                    openAgreement(
                                                                                                      e.nativeEvent
                                                                                                    );
                                                                                                  } else if (
                                                                                                    (
                                                                                                      e.target as HTMLElement | null
                                                                                                    )?.closest(
                                                                                                      ".form-control__button"
                                                                                                    )
                                                                                                  ) {
                                                                                                    openButton(
                                                                                                      e.nativeEvent
                                                                                                    );
                                                                                                  } else if (
                                                                                                    (
                                                                                                      e.target as HTMLElement | null
                                                                                                    )?.closest(
                                                                                                      ".ec-footer__row"
                                                                                                    )
                                                                                                  ) {
                                                                                                    openFooter(
                                                                                                      e.nativeEvent
                                                                                                    );
                                                                                                  } else if (
                                                                                                    (
                                                                                                      e.target as HTMLElement | null
                                                                                                    )?.closest(
                                                                                                      ".ec-cart-step__body .ec-cart-step__section .ec-cart-step__text"
                                                                                                    )
                                                                                                  ) {
                                                                                                    openEmpty(
                                                                                                      e.nativeEvent
                                                                                                    );
                                                                                                  }

                                                                                                  return false;
                                                                                                }}
                                                                                                className="brz-ecwid-my-account"
                                                                                                id={
                                                                                                  this
                                                                                                    .uniqueId
                                                                                                }
                                                                                                ref={
                                                                                                  this
                                                                                                    .containerRef
                                                                                                }
                                                                                              />
                                                                                            </Wrapper>
                                                                                          </CustomCSS>
                                                                                        );
                                                                                      }}
                                                                                    </Toolbar>
                                                                                  );
                                                                                }}
                                                                              </Toolbar>
                                                                            );
                                                                          }}
                                                                        </Toolbar>
                                                                      );
                                                                    }}
                                                                  </Toolbar>
                                                                );
                                                              }}
                                                            </Toolbar>
                                                          );
                                                        }}
                                                      </Toolbar>
                                                    );
                                                  }}
                                                </Toolbar>
                                              );
                                            }}
                                          </Toolbar>
                                        );
                                      }}
                                    </Toolbar>
                                  );
                                }}
                              </Toolbar>
                            );
                          }}
                        </Toolbar>
                      );
                    }}
                  </Toolbar>
                );
              }}
            </Toolbar>
          );
        }}
      </Toolbar>
    );
  }

  renderForView(v: Value, vs: Value, vd: Value): ReactNode {
    const className = classNames(
      "brz-ecwid-wrapper",
      "brz-ecwid-my-account-wrapper",
      css(`${this.getComponentId()}`, `${this.getId()}`, style(v, vs, vd))
    );

    return (
      <Wrapper {...this.makeWrapperProps({ className })}>
        <div
          className="brz-ecwid-my-account"
          data-store-id="{{ecwid_store_id}}"
        />
      </Wrapper>
    );
  }
}
