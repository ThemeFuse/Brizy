import React, { ReactNode } from "react";
import { ElementModel } from "visual/component/Elements/Types";
import Placeholder from "visual/component/Placeholder";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { capitalize } from "visual/utils/string";
import { Wrapper } from "../../tools/Wrapper";
import defaultValue from "./defaultValue.json";
import * as sidebarConfig from "./sidebar";
import * as toolbarConfig from "./toolbar";

export interface Value extends ElementModel {
  upsellType: string;
}
export class LimeSpot extends EditorComponent<Value> {
  static get componentId(): "LimeSpot" {
    return "LimeSpot";
  }

  static defaultValue = defaultValue;

  renderForEdit(): ReactNode {
    return (
      <Toolbar
        {...this.makeToolbarPropsFromConfig2(toolbarConfig, sidebarConfig)}
      >
        <Wrapper
          {...this.makeWrapperProps({
            className: "brz-shopify-limespot-upsell"
          })}
        >
          <Placeholder icon="img" />
        </Wrapper>
      </Toolbar>
    );
  }

  renderForView(v: Value): ReactNode {
    const { upsellType } = v;

    return (
      <Wrapper
        {...this.makeWrapperProps({ className: "brz-shopify-limespot-upsell" })}
      >
        <div data-pf-type="LimeSpot">
          <div id={`pf_limespot_${capitalize(upsellType)}`} />
        </div>
      </Wrapper>
    );
  }
}
