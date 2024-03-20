import classnames from "classnames";
import React, { ReactNode } from "react";
import { Patch } from "visual/component/BoxResizer/types";
import CustomCSS from "visual/component/CustomCSS";
import { ElementModel } from "visual/component/Elements/Types";
import Placeholder from "visual/component/Placeholder";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { css } from "visual/utils/cssStyle";
import { makePlaceholder } from "visual/utils/dynamicContent";
import { makeDataAttr } from "visual/utils/i18n/attribute";
import { WithClassName } from "visual/utils/options/attributes";
import { Wrapper } from "../../tools/Wrapper";
import * as sidebarConfig from "./sidebar";
import { style } from "./styles";
import * as toolbarConfig from "./toolbar";
import { ComponentsMeta } from "visual/editorComponents/EditorComponent/types";

export type Value = ElementModel;

interface Props extends WithClassName {
  meta: ComponentsMeta;
}

export class ProductReview extends EditorComponent<Value, Props> {
  static get componentId(): "ProductReview" {
    return "ProductReview";
  }
  handleResizerChange = (patch: Patch): void => this.patchValue(patch);
  handleTextChange = (patch: Value): void => {
    this.patchValue(patch);
  };

  renderForEdit(v: Value, vs: Value, vd: Value): ReactNode {
    const className = classnames(
      "brz-shopify-product-review",
      css(this.getComponentId(), this.getId(), style(v, vs, vd))
    );
    return (
      <Toolbar
        {...this.makeToolbarPropsFromConfig2(toolbarConfig, sidebarConfig)}
      >
        <CustomCSS selectorName={this.getId()} css={v.customCSS}>
          <Wrapper {...this.makeWrapperProps({ className })}>
            <Placeholder icon="img" />
          </Wrapper>
        </CustomCSS>
      </Toolbar>
    );
  }

  renderForView(v: Value, vs: Value, vd: Value): ReactNode {
    const className = classnames(
      "brz-shopify-product-review",
      css(this.getComponentId(), this.getId(), style(v, vs, vd))
    );
    const placeholder = makePlaceholder({
      content: "{{product.metafields.spr.reviews}}"
    });
    const productId = makePlaceholder({ content: "{{product.id}}" });

    return (
      <Wrapper {...this.makeWrapperProps({ className })}>
        <div
          id="shopify-product-reviews"
          {...makeDataAttr({ name: "id", value: productId })}
        >
          {placeholder}
        </div>
      </Wrapper>
    );
  }
}
