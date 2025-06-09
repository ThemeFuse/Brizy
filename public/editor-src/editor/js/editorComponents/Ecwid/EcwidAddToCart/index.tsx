import React, { JSX } from "react";
import { Text } from "visual/component/ContentOptions/types";
import CustomCSS from "visual/component/CustomCSS";
import { ThemeIcon } from "visual/component/ThemeIcon";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { Wrapper } from "visual/editorComponents/tools/Wrapper";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { makePlaceholder } from "visual/utils/dynamicContent";
import { getEcwidProductId } from "visual/utils/ecwid";
import { makeAttr } from "visual/utils/i18n/attribute";
import { attachRefs } from "visual/utils/react";
import type { MValue } from "visual/utils/value";
import defaultValue from "./defaultValue.json";
import * as sidebar from "./sidebar";
import * as toolbar from "./toolbar";
import type { Value } from "./types";

export class EcwidAddToCart extends EditorComponent<Value> {
  static defaultValue = defaultValue;

  static get componentId(): ElementTypes.EcwidAddToCart {
    return ElementTypes.EcwidAddToCart;
  }

  handleTextChange = (patch: Partial<Value>): void => this.patchValue(patch);

  getWrapperClassName(): string {
    return this.getCSSClassnames({
      toolbars: [toolbar],
      sidebars: [sidebar],
      extraClassNames: ["brz-ecwid-add-to-cart"]
    });
  }

  renderIcon(v: Value): MValue<JSX.Element> {
    const { iconName, iconType, iconFilename } = v;

    if (iconName && iconType) {
      return (
        <ThemeIcon
          className="brz-ecwid-icon-cart"
          name={iconName}
          type={iconType}
          filename={iconFilename}
        />
      );
    }
  }

  renderForEdit(v: Value): JSX.Element {
    const { customCSS } = v;

    const className = this.getWrapperClassName();

    return (
      <Toolbar {...this.makeToolbarPropsFromConfig2(toolbar, sidebar)}>
        {({ ref: toolbarRef }) => (
          <CustomCSS selectorName={this.getId()} css={customCSS}>
            {({ ref: cssRef }) => (
              <Wrapper
                {...this.makeWrapperProps({
                  className,
                  ref: (el) => attachRefs(el, [toolbarRef, cssRef])
                })}
                component={"button"}
              >
                {this.renderIcon(v)}
                <Text id="text" v={v} onChange={this.handleTextChange} />
              </Wrapper>
            )}
          </CustomCSS>
        )}
      </Toolbar>
    );
  }

  renderForView(v: Value): JSX.Element {
    const { entityId, customCSS } = v;

    const className = this.getWrapperClassName();

    const productId =
      entityId === "auto"
        ? makePlaceholder({
            content: "{{brizy_dc_collection_item_field}}",
            attr: { slug: "id" }
          })
        : getEcwidProductId(entityId);

    const attributes = {
      [makeAttr("store-id")]: makePlaceholder({
        content: "{{ecwid_store_id}}"
      }),
      [makeAttr("product-id")]: productId
    };

    return (
      <CustomCSS selectorName={this.getId()} css={customCSS}>
        <Wrapper
          {...this.makeWrapperProps({
            className,
            attributes
          })}
          component={"button"}
        >
          {this.renderIcon(v)}
          <Text id="text" v={v} />
          <span className="brz-ecwid-add-to-cart--spinner brz-invisible">
            <ThemeIcon
              className="brz-ecwid-add-to-cart--spinner-svg"
              name="circle-02"
              type="glyph"
            />
          </span>
        </Wrapper>
      </CustomCSS>
    );
  }
}
