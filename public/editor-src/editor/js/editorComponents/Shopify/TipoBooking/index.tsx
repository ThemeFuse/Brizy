import React, { ReactNode } from "react";
import { ElementModel } from "visual/component/Elements/Types";
import Placeholder from "visual/component/Placeholder";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { makeDataAttr } from "visual/utils/i18n/attribute";
import { Wrapper } from "../../tools/Wrapper";
import * as sidebar from "./sidebar";
import * as toolbar from "./toolbar";

export class TipoBooking extends EditorComponent<ElementModel> {
  static get componentId(): "TipoBooking" {
    return "TipoBooking";
  }
  renderForEdit(): ReactNode {
    return (
      <Toolbar {...this.makeToolbarPropsFromConfig2(toolbar, sidebar)}>
        <Wrapper
          {...this.makeWrapperProps({
            className: "brz-shopify-tipo-booking"
          })}
        >
          {IS_PREVIEW ? (
            <div {...makeDataAttr({ name: "pf-type", value: "Tipo" })}>
              <div className="tpb-product-page" />
            </div>
          ) : (
            <Placeholder icon="img" />
          )}
        </Wrapper>
      </Toolbar>
    );
  }
}
