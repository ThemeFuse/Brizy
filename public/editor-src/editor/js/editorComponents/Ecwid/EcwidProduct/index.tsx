import classnames from "classnames";
import React, { createRef, ReactNode } from "react";
import { uniqueId } from "underscore";
import CustomCSS from "visual/component/CustomCSS";
import Toolbar from "visual/component/Toolbar";
import { valueToEciwdConfig } from "visual/editorComponents/Ecwid/EcwidProduct/utils";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { Wrapper } from "visual/editorComponents/tools/Wrapper";
import Config, { Cloud } from "visual/global/Config";
import { isCloud } from "visual/global/Config/types/configs/Cloud";
import { EcwidService } from "visual/libs/Ecwid";
import { eq } from "visual/libs/Ecwid/types/EcwidConfig";
import { pageSelector } from "visual/redux/selectors";
import { EcwidProductPage } from "visual/types";
import { css } from "visual/utils/cssStyle";
import defaultValue from "./defaultValue.json";
import * as sidebarExtendParent from "./sidebar";
import * as sidebarAddToBag from "./sidebarAddToBag";
import * as sidebarButton from "./sidebarButton";
import * as sidebarCheckbox from "./sidebarCheckbox";
import * as sidebarCheckout from "./sidebarCheckout";
import * as sidebarDatepicker from "./sidebarDatepicker";
import * as sidebarDisable from "./sidebarDisable";
import * as sidebarFavorite from "./sidebarFavorite";
import * as sidebarFavorited from "./sidebarFavorited";
import * as sidebarFiles from "./sidebarFiles";
import * as sidebarGallery from "./sidebarGallery";
import * as sidebarQty from "./sidebarQty";
import * as sidebarSelect from "./sidebarSelect";
import * as sidebarShareButtons from "./sidebarShareButtons";
import * as sidebarTextarea from "./sidebarTextarea";
import * as sidebarTextField from "./sidebarTextField";
import * as sidebarThumbs from "./sidebarThumbs";
import * as sidebarViewFavorites from "./sidebarViewFavorites";
import { style } from "./styles";
import * as toolbarExtendParent from "./toolbar";
import * as toolbarAddToBag from "./toolbarAddToBag";
import * as toolbarAttribute from "./toolbarAttribute";
import * as toolbarBreadcrumbs from "./toolbarBreadcrumbs";
import * as toolbarButton from "./toolbarButton";
import * as toolbarCheckbox from "./toolbarCheckbox";
import * as toolbarCheckbox2 from "./toolbarCheckbox2";
import * as toolbarCheckout from "./toolbarCheckout";
import * as toolbarDatepicker from "./toolbarDatepicker";
import * as toolbarDescription from "./toolbarDescription";
import * as toolbarDetails from "./toolbarDetails";
import * as toolbarFavorite from "./toolbarFavorite";
import * as toolbarFavorited from "./toolbarFavorited";
import * as toolbarFiles from "./toolbarFiles";
import * as toolbarFlagLabel from "./toolbarFlagLabel";
import * as toolbarFooter from "./toolbarFooter";
import * as toolbarGallery from "./toolbarGallery";
import * as toolbarInStock from "./toolbarInStock";
import * as toolbarPrice from "./toolbarPrice";
import * as toolbarQty from "./toolbarQty";
import * as toolbarRadio from "./toolbarRadio";
import * as toolbarSelect from "./toolbarSelect";
import * as toolbarShareButtons from "./toolbarShareButtons";
import * as toolbarShareTitle from "./toolbarShareTitle";
import * as toolbarShowMore from "./toolbarShowMore";
import * as toolbarSize from "./toolbarSize";
import * as toolbarSKU from "./toolbarSKU";
import * as toolbarSubtitles from "./toolbarSubtitles";
import * as toolbarTextarea from "./toolbarTextarea";
import * as toolbarTextField from "./toolbarTextField";
import * as toolbarThumbnail from "./toolbarThumbnail";
import * as toolbarTitle from "./toolbarTitle";
import * as toolbarTitle2 from "./toolbarTitle2";
import * as toolbarViewFavorites from "./toolbarViewFavorites";
import * as toolbarWholesaleNote from "./toolbarWholesaleNote";
import * as toolbarWholesalePrice from "./toolbarWholesalePrice";
import * as toolbarWholesaleTableBody from "./toolbarWholesaleTableBody";
import * as toolbarWholesaleTableHeader from "./toolbarWholesaleTableHeader";
import * as toolbarWholesaleTitle from "./toolbarWholesaleTitle";
import { Value } from "./types/Value";

export class EcwidProduct extends EditorComponent<Value> {
  private uniqueId = `${EcwidProduct.componentId}-${uniqueId()}`;

  private containerRef = createRef<HTMLDivElement>();

  static defaultValue = defaultValue;

  private ecwid: EcwidService | undefined;

  static get componentId(): "EcwidProduct" {
    return "EcwidProduct";
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

    if (!IS_EDITOR) {
      return;
    }

    const config = Config.getAll();

    if (
      this.containerRef.current &&
      isCloud(config) &&
      config.modules?.shop?.type === "ecwid"
    ) {
      const v = this.getValue();
      const cnf = valueToEciwdConfig(v);

      const { productId } = pageSelector(
        this.getReduxState()
      ) as EcwidProductPage;

      const _productId = productId ?? config.modules.shop.defaultProductId;

      this.ecwid = EcwidService.init(config.modules.shop.storeId, cnf);
      this.ecwid.product(_productId, this.containerRef.current);
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
      "brz-ecwid-product-wrapper",
      css(`${this.getComponentId()}`, `${this.getId()}`, style(v, vs, vd))
    );

    return (
      <Toolbar
        {...this.makeToolbarPropsFromConfig2(toolbarTitle, sidebarDisable)}
        selector=".product-details__product-title.ec-header-h3"
        selectorSearchStrategy="dom-tree"
      >
        {({ open: openTitle }) => {
          return (
            <Toolbar
              {...this.makeToolbarPropsFromConfig2(
                toolbarBreadcrumbs,
                sidebarDisable
              )}
              selector=".breadcrumbs__link.ec-link.ec-link--muted.breadcrumbs__link--last"
              selectorSearchStrategy="dom-tree"
            >
              {({ open: openBreadcrumbs }) => {
                return (
                  <Toolbar
                    {...this.makeToolbarPropsFromConfig2(
                      toolbarSKU,
                      sidebarDisable
                    )}
                    selector=".product-details__product-sku.ec-text-muted"
                    selectorSearchStrategy="dom-tree"
                  >
                    {({ open: openSKU }) => {
                      return (
                        <Toolbar
                          {...this.makeToolbarPropsFromConfig2(
                            toolbarPrice,
                            sidebarDisable
                          )}
                          selector=".details-product-price__value.ec-price-item"
                          selectorSearchStrategy="dom-tree"
                        >
                          {({ open: openPrice }) => {
                            return (
                              <Toolbar
                                {...this.makeToolbarPropsFromConfig2(
                                  toolbarQty,
                                  sidebarQty,
                                  { allowExtend: false }
                                )}
                                selector=".details-product-purchase__qty"
                                selectorSearchStrategy="dom-tree"
                              >
                                {({ open: openQty }) => {
                                  return (
                                    <Toolbar
                                      {...this.makeToolbarPropsFromConfig2(
                                        toolbarSize,
                                        sidebarDisable
                                      )}
                                      selector=".product-details-module__title.ec-header-h6.details-product-option__title"
                                      selectorSearchStrategy="dom-tree"
                                    >
                                      {({ open: openSize }) => {
                                        return (
                                          <Toolbar
                                            {...this.makeToolbarPropsFromConfig2(
                                              toolbarRadio,
                                              sidebarDisable
                                            )}
                                            selector=".product-details-module.details-product-option.details-product-option--radio .product-details-module__content"
                                            selectorSearchStrategy="dom-tree"
                                          >
                                            {({ open: openRadio }) => {
                                              return (
                                                <Toolbar
                                                  {...this.makeToolbarPropsFromConfig2(
                                                    toolbarCheckbox2,
                                                    sidebarDisable
                                                  )}
                                                  selector=".product-details-module.details-product-option.details-product-option--checkbox .product-details-module__content"
                                                  selectorSearchStrategy="dom-tree"
                                                >
                                                  {({
                                                    open: openCheckbox2
                                                  }) => {
                                                    return (
                                                      <Toolbar
                                                        {...this.makeToolbarPropsFromConfig2(
                                                          toolbarTextField,
                                                          sidebarTextField,
                                                          { allowExtend: false }
                                                        )}
                                                        selector=".product-details-module.details-product-option.details-product-option--textfield .product-details-module__content"
                                                        selectorSearchStrategy="dom-tree"
                                                      >
                                                        {({
                                                          open: openTextField
                                                        }) => {
                                                          return (
                                                            <Toolbar
                                                              {...this.makeToolbarPropsFromConfig2(
                                                                toolbarTextarea,
                                                                sidebarTextarea,
                                                                {
                                                                  allowExtend:
                                                                    false
                                                                }
                                                              )}
                                                              selector=".product-details-module.details-product-option.details-product-option--textarea .product-details-module__content"
                                                              selectorSearchStrategy="dom-tree"
                                                            >
                                                              {({
                                                                open: openTextarea
                                                              }) => {
                                                                return (
                                                                  <Toolbar
                                                                    {...this.makeToolbarPropsFromConfig2(
                                                                      toolbarSelect,
                                                                      sidebarSelect,
                                                                      {
                                                                        allowExtend:
                                                                          false
                                                                      }
                                                                    )}
                                                                    selector=".product-details-module.details-product-option.details-product-option--select .product-details-module__content"
                                                                    selectorSearchStrategy="dom-tree"
                                                                  >
                                                                    {({
                                                                      open: openSelect
                                                                    }) => {
                                                                      return (
                                                                        <Toolbar
                                                                          {...this.makeToolbarPropsFromConfig2(
                                                                            toolbarDatepicker,
                                                                            sidebarDatepicker,
                                                                            {
                                                                              allowExtend:
                                                                                false
                                                                            }
                                                                          )}
                                                                          selector=".product-details-module.details-product-option.details-product-option--date .product-details-module__content"
                                                                          selectorSearchStrategy="dom-tree"
                                                                        >
                                                                          {({
                                                                            open: openDatepicker
                                                                          }) => {
                                                                            return (
                                                                              <Toolbar
                                                                                {...this.makeToolbarPropsFromConfig2(
                                                                                  toolbarFiles,
                                                                                  sidebarFiles,
                                                                                  {
                                                                                    allowExtend:
                                                                                      false
                                                                                  }
                                                                                )}
                                                                                selector=".product-details-module.details-product-option.details-product-option--files .product-details-module__content"
                                                                                selectorSearchStrategy="dom-tree"
                                                                              >
                                                                                {({
                                                                                  open: openFiles
                                                                                }) => {
                                                                                  return (
                                                                                    <Toolbar
                                                                                      {...this.makeToolbarPropsFromConfig2(
                                                                                        toolbarInStock,
                                                                                        sidebarDisable
                                                                                      )}
                                                                                      selector=".product-details-module__title.ec-header-h6.details-product-purchase__place span"
                                                                                      selectorSearchStrategy="dom-tree"
                                                                                    >
                                                                                      {({
                                                                                        open: openInStock
                                                                                      }) => {
                                                                                        return (
                                                                                          <Toolbar
                                                                                            {...this.makeToolbarPropsFromConfig2(
                                                                                              toolbarWholesaleTitle,
                                                                                              sidebarDisable
                                                                                            )}
                                                                                            selector=".product-details-module.product-details__product-price-wholesale .product-details-module__title.ec-header-h6.details-product-price-wholesale__title"
                                                                                            selectorSearchStrategy="dom-tree"
                                                                                          >
                                                                                            {({
                                                                                              open: openWholesaleTitle
                                                                                            }) => {
                                                                                              return (
                                                                                                <Toolbar
                                                                                                  {...this.makeToolbarPropsFromConfig2(
                                                                                                    toolbarWholesaleTableHeader,
                                                                                                    sidebarDisable
                                                                                                  )}
                                                                                                  selector="thead .details-product-wholesale__header"
                                                                                                  selectorSearchStrategy="dom-tree"
                                                                                                >
                                                                                                  {({
                                                                                                    open: openWholesaleTableHeader
                                                                                                  }) => {
                                                                                                    return (
                                                                                                      <Toolbar
                                                                                                        {...this.makeToolbarPropsFromConfig2(
                                                                                                          toolbarWholesaleTableBody,
                                                                                                          sidebarDisable
                                                                                                        )}
                                                                                                        selector="tbody .details-product-wholesale__row"
                                                                                                        selectorSearchStrategy="dom-tree"
                                                                                                      >
                                                                                                        {({
                                                                                                          open: openWholesaleTableBody
                                                                                                        }) => {
                                                                                                          return (
                                                                                                            <Toolbar
                                                                                                              {...this.makeToolbarPropsFromConfig2(
                                                                                                                toolbarDetails,
                                                                                                                sidebarDisable
                                                                                                              )}
                                                                                                              selector=".product-details-module.product-details__general-info .product-details-module__title.ec-header-h6, .product-details__description div .product-details-module__title.ec-header-h6"
                                                                                                              selectorSearchStrategy="dom-tree"
                                                                                                            >
                                                                                                              {({
                                                                                                                open: openDetails
                                                                                                              }) => {
                                                                                                                return (
                                                                                                                  <Toolbar
                                                                                                                    {...this.makeToolbarPropsFromConfig2(
                                                                                                                      toolbarAttribute,
                                                                                                                      sidebarDisable
                                                                                                                    )}
                                                                                                                    selector=".details-product-attribute, .product-details__product-weight"
                                                                                                                    selectorSearchStrategy="dom-tree"
                                                                                                                  >
                                                                                                                    {({
                                                                                                                      open: openAttribute
                                                                                                                    }) => {
                                                                                                                      return (
                                                                                                                        <Toolbar
                                                                                                                          {...this.makeToolbarPropsFromConfig2(
                                                                                                                            toolbarDescription,
                                                                                                                            sidebarDisable
                                                                                                                          )}
                                                                                                                          selector=".product-details__product-description"
                                                                                                                          selectorSearchStrategy="dom-tree"
                                                                                                                        >
                                                                                                                          {({
                                                                                                                            open: openDescription
                                                                                                                          }) => {
                                                                                                                            return (
                                                                                                                              <Toolbar
                                                                                                                                {...this.makeToolbarPropsFromConfig2(
                                                                                                                                  toolbarShowMore,
                                                                                                                                  sidebarDisable
                                                                                                                                )}
                                                                                                                                selector=".product-details-module__btn-more"
                                                                                                                                selectorSearchStrategy="dom-tree"
                                                                                                                              >
                                                                                                                                {({
                                                                                                                                  open: openShowMore
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
                                                                                                                                      selector=".form-control.form-control--button.form-control--large.form-control--secondary.form-control--flexible.form-control--animated.details-product-purchase__add-more.form-control__button--icon-center.form-control--done"
                                                                                                                                      selectorSearchStrategy="dom-tree"
                                                                                                                                    >
                                                                                                                                      {({
                                                                                                                                        open: openButton
                                                                                                                                      }) => {
                                                                                                                                        return (
                                                                                                                                          <Toolbar
                                                                                                                                            {...this.makeToolbarPropsFromConfig2(
                                                                                                                                              toolbarCheckout,
                                                                                                                                              sidebarCheckout,
                                                                                                                                              {
                                                                                                                                                allowExtend:
                                                                                                                                                  false
                                                                                                                                              }
                                                                                                                                            )}
                                                                                                                                            selector=".form-control.form-control--button.form-control--large.form-control--primary.form-control--flexible.details-product-purchase__checkout"
                                                                                                                                            selectorSearchStrategy="dom-tree"
                                                                                                                                          >
                                                                                                                                            {({
                                                                                                                                              open: openCheckout
                                                                                                                                            }) => {
                                                                                                                                              return (
                                                                                                                                                <Toolbar
                                                                                                                                                  {...this.makeToolbarPropsFromConfig2(
                                                                                                                                                    toolbarAddToBag,
                                                                                                                                                    sidebarAddToBag,
                                                                                                                                                    {
                                                                                                                                                      allowExtend:
                                                                                                                                                        false
                                                                                                                                                    }
                                                                                                                                                  )}
                                                                                                                                                  selector=".form-control.form-control--button.form-control--large.form-control--primary.form-control--flexible.form-control--animated.details-product-purchase__add-to-bag.form-control__button--icon-center.form-control--done"
                                                                                                                                                  selectorSearchStrategy="dom-tree"
                                                                                                                                                >
                                                                                                                                                  {({
                                                                                                                                                    open: openAddToBag
                                                                                                                                                  }) => {
                                                                                                                                                    return (
                                                                                                                                                      <Toolbar
                                                                                                                                                        {...this.makeToolbarPropsFromConfig2(
                                                                                                                                                          toolbarCheckbox,
                                                                                                                                                          sidebarCheckbox,
                                                                                                                                                          {
                                                                                                                                                            allowExtend:
                                                                                                                                                              false
                                                                                                                                                          }
                                                                                                                                                        )}
                                                                                                                                                        selector=".form-control--checkbox-button.form-control"
                                                                                                                                                        selectorSearchStrategy="dom-tree"
                                                                                                                                                      >
                                                                                                                                                        {({
                                                                                                                                                          open: openCheckbox
                                                                                                                                                        }) => {
                                                                                                                                                          return (
                                                                                                                                                            <Toolbar
                                                                                                                                                              {...this.makeToolbarPropsFromConfig2(
                                                                                                                                                                toolbarFavorite,
                                                                                                                                                                sidebarFavorite,
                                                                                                                                                                {
                                                                                                                                                                  allowExtend:
                                                                                                                                                                    false
                                                                                                                                                                }
                                                                                                                                                              )}
                                                                                                                                                              selector=".form-control.form-control--button.form-control--medium.form-control--secondary.form-control--done.favorite-product__button-add"
                                                                                                                                                              selectorSearchStrategy="dom-tree"
                                                                                                                                                            >
                                                                                                                                                              {({
                                                                                                                                                                open: openFavorite
                                                                                                                                                              }) => {
                                                                                                                                                                return (
                                                                                                                                                                  <Toolbar
                                                                                                                                                                    {...this.makeToolbarPropsFromConfig2(
                                                                                                                                                                      toolbarFavorited,
                                                                                                                                                                      sidebarFavorited,
                                                                                                                                                                      {
                                                                                                                                                                        allowExtend:
                                                                                                                                                                          false
                                                                                                                                                                      }
                                                                                                                                                                    )}
                                                                                                                                                                    selector=".form-control.form-control--button.form-control--medium.form-control--secondary.form-control--done.favorite-product__button-saved"
                                                                                                                                                                    selectorSearchStrategy="dom-tree"
                                                                                                                                                                  >
                                                                                                                                                                    {({
                                                                                                                                                                      open: openFavorited
                                                                                                                                                                    }) => {
                                                                                                                                                                      return (
                                                                                                                                                                        <Toolbar
                                                                                                                                                                          {...this.makeToolbarPropsFromConfig2(
                                                                                                                                                                            toolbarViewFavorites,
                                                                                                                                                                            sidebarViewFavorites,
                                                                                                                                                                            {
                                                                                                                                                                              allowExtend:
                                                                                                                                                                                false
                                                                                                                                                                            }
                                                                                                                                                                          )}
                                                                                                                                                                          selector=".form-control.form-control--button.form-control--medium.form-control--secondary.form-control--done.favorite-product__button-view"
                                                                                                                                                                          selectorSearchStrategy="dom-tree"
                                                                                                                                                                        >
                                                                                                                                                                          {({
                                                                                                                                                                            open: openViewFavorites
                                                                                                                                                                          }) => {
                                                                                                                                                                            return (
                                                                                                                                                                              <Toolbar
                                                                                                                                                                                {...this.makeToolbarPropsFromConfig2(
                                                                                                                                                                                  toolbarShareTitle,
                                                                                                                                                                                  sidebarDisable
                                                                                                                                                                                )}
                                                                                                                                                                                selector=".product-details__product-share.details-product-share .product-details-module .product-details-module__title.ec-header-h6.details-product-share__title"
                                                                                                                                                                                selectorSearchStrategy="dom-tree"
                                                                                                                                                                              >
                                                                                                                                                                                {({
                                                                                                                                                                                  open: openShareTitle
                                                                                                                                                                                }) => {
                                                                                                                                                                                  return (
                                                                                                                                                                                    <Toolbar
                                                                                                                                                                                      {...this.makeToolbarPropsFromConfig2(
                                                                                                                                                                                        toolbarShareButtons,
                                                                                                                                                                                        sidebarShareButtons,
                                                                                                                                                                                        {
                                                                                                                                                                                          allowExtend:
                                                                                                                                                                                            false
                                                                                                                                                                                        }
                                                                                                                                                                                      )}
                                                                                                                                                                                      selector=".ec-likely.details-product-share__buttons"
                                                                                                                                                                                      selectorSearchStrategy="dom-tree"
                                                                                                                                                                                    >
                                                                                                                                                                                      {({
                                                                                                                                                                                        open: openShareButtons
                                                                                                                                                                                      }) => {
                                                                                                                                                                                        return (
                                                                                                                                                                                          <Toolbar
                                                                                                                                                                                            {...this.makeToolbarPropsFromConfig2(
                                                                                                                                                                                              toolbarGallery,
                                                                                                                                                                                              sidebarGallery,
                                                                                                                                                                                              {
                                                                                                                                                                                                allowExtend:
                                                                                                                                                                                                  false
                                                                                                                                                                                              }
                                                                                                                                                                                            )}
                                                                                                                                                                                            selector=".details-gallery__image:first-child"
                                                                                                                                                                                            selectorSearchStrategy="dom-tree"
                                                                                                                                                                                          >
                                                                                                                                                                                            {({
                                                                                                                                                                                              open: openThumbs
                                                                                                                                                                                            }) => {
                                                                                                                                                                                              return (
                                                                                                                                                                                                <Toolbar
                                                                                                                                                                                                  {...this.makeToolbarPropsFromConfig2(
                                                                                                                                                                                                    toolbarThumbnail,
                                                                                                                                                                                                    sidebarThumbs,
                                                                                                                                                                                                    {
                                                                                                                                                                                                      allowExtend:
                                                                                                                                                                                                        false
                                                                                                                                                                                                    }
                                                                                                                                                                                                  )}
                                                                                                                                                                                                  selector=".details-gallery__thumbs, .details-gallery__image:not(:first-child)"
                                                                                                                                                                                                  selectorSearchStrategy="dom-tree"
                                                                                                                                                                                                >
                                                                                                                                                                                                  {({
                                                                                                                                                                                                    open: openGallery
                                                                                                                                                                                                  }) => {
                                                                                                                                                                                                    return (
                                                                                                                                                                                                      <Toolbar
                                                                                                                                                                                                        {...this.makeToolbarPropsFromConfig2(
                                                                                                                                                                                                          toolbarWholesalePrice,
                                                                                                                                                                                                          sidebarDisable
                                                                                                                                                                                                        )}
                                                                                                                                                                                                        selector=".details-product-price-compare__container"
                                                                                                                                                                                                        selectorSearchStrategy="dom-tree"
                                                                                                                                                                                                      >
                                                                                                                                                                                                        {({
                                                                                                                                                                                                          open: openWholesalePrice
                                                                                                                                                                                                        }) => {
                                                                                                                                                                                                          return (
                                                                                                                                                                                                            <Toolbar
                                                                                                                                                                                                              {...this.makeToolbarPropsFromConfig2(
                                                                                                                                                                                                                toolbarWholesaleNote,
                                                                                                                                                                                                                sidebarDisable
                                                                                                                                                                                                              )}
                                                                                                                                                                                                              selector=".product-details__product-price-wholesale-note"
                                                                                                                                                                                                              selectorSearchStrategy="dom-tree"
                                                                                                                                                                                                            >
                                                                                                                                                                                                              {({
                                                                                                                                                                                                                open: openWholesaleNote
                                                                                                                                                                                                              }) => {
                                                                                                                                                                                                                return (
                                                                                                                                                                                                                  <Toolbar
                                                                                                                                                                                                                    {...this.makeToolbarPropsFromConfig2(
                                                                                                                                                                                                                      toolbarFlagLabel,
                                                                                                                                                                                                                      sidebarDisable
                                                                                                                                                                                                                    )}
                                                                                                                                                                                                                    selector=".product-details__label-container .ec-label"
                                                                                                                                                                                                                    selectorSearchStrategy="dom-tree"
                                                                                                                                                                                                                  >
                                                                                                                                                                                                                    {({
                                                                                                                                                                                                                      open: openFlagLabel
                                                                                                                                                                                                                    }) => {
                                                                                                                                                                                                                      return (
                                                                                                                                                                                                                        <Toolbar
                                                                                                                                                                                                                          {...this.makeToolbarPropsFromConfig2(
                                                                                                                                                                                                                            toolbarSubtitles,
                                                                                                                                                                                                                            sidebarDisable
                                                                                                                                                                                                                          )}
                                                                                                                                                                                                                          selector=".product-details-module.product-details__subtitle .product-details-module__content"
                                                                                                                                                                                                                          selectorSearchStrategy="dom-tree"
                                                                                                                                                                                                                        >
                                                                                                                                                                                                                          {({
                                                                                                                                                                                                                            open: openSubtitles
                                                                                                                                                                                                                          }) => {
                                                                                                                                                                                                                            return (
                                                                                                                                                                                                                              <Toolbar
                                                                                                                                                                                                                                {...this.makeToolbarPropsFromConfig2(
                                                                                                                                                                                                                                  toolbarTitle2,
                                                                                                                                                                                                                                  sidebarDisable
                                                                                                                                                                                                                                )}
                                                                                                                                                                                                                                selector=".product-details-module.product-details__product-like.favorite-product .product-details-module__title.ec-header-h6.favorite-product__title"
                                                                                                                                                                                                                                selectorSearchStrategy="dom-tree"
                                                                                                                                                                                                                              >
                                                                                                                                                                                                                                {({
                                                                                                                                                                                                                                  open: openTitle2
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
                                                                                                                                                                                                                                                      ".product-details__product-title.ec-header-h3"
                                                                                                                                                                                                                                                    )
                                                                                                                                                                                                                                                  ) {
                                                                                                                                                                                                                                                    openTitle(
                                                                                                                                                                                                                                                      e.nativeEvent
                                                                                                                                                                                                                                                    );
                                                                                                                                                                                                                                                  } else if (
                                                                                                                                                                                                                                                    (
                                                                                                                                                                                                                                                      e.target as HTMLElement | null
                                                                                                                                                                                                                                                    )?.closest(
                                                                                                                                                                                                                                                      ".breadcrumbs__link.ec-link.ec-link--muted.breadcrumbs__link--last"
                                                                                                                                                                                                                                                    )
                                                                                                                                                                                                                                                  ) {
                                                                                                                                                                                                                                                    openBreadcrumbs(
                                                                                                                                                                                                                                                      e.nativeEvent
                                                                                                                                                                                                                                                    );
                                                                                                                                                                                                                                                  } else if (
                                                                                                                                                                                                                                                    (
                                                                                                                                                                                                                                                      e.target as HTMLElement | null
                                                                                                                                                                                                                                                    )?.closest(
                                                                                                                                                                                                                                                      ".product-details__product-sku.ec-text-muted"
                                                                                                                                                                                                                                                    )
                                                                                                                                                                                                                                                  ) {
                                                                                                                                                                                                                                                    openSKU(
                                                                                                                                                                                                                                                      e.nativeEvent
                                                                                                                                                                                                                                                    );
                                                                                                                                                                                                                                                  } else if (
                                                                                                                                                                                                                                                    (
                                                                                                                                                                                                                                                      e.target as HTMLElement | null
                                                                                                                                                                                                                                                    )?.closest(
                                                                                                                                                                                                                                                      ".details-product-price__value.ec-price-item"
                                                                                                                                                                                                                                                    )
                                                                                                                                                                                                                                                  ) {
                                                                                                                                                                                                                                                    openPrice(
                                                                                                                                                                                                                                                      e.nativeEvent
                                                                                                                                                                                                                                                    );
                                                                                                                                                                                                                                                  } else if (
                                                                                                                                                                                                                                                    (
                                                                                                                                                                                                                                                      e.target as HTMLElement | null
                                                                                                                                                                                                                                                    )?.closest(
                                                                                                                                                                                                                                                      ".details-product-purchase__qty"
                                                                                                                                                                                                                                                    )
                                                                                                                                                                                                                                                  ) {
                                                                                                                                                                                                                                                    openQty(
                                                                                                                                                                                                                                                      e.nativeEvent
                                                                                                                                                                                                                                                    );
                                                                                                                                                                                                                                                  } else if (
                                                                                                                                                                                                                                                    (
                                                                                                                                                                                                                                                      e.target as HTMLElement | null
                                                                                                                                                                                                                                                    )?.closest(
                                                                                                                                                                                                                                                      ".product-details-module__title.ec-header-h6.details-product-option__title"
                                                                                                                                                                                                                                                    )
                                                                                                                                                                                                                                                  ) {
                                                                                                                                                                                                                                                    openSize(
                                                                                                                                                                                                                                                      e.nativeEvent
                                                                                                                                                                                                                                                    );
                                                                                                                                                                                                                                                  } else if (
                                                                                                                                                                                                                                                    (
                                                                                                                                                                                                                                                      e.target as HTMLElement | null
                                                                                                                                                                                                                                                    )?.closest(
                                                                                                                                                                                                                                                      ".product-details-module.details-product-option.details-product-option--radio .product-details-module__content"
                                                                                                                                                                                                                                                    )
                                                                                                                                                                                                                                                  ) {
                                                                                                                                                                                                                                                    openRadio(
                                                                                                                                                                                                                                                      e.nativeEvent
                                                                                                                                                                                                                                                    );
                                                                                                                                                                                                                                                  } else if (
                                                                                                                                                                                                                                                    (
                                                                                                                                                                                                                                                      e.target as HTMLElement | null
                                                                                                                                                                                                                                                    )?.closest(
                                                                                                                                                                                                                                                      ".product-details-module.details-product-option.details-product-option--checkbox .product-details-module__content"
                                                                                                                                                                                                                                                    )
                                                                                                                                                                                                                                                  ) {
                                                                                                                                                                                                                                                    openCheckbox2(
                                                                                                                                                                                                                                                      e.nativeEvent
                                                                                                                                                                                                                                                    );
                                                                                                                                                                                                                                                  } else if (
                                                                                                                                                                                                                                                    (
                                                                                                                                                                                                                                                      e.target as HTMLElement | null
                                                                                                                                                                                                                                                    )?.closest(
                                                                                                                                                                                                                                                      ".product-details-module.details-product-option.details-product-option--textfield .product-details-module__content"
                                                                                                                                                                                                                                                    )
                                                                                                                                                                                                                                                  ) {
                                                                                                                                                                                                                                                    openTextField(
                                                                                                                                                                                                                                                      e.nativeEvent
                                                                                                                                                                                                                                                    );
                                                                                                                                                                                                                                                  } else if (
                                                                                                                                                                                                                                                    (
                                                                                                                                                                                                                                                      e.target as HTMLElement | null
                                                                                                                                                                                                                                                    )?.closest(
                                                                                                                                                                                                                                                      ".product-details-module.details-product-option.details-product-option--textarea .product-details-module__content"
                                                                                                                                                                                                                                                    )
                                                                                                                                                                                                                                                  ) {
                                                                                                                                                                                                                                                    openTextarea(
                                                                                                                                                                                                                                                      e.nativeEvent
                                                                                                                                                                                                                                                    );
                                                                                                                                                                                                                                                  } else if (
                                                                                                                                                                                                                                                    (
                                                                                                                                                                                                                                                      e.target as HTMLElement | null
                                                                                                                                                                                                                                                    )?.closest(
                                                                                                                                                                                                                                                      ".product-details-module.details-product-option.details-product-option--select .product-details-module__content"
                                                                                                                                                                                                                                                    )
                                                                                                                                                                                                                                                  ) {
                                                                                                                                                                                                                                                    openSelect(
                                                                                                                                                                                                                                                      e.nativeEvent
                                                                                                                                                                                                                                                    );
                                                                                                                                                                                                                                                  } else if (
                                                                                                                                                                                                                                                    (
                                                                                                                                                                                                                                                      e.target as HTMLElement | null
                                                                                                                                                                                                                                                    )?.closest(
                                                                                                                                                                                                                                                      ".product-details-module.details-product-option.details-product-option--date .product-details-module__content"
                                                                                                                                                                                                                                                    )
                                                                                                                                                                                                                                                  ) {
                                                                                                                                                                                                                                                    openDatepicker(
                                                                                                                                                                                                                                                      e.nativeEvent
                                                                                                                                                                                                                                                    );
                                                                                                                                                                                                                                                  } else if (
                                                                                                                                                                                                                                                    (
                                                                                                                                                                                                                                                      e.target as HTMLElement | null
                                                                                                                                                                                                                                                    )?.closest(
                                                                                                                                                                                                                                                      ".product-details-module.details-product-option.details-product-option--files .product-details-module__content"
                                                                                                                                                                                                                                                    )
                                                                                                                                                                                                                                                  ) {
                                                                                                                                                                                                                                                    openFiles(
                                                                                                                                                                                                                                                      e.nativeEvent
                                                                                                                                                                                                                                                    );
                                                                                                                                                                                                                                                  } else if (
                                                                                                                                                                                                                                                    (
                                                                                                                                                                                                                                                      e.target as HTMLElement | null
                                                                                                                                                                                                                                                    )?.closest(
                                                                                                                                                                                                                                                      ".product-details-module__title.ec-header-h6.details-product-purchase__place span"
                                                                                                                                                                                                                                                    )
                                                                                                                                                                                                                                                  ) {
                                                                                                                                                                                                                                                    openInStock(
                                                                                                                                                                                                                                                      e.nativeEvent
                                                                                                                                                                                                                                                    );
                                                                                                                                                                                                                                                  } else if (
                                                                                                                                                                                                                                                    (
                                                                                                                                                                                                                                                      e.target as HTMLElement | null
                                                                                                                                                                                                                                                    )?.closest(
                                                                                                                                                                                                                                                      ".product-details-module.product-details__product-price-wholesale .product-details-module__title.ec-header-h6.details-product-price-wholesale__title"
                                                                                                                                                                                                                                                    )
                                                                                                                                                                                                                                                  ) {
                                                                                                                                                                                                                                                    openWholesaleTitle(
                                                                                                                                                                                                                                                      e.nativeEvent
                                                                                                                                                                                                                                                    );
                                                                                                                                                                                                                                                  } else if (
                                                                                                                                                                                                                                                    (
                                                                                                                                                                                                                                                      e.target as HTMLElement | null
                                                                                                                                                                                                                                                    )?.closest(
                                                                                                                                                                                                                                                      "thead .details-product-wholesale__header"
                                                                                                                                                                                                                                                    )
                                                                                                                                                                                                                                                  ) {
                                                                                                                                                                                                                                                    openWholesaleTableHeader(
                                                                                                                                                                                                                                                      e.nativeEvent
                                                                                                                                                                                                                                                    );
                                                                                                                                                                                                                                                  } else if (
                                                                                                                                                                                                                                                    (
                                                                                                                                                                                                                                                      e.target as HTMLElement | null
                                                                                                                                                                                                                                                    )?.closest(
                                                                                                                                                                                                                                                      "tbody .details-product-wholesale__row"
                                                                                                                                                                                                                                                    )
                                                                                                                                                                                                                                                  ) {
                                                                                                                                                                                                                                                    openWholesaleTableBody(
                                                                                                                                                                                                                                                      e.nativeEvent
                                                                                                                                                                                                                                                    );
                                                                                                                                                                                                                                                  } else if (
                                                                                                                                                                                                                                                    (
                                                                                                                                                                                                                                                      e.target as HTMLElement | null
                                                                                                                                                                                                                                                    )?.closest(
                                                                                                                                                                                                                                                      ".product-details-module.product-details__general-info .product-details-module__title.ec-header-h6, .product-details__description div .product-details-module__title.ec-header-h6"
                                                                                                                                                                                                                                                    )
                                                                                                                                                                                                                                                  ) {
                                                                                                                                                                                                                                                    openDetails(
                                                                                                                                                                                                                                                      e.nativeEvent
                                                                                                                                                                                                                                                    );
                                                                                                                                                                                                                                                  } else if (
                                                                                                                                                                                                                                                    (
                                                                                                                                                                                                                                                      e.target as HTMLElement | null
                                                                                                                                                                                                                                                    )?.closest(
                                                                                                                                                                                                                                                      ".details-product-attribute, .product-details__product-weight"
                                                                                                                                                                                                                                                    )
                                                                                                                                                                                                                                                  ) {
                                                                                                                                                                                                                                                    openAttribute(
                                                                                                                                                                                                                                                      e.nativeEvent
                                                                                                                                                                                                                                                    );
                                                                                                                                                                                                                                                  } else if (
                                                                                                                                                                                                                                                    (
                                                                                                                                                                                                                                                      e.target as HTMLElement | null
                                                                                                                                                                                                                                                    )?.closest(
                                                                                                                                                                                                                                                      ".product-details__product-description"
                                                                                                                                                                                                                                                    )
                                                                                                                                                                                                                                                  ) {
                                                                                                                                                                                                                                                    openDescription(
                                                                                                                                                                                                                                                      e.nativeEvent
                                                                                                                                                                                                                                                    );
                                                                                                                                                                                                                                                  } else if (
                                                                                                                                                                                                                                                    (
                                                                                                                                                                                                                                                      e.target as HTMLElement | null
                                                                                                                                                                                                                                                    )?.closest(
                                                                                                                                                                                                                                                      ".product-details-module__btn-more"
                                                                                                                                                                                                                                                    )
                                                                                                                                                                                                                                                  ) {
                                                                                                                                                                                                                                                    openShowMore(
                                                                                                                                                                                                                                                      e.nativeEvent
                                                                                                                                                                                                                                                    );
                                                                                                                                                                                                                                                  } else if (
                                                                                                                                                                                                                                                    (
                                                                                                                                                                                                                                                      e.target as HTMLElement | null
                                                                                                                                                                                                                                                    )?.closest(
                                                                                                                                                                                                                                                      ".form-control.form-control--button.form-control--large.form-control--secondary.form-control--flexible.form-control--animated.details-product-purchase__add-more.form-control__button--icon-center.form-control--done"
                                                                                                                                                                                                                                                    )
                                                                                                                                                                                                                                                  ) {
                                                                                                                                                                                                                                                    openButton(
                                                                                                                                                                                                                                                      e.nativeEvent
                                                                                                                                                                                                                                                    );
                                                                                                                                                                                                                                                  } else if (
                                                                                                                                                                                                                                                    (
                                                                                                                                                                                                                                                      e.target as HTMLElement | null
                                                                                                                                                                                                                                                    )?.closest(
                                                                                                                                                                                                                                                      ".form-control.form-control--button.form-control--large.form-control--primary.form-control--flexible.details-product-purchase__checkout"
                                                                                                                                                                                                                                                    )
                                                                                                                                                                                                                                                  ) {
                                                                                                                                                                                                                                                    openCheckout(
                                                                                                                                                                                                                                                      e.nativeEvent
                                                                                                                                                                                                                                                    );
                                                                                                                                                                                                                                                  } else if (
                                                                                                                                                                                                                                                    (
                                                                                                                                                                                                                                                      e.target as HTMLElement | null
                                                                                                                                                                                                                                                    )?.closest(
                                                                                                                                                                                                                                                      ".form-control.form-control--button.form-control--large.form-control--primary.form-control--flexible.form-control--animated.details-product-purchase__add-to-bag.form-control__button--icon-center.form-control--done"
                                                                                                                                                                                                                                                    )
                                                                                                                                                                                                                                                  ) {
                                                                                                                                                                                                                                                    openAddToBag(
                                                                                                                                                                                                                                                      e.nativeEvent
                                                                                                                                                                                                                                                    );
                                                                                                                                                                                                                                                  } else if (
                                                                                                                                                                                                                                                    (
                                                                                                                                                                                                                                                      e.target as HTMLElement | null
                                                                                                                                                                                                                                                    )?.closest(
                                                                                                                                                                                                                                                      ".form-control--checkbox-button.form-control"
                                                                                                                                                                                                                                                    )
                                                                                                                                                                                                                                                  ) {
                                                                                                                                                                                                                                                    openCheckbox(
                                                                                                                                                                                                                                                      e.nativeEvent
                                                                                                                                                                                                                                                    );
                                                                                                                                                                                                                                                  } else if (
                                                                                                                                                                                                                                                    (
                                                                                                                                                                                                                                                      e.target as HTMLElement | null
                                                                                                                                                                                                                                                    )?.closest(
                                                                                                                                                                                                                                                      ".form-control.form-control--button.form-control--medium.form-control--secondary.form-control--done.favorite-product__button-add"
                                                                                                                                                                                                                                                    )
                                                                                                                                                                                                                                                  ) {
                                                                                                                                                                                                                                                    openFavorite(
                                                                                                                                                                                                                                                      e.nativeEvent
                                                                                                                                                                                                                                                    );
                                                                                                                                                                                                                                                  } else if (
                                                                                                                                                                                                                                                    (
                                                                                                                                                                                                                                                      e.target as HTMLElement | null
                                                                                                                                                                                                                                                    )?.closest(
                                                                                                                                                                                                                                                      ".form-control.form-control--button.form-control--medium.form-control--secondary.form-control--done.favorite-product__button-saved"
                                                                                                                                                                                                                                                    )
                                                                                                                                                                                                                                                  ) {
                                                                                                                                                                                                                                                    openFavorited(
                                                                                                                                                                                                                                                      e.nativeEvent
                                                                                                                                                                                                                                                    );
                                                                                                                                                                                                                                                  } else if (
                                                                                                                                                                                                                                                    (
                                                                                                                                                                                                                                                      e.target as HTMLElement | null
                                                                                                                                                                                                                                                    )?.closest(
                                                                                                                                                                                                                                                      ".form-control.form-control--button.form-control--medium.form-control--secondary.form-control--done.favorite-product__button-view"
                                                                                                                                                                                                                                                    )
                                                                                                                                                                                                                                                  ) {
                                                                                                                                                                                                                                                    openViewFavorites(
                                                                                                                                                                                                                                                      e.nativeEvent
                                                                                                                                                                                                                                                    );
                                                                                                                                                                                                                                                  } else if (
                                                                                                                                                                                                                                                    (
                                                                                                                                                                                                                                                      e.target as HTMLElement | null
                                                                                                                                                                                                                                                    )?.closest(
                                                                                                                                                                                                                                                      ".product-details__product-share.details-product-share .product-details-module .product-details-module__title.ec-header-h6.details-product-share__title"
                                                                                                                                                                                                                                                    )
                                                                                                                                                                                                                                                  ) {
                                                                                                                                                                                                                                                    openShareTitle(
                                                                                                                                                                                                                                                      e.nativeEvent
                                                                                                                                                                                                                                                    );
                                                                                                                                                                                                                                                  } else if (
                                                                                                                                                                                                                                                    (
                                                                                                                                                                                                                                                      e.target as HTMLElement | null
                                                                                                                                                                                                                                                    )?.closest(
                                                                                                                                                                                                                                                      ".ec-likely.details-product-share__buttons"
                                                                                                                                                                                                                                                    )
                                                                                                                                                                                                                                                  ) {
                                                                                                                                                                                                                                                    openShareButtons(
                                                                                                                                                                                                                                                      e.nativeEvent
                                                                                                                                                                                                                                                    );
                                                                                                                                                                                                                                                  } else if (
                                                                                                                                                                                                                                                    (
                                                                                                                                                                                                                                                      e.target as HTMLElement | null
                                                                                                                                                                                                                                                    )?.closest(
                                                                                                                                                                                                                                                      ".details-gallery__image:first-child"
                                                                                                                                                                                                                                                    )
                                                                                                                                                                                                                                                  ) {
                                                                                                                                                                                                                                                    openThumbs(
                                                                                                                                                                                                                                                      e.nativeEvent
                                                                                                                                                                                                                                                    );
                                                                                                                                                                                                                                                  } else if (
                                                                                                                                                                                                                                                    (
                                                                                                                                                                                                                                                      e.target as HTMLElement | null
                                                                                                                                                                                                                                                    )?.closest(
                                                                                                                                                                                                                                                      ".details-gallery__thumbs, .details-gallery__image:not(:first-child)"
                                                                                                                                                                                                                                                    )
                                                                                                                                                                                                                                                  ) {
                                                                                                                                                                                                                                                    openGallery(
                                                                                                                                                                                                                                                      e.nativeEvent
                                                                                                                                                                                                                                                    );
                                                                                                                                                                                                                                                  } else if (
                                                                                                                                                                                                                                                    (
                                                                                                                                                                                                                                                      e.target as HTMLElement | null
                                                                                                                                                                                                                                                    )?.closest(
                                                                                                                                                                                                                                                      ".details-product-price-compare__container"
                                                                                                                                                                                                                                                    )
                                                                                                                                                                                                                                                  ) {
                                                                                                                                                                                                                                                    openWholesalePrice(
                                                                                                                                                                                                                                                      e.nativeEvent
                                                                                                                                                                                                                                                    );
                                                                                                                                                                                                                                                  } else if (
                                                                                                                                                                                                                                                    (
                                                                                                                                                                                                                                                      e.target as HTMLElement | null
                                                                                                                                                                                                                                                    )?.closest(
                                                                                                                                                                                                                                                      ".product-details__product-price-wholesale-note"
                                                                                                                                                                                                                                                    )
                                                                                                                                                                                                                                                  ) {
                                                                                                                                                                                                                                                    openWholesaleNote(
                                                                                                                                                                                                                                                      e.nativeEvent
                                                                                                                                                                                                                                                    );
                                                                                                                                                                                                                                                  } else if (
                                                                                                                                                                                                                                                    (
                                                                                                                                                                                                                                                      e.target as HTMLElement | null
                                                                                                                                                                                                                                                    )?.closest(
                                                                                                                                                                                                                                                      ".product-details__label-container .ec-label"
                                                                                                                                                                                                                                                    )
                                                                                                                                                                                                                                                  ) {
                                                                                                                                                                                                                                                    openFlagLabel(
                                                                                                                                                                                                                                                      e.nativeEvent
                                                                                                                                                                                                                                                    );
                                                                                                                                                                                                                                                  } else if (
                                                                                                                                                                                                                                                    (
                                                                                                                                                                                                                                                      e.target as HTMLElement | null
                                                                                                                                                                                                                                                    )?.closest(
                                                                                                                                                                                                                                                      ".product-details-module.product-details__subtitle .product-details-module__content"
                                                                                                                                                                                                                                                    )
                                                                                                                                                                                                                                                  ) {
                                                                                                                                                                                                                                                    openSubtitles(
                                                                                                                                                                                                                                                      e.nativeEvent
                                                                                                                                                                                                                                                    );
                                                                                                                                                                                                                                                  } else if (
                                                                                                                                                                                                                                                    (
                                                                                                                                                                                                                                                      e.target as HTMLElement | null
                                                                                                                                                                                                                                                    )?.closest(
                                                                                                                                                                                                                                                      ".product-details-module.product-details__product-like.favorite-product .product-details-module__title.ec-header-h6.favorite-product__title"
                                                                                                                                                                                                                                                    )
                                                                                                                                                                                                                                                  ) {
                                                                                                                                                                                                                                                    openTitle2(
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
                                                                                                                                                                                                                                                className="brz-ecwid-product"
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
    const config = Config.getAll() as Cloud;
    const defaultProductId = config.modules?.shop?.defaultProductId;

    const className = classnames(
      "brz-ecwid-wrapper",
      "brz-ecwid-product-wrapper",
      css(`${this.getComponentId()}`, `${this.getId()}`, style(v, vs, vd))
    );

    return (
      <Wrapper {...this.makeWrapperProps({ className })}>
        <div
          className="brz-ecwid-product"
          data-product-id="{{brizy_dc_post_id}}"
          data-default-product-id={defaultProductId}
          data-store-id="{{ecwid_store_id}}"
          data-storefront={encodeURIComponent(
            JSON.stringify(valueToEciwdConfig(v))
          )}
        />
      </Wrapper>
    );
  }
}
