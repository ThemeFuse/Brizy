import classNames from "classnames";
import { uniqueId } from "es-toolkit/compat";
import React, { ReactNode, createRef } from "react";
import CustomCSS from "visual/component/CustomCSS";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { Wrapper } from "visual/editorComponents/tools/Wrapper";
import { isCloud } from "visual/global/Config/types/configs/Cloud";
import { EcwidService } from "visual/libs/Ecwid";
import { eq } from "visual/libs/Ecwid/types/EcwidConfig";
import { isView } from "visual/providers/RenderProvider";
import { makePlaceholder } from "visual/utils/dynamicContent";
import { attachRefs } from "visual/utils/react";
import * as sidebarButton from "../sidebarButton";
import * as sidebarDisable from "../sidebarDisable";
import { ecwidToolbarFooter } from "../toolbarFooter";
import * as toolbarSKU from "../toolbarSKU";
import defaultValue from "./defaultValue.json";
import * as sidebarExtendParent from "./sidebar";
import * as sidebarLabel from "./sidebarLabel";
import * as sidebarPagination from "./sidebarPagination";
import * as sidebarSortingOption from "./sidebarSortingOption";
import { style } from "./styles";
import * as toolbarExtendParent from "./toolbar";
import * as toolbarButton from "./toolbarButton";
import * as toolbarCountPages from "./toolbarCountPages";
import * as toolbarFeaturedProducts from "./toolbarFeaturedProducts";
import * as toolbarGallery from "./toolbarGallery";
import * as toolbarPagination from "./toolbarPagination";
import * as toolbarShopTitle from "./toolbarShopTitle";
import * as toolbarSortingOption from "./toolbarSortingOption";
import * as toolbarSubtitle from "./toolbarSubtitle";
import * as toolbarTitle from "./toolbarTitle";
import { Value } from "./types/Value";
import { valueToEciwdConfigProducts } from "./utils";

export class EcwidProducts extends EditorComponent<Value> {
  static defaultValue = defaultValue;
  private uniqueId = `${EcwidProducts.componentId}-${uniqueId()}`;
  private containerRef = createRef<HTMLDivElement>();
  private ecwid: EcwidService | undefined;

  static get componentId(): "EcwidProducts" {
    return "EcwidProducts";
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

    if (isView(this.props.renderContext)) {
      return;
    }

    const config = this.getGlobalConfig();

    if (
      this.containerRef.current &&
      isCloud(config) &&
      config.modules?.shop?.type === "ecwid"
    ) {
      const v = this.getDBValue();
      const cnf = valueToEciwdConfigProducts(v);

      this.ecwid = EcwidService.init(config.modules.shop.storeId, cnf);
      this.ecwid.products(this.containerRef.current);
    }
  }

  componentDidUpdate(): void {
    const newConfig = valueToEciwdConfigProducts(this.getDBValue());
    const oldConfig = this.ecwid?.getConfig();

    if (!oldConfig || !eq(oldConfig, newConfig)) {
      this.ecwid?.updateConfig(newConfig);
    }
  }

  renderForEdit(v: Value, vs: Value, vd: Value): React.ReactNode {
    const { customCSS } = v;

    const className = classNames(
      "brz-ecwid-wrapper",
      "brz-ecwid-products-wrapper",
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
      <Toolbar
        {...this.makeToolbarPropsFromConfig2(
          toolbarFeaturedProducts,
          sidebarDisable
        )}
        selector=".ec-page-title.ec-page-title__featured-products"
        selectorSearchStrategy="dom-tree"
      >
        {({ open: openFeaturedProducts, ref: featuredProductsRef }) => {
          return (
            <Toolbar
              {...this.makeToolbarPropsFromConfig2(
                toolbarTitle,
                sidebarDisable
              )}
              selector=".grid-product__title-inner"
              selectorSearchStrategy="dom-tree"
            >
              {({ open: openTitle, ref: titleRef }) => {
                return (
                  <Toolbar
                    {...this.makeToolbarPropsFromConfig2(
                      toolbarShopTitle,
                      sidebarDisable
                    )}
                    selector=".grid-product__price-value.ec-price-item"
                    selectorSearchStrategy="dom-tree"
                  >
                    {({ open: openShopTitle, ref: shopTitleRef }) => {
                      return (
                        <Toolbar
                          {...this.makeToolbarPropsFromConfig2(
                            toolbarSKU,
                            sidebarDisable
                          )}
                          selector=".grid-product__sku"
                          selectorSearchStrategy="dom-tree"
                        >
                          {({ open: openSKU, ref: skuRef }) => {
                            return (
                              <Toolbar
                                {...this.makeToolbarPropsFromConfig2(
                                  toolbarButton,
                                  sidebarButton,
                                  {
                                    allowExtend: false
                                  }
                                )}
                                selector=".form-control.form-control--button"
                                selectorSearchStrategy="dom-tree"
                              >
                                {({ open: openButton, ref: buttonRef }) => {
                                  return (
                                    <Toolbar
                                      {...this.makeToolbarPropsFromConfig2(
                                        toolbarSubtitle,
                                        sidebarDisable
                                      )}
                                      selector=".grid-product__subtitle-inner"
                                      selectorSearchStrategy="dom-tree"
                                    >
                                      {({
                                        open: openSubtitle,
                                        ref: subTitleRef
                                      }) => {
                                        return (
                                          <Toolbar
                                            {...this.makeToolbarPropsFromConfig2(
                                              toolbarGallery,
                                              sidebarLabel,
                                              {
                                                allowExtend: false
                                              }
                                            )}
                                            selector=".grid-product"
                                            selectorSearchStrategy="dom-tree"
                                          >
                                            {({
                                              open: openImage,
                                              ref: imageRef
                                            }) => {
                                              return (
                                                <Toolbar
                                                  {...this.makeToolbarPropsFromConfig2(
                                                    toolbarSortingOption,
                                                    sidebarSortingOption,
                                                    {
                                                      allowExtend: false
                                                    }
                                                  )}
                                                  selector=".grid__sort.ec-text-muted"
                                                  selectorSearchStrategy="dom-tree"
                                                >
                                                  {({
                                                    open: openSortingOption,
                                                    ref: sortingOptionRef
                                                  }) => {
                                                    return (
                                                      <Toolbar
                                                        {...this.makeToolbarPropsFromConfig2(
                                                          toolbarCountPages,
                                                          sidebarDisable
                                                        )}
                                                        selector=".pager__count-pages"
                                                        selectorSearchStrategy="dom-tree"
                                                      >
                                                        {({
                                                          open: openCountPages,
                                                          ref: countPagesRef
                                                        }) => {
                                                          return (
                                                            <Toolbar
                                                              {...this.makeToolbarPropsFromConfig2(
                                                                toolbarPagination,
                                                                sidebarPagination,
                                                                {
                                                                  allowExtend:
                                                                    false
                                                                }
                                                              )}
                                                              selector=".pager__body.pager__body--has-next"
                                                              selectorSearchStrategy="dom-tree"
                                                            >
                                                              {({
                                                                open: openPagination,
                                                                ref: paginationRef
                                                              }) => {
                                                                return (
                                                                  <Toolbar
                                                                    {...this.makeToolbarPropsFromConfig2(
                                                                      ecwidToolbarFooter(),
                                                                      sidebarDisable
                                                                    )}
                                                                    selector=".ec-footer"
                                                                    selectorSearchStrategy="dom-tree"
                                                                  >
                                                                    {({
                                                                      open: openFooter,
                                                                      ref: footerRef
                                                                    }) => {
                                                                      return (
                                                                        <CustomCSS
                                                                          selectorName={this.getId()}
                                                                          css={
                                                                            customCSS
                                                                          }
                                                                        >
                                                                          {({
                                                                            ref: cssRef
                                                                          }) => (
                                                                            <Wrapper
                                                                              {...this.makeWrapperProps(
                                                                                {
                                                                                  className,
                                                                                  ref: (
                                                                                    el
                                                                                  ) => {
                                                                                    attachRefs(
                                                                                      el,
                                                                                      [
                                                                                        featuredProductsRef,
                                                                                        titleRef,
                                                                                        shopTitleRef,
                                                                                        skuRef,
                                                                                        buttonRef,
                                                                                        subTitleRef,
                                                                                        imageRef,
                                                                                        sortingOptionRef,
                                                                                        countPagesRef,
                                                                                        paginationRef,
                                                                                        footerRef,
                                                                                        cssRef
                                                                                      ]
                                                                                    );
                                                                                  }
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
                                                                                      ".ec-page-title.ec-page-title__featured-products"
                                                                                    )
                                                                                  ) {
                                                                                    openFeaturedProducts(
                                                                                      e.nativeEvent
                                                                                    );
                                                                                  } else if (
                                                                                    (
                                                                                      e.target as HTMLElement | null
                                                                                    )?.closest(
                                                                                      ".grid-product__title-inner"
                                                                                    )
                                                                                  ) {
                                                                                    openTitle(
                                                                                      e.nativeEvent
                                                                                    );
                                                                                  } else if (
                                                                                    (
                                                                                      e.target as HTMLElement | null
                                                                                    )?.closest(
                                                                                      ".grid-product__price-value.ec-price-item"
                                                                                    )
                                                                                  ) {
                                                                                    openShopTitle(
                                                                                      e.nativeEvent
                                                                                    );
                                                                                  } else if (
                                                                                    (
                                                                                      e.target as HTMLElement | null
                                                                                    )?.closest(
                                                                                      ".grid-product__sku"
                                                                                    )
                                                                                  ) {
                                                                                    openSKU(
                                                                                      e.nativeEvent
                                                                                    );
                                                                                  } else if (
                                                                                    (
                                                                                      e.target as HTMLElement | null
                                                                                    )?.closest(
                                                                                      ".form-control.form-control--button"
                                                                                    )
                                                                                  ) {
                                                                                    openButton(
                                                                                      e.nativeEvent
                                                                                    );
                                                                                  } else if (
                                                                                    (
                                                                                      e.target as HTMLElement | null
                                                                                    )?.closest(
                                                                                      ".grid-product__subtitle-inner"
                                                                                    )
                                                                                  ) {
                                                                                    openSubtitle(
                                                                                      e.nativeEvent
                                                                                    );
                                                                                  } else if (
                                                                                    (
                                                                                      e.target as HTMLElement | null
                                                                                    )?.closest(
                                                                                      ".grid-product"
                                                                                    )
                                                                                  ) {
                                                                                    openImage(
                                                                                      e.nativeEvent
                                                                                    );
                                                                                  } else if (
                                                                                    (
                                                                                      e.target as HTMLElement | null
                                                                                    )?.closest(
                                                                                      ".grid__sort.ec-text-muted"
                                                                                    )
                                                                                  ) {
                                                                                    openSortingOption(
                                                                                      e.nativeEvent
                                                                                    );
                                                                                  } else if (
                                                                                    (
                                                                                      e.target as HTMLElement | null
                                                                                    )?.closest(
                                                                                      ".pager__count-pages"
                                                                                    )
                                                                                  ) {
                                                                                    openCountPages(
                                                                                      e.nativeEvent
                                                                                    );
                                                                                  } else if (
                                                                                    (
                                                                                      e.target as HTMLElement | null
                                                                                    )?.closest(
                                                                                      ".pager__body.pager__body--has-next"
                                                                                    )
                                                                                  ) {
                                                                                    openPagination(
                                                                                      e.nativeEvent
                                                                                    );
                                                                                  } else if (
                                                                                    (
                                                                                      e.target as HTMLElement | null
                                                                                    )?.closest(
                                                                                      ".ec-footer"
                                                                                    )
                                                                                  ) {
                                                                                    openFooter(
                                                                                      e.nativeEvent
                                                                                    );
                                                                                  }

                                                                                  return false;
                                                                                }}
                                                                                className="brz-ecwid-products"
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
                                                                          )}
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
  }

  renderForView(v: Value, vs: Value, vd: Value): ReactNode {
    const className = classNames(
      "brz-ecwid-wrapper",
      "brz-ecwid-products-wrapper",
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
    const storeId = makePlaceholder({
      content: "{{ecwid_store_id}}"
    });

    return (
      <Wrapper {...this.makeWrapperProps({ className })}>
        <div
          className="brz-ecwid-products"
          data-store-id={storeId}
          data-storefront={encodeURIComponent(
            JSON.stringify(valueToEciwdConfigProducts(v))
          )}
        />
      </Wrapper>
    );
  }
}
