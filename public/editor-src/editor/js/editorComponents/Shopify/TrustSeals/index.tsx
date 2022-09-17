import React from "react";
import { ElementModel } from "visual/component/Elements/Types";
import Placeholder from "visual/component/Placeholder";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { Wrapper } from "../../tools/Wrapper";
import * as sidebar from "./sidebar";
import * as toolbar from "./toolbar";

export type Value = ElementModel;

export class TrustSeals extends EditorComponent<Value> {
  static get componentId(): "TrustSeals" {
    return "TrustSeals";
  }

  renderForEdit(): React.ReactNode {
    return (
      <Toolbar {...this.makeToolbarPropsFromConfig2(toolbar, sidebar)}>
        <Wrapper
          {...this.makeWrapperProps({
            className: "brz-shopify-trust-seals"
          })}
        >
          {IS_PREVIEW ? (
            <div id="vntc-wrp" />
          ) : (
            <Placeholder icon="shopify" type="fa" />
          )}
        </Wrapper>
      </Toolbar>
    );
  }
}
