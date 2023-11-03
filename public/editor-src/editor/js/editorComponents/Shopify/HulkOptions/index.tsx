import React, { ReactNode } from "react";
import { ElementModel } from "visual/component/Elements/Types";
import Placeholder from "visual/component/Placeholder";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { makeDataAttr } from "visual/utils/i18n/attribute";
import { makePlaceholder } from "visual/utils/dynamicContent";
import { Wrapper } from "../../tools/Wrapper";
import defaultValue from "./defaultValue.json";
import * as sidebar from "./sidebar";
import * as toolbar from "./toolbar";

export class HulkOptions extends EditorComponent<ElementModel> {
  static get componentId(): "HulkOptions" {
    return "HulkOptions";
  }

  static defaultValue = defaultValue;

  renderForEdit(): ReactNode {
    const placeholder = makePlaceholder({ content: "{{ product.id }}" });

    return (
      <Toolbar {...this.makeToolbarPropsFromConfig2(toolbar, sidebar)}>
        <Wrapper
          {...this.makeWrapperProps({
            className: "brz-shopify-hulk-options"
          })}
        >
          {IS_PREVIEW ? (
            <div
              {...makeDataAttr({
                name: "pf-type",
                value: "InfiniteProductOption"
              })}
            >
              <div id={`hulkapps_custom_options_${placeholder}`} />
            </div>
          ) : (
            <Placeholder icon="img" />
          )}
        </Wrapper>
      </Toolbar>
    );
  }
}
