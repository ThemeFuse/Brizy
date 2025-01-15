import classNames from "classnames";
import React, { ReactNode, createRef } from "react";
import { uniqueId } from "underscore";
import { isView } from "visual/providers/RenderProvider";
import CustomCSS from "visual/component/CustomCSS";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { Wrapper } from "visual/editorComponents/tools/Wrapper";
import { isCloud } from "visual/global/Config/types/configs/Cloud";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { EcwidService } from "visual/libs/Ecwid";
import { eq } from "visual/libs/Ecwid/types/EcwidConfig";
import { makePlaceholder } from "visual/utils/dynamicContent";
import { encodeToString } from "visual/utils/string";
import * as sidebarExtendParent from "../sidebar";
import * as sidebarButton from "../sidebarButton";
import * as sidebarDisable from "../sidebarDisable";
import * as sidebarImage from "../sidebarImage";
import * as sidebarInput from "../sidebarInput";
import * as toolbarConnectLink from "../toolbarConnectLink";
import { ecwidToolbarFooter } from "../toolbarFooter";
import { ecwidToolbarTitle } from "../toolbarTitle";
import { ecwidToolbarTitle2 } from "../toolbarTitle2";
import defaultValue from "./defaultValue.json";
import * as sidebarUser from "./sidebarUser";
import { style } from "./styles";
import * as toolbarExtendParent from "./toolbar";
import * as toolbarAccountTitle from "./toolbarAccountTitle";
import * as toolbarAgreement from "./toolbarAgreement";
import * as toolbarButton from "./toolbarButton";
import * as toolbarDescription from "./toolbarDescription";
import * as toolbarEmpty from "./toolbarEmpty";
import * as toolbarInput from "./toolbarInput";
import * as toolbarProducts from "./toolbarProducts";
import * as toolbarShopTitle from "./toolbarShopTitle";
import * as toolbarTerms from "./toolbarTerms";
import * as toolbarUser from "./toolbarUser";
import { Value } from "./types/Value";
import { valueToEciwdConfig } from "./utils";

export class EcwidMyAccount extends EditorComponent<Value> {
  static defaultValue = defaultValue;
  private uniqueId = `${EcwidMyAccount.componentId}-${uniqueId()}`;
  private containerRef = createRef<HTMLDivElement>();
  private ecwid: EcwidService | undefined;

  static get componentId(): ElementTypes.EcwidMyAccount {
    return ElementTypes.EcwidMyAccount;
  }

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

    if (isView(this.renderContext)) {
      return;
    }

    const config = this.getGlobalConfig();

    if (
      this.containerRef.current &&
      isCloud(config) &&
      config.modules?.shop?.type === "ecwid"
    ) {
      const v = this.getValue();
      const cnf = valueToEciwdConfig(v);

      this.ecwid = EcwidService.init(config.modules.shop.storeId, {
        ...cnf,
        redirect: undefined
      });
      this.ecwid.myAccount(this.containerRef.current);
    }
  }

  componentDidUpdate(): void {
    const newConfig = valueToEciwdConfig(this.getValue());
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
      this.css(
        this.getComponentId(),
        this.getId(),
        style({
          v,
          vs,
          vd,
          store: this.getReduxStore(),
          renderContext: this.renderContext
        })
      )
    );

    return (
      <Toolbar
        {...this.makeToolbarPropsFromConfig2(
          ecwidToolbarTitle(),
          sidebarDisable
        )}
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
                            toolbarConnectLink,
                            sidebarDisable
                          )}
                          selector=".ec-cart__account-info .ec-cart-step__body .ec-cart-step__section"
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
                                              ecwidToolbarTitle2(),
                                              sidebarDisable
                                            )}
                                            selector=".page-title__name.ec-header-h4"
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
                                                            allowExtend: false
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
                                                                            ecwidToolbarFooter(),
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
                                                                                    <Toolbar
                                                                                      {...this.makeToolbarPropsFromConfig2(
                                                                                        toolbarTerms,
                                                                                        sidebarDisable
                                                                                      )}
                                                                                      selector=".ec-cart-step__body .ec-cart-step__section .ec-cart-step__text .ec-link, .ec-cart__agreement .ec-link"
                                                                                      selectorSearchStrategy="dom-tree"
                                                                                    >
                                                                                      {({
                                                                                        open: openTerms
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
                                                                                                      ".ec-cart__account-info .ec-cart-step__body .ec-cart-step__section"
                                                                                                    ) ||
                                                                                                    (e.target &&
                                                                                                      e.target instanceof
                                                                                                        HTMLElement &&
                                                                                                      (
                                                                                                        e
                                                                                                          .target
                                                                                                          .nextSibling as HTMLElement | null
                                                                                                      )?.classList?.contains(
                                                                                                        "ec-link"
                                                                                                      ))
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
                                                                                                      ".page-title__name.ec-header-h4"
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
                                                                                                    !(
                                                                                                      e.target as HTMLElement | null
                                                                                                    )?.classList.contains(
                                                                                                      "ec-link"
                                                                                                    ) &&
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
                                                                                                      ".ec-cart-step__body .ec-cart-step__section .ec-cart-step__text .ec-link"
                                                                                                    ) ||
                                                                                                    (
                                                                                                      e.target as HTMLElement | null
                                                                                                    )?.closest(
                                                                                                      ".ec-cart__agreement .ec-link"
                                                                                                    )
                                                                                                  ) {
                                                                                                    openTerms(
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
    const cnf = valueToEciwdConfig(v);

    const className = classNames(
      "brz-ecwid-wrapper",
      "brz-ecwid-my-account-wrapper",
      this.css(
        this.getComponentId(),
        this.getId(),
        style({
          v,
          vs,
          vd,
          store: this.getReduxStore(),
          renderContext: this.renderContext
        })
      )
    );
    const storeId = makePlaceholder({
      content: "{{ecwid_store_id}}"
    });

    return (
      <Wrapper {...this.makeWrapperProps({ className })}>
        <div
          className="brz-ecwid-my-account"
          data-store-id={storeId}
          data-storefront={encodeToString(cnf)}
        />
      </Wrapper>
    );
  }
}
