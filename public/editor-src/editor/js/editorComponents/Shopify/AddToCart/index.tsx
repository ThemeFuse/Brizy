import classnames from "classnames";
import React, { ReactNode } from "react";
import { isView } from "visual/providers/RenderProvider";
import { Text } from "visual/component/ContentOptions/types";
import CustomCSS from "visual/component/CustomCSS";
import { ElementModel } from "visual/component/Elements/Types";
import { ThemeIcon } from "visual/component/ThemeIcon";
import PortalToolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { makePlaceholder } from "visual/utils/dynamicContent";
import { makeDataAttr } from "visual/utils/i18n/attribute";
import * as Str from "visual/utils/reader/string";
import { Wrapper } from "../../tools/Wrapper";
import defaultValue from "./defaultValue.json";
import * as sidebar from "./sidebar";
import { style } from "./styles";
import * as toolbar from "./toolbar";

export interface Value extends ElementModel {
  iconName: string;
  iconType: string;
  iconFilename?: string;
  itemId: string;
}

export class AddToCart extends EditorComponent<Value> {
  static get componentId(): "AddToCart" {
    return "AddToCart";
  }

  static defaultValue = defaultValue;

  handleTextChange = (patch: { [k: string]: string }): void =>
    this.patchValue(patch);

  renderIcon(v: Value): ReactNode {
    const { iconName, iconType, iconFilename } = v;

    if (iconName && iconType) {
      return (
        <ThemeIcon
          className="brz-shopify-icon-cart"
          name={iconName}
          type={iconType}
          filename={iconFilename}
        />
      );
    }
  }

  renderForEdit(v: Value, vs: Value, vd: Value): ReactNode {
    const { itemId, customCSS } = v;

    const className = classnames(
      "brz-shopify-add-to-cart",
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

    const _itemId =
      Str.read(itemId) ||
      makePlaceholder({
        content: "{{ brizy_dc_collection_item_field }}",
        attr: { slug: "id" }
      });

    const _variantId = makePlaceholder({
      content: "{{ brizy_dc_collection_item_field }}",
      attr: { slug: "variants.id" }
    });

    return (
      <PortalToolbar {...this.makeToolbarPropsFromConfig2(toolbar, sidebar)}>
        <CustomCSS selectorName={this.getId()} css={customCSS}>
          <Wrapper
            {...this.makeWrapperProps({
              className,
              attributes: {
                ...makeDataAttr({ name: "product-handle", value: _itemId }),
                ...makeDataAttr({
                  name: "default-variant-id",
                  value: _variantId
                })
              }
            })}
            component={"button"}
          >
            {this.renderIcon(v)}
            <Text id="text" v={v} onChange={this.handleTextChange} />
            {isView(this.renderContext) && (
              <ThemeIcon
                className="brz-shopify-add-to-cart--spinner brz-invisible"
                name="circle-02"
                type="glyph"
              />
            )}
          </Wrapper>
        </CustomCSS>
      </PortalToolbar>
    );
  }
}
