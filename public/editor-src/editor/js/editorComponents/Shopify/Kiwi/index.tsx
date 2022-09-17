import React, { ReactNode } from "react";
import { ElementModel } from "visual/component/Elements/Types";
import Placeholder from "visual/component/Placeholder";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
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
                data-collections="{{ product.collections | map: 'id' | join: ','}}"
                data-tags="{{ product.tags | join: ',' | escape}}"
                data-product="{{product.id}}"
                data-vendor="{{product.vendor | escape}}"
                data-product-name="{{product.title}}"
                data-product-images="{{product.images | json| escape}}"
                data-type="{{product.type | escape}}"
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
