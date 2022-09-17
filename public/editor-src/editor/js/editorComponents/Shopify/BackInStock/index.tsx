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
  buttonName: string;
}

export class BISStock extends EditorComponent<Value> {
  static get componentId(): "BISStock" {
    return "BISStock";
  }

  static defaultValue = defaultValue;

  renderForEdit(v: Value): ReactNode {
    const { buttonName } = v;

    return (
      <Toolbar {...this.makeToolbarPropsFromConfig2(toolbar, sidebar)}>
        <Wrapper
          {...this.makeWrapperProps({
            className: "brz-shopify-bis-stock"
          })}
        >
          {IS_PREVIEW ? (
            <button
              data-id="BIS_trigger"
              className="btn BIS_trigger"
              data-pf-type="BackInStock"
            >
              {buttonName.trim()}
            </button>
          ) : (
            <Placeholder icon="img" />
          )}
        </Wrapper>
      </Toolbar>
    );
  }
}
