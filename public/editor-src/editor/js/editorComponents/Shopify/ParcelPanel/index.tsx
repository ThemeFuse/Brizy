import React, { ReactNode } from "react";
import { ElementModel } from "visual/component/Elements/Types";
import Placeholder from "visual/component/Placeholder";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { makeDataAttr } from "visual/utils/i18n/attribute";
import { Wrapper } from "../../tools/Wrapper";
import * as sidebarConfig from "./sidebar";
import * as toolbarConfig from "./toolbar";

export class ParcelPanel extends EditorComponent<ElementModel> {
  static get componentId(): "ParcelPanel" {
    return "ParcelPanel";
  }

  renderForEdit(): ReactNode {
    return (
      <Toolbar
        {...this.makeToolbarPropsFromConfig2(toolbarConfig, sidebarConfig)}
      >
        <Wrapper
          {...this.makeWrapperProps({ className: "brz-shopify-parcel-panel" })}
        >
          <Placeholder icon="img" />
        </Wrapper>
      </Toolbar>
    );
  }

  renderForView(): ReactNode {
    return (
      <Wrapper
        {...this.makeWrapperProps({ className: "brz-shopify-parcel-panel" })}
      >
        <div
          {...makeDataAttr({ name: "pf-type", value: "ParcelPanel" })}
          className="sc-eTwdGJ IQtZe pf-22_"
        >
          <div className="sc-eTwdGJ IQtZe">
            <div className="pp_main">
              <div className="pp_tracking_info" style={{ display: "none" }} />
              <div className="pp_tracking_content" />
            </div>
            <script
              type="text/javascript"
              src="//www.parcelpanel.com/track-page/track-js-get/pp-tracking-ajax-func"
            />
          </div>
        </div>
      </Wrapper>
    );
  }
}
