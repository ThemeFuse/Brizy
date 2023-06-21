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
  pageLink: string;
}

export class MarselloMarketing extends EditorComponent<ElementModel> {
  static get componentId(): "MarselloMarketing" {
    return "MarselloMarketing";
  }

  static defaultValue = defaultValue;

  renderForEdit(v: Value): ReactNode {
    const { pageLink } = v;

    return (
      <Toolbar {...this.makeToolbarPropsFromConfig2(toolbar, sidebar)}>
        <Wrapper
          {...this.makeWrapperProps({
            className: "brz-shopify-marsello-marketing"
          })}
        >
          {IS_PREVIEW ? (
            <div data-pf-type="Marsello">
              <iframe
                loading="lazy"
                style={{ position: "absolute", border: "none" }}
                src={pageLink}
                title="marsello"
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
