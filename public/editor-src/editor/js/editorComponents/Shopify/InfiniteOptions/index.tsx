import React, { ReactNode } from "react";
import { ElementModel } from "visual/component/Elements/Types";
import Placeholder from "visual/component/Placeholder";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { Wrapper } from "../../tools/Wrapper";
import defaultValue from "./defaultValue.json";
import * as sidebar from "./sidebar";
import * as toolbar from "./toolbar";

export class InfiniteOptions extends EditorComponent<ElementModel> {
  static get componentId(): "InfiniteOptions" {
    return "InfiniteOptions";
  }
  static defaultValue = defaultValue;

  renderForEdit(): ReactNode {
    return (
      <Toolbar {...this.makeToolbarPropsFromConfig2(toolbar, sidebar)}>
        <Wrapper
          {...this.makeWrapperProps({
            className: "brz-shopify-infite-options"
          })}
        >
          {IS_PREVIEW ? (
            <div data-pf-type="InfiniteOptionsShopPad">
              <div id="infiniteoptions-container" />
            </div>
          ) : (
            <Placeholder icon="img" />
          )}
        </Wrapper>
      </Toolbar>
    );
  }
}
