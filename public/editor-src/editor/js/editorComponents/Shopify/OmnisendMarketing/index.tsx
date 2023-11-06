import React, { ReactNode } from "react";
import { ElementModel } from "visual/component/Elements/Types";
import Placeholder from "visual/component/Placeholder";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { makeDataAttr } from "visual/utils/i18n/attribute";
import { Wrapper } from "../../tools/Wrapper";
import defaultValue from "./defaultValue.json";
import * as sidebar from "./sidebar";
import * as toolbar from "./toolbar";

export interface Value extends ElementModel {
  pageLink: string;
}

export class OmnisendMarketing extends EditorComponent<Value> {
  static get componentId(): "OmnisendMarketing" {
    return "OmnisendMarketing";
  }

  static defaultValue = defaultValue;

  renderForEdit(v: Value): ReactNode {
    const { pageLink } = v;
    return (
      <Toolbar {...this.makeToolbarPropsFromConfig2(toolbar, sidebar)}>
        <Wrapper
          {...this.makeWrapperProps({
            className: "brz-shopify-omnisend-marketing"
          })}
        >
          {IS_PREVIEW ? (
            <div {...makeDataAttr({ name: "pf-type", value: "Omnisend" })}>
              <iframe
                loading="lazy"
                style={{ position: "absolute", border: "none" }}
                src={pageLink}
                title="omnisend"
                width="100%"
                height="100%"
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
