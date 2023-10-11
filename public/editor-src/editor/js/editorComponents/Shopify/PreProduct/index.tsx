import React, { ReactNode } from "react";
import { ElementModel } from "visual/component/Elements/Types";
import Placeholder from "visual/component/Placeholder";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { makePlaceholder } from "visual/utils/dynamicContent";
import { Wrapper } from "../../tools/Wrapper";
import * as sidebar from "./sidebar";
import * as toolbar from "./toolbar";

export class PreProduct extends EditorComponent<ElementModel> {
  static get componentId(): "PreProduct" {
    return "PreProduct";
  }

  renderForEdit(): ReactNode {
    const productId = makePlaceholder({
      content: "{{product.id}}"
    });
    return (
      <Toolbar {...this.makeToolbarPropsFromConfig2(toolbar, sidebar)}>
        <Wrapper
          {...this.makeWrapperProps({
            className: "brz-shopify-pre-product"
          })}
        >
          {IS_PREVIEW ? (
            <div data-pf-type="PreProduct">
              <div
                id="preproduct-pledge"
                data-id={productId}
                style={{ textAlign: "left" }}
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
