import { uniqueId } from "es-toolkit/compat";
import React, { JSX, createRef } from "react";
import Toolbar from "visual/component/Toolbar";
import * as sidebarDisable from "visual/editorComponents/Ecwid/sidebarDisable";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { Wrapper } from "visual/editorComponents/tools/Wrapper";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { EcwidService } from "visual/libs/Ecwid";
import { eq } from "visual/libs/Ecwid/types/EcwidConfig";
import { isView } from "visual/providers/RenderProvider";
import { makePlaceholder } from "visual/utils/dynamicContent";
import { getEcwidShopPathPlaceholder } from "visual/utils/ecwid";
import { makeAttr } from "visual/utils/i18n/attribute";
import { attachRefs } from "visual/utils/react";
import { encodeToString } from "visual/utils/string";
import { ecwidToolbarFooter } from "../toolbarFooter";
import { ecwidToolbarTitle } from "../toolbarTitle";
import { footerCssData, titleCSSData } from "./css";
import defaultValue from "./defaultValue.json";
import * as sidebarExtendParent from "./sidebar";
import * as sidebarInputs from "./sidebarInputs";
import * as sidebarProduct from "./sidebarProduct";
import { style } from "./styles";
import * as toolbarExtendParent from "./toolbar";
import * as toolbarActiveFilters from "./toolbarActiveFilters";
import * as toolbarCheckboxes from "./toolbarCheckboxes";
import * as toolbarDropdownTitle from "./toolbarDropdownTitle";
import * as toolbarInputs from "./toolbarInputs";
import * as toolbarNoResults from "./toolbarNoResults";
import * as toolbarPrice from "./toolbarPrice";
import * as toolbarPriceLabel from "./toolbarPriceLabel";
import * as toolbarProduct from "./toolbarProduct";
import * as toolbarProductSaleBadge from "./toolbarProductSaleBadge";
import * as toolbarProductSoldOutBadge from "./toolbarProductSoldOutBadge";
import * as toolbarProductTitle from "./toolbarProductTitle";
import * as toolbarRadio from "./toolbarRadio";
import * as toolbarRange from "./toolbarRange";
import * as toolbarSKU from "./toolbarSKU";
import * as toolbarSalePrice from "./toolbarSalePrice";
import * as toolbarSearchResults from "./toolbarSearchResults";
import * as toolbarSecondaryText from "./toolbarSecondaryText";
import * as toolbarSelectTitle from "./toolbarSelectTitle";
import * as toolbarSubtitle from "./toolbarSubtitle";
import { Value } from "./types";
import { onClickCapture, valueToEciwdConfig } from "./utils";

export class EcwidSearch extends EditorComponent<Value> {
  static defaultValue = defaultValue;
  private ecwid: EcwidService | undefined;

  private uniqueId = `${EcwidSearch.componentId}-${uniqueId()}`;

  private containerRef = createRef<HTMLDivElement>();

  static get componentId(): ElementTypes.EcwidSearch {
    return ElementTypes.EcwidSearch;
  }

  componentDidMount(): void {
    const { renderContext, extendParentToolbar } = this.props;

    if (isView(renderContext)) {
      return;
    }

    const toolbarExtend = this.makeToolbarPropsFromConfig2(
      toolbarExtendParent,
      sidebarExtendParent,
      {
        allowExtend: false,
        allowExtendFromThirdParty: true,
        thirdPartyExtendId: `${this.getComponentId()}Parent`
      }
    );
    extendParentToolbar(toolbarExtend);

    const config = this.getGlobalConfig();

    if (this.containerRef.current && config.modules?.shop?.type === "ecwid") {
      const v = this.getValue();
      const cnf = valueToEciwdConfig(v);

      const { locale: langLocale = "" } = config;
      const { storeId } = config.modules.shop;

      if (storeId) {
        this.ecwid = EcwidService.init(storeId, {
          ...cnf,
          langLocale,
          onPageLoadCallbacks: [this.openSortBySelect]
        });

        const args = {
          priceFrom: 1,
          priceTo: 999
        };

        this.ecwid.search(this.containerRef.current, args);
      }
    }
  }

  componentDidUpdate(): void {
    const newConfig = valueToEciwdConfig(this.getValue());
    const oldConfig = this.ecwid?.getConfig();

    if (!oldConfig || !eq(oldConfig, newConfig)) {
      this.ecwid?.updateConfig(newConfig);
    }
  }

  openSortBySelect = () => {
    requestAnimationFrame(() => {
      const sortByNode =
        this.containerRef.current?.querySelector<HTMLDivElement>(
          ".ec-filters__body .ec-filter.ec-filter--sortby .ec-filter__body .ec-openable-block"
        );

      if (sortByNode) {
        sortByNode.classList.add("ec-openable-block--opened");
      }
    });
  };

  getClassName() {
    const { hoverAnimation } = this.getValue();

    return this.getCSSClassnames({
      toolbars: [
        toolbarExtendParent,
        toolbarSearchResults,
        toolbarDropdownTitle,
        toolbarInputs,
        toolbarCheckboxes,
        toolbarRadio,
        toolbarSecondaryText,
        toolbarActiveFilters,
        toolbarRange,
        toolbarProduct,
        toolbarProductTitle,
        toolbarSKU,
        toolbarPrice,
        toolbarSalePrice,
        toolbarProductSaleBadge,
        toolbarProductSoldOutBadge,
        toolbarNoResults,
        toolbarSelectTitle,
        toolbarSubtitle,
        toolbarPriceLabel,
        ecwidToolbarTitle<Value>(titleCSSData),
        ecwidToolbarFooter<Value>(footerCssData)
      ],
      sidebars: [sidebarExtendParent, sidebarInputs, sidebarProduct],
      stylesFn: style,
      extraClassNames: [
        "brz-ecwid-wrapper",
        "brz-ecwid-search-wrapper",
        {
          [`brz-ecwid-search-animation--${hoverAnimation}`]:
            hoverAnimation !== "none"
        }
      ]
    });
  }

  renderForEdit(): JSX.Element {
    const className = this.getClassName();

    return (
      // At the moment, display: none has been set on this title in CSS. We're keeping this toolbar because in the future we might make changes and bring it back with different content
      <Toolbar
        {...this.makeToolbarPropsFromConfig2(
          ecwidToolbarTitle(),
          sidebarDisable
        )}
        selector=".page-title__name.ec-header-h1"
        selectorSearchStrategy="dom-tree"
      >
        {({ open: openTitle, ref: titleRef }) => {
          return (
            <Toolbar
              {...this.makeToolbarPropsFromConfig2(
                ecwidToolbarFooter(),
                sidebarDisable
              )}
              selector=".ec-footer__row"
              selectorSearchStrategy="dom-tree"
            >
              {({ open: openFooter, ref: footerRef }) => {
                return (
                  <Toolbar
                    {...this.makeToolbarPropsFromConfig2(
                      toolbarSearchResults,
                      sidebarDisable
                    )}
                    selector=".ec-page-title .ec-breadcrumbs .breadcrumbs__link--last"
                    selectorSearchStrategy="dom-tree"
                  >
                    {({ open: openSearchResults, ref: searchResultsRef }) => {
                      return (
                        <Toolbar
                          {...this.makeToolbarPropsFromConfig2(
                            toolbarDropdownTitle,
                            sidebarDisable
                          )}
                          selector=".ec-filter .ec-filter__head .ec-filter__name, .ec-filters__applied-head .ec-filter__head .ec-filter__name"
                          selectorSearchStrategy="dom-tree"
                        >
                          {({
                            open: openDropdownTitle,
                            ref: dropdownTitleRef
                          }) => {
                            return (
                              <Toolbar
                                {...this.makeToolbarPropsFromConfig2(
                                  toolbarInputs,
                                  sidebarInputs,
                                  { allowExtend: false }
                                )}
                                selector=".ec-filters .ec-filter .ec-filter__body .form-control:not(.form-control--checkbox):not(.form-control--radio)"
                                selectorSearchStrategy="dom-tree"
                              >
                                {({ open: openInputs, ref: inputsRef }) => {
                                  return (
                                    <Toolbar
                                      {...this.makeToolbarPropsFromConfig2(
                                        toolbarCheckboxes,
                                        sidebarDisable
                                      )}
                                      selector=".ec-filters .ec-filter .ec-filter__body .form-control.form-control--checkbox"
                                      selectorSearchStrategy="dom-tree"
                                    >
                                      {({
                                        open: openCheckboxes,
                                        ref: checkboxesRef
                                      }) => {
                                        return (
                                          <Toolbar
                                            {...this.makeToolbarPropsFromConfig2(
                                              toolbarRadio,
                                              sidebarDisable
                                            )}
                                            selector=".ec-filters .ec-filter .ec-filter__body .form-control.form-control--radio"
                                            selectorSearchStrategy="dom-tree"
                                          >
                                            {({
                                              open: openRadio,
                                              ref: radioRef
                                            }) => {
                                              return (
                                                <Toolbar
                                                  {...this.makeToolbarPropsFromConfig2(
                                                    toolbarSecondaryText,
                                                    sidebarDisable
                                                  )}
                                                  selector=".ec-filters .ec-filter .ec-filter__body .ec-filter__items-count, .ec-filters .ec-filters__summary .ec-filters__clear-all-link, .ec-filters .ec-filter .ec-filter__head .ec-filters__clear-link, .ec-filters .ec-filter .ec-range .ec-range__limits .ec-range__limit"
                                                  selectorSearchStrategy="dom-tree"
                                                >
                                                  {({
                                                    open: openSecondaryText,
                                                    ref: secondaryTextRef
                                                  }) => {
                                                    return (
                                                      <Toolbar
                                                        {...this.makeToolbarPropsFromConfig2(
                                                          toolbarActiveFilters,
                                                          sidebarDisable
                                                        )}
                                                        selector=".ec-filters .ec-filters__applied .ec-pill"
                                                        selectorSearchStrategy="dom-tree"
                                                      >
                                                        {({
                                                          open: openActiveFilters,
                                                          ref: activeFiltersRef
                                                        }) => {
                                                          return (
                                                            <Toolbar
                                                              {...this.makeToolbarPropsFromConfig2(
                                                                toolbarRange,
                                                                sidebarDisable
                                                              )}
                                                              selector=".ec-filter .ec-range .ec-range__runner"
                                                              selectorSearchStrategy="dom-tree"
                                                            >
                                                              {({
                                                                open: openRange,
                                                                ref: rangeRef
                                                              }) => {
                                                                return (
                                                                  <Toolbar
                                                                    {...this.makeToolbarPropsFromConfig2(
                                                                      toolbarProduct,
                                                                      sidebarProduct,
                                                                      {
                                                                        allowExtend:
                                                                          false
                                                                      }
                                                                    )}
                                                                    selector=".ec-filters__products .grid-product__wrap-inner .grid-product__image"
                                                                    selectorSearchStrategy="dom-tree"
                                                                  >
                                                                    {({
                                                                      open: openProduct,
                                                                      ref: productRef
                                                                    }) => {
                                                                      return (
                                                                        <Toolbar
                                                                          {...this.makeToolbarPropsFromConfig2(
                                                                            toolbarProductTitle,
                                                                            sidebarDisable
                                                                          )}
                                                                          selector=".ec-filters__products .grid-product .grid-product__title-inner"
                                                                          selectorSearchStrategy="dom-tree"
                                                                        >
                                                                          {({
                                                                            open: openProductTitle,
                                                                            ref: productTitleRef
                                                                          }) => {
                                                                            return (
                                                                              <Toolbar
                                                                                {...this.makeToolbarPropsFromConfig2(
                                                                                  toolbarSKU,
                                                                                  sidebarDisable
                                                                                )}
                                                                                selector=".ec-filters__products .grid-product .grid-product__sku-inner"
                                                                                selectorSearchStrategy="dom-tree"
                                                                              >
                                                                                {({
                                                                                  open: openSku,
                                                                                  ref: skuRef
                                                                                }) => {
                                                                                  return (
                                                                                    <Toolbar
                                                                                      {...this.makeToolbarPropsFromConfig2(
                                                                                        toolbarPrice,
                                                                                        sidebarDisable
                                                                                      )}
                                                                                      selector=".ec-filters__products .grid-product .grid-product__price-value"
                                                                                      selectorSearchStrategy="dom-tree"
                                                                                    >
                                                                                      {({
                                                                                        open: openPrice,
                                                                                        ref: priceRef
                                                                                      }) => {
                                                                                        return (
                                                                                          <Toolbar
                                                                                            {...this.makeToolbarPropsFromConfig2(
                                                                                              toolbarSalePrice,
                                                                                              sidebarDisable
                                                                                            )}
                                                                                            selector=".ec-filters__products .grid-product .grid-product__price-compare .grid-product__textblock s"
                                                                                            selectorSearchStrategy="dom-tree"
                                                                                          >
                                                                                            {({
                                                                                              open: openSalePrice,
                                                                                              ref: salePriceRef
                                                                                            }) => {
                                                                                              return (
                                                                                                <Toolbar
                                                                                                  {...this.makeToolbarPropsFromConfig2(
                                                                                                    toolbarProductSaleBadge,
                                                                                                    sidebarDisable
                                                                                                  )}
                                                                                                  selector=".ec-filters__products .grid-product .grid-product__label .ec-label.label--notice, .ec-filters__products .grid-product .grid-product__label .ec-label.label--custom"
                                                                                                  selectorSearchStrategy="dom-tree"
                                                                                                >
                                                                                                  {({
                                                                                                    open: openProductBadge,
                                                                                                    ref: productSaleBadgeRef
                                                                                                  }) => {
                                                                                                    return (
                                                                                                      <Toolbar
                                                                                                        {...this.makeToolbarPropsFromConfig2(
                                                                                                          toolbarProductSoldOutBadge,
                                                                                                          sidebarDisable
                                                                                                        )}
                                                                                                        selector=".ec-filters__products .grid-product .grid-product__label .ec-label.label--attention"
                                                                                                        selectorSearchStrategy="dom-tree"
                                                                                                      >
                                                                                                        {({
                                                                                                          open: openProductSoldOutBadge,
                                                                                                          ref: productSoldOutBadgeRef
                                                                                                        }) => {
                                                                                                          return (
                                                                                                            <Toolbar
                                                                                                              {...this.makeToolbarPropsFromConfig2(
                                                                                                                toolbarNoResults,
                                                                                                                sidebarDisable
                                                                                                              )}
                                                                                                              selector=".ec-filters__products .ec-search .search__notice"
                                                                                                              selectorSearchStrategy="dom-tree"
                                                                                                            >
                                                                                                              {({
                                                                                                                open: openNoResults,
                                                                                                                ref: noResultsRef
                                                                                                              }) => {
                                                                                                                return (
                                                                                                                  <Toolbar
                                                                                                                    {...this.makeToolbarPropsFromConfig2(
                                                                                                                      toolbarSelectTitle,
                                                                                                                      sidebarDisable
                                                                                                                    )}
                                                                                                                    selector=".grid__sort .grid-sort__item--sortby .form-control__select-text, .grid__sort .grid-sort__item--sortby select"
                                                                                                                    selectorSearchStrategy="dom-tree"
                                                                                                                  >
                                                                                                                    {({
                                                                                                                      open: openSelectTitle,
                                                                                                                      ref: selectTitleRef
                                                                                                                    }) => {
                                                                                                                      return (
                                                                                                                        <Toolbar
                                                                                                                          {...this.makeToolbarPropsFromConfig2(
                                                                                                                            toolbarSubtitle,
                                                                                                                            sidebarDisable
                                                                                                                          )}
                                                                                                                          selector=".ec-filters__products .grid-product .grid-product__subtitle-inner"
                                                                                                                          selectorSearchStrategy="dom-tree"
                                                                                                                        >
                                                                                                                          {({
                                                                                                                            open: openSubtitle,
                                                                                                                            ref: subtitleRef
                                                                                                                          }) => {
                                                                                                                            return (
                                                                                                                              <Toolbar
                                                                                                                                {...this.makeToolbarPropsFromConfig2(
                                                                                                                                  toolbarPriceLabel,
                                                                                                                                  sidebarDisable
                                                                                                                                )}
                                                                                                                                selector=".ec-filters__products .grid-product .grid-product__price-compare .grid-product__textblock.grid-product__price-label"
                                                                                                                                selectorSearchStrategy="dom-tree"
                                                                                                                              >
                                                                                                                                {({
                                                                                                                                  open: openPriceLabel,
                                                                                                                                  ref: priceLabelRef
                                                                                                                                }) => {
                                                                                                                                  return (
                                                                                                                                    <Wrapper
                                                                                                                                      {...this.makeWrapperProps(
                                                                                                                                        {
                                                                                                                                          className,
                                                                                                                                          ref: (
                                                                                                                                            el
                                                                                                                                          ) =>
                                                                                                                                            attachRefs(
                                                                                                                                              el,
                                                                                                                                              [
                                                                                                                                                titleRef,
                                                                                                                                                searchResultsRef,
                                                                                                                                                dropdownTitleRef,
                                                                                                                                                inputsRef,
                                                                                                                                                checkboxesRef,
                                                                                                                                                radioRef,
                                                                                                                                                secondaryTextRef,
                                                                                                                                                activeFiltersRef,
                                                                                                                                                rangeRef,
                                                                                                                                                footerRef,
                                                                                                                                                productRef,
                                                                                                                                                productTitleRef,
                                                                                                                                                skuRef,
                                                                                                                                                priceRef,
                                                                                                                                                salePriceRef,
                                                                                                                                                productSaleBadgeRef,
                                                                                                                                                productSoldOutBadgeRef,
                                                                                                                                                noResultsRef,
                                                                                                                                                selectTitleRef,
                                                                                                                                                subtitleRef,
                                                                                                                                                priceLabelRef
                                                                                                                                              ]
                                                                                                                                            )
                                                                                                                                        }
                                                                                                                                      )}
                                                                                                                                    >
                                                                                                                                      <div
                                                                                                                                        className="brz-ecwid-search"
                                                                                                                                        id={
                                                                                                                                          this
                                                                                                                                            .uniqueId
                                                                                                                                        }
                                                                                                                                        ref={
                                                                                                                                          this
                                                                                                                                            .containerRef
                                                                                                                                        }
                                                                                                                                        onClickCapture={(
                                                                                                                                          e
                                                                                                                                        ) =>
                                                                                                                                          onClickCapture(
                                                                                                                                            e,
                                                                                                                                            [
                                                                                                                                              {
                                                                                                                                                selector:
                                                                                                                                                  ".page-title__name.ec-header-h1",
                                                                                                                                                fn: openTitle
                                                                                                                                              },
                                                                                                                                              {
                                                                                                                                                selector:
                                                                                                                                                  ".ec-page-title .ec-breadcrumbs .breadcrumbs__link--last",
                                                                                                                                                fn: openSearchResults
                                                                                                                                              },
                                                                                                                                              {
                                                                                                                                                selector:
                                                                                                                                                  ".ec-filter .ec-filter__head .ec-filter__name, .ec-filters__applied-head .ec-filter__head .ec-filter__name",
                                                                                                                                                fn: openDropdownTitle
                                                                                                                                              },
                                                                                                                                              {
                                                                                                                                                selector:
                                                                                                                                                  ".ec-filters .ec-filter .ec-filter__body .form-control:not(.form-control--checkbox):not(.form-control--radio)",
                                                                                                                                                fn: openInputs
                                                                                                                                              },
                                                                                                                                              {
                                                                                                                                                selector:
                                                                                                                                                  ".ec-filters .ec-filter .ec-filter__body .form-control.form-control--checkbox",
                                                                                                                                                fn: openCheckboxes
                                                                                                                                              },
                                                                                                                                              {
                                                                                                                                                selector:
                                                                                                                                                  ".ec-filters .ec-filter .ec-filter__body .form-control.form-control--radio",
                                                                                                                                                fn: openRadio
                                                                                                                                              },
                                                                                                                                              {
                                                                                                                                                selector:
                                                                                                                                                  ".ec-filters .ec-filter .ec-filter__body .ec-filter__items-count, .ec-filters .ec-filters__summary .ec-filters__clear-all-link, .ec-filters .ec-filter .ec-filter__head .ec-filters__clear-link, .ec-filters .ec-filter .ec-range .ec-range__limits .ec-range__limit",
                                                                                                                                                fn: openSecondaryText
                                                                                                                                              },
                                                                                                                                              {
                                                                                                                                                selector:
                                                                                                                                                  ".ec-filters .ec-filters__applied .ec-pill",
                                                                                                                                                fn: openActiveFilters
                                                                                                                                              },
                                                                                                                                              {
                                                                                                                                                selector:
                                                                                                                                                  ".ec-filter .ec-range .ec-range__runner",
                                                                                                                                                fn: openRange
                                                                                                                                              },
                                                                                                                                              {
                                                                                                                                                selector:
                                                                                                                                                  ".ec-footer__row",
                                                                                                                                                fn: openFooter
                                                                                                                                              },
                                                                                                                                              {
                                                                                                                                                selector:
                                                                                                                                                  ".ec-filters__products .grid-product .grid-product__label .ec-label.label--notice",
                                                                                                                                                fn: openProductBadge
                                                                                                                                              },
                                                                                                                                              {
                                                                                                                                                selector:
                                                                                                                                                  ".ec-filters__products .grid-product .grid-product__label .ec-label.label--custom",
                                                                                                                                                fn: openProductBadge
                                                                                                                                              },
                                                                                                                                              {
                                                                                                                                                selector:
                                                                                                                                                  ".ec-filters__products .grid-product .grid-product__label .ec-label.label--attention",
                                                                                                                                                fn: openProductSoldOutBadge
                                                                                                                                              },
                                                                                                                                              {
                                                                                                                                                selector:
                                                                                                                                                  ".ec-filters__products .grid-product__wrap-inner .grid-product__image",
                                                                                                                                                fn: openProduct
                                                                                                                                              },
                                                                                                                                              {
                                                                                                                                                selector:
                                                                                                                                                  ".ec-filters__products .grid-product .grid-product__title-inner",
                                                                                                                                                fn: openProductTitle
                                                                                                                                              },
                                                                                                                                              {
                                                                                                                                                selector:
                                                                                                                                                  ".ec-filters__products .grid-product .grid-product__sku-inner",
                                                                                                                                                fn: openSku
                                                                                                                                              },
                                                                                                                                              {
                                                                                                                                                selector:
                                                                                                                                                  ".ec-filters__products .grid-product .grid-product__price-value",
                                                                                                                                                fn: openPrice
                                                                                                                                              },
                                                                                                                                              {
                                                                                                                                                selector:
                                                                                                                                                  ".ec-filters__products .grid-product .grid-product__price-compare .grid-product__textblock s",
                                                                                                                                                fn: openSalePrice
                                                                                                                                              },
                                                                                                                                              {
                                                                                                                                                selector:
                                                                                                                                                  ".ec-filters__products .ec-search .search__notice",
                                                                                                                                                fn: openNoResults
                                                                                                                                              },
                                                                                                                                              {
                                                                                                                                                selector:
                                                                                                                                                  ".grid__sort .grid-sort__item--sortby .form-control__select-text, .grid__sort .grid-sort__item--sortby select",
                                                                                                                                                fn: openSelectTitle
                                                                                                                                              },
                                                                                                                                              {
                                                                                                                                                selector:
                                                                                                                                                  ".ec-filters__products .grid-product .grid-product__subtitle-inner",
                                                                                                                                                fn: openSubtitle
                                                                                                                                              },
                                                                                                                                              {
                                                                                                                                                selector:
                                                                                                                                                  ".ec-filters__products .grid-product .grid-product__price-compare .grid-product__textblock.grid-product__price-label",
                                                                                                                                                fn: openPriceLabel
                                                                                                                                              }
                                                                                                                                            ]
                                                                                                                                          )
                                                                                                                                        }
                                                                                                                                      />
                                                                                                                                    </Wrapper>
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

  renderForView(v: Value): JSX.Element {
    const cnf = valueToEciwdConfig(v);

    const className = this.getClassName();

    const storeId = makePlaceholder({
      content: "{{ecwid_store_id}}"
    });

    const langLocale = makePlaceholder({
      content: "{{ecwid_language_code}}"
    });

    const attr = {
      [makeAttr("shop-path")]: getEcwidShopPathPlaceholder(),
      [makeAttr("lang-locale")]: langLocale
    };

    return (
      <Wrapper
        {...this.makeWrapperProps({
          className
        })}
      >
        <div
          className="brz-ecwid-search"
          data-store-id={storeId}
          data-storefront={encodeToString(cnf)}
          {...attr}
        />
      </Wrapper>
    );
  }
}
