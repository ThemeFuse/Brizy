import React, { ReactNode } from "react";
import { ElementModel } from "visual/component/Elements/Types";
import Placeholder from "visual/component/Placeholder";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { Wrapper } from "../../tools/Wrapper";
import defaultValue from "./defaultValue.json";
import * as sidebar from "./sidebar";
import * as toolbar from "./toolbar";

export class SwymWishList extends EditorComponent<ElementModel> {
  static get componentId(): "SwymWishList" {
    return "SwymWishList";
  }
  static defaultValue = defaultValue;

  renderForEdit(): ReactNode {
    return (
      <Toolbar {...this.makeToolbarPropsFromConfig2(toolbar, sidebar)}>
        <Wrapper
          {...this.makeWrapperProps({
            className: "brz-shopify-swym-wishlist"
          })}
        >
          {IS_PREVIEW ? (
            <div
              className="swym-wishlist-button-bar"
              data-pf-type="SwymWishlist"
            />
          ) : (
            <Placeholder icon="img" />
          )}
        </Wrapper>
      </Toolbar>
    );
  }
}
