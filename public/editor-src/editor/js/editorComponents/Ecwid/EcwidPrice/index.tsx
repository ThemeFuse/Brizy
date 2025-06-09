import { Content } from "@brizy/widget/src/Shopify/Price/Content";
import React, { JSX } from "react";
import CustomCSS from "visual/component/CustomCSS";
import { HoverAnimation } from "visual/component/HoverAnimation/HoverAnimation";
import { getHoverAnimationOptions } from "visual/component/HoverAnimation/utils";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { Wrapper } from "visual/editorComponents/tools/Wrapper";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { deviceModeSelector } from "visual/redux/selectors";
import { defaultValueValue } from "visual/utils/onChange";
import { makeOptionValueToAnimation } from "visual/utils/options/utils/makeValueToOptions";
import { attachRefs } from "visual/utils/react";
import * as State from "visual/utils/stateMode";
import * as Str from "visual/utils/string/specs";
import defaultValue from "./defaultValue.json";
import * as sidebarExtendDiscountPrice from "./sidebarDiscountPrice";
import * as sidebarExtendPrice from "./sidebarPrice";
import * as toolbarExtendDiscountPrice from "./toolbarDiscountPrice";
import * as toolbarExtendPrice from "./toolbarPrice";
import { Value } from "./types";

export class EcwidPrice extends EditorComponent<Value> {
  static defaultValue = defaultValue;
  static experimentalDynamicContent = true;

  static get componentId(): ElementTypes.EcwidPrice {
    return ElementTypes.EcwidPrice;
  }

  dvv = (key: string) => {
    const v = this.getValue();
    const device = deviceModeSelector(this.getReduxState());

    const state = State.mRead(v.tabsState);

    return defaultValueValue({ v, key, device, state });
  };

  renderForEdit(v: Value): JSX.Element {
    const { priceStyle, entityId: _entityId, customCSS } = v;

    const config = this.getGlobalConfig();

    const isContextAuto = _entityId === "auto";
    const entityType = isContextAuto
      ? undefined
      : config.modules?.shop?.ecwidProductTypeId;
    const entityId = isContextAuto ? undefined : _entityId;

    const toolbarPriceSelector =
      ".brz-ecwid-price-container .brz-shortcode__placeholder, .brz-ecwid-price-container .brz-ecwid-price-style1";
    const store = this.getReduxStore();
    const options = makeOptionValueToAnimation({ v, store });
    const hoverName = Str.read(this.dvv("hoverName")) ?? "none";
    const { cloneableAnimationId } = this.props.meta;
    const animationId = Str.read(cloneableAnimationId) ?? this.getId();

    const className = this.getCSSClassnames({
      toolbars: [toolbarExtendPrice, toolbarExtendDiscountPrice],
      sidebars: [sidebarExtendPrice, sidebarExtendDiscountPrice],
      extraClassNames: ["brz-ecwid-price-container"]
    });

    return (
      <Toolbar
        {...this.makeToolbarPropsFromConfig2(
          toolbarExtendPrice,
          sidebarExtendPrice
        )}
        selector={toolbarPriceSelector}
      >
        {({ ref: toolbarPriceRef }) => (
          <Toolbar
            {...this.makeToolbarPropsFromConfig2(
              toolbarExtendDiscountPrice,
              sidebarExtendDiscountPrice
            )}
            selector=".brz-ecwid-price-container .brz-ecwid-price-style2"
          >
            {({ ref: toolbarDiscountPriceRef }) => (
              <CustomCSS selectorName={this.getId()} css={customCSS}>
                {({ ref: customCssRef }) => (
                  <Wrapper
                    {...this.makeWrapperProps({
                      className,
                      ref: (el) => {
                        attachRefs(el, [
                          toolbarPriceRef,
                          toolbarDiscountPriceRef,
                          customCssRef
                        ]);
                      }
                    })}
                  >
                    <HoverAnimation
                      animationId={animationId}
                      cssKeyframe={hoverName}
                      options={getHoverAnimationOptions(options, hoverName)}
                      isHidden={hoverName === "none"}
                      target={"parent"}
                    >
                      <Content
                        style={priceStyle}
                        priceClass="brz-ecwid-price-style1"
                        compareAtPriceClass="brz-ecwid-price-style2"
                        pricePlaceholder="{{brizy_dc_collection_item_field slug='ecwid-product/defaultDisplayedPriceFormatted'}}"
                        compareAtPricePlaceholder="{{brizy_dc_collection_item_field slug='ecwid-product/compareToPriceFormatted'}}"
                        entityId={entityId}
                        entityType={entityType}
                      />
                    </HoverAnimation>
                  </Wrapper>
                )}
              </CustomCSS>
            )}
          </Toolbar>
        )}
      </Toolbar>
    );
  }
}
