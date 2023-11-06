import React, { ReactNode } from "react";
import { ElementModel } from "visual/component/Elements/Types";
import Placeholder from "visual/component/Placeholder";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { makePlaceholder } from "visual/utils/dynamicContent";
import { makeDataAttr } from "visual/utils/i18n/attribute";
import { Wrapper } from "../../tools/Wrapper";
import * as sidebar from "./sidebar";
import * as toolbar from "./toolbar";

export class BoldProduct extends EditorComponent<ElementModel> {
  static get componentId(): "BoldProduct" {
    return "BoldProduct";
  }

  renderForEdit(): ReactNode {
    const productId = makePlaceholder({ content: "{{ product.id }}" });

    return (
      <Toolbar {...this.makeToolbarPropsFromConfig2(toolbar, sidebar)}>
        <Wrapper
          {...this.makeWrapperProps({
            className: "brz-shopify-bold-options"
          })}
        >
          {IS_PREVIEW ? (
            <div
              {...makeDataAttr({
                name: "product-id",
                value: productId
              })}
              {...makeDataAttr({
                name: "pf-type",
                value: "BoldProductOptions"
              })}
            />
          ) : (
            <Placeholder icon="img" />
          )}
        </Wrapper>
      </Toolbar>
    );
  }
}
