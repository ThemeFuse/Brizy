import React, { ReactNode } from "react";
import { ElementModel } from "visual/component/Elements/Types";
import Placeholder from "visual/component/Placeholder";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { makeDataAttr } from "visual/utils/i18n/attribute";
import { Wrapper } from "../../tools/Wrapper";
import defaultValue from "./defaultValue.json";
import * as sidebar from "./sidebar";
import * as toolbar from "./toolbar";

export class ProductOptions extends EditorComponent<ElementModel> {
  static get componentId(): "ProductOptions" {
    return "ProductOptions";
  }

  static defaultValue = defaultValue;

  renderForEdit(): ReactNode {
    return (
      <Toolbar {...this.makeToolbarPropsFromConfig2(toolbar, sidebar)}>
        <Wrapper
          {...this.makeWrapperProps({
            className: "brz-shopify-product-options"
          })}
        >
          {IS_PREVIEW ? (
            <div
              {...makeDataAttr({ name: "pf-type", value: "ProductCustomizer" })}
            >
              <div>{'{% include "product-customizer" %}'}</div>
            </div>
          ) : (
            <Placeholder icon="img" />
          )}
        </Wrapper>
      </Toolbar>
    );
  }
}
