import classnames from "classnames";
import React, { createRef, ReactNode } from "react";
import { uniqueId } from "underscore";
import CustomCSS from "visual/component/CustomCSS";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { Wrapper } from "visual/editorComponents/tools/Wrapper";
import Config from "visual/global/Config";
import { isCloud } from "visual/global/Config/types/configs/Cloud";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { EcwidService } from "visual/libs/Ecwid";
import { eq } from "visual/libs/Ecwid/types/EcwidConfig";
import { css } from "visual/utils/cssStyle";
import { makePlaceholder } from "visual/utils/dynamicContent";
import * as sidebarExtendParent from "../sidebar";
import * as sidebarButton from "../sidebarButton";
import * as sidebarDisable from "../sidebarDisable";
import * as sidebarImage from "../sidebarImage";
import * as sidebarInput from "../sidebarInput";
import * as toolbarBreadcrumbs from "../toolbarBreadcrumbs";
import * as toolbarConnectLink from "../toolbarConnectLink";
import * as toolbarFooter from "../toolbarFooter";
import * as toolbarSKU from "../toolbarSKU";
import * as toolbarTitle from "../toolbarTitle";
import * as toolbarTitle2 from "../toolbarTitle2";
import defaultValue from "./defaultValue.json";
import * as sidebarClose from "./sidebarClose";
import * as sidebarCollapsedImage from "./sidebarCollapsedImage";
import * as sidebarGrid from "./sidebarGrid";
import { style } from "./styles";
import * as toolbarExtendParent from "./toolbar";
import * as toolbarButton from "./toolbarButton";
import * as toolbarCheckbox from "./toolbarCheckbox";
import * as toolbarClose from "./toolbarClose";
import * as toolbarCollapsedImage from "./toolbarCollapsedImage";
import * as toolbarEmail from "./toolbarEmail";
import * as toolbarEmpty from "./toolbarEmpty";
import * as toolbarGrid from "./toolbarGrid";
import * as toolbarGridPrice from "./toolbarGridPrice";
import * as toolbarGridSKUInner from "./toolbarGridSKUInner";
import * as toolbarGridSubtitle from "./toolbarGridSubtitle";
import * as toolbarGridTitle from "./toolbarGridTitle";
import * as toolbarImage from "./toolbarImage";
import * as toolbarInput from "./toolbarInput";
import * as toolbarNext from "./toolbarNext";
import * as toolbarPayment from "./toolbarPayment";
import * as toolbarPrice from "./toolbarPrice";
import * as toolbarProductName from "./toolbarProductName";
import * as toolbarProductSize from "./toolbarProductSize";
import * as toolbarQty from "./toolbarQty";
import * as toolbarSubtitles from "./toolbarSubtitles";
import * as toolbarSubtotalPrice from "./toolbarSubtotalPrice";
import * as toolbarSubtotalTitle from "./toolbarSubtotalTitle";
import * as toolbarSummaryNote from "./toolbarSummaryNote";
import * as toolbarSummaryPrice from "./toolbarSummaryPrice";
import * as toolbarSummaryTitle from "./toolbarSummaryTitle";
import * as toolbarTaxesPrice from "./toolbarTaxesPrice";
import * as toolbarTaxesTitle from "./toolbarTaxesTitle";
import * as toolbarTotalProductsCount from "./toolbarTotalProductsCount";
import { Value } from "./types/Value";
import { valueToEciwdConfig } from "./utils";

export class EcwidCart extends EditorComponent<Value> {
  static get componentId(): ElementTypes.EcwidCart {
    return ElementTypes.EcwidCart;
  }
  static defaultValue = defaultValue;

  private ecwid: EcwidService | undefined;

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
      const v = this.getDBValue();
      const cnf = valueToEciwdConfig(v);

      this.ecwid = EcwidService.init(config.modules.shop.storeId, cnf);
      this.ecwid.cart(this.containerRef.current);
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

    const className = classnames(
      "brz-ecwid-wrapper",
      "brz-ecwid-cart-wrapper",
      css(this.getComponentId(), this.getId(), style(v, vs, vd))
    );

    return (
      <Toolbar
        {...this.makeToolbarPropsFromConfig2(toolbarTitle, sidebarDisable)}
        selector=".ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-page-title .page-title__name, .ec-store .ec-store__content-wrapper .ec-page-title .page-title__name"
        selectorSearchStrategy="dom-tree"
      >
        {({ open: openTitle }) => {
          return (
            <Toolbar
              {...this.makeToolbarPropsFromConfig2(
                toolbarTitle2,
                sidebarDisable
              )}
              selector=".ec-cart .ec-cart__body .ec-cart__body-inner .ec-page-title .page-title__name"
              selectorSearchStrategy="dom-tree"
            >
              {({ open: openTitle2 }) => {
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
                            toolbarImage,
                            sidebarImage,
                            {
                              allowExtend: false
                            }
                          )}
                          selector=".ec-cart-item__image"
                          selectorSearchStrategy="dom-tree"
                        >
                          {({ open: openImage }) => {
                            return (
                              <Toolbar
                                {...this.makeToolbarPropsFromConfig2(
                                  toolbarProductName,
                                  sidebarDisable
                                )}
                                selector="a.ec-cart-item__title"
                                selectorSearchStrategy="dom-tree"
                              >
                                {({ open: openProductName }) => {
                                  return (
                                    <Toolbar
                                      {...this.makeToolbarPropsFromConfig2(
                                        toolbarProductSize,
                                        sidebarDisable
                                      )}
                                      selector=".ec-cart-item__options.ec-text-muted"
                                      selectorSearchStrategy="dom-tree"
                                    >
                                      {({ open: openProductSize }) => {
                                        return (
                                          <Toolbar
                                            {...this.makeToolbarPropsFromConfig2(
                                              toolbarClose,
                                              sidebarClose
                                            )}
                                            selector=".ec-cart-item__control"
                                            selectorSearchStrategy="dom-tree"
                                          >
                                            {({ open: openClose }) => {
                                              return (
                                                <Toolbar
                                                  {...this.makeToolbarPropsFromConfig2(
                                                    toolbarSKU,
                                                    sidebarDisable
                                                  )}
                                                  selector=".ec-cart-item__sku.ec-text-muted"
                                                  selectorSearchStrategy="dom-tree"
                                                >
                                                  {({ open: openSKU }) => {
                                                    return (
                                                      <Toolbar
                                                        {...this.makeToolbarPropsFromConfig2(
                                                          toolbarQty,
                                                          sidebarDisable
                                                        )}
                                                        selector=".ec-cart-item__count"
                                                        selectorSearchStrategy="dom-tree"
                                                      >
                                                        {({
                                                          open: openQty
                                                        }) => {
                                                          return (
                                                            <Toolbar
                                                              {...this.makeToolbarPropsFromConfig2(
                                                                toolbarPrice,
                                                                sidebarDisable
                                                              )}
                                                              selector=".ec-cart-item__price-inner, .ec-cart-item-sum.ec-cart-item-sum--cta"
                                                              selectorSearchStrategy="dom-tree"
                                                            >
                                                              {({
                                                                open: openPrice
                                                              }) => {
                                                                return (
                                                                  <Toolbar
                                                                    {...this.makeToolbarPropsFromConfig2(
                                                                      toolbarSummaryTitle,
                                                                      sidebarDisable
                                                                    )}
                                                                    selector=".ec-cart-summary__row.ec-cart-summary__row--total .ec-cart-summary__cell.ec-cart-summary__title"
                                                                    selectorSearchStrategy="dom-tree"
                                                                  >
                                                                    {({
                                                                      open: openSummaryTitle
                                                                    }) => {
                                                                      return (
                                                                        <Toolbar
                                                                          {...this.makeToolbarPropsFromConfig2(
                                                                            toolbarSummaryPrice,
                                                                            sidebarDisable
                                                                          )}
                                                                          selector=".ec-cart-summary__total"
                                                                          selectorSearchStrategy="dom-tree"
                                                                        >
                                                                          {({
                                                                            open: openSummaryPrice
                                                                          }) => {
                                                                            return (
                                                                              <Toolbar
                                                                                {...this.makeToolbarPropsFromConfig2(
                                                                                  toolbarSubtotalTitle,
                                                                                  sidebarDisable
                                                                                )}
                                                                                selector=".ec-cart-summary__row.ec-cart-summary__row--items .ec-cart-summary__cell.ec-cart-summary__title"
                                                                                selectorSearchStrategy="dom-tree"
                                                                              >
                                                                                {({
                                                                                  open: openSubtotalTitle
                                                                                }) => {
                                                                                  return (
                                                                                    <Toolbar
                                                                                      {...this.makeToolbarPropsFromConfig2(
                                                                                        toolbarSubtotalPrice,
                                                                                        sidebarDisable
                                                                                      )}
                                                                                      selector=".ec-cart-summary__row--items .ec-cart-summary__price span"
                                                                                      selectorSearchStrategy="dom-tree"
                                                                                    >
                                                                                      {({
                                                                                        open: openSubtotalPrice
                                                                                      }) => {
                                                                                        return (
                                                                                          <Toolbar
                                                                                            {...this.makeToolbarPropsFromConfig2(
                                                                                              toolbarTaxesTitle,
                                                                                              sidebarDisable
                                                                                            )}
                                                                                            selector=".ec-cart-summary__row--taxes .ec-cart-summary__title"
                                                                                            selectorSearchStrategy="dom-tree"
                                                                                          >
                                                                                            {({
                                                                                              open: openTaxesTitle
                                                                                            }) => {
                                                                                              return (
                                                                                                <Toolbar
                                                                                                  {...this.makeToolbarPropsFromConfig2(
                                                                                                    toolbarTaxesPrice,
                                                                                                    sidebarDisable
                                                                                                  )}
                                                                                                  selector=".ec-cart-summary__row--taxes .ec-cart-summary__price"
                                                                                                  selectorSearchStrategy="dom-tree"
                                                                                                >
                                                                                                  {({
                                                                                                    open: openTaxesPrice
                                                                                                  }) => {
                                                                                                    return (
                                                                                                      <Toolbar
                                                                                                        {...this.makeToolbarPropsFromConfig2(
                                                                                                          toolbarSummaryNote,
                                                                                                          sidebarDisable
                                                                                                        )}
                                                                                                        selector=".ec-cart-summary__cell.ec-cart-summary__note"
                                                                                                        selectorSearchStrategy="dom-tree"
                                                                                                      >
                                                                                                        {({
                                                                                                          open: openSummaryNote
                                                                                                        }) => {
                                                                                                          return (
                                                                                                            <Toolbar
                                                                                                              {...this.makeToolbarPropsFromConfig2(
                                                                                                                toolbarConnectLink,
                                                                                                                sidebarDisable
                                                                                                              )}
                                                                                                              selector=".ec-cart-shopping__wrap"
                                                                                                              selectorSearchStrategy="dom-tree"
                                                                                                            >
                                                                                                              {({
                                                                                                                open: openConnectLink
                                                                                                              }) => {
                                                                                                                return (
                                                                                                                  <Toolbar
                                                                                                                    {...this.makeToolbarPropsFromConfig2(
                                                                                                                      toolbarEmpty,
                                                                                                                      sidebarDisable
                                                                                                                    )}
                                                                                                                    selector=".ec-cart__message"
                                                                                                                    selectorSearchStrategy="dom-tree"
                                                                                                                  >
                                                                                                                    {({
                                                                                                                      open: openEmpty
                                                                                                                    }) => {
                                                                                                                      return (
                                                                                                                        <Toolbar
                                                                                                                          {...this.makeToolbarPropsFromConfig2(
                                                                                                                            toolbarEmail,
                                                                                                                            sidebarDisable
                                                                                                                          )}
                                                                                                                          selector=".ec-cart-email__text"
                                                                                                                          selectorSearchStrategy="dom-tree"
                                                                                                                        >
                                                                                                                          {({
                                                                                                                            open: openEmail
                                                                                                                          }) => {
                                                                                                                            return (
                                                                                                                              <Toolbar
                                                                                                                                {...this.makeToolbarPropsFromConfig2(
                                                                                                                                  toolbarCheckbox,
                                                                                                                                  sidebarDisable
                                                                                                                                )}
                                                                                                                                selector=".form-control--checkbox.form-control"
                                                                                                                                selectorSearchStrategy="dom-tree"
                                                                                                                              >
                                                                                                                                {({
                                                                                                                                  open: openCheckbox
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
                                                                                                                                              toolbarSubtitles,
                                                                                                                                              sidebarDisable
                                                                                                                                            )}
                                                                                                                                            selector=".ec-cart__cert.ec-text-muted, .ec-cart-next__text.ec-text-muted"
                                                                                                                                            selectorSearchStrategy="dom-tree"
                                                                                                                                          >
                                                                                                                                            {({
                                                                                                                                              open: openSubtitles
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
                                                                                                                                                          toolbarNext,
                                                                                                                                                          sidebarDisable
                                                                                                                                                        )}
                                                                                                                                                        selector=".ec-cart-next__header.ec-header-h4"
                                                                                                                                                        selectorSearchStrategy="dom-tree"
                                                                                                                                                      >
                                                                                                                                                        {({
                                                                                                                                                          open: openNext
                                                                                                                                                        }) => {
                                                                                                                                                          return (
                                                                                                                                                            <Toolbar
                                                                                                                                                              {...this.makeToolbarPropsFromConfig2(
                                                                                                                                                                toolbarPayment,
                                                                                                                                                                sidebarDisable
                                                                                                                                                              )}
                                                                                                                                                              selector=".ec-cart-next__title"
                                                                                                                                                              selectorSearchStrategy="dom-tree"
                                                                                                                                                            >
                                                                                                                                                              {({
                                                                                                                                                                open: openPayment
                                                                                                                                                              }) => {
                                                                                                                                                                return (
                                                                                                                                                                  <Toolbar
                                                                                                                                                                    {...this.makeToolbarPropsFromConfig2(
                                                                                                                                                                      toolbarFooter,
                                                                                                                                                                      sidebarDisable
                                                                                                                                                                    )}
                                                                                                                                                                    selector=".ec-footer"
                                                                                                                                                                    selectorSearchStrategy="dom-tree"
                                                                                                                                                                  >
                                                                                                                                                                    {({
                                                                                                                                                                      open: openFooter
                                                                                                                                                                    }) => {
                                                                                                                                                                      return (
                                                                                                                                                                        <Toolbar
                                                                                                                                                                          {...this.makeToolbarPropsFromConfig2(
                                                                                                                                                                            toolbarGrid,
                                                                                                                                                                            sidebarGrid,
                                                                                                                                                                            {
                                                                                                                                                                              allowExtend:
                                                                                                                                                                                false
                                                                                                                                                                            }
                                                                                                                                                                          )}
                                                                                                                                                                          selector=".ec-related-products .grid-product__image"
                                                                                                                                                                          selectorSearchStrategy="dom-tree"
                                                                                                                                                                        >
                                                                                                                                                                          {({
                                                                                                                                                                            open: openGrid
                                                                                                                                                                          }) => {
                                                                                                                                                                            return (
                                                                                                                                                                              <Toolbar
                                                                                                                                                                                {...this.makeToolbarPropsFromConfig2(
                                                                                                                                                                                  toolbarGridTitle,
                                                                                                                                                                                  sidebarDisable
                                                                                                                                                                                )}
                                                                                                                                                                                selector=".ec-related-products .grid-product__title"
                                                                                                                                                                                selectorSearchStrategy="dom-tree"
                                                                                                                                                                              >
                                                                                                                                                                                {({
                                                                                                                                                                                  open: openGridTitle
                                                                                                                                                                                }) => {
                                                                                                                                                                                  return (
                                                                                                                                                                                    <Toolbar
                                                                                                                                                                                      {...this.makeToolbarPropsFromConfig2(
                                                                                                                                                                                        toolbarGridSubtitle,
                                                                                                                                                                                        sidebarDisable
                                                                                                                                                                                      )}
                                                                                                                                                                                      selector=".ec-related-products .grid-product__subtitle"
                                                                                                                                                                                      selectorSearchStrategy="dom-tree"
                                                                                                                                                                                    >
                                                                                                                                                                                      {({
                                                                                                                                                                                        open: openGridSubtitle
                                                                                                                                                                                      }) => {
                                                                                                                                                                                        return (
                                                                                                                                                                                          <Toolbar
                                                                                                                                                                                            {...this.makeToolbarPropsFromConfig2(
                                                                                                                                                                                              toolbarGridSKUInner,
                                                                                                                                                                                              sidebarDisable
                                                                                                                                                                                            )}
                                                                                                                                                                                            selector=".ec-related-products .grid-product__sku"
                                                                                                                                                                                            selectorSearchStrategy="dom-tree"
                                                                                                                                                                                          >
                                                                                                                                                                                            {({
                                                                                                                                                                                              open: openGridSKUInner
                                                                                                                                                                                            }) => {
                                                                                                                                                                                              return (
                                                                                                                                                                                                <Toolbar
                                                                                                                                                                                                  {...this.makeToolbarPropsFromConfig2(
                                                                                                                                                                                                    toolbarGridPrice,
                                                                                                                                                                                                    sidebarDisable
                                                                                                                                                                                                  )}
                                                                                                                                                                                                  selector=".ec-related-products .grid-product__price"
                                                                                                                                                                                                  selectorSearchStrategy="dom-tree"
                                                                                                                                                                                                >
                                                                                                                                                                                                  {({
                                                                                                                                                                                                    open: openGridPrice
                                                                                                                                                                                                  }) => {
                                                                                                                                                                                                    return (
                                                                                                                                                                                                      <Toolbar
                                                                                                                                                                                                        {...this.makeToolbarPropsFromConfig2(
                                                                                                                                                                                                          toolbarTotalProductsCount,
                                                                                                                                                                                                          sidebarDisable
                                                                                                                                                                                                        )}
                                                                                                                                                                                                        selector=".ec-cart-item__sum .ec-cart-item-sum--items"
                                                                                                                                                                                                        selectorSearchStrategy="dom-tree"
                                                                                                                                                                                                      >
                                                                                                                                                                                                        {({
                                                                                                                                                                                                          open: openTotalProductsCount
                                                                                                                                                                                                        }) => {
                                                                                                                                                                                                          return (
                                                                                                                                                                                                            <Toolbar
                                                                                                                                                                                                              {...this.makeToolbarPropsFromConfig2(
                                                                                                                                                                                                                toolbarCollapsedImage,
                                                                                                                                                                                                                sidebarCollapsedImage,
                                                                                                                                                                                                                {
                                                                                                                                                                                                                  allowExtend:
                                                                                                                                                                                                                    false
                                                                                                                                                                                                                }
                                                                                                                                                                                                              )}
                                                                                                                                                                                                              selector=".ec-cart__products--short-desktop .ec-cart-item__image"
                                                                                                                                                                                                              selectorSearchStrategy="dom-tree"
                                                                                                                                                                                                            >
                                                                                                                                                                                                              {({
                                                                                                                                                                                                                open: openCollapsedImage
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
                                                                                                                                                                                                                              ".ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-page-title .page-title__name, .ec-store .ec-store__content-wrapper .ec-page-title .page-title__name"
                                                                                                                                                                                                                            )
                                                                                                                                                                                                                          ) {
                                                                                                                                                                                                                            openTitle(
                                                                                                                                                                                                                              e.nativeEvent
                                                                                                                                                                                                                            );
                                                                                                                                                                                                                          } else if (
                                                                                                                                                                                                                            (
                                                                                                                                                                                                                              e.target as HTMLElement | null
                                                                                                                                                                                                                            )?.closest(
                                                                                                                                                                                                                              ".ec-cart .ec-cart__body .ec-cart__body-inner .ec-page-title .page-title__name"
                                                                                                                                                                                                                            )
                                                                                                                                                                                                                          ) {
                                                                                                                                                                                                                            openTitle2(
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
                                                                                                                                                                                                                              ".ec-cart__products--short-desktop .ec-cart-item__image"
                                                                                                                                                                                                                            )
                                                                                                                                                                                                                          ) {
                                                                                                                                                                                                                            openCollapsedImage(
                                                                                                                                                                                                                              e.nativeEvent
                                                                                                                                                                                                                            );
                                                                                                                                                                                                                          } else if (
                                                                                                                                                                                                                            (
                                                                                                                                                                                                                              e.target as HTMLElement | null
                                                                                                                                                                                                                            )?.closest(
                                                                                                                                                                                                                              ".ec-cart-item__image"
                                                                                                                                                                                                                            )
                                                                                                                                                                                                                          ) {
                                                                                                                                                                                                                            openImage(
                                                                                                                                                                                                                              e.nativeEvent
                                                                                                                                                                                                                            );
                                                                                                                                                                                                                          } else if (
                                                                                                                                                                                                                            (
                                                                                                                                                                                                                              e.target as HTMLElement | null
                                                                                                                                                                                                                            )?.closest(
                                                                                                                                                                                                                              "a.ec-cart-item__title"
                                                                                                                                                                                                                            )
                                                                                                                                                                                                                          ) {
                                                                                                                                                                                                                            openProductName(
                                                                                                                                                                                                                              e.nativeEvent
                                                                                                                                                                                                                            );
                                                                                                                                                                                                                          } else if (
                                                                                                                                                                                                                            (
                                                                                                                                                                                                                              e.target as HTMLElement | null
                                                                                                                                                                                                                            )?.closest(
                                                                                                                                                                                                                              ".ec-cart-item__options.ec-text-muted"
                                                                                                                                                                                                                            )
                                                                                                                                                                                                                          ) {
                                                                                                                                                                                                                            openProductSize(
                                                                                                                                                                                                                              e.nativeEvent
                                                                                                                                                                                                                            );
                                                                                                                                                                                                                          } else if (
                                                                                                                                                                                                                            (
                                                                                                                                                                                                                              e.target as HTMLElement | null
                                                                                                                                                                                                                            )?.closest(
                                                                                                                                                                                                                              ".ec-cart-item__control"
                                                                                                                                                                                                                            )
                                                                                                                                                                                                                          ) {
                                                                                                                                                                                                                            openClose(
                                                                                                                                                                                                                              e.nativeEvent
                                                                                                                                                                                                                            );
                                                                                                                                                                                                                          } else if (
                                                                                                                                                                                                                            (
                                                                                                                                                                                                                              e.target as HTMLElement | null
                                                                                                                                                                                                                            )?.closest(
                                                                                                                                                                                                                              ".ec-cart-item__sku.ec-text-muted"
                                                                                                                                                                                                                            )
                                                                                                                                                                                                                          ) {
                                                                                                                                                                                                                            openSKU(
                                                                                                                                                                                                                              e.nativeEvent
                                                                                                                                                                                                                            );
                                                                                                                                                                                                                          } else if (
                                                                                                                                                                                                                            (
                                                                                                                                                                                                                              e.target as HTMLElement | null
                                                                                                                                                                                                                            )?.closest(
                                                                                                                                                                                                                              ".ec-cart-item__count"
                                                                                                                                                                                                                            )
                                                                                                                                                                                                                          ) {
                                                                                                                                                                                                                            openQty(
                                                                                                                                                                                                                              e.nativeEvent
                                                                                                                                                                                                                            );
                                                                                                                                                                                                                          } else if (
                                                                                                                                                                                                                            (
                                                                                                                                                                                                                              e.target as HTMLElement | null
                                                                                                                                                                                                                            )?.closest(
                                                                                                                                                                                                                              ".ec-cart-item__price-inner, .ec-cart-item-sum.ec-cart-item-sum--cta"
                                                                                                                                                                                                                            )
                                                                                                                                                                                                                          ) {
                                                                                                                                                                                                                            openPrice(
                                                                                                                                                                                                                              e.nativeEvent
                                                                                                                                                                                                                            );
                                                                                                                                                                                                                          } else if (
                                                                                                                                                                                                                            (
                                                                                                                                                                                                                              e.target as HTMLElement | null
                                                                                                                                                                                                                            )?.closest(
                                                                                                                                                                                                                              ".ec-cart-summary__row.ec-cart-summary__row--total .ec-cart-summary__cell.ec-cart-summary__title"
                                                                                                                                                                                                                            )
                                                                                                                                                                                                                          ) {
                                                                                                                                                                                                                            openSummaryTitle(
                                                                                                                                                                                                                              e.nativeEvent
                                                                                                                                                                                                                            );
                                                                                                                                                                                                                          } else if (
                                                                                                                                                                                                                            (
                                                                                                                                                                                                                              e.target as HTMLElement | null
                                                                                                                                                                                                                            )?.closest(
                                                                                                                                                                                                                              ".ec-cart-summary__total"
                                                                                                                                                                                                                            )
                                                                                                                                                                                                                          ) {
                                                                                                                                                                                                                            openSummaryPrice(
                                                                                                                                                                                                                              e.nativeEvent
                                                                                                                                                                                                                            );
                                                                                                                                                                                                                          } else if (
                                                                                                                                                                                                                            (
                                                                                                                                                                                                                              e.target as HTMLElement | null
                                                                                                                                                                                                                            )?.closest(
                                                                                                                                                                                                                              ".ec-cart-summary__row.ec-cart-summary__row--items .ec-cart-summary__cell.ec-cart-summary__title"
                                                                                                                                                                                                                            )
                                                                                                                                                                                                                          ) {
                                                                                                                                                                                                                            openSubtotalTitle(
                                                                                                                                                                                                                              e.nativeEvent
                                                                                                                                                                                                                            );
                                                                                                                                                                                                                          } else if (
                                                                                                                                                                                                                            (
                                                                                                                                                                                                                              e.target as HTMLElement | null
                                                                                                                                                                                                                            )?.closest(
                                                                                                                                                                                                                              ".ec-cart-summary__row--items .ec-cart-summary__price span"
                                                                                                                                                                                                                            )
                                                                                                                                                                                                                          ) {
                                                                                                                                                                                                                            openSubtotalPrice(
                                                                                                                                                                                                                              e.nativeEvent
                                                                                                                                                                                                                            );
                                                                                                                                                                                                                          } else if (
                                                                                                                                                                                                                            (
                                                                                                                                                                                                                              e.target as HTMLElement | null
                                                                                                                                                                                                                            )?.closest(
                                                                                                                                                                                                                              ".ec-cart-summary__row--taxes .ec-cart-summary__title"
                                                                                                                                                                                                                            )
                                                                                                                                                                                                                          ) {
                                                                                                                                                                                                                            openTaxesTitle(
                                                                                                                                                                                                                              e.nativeEvent
                                                                                                                                                                                                                            );
                                                                                                                                                                                                                          } else if (
                                                                                                                                                                                                                            (
                                                                                                                                                                                                                              e.target as HTMLElement | null
                                                                                                                                                                                                                            )?.closest(
                                                                                                                                                                                                                              ".ec-cart-summary__row--taxes .ec-cart-summary__price"
                                                                                                                                                                                                                            )
                                                                                                                                                                                                                          ) {
                                                                                                                                                                                                                            openTaxesPrice(
                                                                                                                                                                                                                              e.nativeEvent
                                                                                                                                                                                                                            );
                                                                                                                                                                                                                          } else if (
                                                                                                                                                                                                                            (
                                                                                                                                                                                                                              e.target as HTMLElement | null
                                                                                                                                                                                                                            )?.closest(
                                                                                                                                                                                                                              ".ec-cart-summary__cell.ec-cart-summary__note"
                                                                                                                                                                                                                            )
                                                                                                                                                                                                                          ) {
                                                                                                                                                                                                                            openSummaryNote(
                                                                                                                                                                                                                              e.nativeEvent
                                                                                                                                                                                                                            );
                                                                                                                                                                                                                          } else if (
                                                                                                                                                                                                                            (
                                                                                                                                                                                                                              e.target as HTMLElement | null
                                                                                                                                                                                                                            )?.closest(
                                                                                                                                                                                                                              ".ec-cart-shopping__wrap"
                                                                                                                                                                                                                            )
                                                                                                                                                                                                                          ) {
                                                                                                                                                                                                                            openConnectLink(
                                                                                                                                                                                                                              e.nativeEvent
                                                                                                                                                                                                                            );
                                                                                                                                                                                                                          } else if (
                                                                                                                                                                                                                            (
                                                                                                                                                                                                                              e.target as HTMLElement | null
                                                                                                                                                                                                                            )?.closest(
                                                                                                                                                                                                                              ".ec-cart__message"
                                                                                                                                                                                                                            )
                                                                                                                                                                                                                          ) {
                                                                                                                                                                                                                            openEmpty(
                                                                                                                                                                                                                              e.nativeEvent
                                                                                                                                                                                                                            );
                                                                                                                                                                                                                          } else if (
                                                                                                                                                                                                                            (
                                                                                                                                                                                                                              e.target as HTMLElement | null
                                                                                                                                                                                                                            )?.closest(
                                                                                                                                                                                                                              ".ec-cart-email__text"
                                                                                                                                                                                                                            )
                                                                                                                                                                                                                          ) {
                                                                                                                                                                                                                            openEmail(
                                                                                                                                                                                                                              e.nativeEvent
                                                                                                                                                                                                                            );
                                                                                                                                                                                                                          } else if (
                                                                                                                                                                                                                            (
                                                                                                                                                                                                                              e.target as HTMLElement | null
                                                                                                                                                                                                                            )?.closest(
                                                                                                                                                                                                                              ".form-control--checkbox.form-control"
                                                                                                                                                                                                                            )
                                                                                                                                                                                                                          ) {
                                                                                                                                                                                                                            openCheckbox(
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
                                                                                                                                                                                                                              ".ec-cart__cert.ec-text-muted, .ec-cart-next__text.ec-text-muted"
                                                                                                                                                                                                                            )
                                                                                                                                                                                                                          ) {
                                                                                                                                                                                                                            openSubtitles(
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
                                                                                                                                                                                                                              ".ec-cart-next__header.ec-header-h4"
                                                                                                                                                                                                                            )
                                                                                                                                                                                                                          ) {
                                                                                                                                                                                                                            openNext(
                                                                                                                                                                                                                              e.nativeEvent
                                                                                                                                                                                                                            );
                                                                                                                                                                                                                          } else if (
                                                                                                                                                                                                                            (
                                                                                                                                                                                                                              e.target as HTMLElement | null
                                                                                                                                                                                                                            )?.closest(
                                                                                                                                                                                                                              ".ec-cart-next__title"
                                                                                                                                                                                                                            )
                                                                                                                                                                                                                          ) {
                                                                                                                                                                                                                            openPayment(
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
                                                                                                                                                                                                                          } else if (
                                                                                                                                                                                                                            (
                                                                                                                                                                                                                              e.target as HTMLElement | null
                                                                                                                                                                                                                            )?.closest(
                                                                                                                                                                                                                              ".ec-related-products .grid-product__image"
                                                                                                                                                                                                                            )
                                                                                                                                                                                                                          ) {
                                                                                                                                                                                                                            openGrid(
                                                                                                                                                                                                                              e.nativeEvent
                                                                                                                                                                                                                            );
                                                                                                                                                                                                                          } else if (
                                                                                                                                                                                                                            (
                                                                                                                                                                                                                              e.target as HTMLElement | null
                                                                                                                                                                                                                            )?.closest(
                                                                                                                                                                                                                              ".ec-related-products .grid-product__title"
                                                                                                                                                                                                                            )
                                                                                                                                                                                                                          ) {
                                                                                                                                                                                                                            openGridTitle(
                                                                                                                                                                                                                              e.nativeEvent
                                                                                                                                                                                                                            );
                                                                                                                                                                                                                          } else if (
                                                                                                                                                                                                                            (
                                                                                                                                                                                                                              e.target as HTMLElement | null
                                                                                                                                                                                                                            )?.closest(
                                                                                                                                                                                                                              ".ec-related-products .grid-product__subtitle"
                                                                                                                                                                                                                            )
                                                                                                                                                                                                                          ) {
                                                                                                                                                                                                                            openGridSubtitle(
                                                                                                                                                                                                                              e.nativeEvent
                                                                                                                                                                                                                            );
                                                                                                                                                                                                                          } else if (
                                                                                                                                                                                                                            (
                                                                                                                                                                                                                              e.target as HTMLElement | null
                                                                                                                                                                                                                            )?.closest(
                                                                                                                                                                                                                              ".ec-related-products .grid-product__sku"
                                                                                                                                                                                                                            )
                                                                                                                                                                                                                          ) {
                                                                                                                                                                                                                            openGridSKUInner(
                                                                                                                                                                                                                              e.nativeEvent
                                                                                                                                                                                                                            );
                                                                                                                                                                                                                          } else if (
                                                                                                                                                                                                                            (
                                                                                                                                                                                                                              e.target as HTMLElement | null
                                                                                                                                                                                                                            )?.closest(
                                                                                                                                                                                                                              ".ec-related-products .grid-product__price"
                                                                                                                                                                                                                            )
                                                                                                                                                                                                                          ) {
                                                                                                                                                                                                                            openGridPrice(
                                                                                                                                                                                                                              e.nativeEvent
                                                                                                                                                                                                                            );
                                                                                                                                                                                                                          } else if (
                                                                                                                                                                                                                            (
                                                                                                                                                                                                                              e.target as HTMLElement | null
                                                                                                                                                                                                                            )?.closest(
                                                                                                                                                                                                                              ".ec-cart-item__sum"
                                                                                                                                                                                                                            )
                                                                                                                                                                                                                          ) {
                                                                                                                                                                                                                            openTotalProductsCount(
                                                                                                                                                                                                                              e.nativeEvent
                                                                                                                                                                                                                            );
                                                                                                                                                                                                                          }

                                                                                                                                                                                                                          return false;
                                                                                                                                                                                                                        }}
                                                                                                                                                                                                                        className="brz-ecwid-cart"
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

  renderForView(v: Value, vs: Value, vd: Value): ReactNode {
    const className = classnames(
      "brz-ecwid-wrapper",
      "brz-ecwid-cart-wrapper",
      css(this.getComponentId(), this.getId(), style(v, vs, vd))
    );

    const storeId = makePlaceholder({
      content: "{{ecwid_store_id}}"
    });

    return (
      <Wrapper {...this.makeWrapperProps({ className })}>
        <div className="brz-ecwid-cart" data-store-id={storeId} />
      </Wrapper>
    );
  }
}
