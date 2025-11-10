import { uniqueId } from "es-toolkit/compat";
import React, { ReactNode, createRef } from "react";
import CustomCSS from "visual/component/CustomCSS";
import Toolbar from "visual/component/Toolbar";
import EditorComponent, {
  Props
} from "visual/editorComponents/EditorComponent";
import { Wrapper } from "visual/editorComponents/tools/Wrapper";
import { isCloud } from "visual/global/Config/types/configs/Cloud";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { EcwidService } from "visual/libs/Ecwid";
import { eq } from "visual/libs/Ecwid/types/EcwidConfig";
import { isView } from "visual/providers/RenderProvider";
import { makePlaceholder } from "visual/utils/dynamicContent";
import { getEcwidShopPathPlaceholder } from "visual/utils/ecwid";
import { makeAttr } from "visual/utils/i18n/attribute";
import { attachRefs } from "visual/utils/react";
import { encodeToString } from "visual/utils/string";
import { MValue } from "visual/utils/value";
import * as sidebarExtendParent from "../sidebar";
import * as sidebarButton from "../sidebarButton";
import * as sidebarDisable from "../sidebarDisable";
import * as sidebarImage from "../sidebarImage";
import * as sidebarInput from "../sidebarInput";
import * as toolbarConnectLink from "../toolbarConnectLink";
import { ecwidToolbarFooter } from "../toolbarFooter";
import * as toolbarSKU from "../toolbarSKU";
import { ecwidToolbarTitle } from "../toolbarTitle";
import { ecwidToolbarTitle2 } from "../toolbarTitle2";
import defaultValue from "./defaultValue.json";
import * as sidebarCheckoutInputs from "./sidebarCheckoutInputs";
import * as sidebarCheckoutPayments from "./sidebarCheckoutPayments";
import * as sidebarClose from "./sidebarClose";
import * as sidebarCollapsedImage from "./sidebarCollapsedImage";
import * as sidebarGrid from "./sidebarGrid";
import * as sidebarInputs from "./sidebarInputs";
import { style } from "./styles";
import * as toolbarExtendParent from "./toolbar";
import * as toolbarButton from "./toolbarButton";
import * as toolbarCheckbox from "./toolbarCheckbox";
import * as toolbarCheckboxLink from "./toolbarCheckboxLink";
import * as toolbarCheckoutEmail from "./toolbarCheckoutEmail";
import * as toolbarCheckoutFieldsSubtitle from "./toolbarCheckoutFieldsSubtitle";
import * as toolbarCheckoutFieldsTitle from "./toolbarCheckoutFieldsTitle";
import * as toolbarCheckoutInputs from "./toolbarCheckoutInputs";
import * as toolbarCheckoutPayments from "./toolbarCheckoutPayments";
import * as toolbarCheckoutShipping from "./toolbarCheckoutShipping";
import * as toolbarCheckoutShippingPrice from "./toolbarCheckoutShippingPrice";
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
import * as toolbarInputs from "./toolbarInputs";
import * as toolbarNext from "./toolbarNext";
import * as toolbarPayment from "./toolbarPayment";
import * as toolbarPrice from "./toolbarPrice";
import * as toolbarProductName from "./toolbarProductName";
import * as toolbarProductSize from "./toolbarProductSize";
import * as toolbarQty from "./toolbarQty";
import * as toolbarRadio from "./toolbarRadio";
import * as toolbarSubtitles from "./toolbarSubtitles";
import * as toolbarSubtotalPrice from "./toolbarSubtotalPrice";
import * as toolbarSubtotalTitle from "./toolbarSubtotalTitle";
import * as toolbarSummaryNote from "./toolbarSummaryNote";
import * as toolbarSummaryPrice from "./toolbarSummaryPrice";
import * as toolbarSummaryTitle from "./toolbarSummaryTitle";
import * as toolbarTaxesPrice from "./toolbarTaxesPrice";
import * as toolbarTaxesTitle from "./toolbarTaxesTitle";
import * as toolbarTotalProductsCount from "./toolbarTotalProductsCount";
import { EcwidCartCheckoutStep, Value } from "./types/Value";
import { valueToEciwdConfig } from "./utils";

export class EcwidCart extends EditorComponent<Value> {
  static defaultValue = defaultValue;
  initialStep: MValue<EcwidCartCheckoutStep>;
  private ecwid: EcwidService | undefined;

  private uniqueId = `${EcwidCart.componentId}-${uniqueId()}`;

  private containerRef = createRef<HTMLDivElement>();

  static get componentId(): ElementTypes.EcwidCart {
    return ElementTypes.EcwidCart;
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
      const v = this.getValue();
      const cnf = valueToEciwdConfig(v);
      const { step, prefilledCart } = v;

      const { locale: langLocale = "" } = config;
      const { storeId } = config.modules.shop;

      this.ecwid = EcwidService.init(storeId, {
        ...cnf,
        prefetchScripts: true,
        langLocale
      });

      this.ecwid.cart(this.containerRef.current, step, {
        onPageLoad: () => {
          this.ecwid?.setAddress();
          this.ecwid?.setEmail({ email: "john.doe@example.com" });
          this.handleCartContent(prefilledCart);
        }
      });

      this.initialStep = step;
    }
  }

  componentDidUpdate(prevProps: Props<Value, Record<string, unknown>>): void {
    const v = this.getValue();
    const newConfig = valueToEciwdConfig(v);
    const oldConfig = this.ecwid?.getConfig();
    const {
      step: prevStep = this.initialStep,
      prefilledCart: prevPrefilledCart
    } = prevProps.dbValue;
    const { step, prefilledCart } = v;

    if (prevStep !== step && this.containerRef.current) {
      this?.ecwid?.cart(this.containerRef.current, step, {
        clearPrevious: true
      });
    }

    if (!oldConfig || !eq(oldConfig, newConfig)) {
      this.ecwid?.updateConfig(newConfig);
    }

    if (prevPrefilledCart !== prefilledCart) {
      this.handleCartContent(prefilledCart);
    }
  }

  handleCartContent(prefilledCart: "on" | "off") {
    const config = this.getGlobalConfig();

    const defaultProductId = config?.modules?.shop?.defaultProductId;

    if (defaultProductId) {
      switch (prefilledCart) {
        case "on":
          this.ecwid?.addToCart(defaultProductId);
          break;
        case "off":
          this.ecwid?.clearCart();
          break;
      }
    }
  }

  renderForEdit(v: Value): React.ReactNode {
    const { customCSS } = v;

    const className = this.getCSSClassnames({
      toolbars: [
        toolbarExtendParent,
        toolbarCheckboxLink,
        toolbarCheckoutEmail,
        toolbarCheckoutFieldsTitle,
        toolbarCheckoutFieldsSubtitle,
        toolbarCheckoutInputs,
        toolbarCheckoutPayments,
        toolbarCheckoutShipping,
        toolbarCheckoutShippingPrice,
        toolbarNext,
        toolbarInputs
      ],
      sidebars: [sidebarCheckoutInputs, sidebarCheckoutPayments, sidebarInputs],
      stylesFn: style,
      extraClassNames: ["brz-ecwid-wrapper", "brz-ecwid-cart-wrapper"]
    });

    return (
      <Toolbar
        {...this.makeToolbarPropsFromConfig2(
          toolbarCheckoutShipping,
          sidebarDisable
        )}
        selector=".ec-cart-summary__row.ec-cart-summary__row--shipping .ec-cart-summary__cell.ec-cart-summary__title"
        selectorSearchStrategy="dom-tree"
      >
        {({ open: openCheckoutShipping, ref: checkoutShippingRef }) => {
          return (
            <Toolbar
              {...this.makeToolbarPropsFromConfig2(
                toolbarCheckoutShippingPrice,
                sidebarDisable
              )}
              selector=".ec-cart-summary__row.ec-cart-summary__row--shipping .ec-cart-summary__price"
              selectorSearchStrategy="dom-tree"
            >
              {({
                open: openCheckoutShippingPrice,
                ref: checkoutShippingPriceRef
              }) => {
                return (
                  <Toolbar
                    {...this.makeToolbarPropsFromConfig2(
                      ecwidToolbarTitle(),
                      sidebarDisable
                    )}
                    selector=".ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-page-title .page-title__name, .ec-store .ec-store__content-wrapper .ec-page-title .page-title__name"
                    selectorSearchStrategy="dom-tree"
                  >
                    {({ open: openTitle, ref: titleRef }) => {
                      return (
                        <Toolbar
                          {...this.makeToolbarPropsFromConfig2(
                            ecwidToolbarTitle2(),
                            sidebarDisable
                          )}
                          selector=".ec-cart .ec-cart__body .ec-cart__body-inner .ec-page-title .page-title__name"
                          selectorSearchStrategy="dom-tree"
                        >
                          {({ open: openTitle2, ref: title2Ref }) => {
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
                                {({ open: openImage, ref: imageRef }) => {
                                  return (
                                    <Toolbar
                                      {...this.makeToolbarPropsFromConfig2(
                                        toolbarProductName,
                                        sidebarDisable
                                      )}
                                      selector="a.ec-cart-item__title"
                                      selectorSearchStrategy="dom-tree"
                                    >
                                      {({
                                        open: openProductName,
                                        ref: productNameRef
                                      }) => {
                                        return (
                                          <Toolbar
                                            {...this.makeToolbarPropsFromConfig2(
                                              toolbarProductSize,
                                              sidebarDisable
                                            )}
                                            selector=".ec-cart-item__options.ec-text-muted"
                                            selectorSearchStrategy="dom-tree"
                                          >
                                            {({
                                              open: openProductSize,
                                              ref: productSizeRef
                                            }) => {
                                              return (
                                                <Toolbar
                                                  {...this.makeToolbarPropsFromConfig2(
                                                    toolbarCheckoutEmail,
                                                    sidebarDisable
                                                  )}
                                                  selector=".ec-cart-step--email .ec-cart-step__icon, .ec-cart-step--address .ec-cart-step__icon, .ec-cart-step--delivery .ec-cart-step__icon"
                                                  selectorSearchStrategy="dom-tree"
                                                >
                                                  {({
                                                    open: openCheckoutEmail,
                                                    ref: checkoutEmailRef
                                                  }) => {
                                                    return (
                                                      <Toolbar
                                                        {...this.makeToolbarPropsFromConfig2(
                                                          toolbarCheckoutFieldsTitle,
                                                          sidebarDisable
                                                        )}
                                                        selector=".ec-cart-step--payment .ec-form__row .ec-form__title, .ec-cart-step--payment .ec-cart-step__section .ec-cart-step__subtitle, .ec-cart-step--address .ec-form__row .ec-form__title, .ec-cart-step--address .ec-cart-step__section .ec-cart-step__subtitle"
                                                        selectorSearchStrategy="dom-tree"
                                                      >
                                                        {({
                                                          open: openCheckoutFieldsTitle,
                                                          ref: checkoutFieldsTitleRef
                                                        }) => {
                                                          return (
                                                            <Toolbar
                                                              {...this.makeToolbarPropsFromConfig2(
                                                                toolbarCheckoutFieldsSubtitle,
                                                                sidebarDisable
                                                              )}
                                                              selector=".ec-cart-step--payment .ec-cart-step__body .ec-cart-step__mandatory-fields-notice"
                                                              selectorSearchStrategy="dom-tree"
                                                            >
                                                              {({
                                                                open: openCheckoutFieldsSubtitle,
                                                                ref: checkoutFieldsSubtitleRef
                                                              }) => {
                                                                return (
                                                                  <Toolbar
                                                                    {...this.makeToolbarPropsFromConfig2(
                                                                      toolbarCheckoutInputs,
                                                                      sidebarCheckoutInputs,
                                                                      {
                                                                        allowExtend:
                                                                          false
                                                                      }
                                                                    )}
                                                                    selector=".ec-cart-step--payment .ec-cart-step__body .ec-form .ec-form__row .form-control, .ec-cart-step--address .ec-cart-step__body .ec-form .ec-form__row .form-control"
                                                                    selectorSearchStrategy="dom-tree"
                                                                  >
                                                                    {({
                                                                      open: openCheckoutInputs,
                                                                      ref: checkoutInputsRef
                                                                    }) => {
                                                                      return (
                                                                        <Toolbar
                                                                          {...this.makeToolbarPropsFromConfig2(
                                                                            toolbarClose,
                                                                            sidebarClose
                                                                          )}
                                                                          selector=".ec-cart-item__control"
                                                                          selectorSearchStrategy="dom-tree"
                                                                        >
                                                                          {({
                                                                            open: openClose,
                                                                            ref: closeRef
                                                                          }) => {
                                                                            return (
                                                                              <Toolbar
                                                                                {...this.makeToolbarPropsFromConfig2(
                                                                                  toolbarSKU,
                                                                                  sidebarDisable
                                                                                )}
                                                                                selector=".ec-cart-item__sku.ec-text-muted"
                                                                                selectorSearchStrategy="dom-tree"
                                                                              >
                                                                                {({
                                                                                  open: openSKU,
                                                                                  ref: skuRef
                                                                                }) => {
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
                                                                                        open: openQty,
                                                                                        ref: qtyRef
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
                                                                                              open: openPrice,
                                                                                              ref: priceRef
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
                                                                                                    open: openSummaryTitle,
                                                                                                    ref: summaryTitleRef
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
                                                                                                          open: openSummaryPrice,
                                                                                                          ref: summaryPriceRef
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
                                                                                                                open: openSubtotalTitle,
                                                                                                                ref: subtotalTitleRef
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
                                                                                                                      open: openSubtotalPrice,
                                                                                                                      ref: subtotalPriceRef
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
                                                                                                                            open: openTaxesTitle,
                                                                                                                            ref: taxesTitleRef
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
                                                                                                                                  open: openTaxesPrice,
                                                                                                                                  ref: taxesPriceRef
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
                                                                                                                                        open: openSummaryNote,
                                                                                                                                        ref: summaryNoteRef
                                                                                                                                      }) => {
                                                                                                                                        return (
                                                                                                                                          <Toolbar
                                                                                                                                            {...this.makeToolbarPropsFromConfig2(
                                                                                                                                              toolbarConnectLink,
                                                                                                                                              sidebarDisable
                                                                                                                                            )}
                                                                                                                                            selector=".ec-cart-shopping__wrap, .ec-cart-step--done .ec-cart-step__block .ec-cart-step__wrap .ec-cart-step__body"
                                                                                                                                            selectorSearchStrategy="dom-tree"
                                                                                                                                          >
                                                                                                                                            {({
                                                                                                                                              open: openConnectLink,
                                                                                                                                              ref: connectLinkRef
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
                                                                                                                                                    open: openEmpty,
                                                                                                                                                    ref: emptyRef
                                                                                                                                                  }) => {
                                                                                                                                                    return (
                                                                                                                                                      <Toolbar
                                                                                                                                                        {...this.makeToolbarPropsFromConfig2(
                                                                                                                                                          toolbarEmail,
                                                                                                                                                          sidebarDisable
                                                                                                                                                        )}
                                                                                                                                                        selector=".ec-cart-email__text, .ec-cart-step__section p"
                                                                                                                                                        selectorSearchStrategy="dom-tree"
                                                                                                                                                      >
                                                                                                                                                        {({
                                                                                                                                                          open: openEmail,
                                                                                                                                                          ref: emailRef
                                                                                                                                                        }) => {
                                                                                                                                                          return (
                                                                                                                                                            <Toolbar
                                                                                                                                                              {...this.makeToolbarPropsFromConfig2(
                                                                                                                                                                toolbarCheckoutPayments,
                                                                                                                                                                sidebarCheckoutPayments,
                                                                                                                                                                {
                                                                                                                                                                  allowExtend:
                                                                                                                                                                    false
                                                                                                                                                                }
                                                                                                                                                              )}
                                                                                                                                                              selector=".ec-cart-step--payment .ec-cart-step__body .ec-radiogroup__items-inner .ec-radiogroup__item, .ec-cart-step--address .ec-cart-step__body  .ec-tabs .ec-tabs__tab, .ec-cart-step--delivery .ec-cart-step__body .ec-radiogroup .ec-radiogroup__items .ec-radiogroup__item"
                                                                                                                                                              selectorSearchStrategy="dom-tree"
                                                                                                                                                            >
                                                                                                                                                              {({
                                                                                                                                                                open: openCheckoutPayment,
                                                                                                                                                                ref: checkoutPaymentRef
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
                                                                                                                                                                      open: openCheckbox,
                                                                                                                                                                      ref: checkboxRef
                                                                                                                                                                    }) => {
                                                                                                                                                                      return (
                                                                                                                                                                        <Toolbar
                                                                                                                                                                          {...this.makeToolbarPropsFromConfig2(
                                                                                                                                                                            toolbarCheckboxLink,
                                                                                                                                                                            sidebarDisable
                                                                                                                                                                          )}
                                                                                                                                                                          selector=".form-control--checkbox .form-control__inline-label .ec-link"
                                                                                                                                                                          selectorSearchStrategy="dom-tree"
                                                                                                                                                                        >
                                                                                                                                                                          {({
                                                                                                                                                                            open: openCheckboxLink,
                                                                                                                                                                            ref: checkboxLinkRef
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
                                                                                                                                                                                  open: openButton,
                                                                                                                                                                                  ref: buttonRef
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
                                                                                                                                                                                        open: openSubtitles,
                                                                                                                                                                                        ref: subtitlesRef
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
                                                                                                                                                                                              open: openInput,
                                                                                                                                                                                              ref: inputRef
                                                                                                                                                                                            }) => {
                                                                                                                                                                                              return (
                                                                                                                                                                                                <Toolbar
                                                                                                                                                                                                  {...this.makeToolbarPropsFromConfig2(
                                                                                                                                                                                                    toolbarNext,
                                                                                                                                                                                                    sidebarDisable
                                                                                                                                                                                                  )}
                                                                                                                                                                                                  selector=".ec-cart-next__header.ec-header-h4, .ec-cart-step__next.ec-header-h5"
                                                                                                                                                                                                  selectorSearchStrategy="dom-tree"
                                                                                                                                                                                                >
                                                                                                                                                                                                  {({
                                                                                                                                                                                                    open: openNext,
                                                                                                                                                                                                    ref: nextRef
                                                                                                                                                                                                  }) => {
                                                                                                                                                                                                    return (
                                                                                                                                                                                                      <Toolbar
                                                                                                                                                                                                        {...this.makeToolbarPropsFromConfig2(
                                                                                                                                                                                                          toolbarPayment,
                                                                                                                                                                                                          sidebarDisable
                                                                                                                                                                                                        )}
                                                                                                                                                                                                        selector=".ec-cart-next__title, .ec-cart-step__title"
                                                                                                                                                                                                        selectorSearchStrategy="dom-tree"
                                                                                                                                                                                                      >
                                                                                                                                                                                                        {({
                                                                                                                                                                                                          open: openPayment,
                                                                                                                                                                                                          ref: paymentRef
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
                                                                                                                                                                                                                      open: openGrid,
                                                                                                                                                                                                                      ref: gridRef
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
                                                                                                                                                                                                                            open: openGridTitle,
                                                                                                                                                                                                                            ref: gridTitleRef
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
                                                                                                                                                                                                                                  open: openGridSubtitle,
                                                                                                                                                                                                                                  ref: gridSubtitleRef
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
                                                                                                                                                                                                                                        open: openGridSKUInner,
                                                                                                                                                                                                                                        ref: gridSKUInnerRef
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
                                                                                                                                                                                                                                              open: openGridPrice,
                                                                                                                                                                                                                                              ref: gridPriceRef
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
                                                                                                                                                                                                                                                    open: openTotalProductsCount,
                                                                                                                                                                                                                                                    ref: totalProductsCountRef
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
                                                                                                                                                                                                                                                          open: openCollapsedImage,
                                                                                                                                                                                                                                                          ref: collapsedImageRef
                                                                                                                                                                                                                                                        }) => {
                                                                                                                                                                                                                                                          return (
                                                                                                                                                                                                                                                            <Toolbar
                                                                                                                                                                                                                                                              {...this.makeToolbarPropsFromConfig2(
                                                                                                                                                                                                                                                                toolbarRadio,
                                                                                                                                                                                                                                                                sidebarDisable,
                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                  allowExtend:
                                                                                                                                                                                                                                                                    false
                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                              )}
                                                                                                                                                                                                                                                              selector=".form-control__radio-wrap .form-control__radio-view"
                                                                                                                                                                                                                                                              selectorSearchStrategy="dom-tree"
                                                                                                                                                                                                                                                            >
                                                                                                                                                                                                                                                              {({
                                                                                                                                                                                                                                                                open: openRadio,
                                                                                                                                                                                                                                                                ref: radioRef
                                                                                                                                                                                                                                                              }) => {
                                                                                                                                                                                                                                                                return (
                                                                                                                                                                                                                                                                  <Toolbar
                                                                                                                                                                                                                                                                    {...this.makeToolbarPropsFromConfig2(
                                                                                                                                                                                                                                                                      toolbarInputs,
                                                                                                                                                                                                                                                                      sidebarInputs,
                                                                                                                                                                                                                                                                      {
                                                                                                                                                                                                                                                                        allowExtend:
                                                                                                                                                                                                                                                                          false
                                                                                                                                                                                                                                                                      }
                                                                                                                                                                                                                                                                    )}
                                                                                                                                                                                                                                                                    selector=".form-control.form-control--datepicker"
                                                                                                                                                                                                                                                                    selectorSearchStrategy="dom-tree"
                                                                                                                                                                                                                                                                  >
                                                                                                                                                                                                                                                                    {({
                                                                                                                                                                                                                                                                      open: openInputs,
                                                                                                                                                                                                                                                                      ref: inputsRef
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
                                                                                                                                                                                                                                                                                  ) =>
                                                                                                                                                                                                                                                                                    attachRefs(
                                                                                                                                                                                                                                                                                      el,
                                                                                                                                                                                                                                                                                      [
                                                                                                                                                                                                                                                                                        titleRef,
                                                                                                                                                                                                                                                                                        title2Ref,
                                                                                                                                                                                                                                                                                        imageRef,
                                                                                                                                                                                                                                                                                        productNameRef,
                                                                                                                                                                                                                                                                                        productSizeRef,
                                                                                                                                                                                                                                                                                        checkoutEmailRef,
                                                                                                                                                                                                                                                                                        checkoutFieldsTitleRef,
                                                                                                                                                                                                                                                                                        checkoutFieldsSubtitleRef,
                                                                                                                                                                                                                                                                                        checkoutInputsRef,
                                                                                                                                                                                                                                                                                        closeRef,
                                                                                                                                                                                                                                                                                        skuRef,
                                                                                                                                                                                                                                                                                        qtyRef,
                                                                                                                                                                                                                                                                                        priceRef,
                                                                                                                                                                                                                                                                                        summaryTitleRef,
                                                                                                                                                                                                                                                                                        summaryPriceRef,
                                                                                                                                                                                                                                                                                        subtotalTitleRef,
                                                                                                                                                                                                                                                                                        subtotalPriceRef,
                                                                                                                                                                                                                                                                                        taxesTitleRef,
                                                                                                                                                                                                                                                                                        taxesPriceRef,
                                                                                                                                                                                                                                                                                        summaryNoteRef,
                                                                                                                                                                                                                                                                                        connectLinkRef,
                                                                                                                                                                                                                                                                                        emptyRef,
                                                                                                                                                                                                                                                                                        emailRef,
                                                                                                                                                                                                                                                                                        checkoutPaymentRef,
                                                                                                                                                                                                                                                                                        checkboxRef,
                                                                                                                                                                                                                                                                                        checkboxLinkRef,
                                                                                                                                                                                                                                                                                        buttonRef,
                                                                                                                                                                                                                                                                                        inputsRef,
                                                                                                                                                                                                                                                                                        subtitlesRef,
                                                                                                                                                                                                                                                                                        inputRef,
                                                                                                                                                                                                                                                                                        nextRef,
                                                                                                                                                                                                                                                                                        paymentRef,
                                                                                                                                                                                                                                                                                        footerRef,
                                                                                                                                                                                                                                                                                        gridRef,
                                                                                                                                                                                                                                                                                        gridTitleRef,
                                                                                                                                                                                                                                                                                        gridSubtitleRef,
                                                                                                                                                                                                                                                                                        gridSKUInnerRef,
                                                                                                                                                                                                                                                                                        gridPriceRef,
                                                                                                                                                                                                                                                                                        totalProductsCountRef,
                                                                                                                                                                                                                                                                                        collapsedImageRef,
                                                                                                                                                                                                                                                                                        checkoutShippingRef,
                                                                                                                                                                                                                                                                                        checkoutShippingPriceRef,
                                                                                                                                                                                                                                                                                        cssRef,
                                                                                                                                                                                                                                                                                        radioRef
                                                                                                                                                                                                                                                                                      ]
                                                                                                                                                                                                                                                                                    )
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
                                                                                                                                                                                                                                                                                      ".ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-page-title .page-title__name"
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
                                                                                                                                                                                                                                                                                    ) ||
                                                                                                                                                                                                                                                                                    (
                                                                                                                                                                                                                                                                                      e.target as HTMLElement | null
                                                                                                                                                                                                                                                                                    )?.closest(
                                                                                                                                                                                                                                                                                      ".ec-cart-step--done .ec-cart-step__block .ec-cart-step__wrap .ec-cart-step__body"
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
                                                                                                                                                                                                                                                                                    ) ||
                                                                                                                                                                                                                                                                                    (
                                                                                                                                                                                                                                                                                      e.target as HTMLElement | null
                                                                                                                                                                                                                                                                                    )?.closest(
                                                                                                                                                                                                                                                                                      ".ec-cart-step__section p"
                                                                                                                                                                                                                                                                                    )
                                                                                                                                                                                                                                                                                  ) {
                                                                                                                                                                                                                                                                                    openEmail(
                                                                                                                                                                                                                                                                                      e.nativeEvent
                                                                                                                                                                                                                                                                                    );
                                                                                                                                                                                                                                                                                  } else if (
                                                                                                                                                                                                                                                                                    (
                                                                                                                                                                                                                                                                                      e.target as HTMLElement | null
                                                                                                                                                                                                                                                                                    )?.closest(
                                                                                                                                                                                                                                                                                      ".form-control--checkbox .form-control__inline-label .ec-link"
                                                                                                                                                                                                                                                                                    )
                                                                                                                                                                                                                                                                                  ) {
                                                                                                                                                                                                                                                                                    openCheckboxLink(
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
                                                                                                                                                                                                                                                                                      ".form-control__radio-wrap .form-control__radio-view"
                                                                                                                                                                                                                                                                                    )
                                                                                                                                                                                                                                                                                  ) {
                                                                                                                                                                                                                                                                                    openRadio(
                                                                                                                                                                                                                                                                                      e.nativeEvent
                                                                                                                                                                                                                                                                                    );
                                                                                                                                                                                                                                                                                  } else if (
                                                                                                                                                                                                                                                                                    (
                                                                                                                                                                                                                                                                                      e.target as HTMLElement | null
                                                                                                                                                                                                                                                                                    )?.closest(
                                                                                                                                                                                                                                                                                      ".ec-cart-next__header.ec-header-h4"
                                                                                                                                                                                                                                                                                    ) ||
                                                                                                                                                                                                                                                                                    (
                                                                                                                                                                                                                                                                                      e.target as HTMLElement | null
                                                                                                                                                                                                                                                                                    )?.closest(
                                                                                                                                                                                                                                                                                      ".ec-cart-step__next.ec-header-h5"
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
                                                                                                                                                                                                                                                                                    ) ||
                                                                                                                                                                                                                                                                                    (
                                                                                                                                                                                                                                                                                      e.target as HTMLElement | null
                                                                                                                                                                                                                                                                                    )?.closest(
                                                                                                                                                                                                                                                                                      ".ec-cart-step__title"
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
                                                                                                                                                                                                                                                                                  } else if (
                                                                                                                                                                                                                                                                                    (
                                                                                                                                                                                                                                                                                      e.target as HTMLElement | null
                                                                                                                                                                                                                                                                                    )?.closest(
                                                                                                                                                                                                                                                                                      ".ec-cart-step--email .ec-cart-step__icon"
                                                                                                                                                                                                                                                                                    ) ||
                                                                                                                                                                                                                                                                                    (
                                                                                                                                                                                                                                                                                      e.target as HTMLElement | null
                                                                                                                                                                                                                                                                                    )?.closest(
                                                                                                                                                                                                                                                                                      ".ec-cart-step--address .ec-cart-step__icon"
                                                                                                                                                                                                                                                                                    ) ||
                                                                                                                                                                                                                                                                                    (
                                                                                                                                                                                                                                                                                      e.target as HTMLElement | null
                                                                                                                                                                                                                                                                                    )?.closest(
                                                                                                                                                                                                                                                                                      ".ec-cart-step--delivery .ec-cart-step__icon"
                                                                                                                                                                                                                                                                                    )
                                                                                                                                                                                                                                                                                  ) {
                                                                                                                                                                                                                                                                                    openCheckoutEmail(
                                                                                                                                                                                                                                                                                      e.nativeEvent
                                                                                                                                                                                                                                                                                    );
                                                                                                                                                                                                                                                                                  } else if (
                                                                                                                                                                                                                                                                                    (
                                                                                                                                                                                                                                                                                      e.target as HTMLElement | null
                                                                                                                                                                                                                                                                                    )?.closest(
                                                                                                                                                                                                                                                                                      ".ec-cart-step--payment .ec-form__row .ec-form__title"
                                                                                                                                                                                                                                                                                    ) ||
                                                                                                                                                                                                                                                                                    (
                                                                                                                                                                                                                                                                                      e.target as HTMLElement | null
                                                                                                                                                                                                                                                                                    )?.closest(
                                                                                                                                                                                                                                                                                      ".ec-cart-step--payment .ec-cart-step__section .ec-cart-step__subtitle"
                                                                                                                                                                                                                                                                                    ) ||
                                                                                                                                                                                                                                                                                    (
                                                                                                                                                                                                                                                                                      e.target as HTMLElement | null
                                                                                                                                                                                                                                                                                    )?.closest(
                                                                                                                                                                                                                                                                                      ".ec-cart-step--address .ec-form__row .ec-form__title"
                                                                                                                                                                                                                                                                                    ) ||
                                                                                                                                                                                                                                                                                    (
                                                                                                                                                                                                                                                                                      e.target as HTMLElement | null
                                                                                                                                                                                                                                                                                    )?.closest(
                                                                                                                                                                                                                                                                                      ".ec-cart-step--address .ec-cart-step__section .ec-cart-step__subtitle"
                                                                                                                                                                                                                                                                                    )
                                                                                                                                                                                                                                                                                  ) {
                                                                                                                                                                                                                                                                                    openCheckoutFieldsTitle(
                                                                                                                                                                                                                                                                                      e.nativeEvent
                                                                                                                                                                                                                                                                                    );
                                                                                                                                                                                                                                                                                  } else if (
                                                                                                                                                                                                                                                                                    (
                                                                                                                                                                                                                                                                                      e.target as HTMLElement | null
                                                                                                                                                                                                                                                                                    )?.closest(
                                                                                                                                                                                                                                                                                      ".ec-cart-step--payment .ec-cart-step__body .ec-cart-step__mandatory-fields-notice"
                                                                                                                                                                                                                                                                                    )
                                                                                                                                                                                                                                                                                  ) {
                                                                                                                                                                                                                                                                                    openCheckoutFieldsSubtitle(
                                                                                                                                                                                                                                                                                      e.nativeEvent
                                                                                                                                                                                                                                                                                    );
                                                                                                                                                                                                                                                                                  } else if (
                                                                                                                                                                                                                                                                                    (
                                                                                                                                                                                                                                                                                      e.target as HTMLElement | null
                                                                                                                                                                                                                                                                                    )?.closest(
                                                                                                                                                                                                                                                                                      ".ec-cart-step--payment .ec-cart-step__body .ec-form .ec-form__row .form-control"
                                                                                                                                                                                                                                                                                    ) ||
                                                                                                                                                                                                                                                                                    (
                                                                                                                                                                                                                                                                                      e.target as HTMLElement | null
                                                                                                                                                                                                                                                                                    )?.closest(
                                                                                                                                                                                                                                                                                      ".ec-cart-step--address .ec-cart-step__body .ec-form .ec-form__row .form-control"
                                                                                                                                                                                                                                                                                    )
                                                                                                                                                                                                                                                                                  ) {
                                                                                                                                                                                                                                                                                    openCheckoutInputs(
                                                                                                                                                                                                                                                                                      e.nativeEvent
                                                                                                                                                                                                                                                                                    );
                                                                                                                                                                                                                                                                                  } else if (
                                                                                                                                                                                                                                                                                    (
                                                                                                                                                                                                                                                                                      e.target as HTMLElement | null
                                                                                                                                                                                                                                                                                    )?.closest(
                                                                                                                                                                                                                                                                                      ".ec-cart-step--payment .ec-cart-step__body .ec-radiogroup__items-inner .ec-radiogroup__item"
                                                                                                                                                                                                                                                                                    ) ||
                                                                                                                                                                                                                                                                                    (
                                                                                                                                                                                                                                                                                      e.target as HTMLElement | null
                                                                                                                                                                                                                                                                                    )?.closest(
                                                                                                                                                                                                                                                                                      ".ec-cart-step--address .ec-cart-step__body  .ec-tabs .ec-tabs__tab"
                                                                                                                                                                                                                                                                                    ) ||
                                                                                                                                                                                                                                                                                    (
                                                                                                                                                                                                                                                                                      e.target as HTMLElement | null
                                                                                                                                                                                                                                                                                    )?.closest(
                                                                                                                                                                                                                                                                                      ".ec-cart-step--delivery .ec-cart-step__body .ec-radiogroup .ec-radiogroup__items .ec-radiogroup__item"
                                                                                                                                                                                                                                                                                    )
                                                                                                                                                                                                                                                                                  ) {
                                                                                                                                                                                                                                                                                    openCheckoutPayment(
                                                                                                                                                                                                                                                                                      e.nativeEvent
                                                                                                                                                                                                                                                                                    );
                                                                                                                                                                                                                                                                                  } else if (
                                                                                                                                                                                                                                                                                    (
                                                                                                                                                                                                                                                                                      e.target as HTMLElement | null
                                                                                                                                                                                                                                                                                    )?.closest(
                                                                                                                                                                                                                                                                                      ".ec-cart-summary__row.ec-cart-summary__row--shipping .ec-cart-summary__cell.ec-cart-summary__title"
                                                                                                                                                                                                                                                                                    )
                                                                                                                                                                                                                                                                                  ) {
                                                                                                                                                                                                                                                                                    openCheckoutShipping(
                                                                                                                                                                                                                                                                                      e.nativeEvent
                                                                                                                                                                                                                                                                                    );
                                                                                                                                                                                                                                                                                  } else if (
                                                                                                                                                                                                                                                                                    (
                                                                                                                                                                                                                                                                                      e.target as HTMLElement | null
                                                                                                                                                                                                                                                                                    )?.closest(
                                                                                                                                                                                                                                                                                      ".ec-cart-summary__row.ec-cart-summary__row--shipping .ec-cart-summary__price"
                                                                                                                                                                                                                                                                                    )
                                                                                                                                                                                                                                                                                  ) {
                                                                                                                                                                                                                                                                                    openCheckoutShippingPrice(
                                                                                                                                                                                                                                                                                      e.nativeEvent
                                                                                                                                                                                                                                                                                    );
                                                                                                                                                                                                                                                                                  } else if (
                                                                                                                                                                                                                                                                                    (
                                                                                                                                                                                                                                                                                      e.target as HTMLElement | null
                                                                                                                                                                                                                                                                                    )?.closest(
                                                                                                                                                                                                                                                                                      ".form-control.form-control--datepicker"
                                                                                                                                                                                                                                                                                    )
                                                                                                                                                                                                                                                                                  ) {
                                                                                                                                                                                                                                                                                    openInputs(
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

  renderForView(v: Value): ReactNode {
    const cnf = valueToEciwdConfig(v);

    const className = this.getCSSClassnames({
      toolbars: [
        toolbarExtendParent,
        toolbarCheckboxLink,
        toolbarCheckoutEmail,
        toolbarCheckoutFieldsTitle,
        toolbarCheckoutFieldsSubtitle,
        toolbarCheckoutInputs,
        toolbarCheckoutPayments,
        toolbarCheckoutShipping,
        toolbarCheckoutShippingPrice,
        toolbarNext,
        toolbarInputs
      ],
      sidebars: [sidebarCheckoutInputs, sidebarCheckoutPayments, sidebarInputs],
      stylesFn: style,
      extraClassNames: ["brz-ecwid-wrapper", "brz-ecwid-cart-wrapper"]
    });

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
      <Wrapper {...this.makeWrapperProps({ className })}>
        <div
          className="brz-ecwid-cart"
          data-store-id={storeId}
          data-storefront={encodeToString(cnf)}
          {...attr}
        />
      </Wrapper>
    );
  }
}
