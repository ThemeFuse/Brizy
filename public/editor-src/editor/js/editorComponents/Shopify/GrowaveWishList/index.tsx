import React, { ReactNode } from "react";
import { ElementModel } from "visual/component/Elements/Types";
import Placeholder from "visual/component/Placeholder";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { makePlaceholder } from "visual/utils/dynamicContent";
import { Wrapper } from "../../tools/Wrapper";
import * as sidebarConfig from "./sidebar";
import * as toolbarConfig from "./toolbar";

export class GrowaveWishlist extends EditorComponent<ElementModel> {
  static get componentId(): "GrowaveWishlist" {
    return "GrowaveWishlist";
  }

  renderForEdit(): ReactNode {
    return (
      <Toolbar
        {...this.makeToolbarPropsFromConfig2(toolbarConfig, sidebarConfig)}
      >
        <Wrapper
          {...this.makeWrapperProps({
            className: "brz-shopify-growave-wishlist"
          })}
        >
          <Placeholder icon="img" />
        </Wrapper>
      </Toolbar>
    );
  }

  renderForView(): ReactNode {
    const placeholder = makePlaceholder({ content: "{{ the_snippet_fave }}" });

    return (
      <Wrapper
        {...this.makeWrapperProps({
          className: "brz-shopify-growave-wishlist"
        })}
      >
        <div data-pf-type="GrowaveWishlist">
          {`{% capture the_snippet_fave %}{% include 'socialshopwave-widget-fave' %}{% endcapture %}{% unless the_snippet_fave contains 'Liquid error' %}${placeholder}{% endunless %}`}
        </div>
      </Wrapper>
    );
  }
}
