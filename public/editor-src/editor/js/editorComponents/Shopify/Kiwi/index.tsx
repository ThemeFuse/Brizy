import React, { ReactNode } from "react";
import { ElementModel } from "visual/component/Elements/Types";
import Placeholder from "visual/component/Placeholder";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { makePlaceholder } from "visual/utils/dynamicContent";
import { Wrapper } from "../../tools/Wrapper";
import defaultValue from "./defaultValue.json";
import * as sidebar from "./sidebar";
import * as toolbar from "./toolbar";

export interface Value extends ElementModel {
  displayMode: string;
}

export class KiwiChart extends EditorComponent<Value> {
  static get componentId(): "KiwiChart" {
    return "KiwiChart";
  }

  static defaultValue = defaultValue;

  renderForEdit(v: Value): ReactNode {
    const { displayMode } = v;
    const productId = makePlaceholder({ content: "{{product.id}}" });
    const productCollection = makePlaceholder({
      content: "{{product.collections | map: 'id' | join: ','}}"
    });
    const productTags = makePlaceholder({
      content: "{{product.tags | join: ',' | escape}}"
    });
    const productVendor = makePlaceholder({
      content: "{{product.vendor | escape}}"
    });
    const productTitle = makePlaceholder({
      content: "{{product.title}}"
    });
    const productImage = makePlaceholder({
      content: "{{product.images | json| escape}}"
    });
    const productType = makePlaceholder({
      content: "{{product.type | escape}}"
    });

    return (
      <Toolbar {...this.makeToolbarPropsFromConfig2(toolbar, sidebar)}>
        <Wrapper
          {...this.makeWrapperProps({
            className: "brz-shopify-kiwi-chart"
          })}
        >
          {IS_PREVIEW ? (
            <div data-pf-type="KiwiSizeChart">
              <div
                id="KiwiSizingChart"
                data-collections={productCollection}
                data-tags={productTags}
                data-product={productId}
                data-vendor={productVendor}
                data-product-name={productTitle}
                data-product-images={productImage}
                data-type={productType}
                data-display-mode={displayMode}
              />
            </div>
          ) : (
            <Placeholder icon="img" />
          )}
        </Wrapper>
      </Toolbar>
    );
  }
}
