import React, { ReactNode } from "react";
import classnames from "classnames";
import EditorComponent, {
  ComponentsMeta
} from "visual/editorComponents/EditorComponent";
import CustomCSS from "visual/component/CustomCSS";
import Toolbar from "visual/component/Toolbar";
import * as toolbarConfig from "./toolbar";
import * as sidebarConfig from "./sidebar";
import { css } from "visual/utils/cssStyle";
import { style } from "./styles";
import { Wrapper } from "../../tools/Wrapper";
import { ElementModel } from "visual/component/Elements/Types";
import { WithClassName } from "visual/utils/options/attributes";
import { Patch } from "visual/component/BoxResizer/types";
import Placeholder from "visual/component/Placeholder";

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
    const placeholder = "{{product.metafields.spr.reviews}}";

    return (
      <Wrapper {...this.makeWrapperProps({ className })}>
        <div id="shopify-product-reviews" data-id="{{product.id}}">
          {placeholder}
        </div>
      </Wrapper>
    );
  }
}
