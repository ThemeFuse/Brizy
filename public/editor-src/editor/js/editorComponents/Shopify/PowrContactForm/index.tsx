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
  embededCode: string;
}

export class PowrContactForm extends EditorComponent<ElementModel> {
  static get componentId(): "PowrContactForm" {
    return "PowrContactForm";
  }

  static defaultValue = defaultValue;

  renderForEdit(v: Value): ReactNode {
    const { embededCode } = v;

    return (
      <Toolbar {...this.makeToolbarPropsFromConfig2(toolbar, sidebar)}>
        <Wrapper
          {...this.makeWrapperProps({
            className: "brz-shopify-powr-contact-form"
          })}
        >
          {IS_PREVIEW ? (
            <div
              data-pf-type="Powr"
              dangerouslySetInnerHTML={{ __html: embededCode }}
            />
          ) : (
            <Placeholder icon="img" />
          )}
        </Wrapper>
      </Toolbar>
    );
  }
}
