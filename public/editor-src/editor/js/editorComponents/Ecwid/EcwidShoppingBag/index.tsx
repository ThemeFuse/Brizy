import classNames from "classnames";
import { uniqueId } from "es-toolkit/compat";
import React, { ReactNode } from "react";
import BoxResizer from "visual/component/BoxResizer";
import CustomCSS from "visual/component/CustomCSS";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { Patch } from "visual/editorComponents/Icon/types";
import {
  resizerPoints,
  resizerTransformPatch
} from "visual/editorComponents/Icon/utils";
import { Wrapper } from "visual/editorComponents/tools/Wrapper";
import { isCloud } from "visual/global/Config/types/configs/Cloud";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { EcwidService } from "visual/libs/Ecwid";
import { isView } from "visual/providers/RenderProvider";
import { makePlaceholder } from "visual/utils/dynamicContent";
import { defaultValueKey } from "visual/utils/onChange";
import { attachRefs } from "visual/utils/react";
import defaultValue from "./defaultValue.json";
import * as sidebarParent from "./sidebar";
import * as sidebarIcon from "./sidebarIcon";
import { style } from "./styles";
import * as toolbarParent from "./toolbar";
import * as toolbarIcon from "./toolbarIcon";
import { Value } from "./types/Value";
import { resizerRestrictions, resizerTransformValue } from "./utils";

export class EcwidShoppingBag extends EditorComponent<Value> {
  static defaultValue = defaultValue;
  private uniqueId = `${EcwidShoppingBag.componentId}-${uniqueId()}`;

  static get componentId(): ElementTypes.EcwidShoppingBag {
    return ElementTypes.EcwidShoppingBag;
  }

  handleResizerChange = (patch: Patch): void => {
    const device = this.getDeviceMode();
    const sizeKey = defaultValueKey({ key: "size", device, state: "normal" });

    this.patchValue({
      ...resizerTransformPatch(patch),
      [sizeKey]: "custom"
    });
  };

  componentDidMount(): void {
    if (isView(this.props.renderContext)) {
      return;
    }

    const config = this.getGlobalConfig();

    if (isCloud(config) && config.modules?.shop?.type === "ecwid") {
      EcwidService.init(config.modules.shop.storeId, {}).shoppingCart();
    }
  }

  renderForEdit(v: Value, vs: Value, vd: Value): React.ReactNode {
    const { customCSS } = v;

    const className = classNames(
      "brz-ecwid-wrapper",
      "brz-ecwid-shopping-bag-wrapper",
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
        {...this.makeToolbarPropsFromConfig2(toolbarParent, sidebarParent)}
      >
        {({ open: openBag, ref: bagRef }) => {
          return (
            <Toolbar
              {...this.makeToolbarPropsFromConfig2(toolbarIcon, sidebarIcon)}
              selector=".brz-ecwid-shopping-bag-wrapper .ec-minicart__counter"
            >
              {({ open: openCounter, ref: counterRef }) => {
                return (
                  <CustomCSS selectorName={this.getId()} css={customCSS}>
                    {({ ref: cssRef }) => (
                      <Wrapper
                        {...this.makeWrapperProps({
                          className,
                          ref: (el) => {
                            attachRefs(el, [bagRef, counterRef, cssRef]);
                          }
                        })}
                      >
                        <BoxResizer
                          keepAspectRatio
                          points={resizerPoints}
                          restrictions={resizerRestrictions}
                          value={resizerTransformValue(v)}
                          onChange={this.handleResizerChange}
                        >
                          <div
                            onClickCapture={(e) => {
                              e.stopPropagation();
                              e.preventDefault();

                              if (
                                (e.target as HTMLElement | null)?.closest(
                                  ".brz-ecwid-shopping-bag-wrapper .ec-minicart__icon"
                                )
                              ) {
                                openBag(e.nativeEvent);
                              } else if (
                                (e.target as HTMLElement | null)?.closest(
                                  ".brz-ecwid-shopping-bag-wrapper .ec-minicart__counter"
                                )
                              ) {
                                openCounter(e.nativeEvent);
                              }

                              return false;
                            }}
                            className={classNames(
                              "ec-cart-widget",
                              "brz-ecwid-shopping-bag"
                            )}
                            id={this.uniqueId}
                          />
                        </BoxResizer>
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
  }

  renderForView(v: Value, vs: Value, vd: Value): ReactNode {
    const className = classNames(
      "brz-ecwid-wrapper",
      "brz-ecwid-shopping-bag-wrapper",
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
          className={classNames("ec-cart-widget", "brz-ecwid-shopping-bag")}
          data-store-id={storeId}
        />
      </Wrapper>
    );
  }
}
