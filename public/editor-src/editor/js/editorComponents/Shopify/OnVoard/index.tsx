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
  widgetType: string;
  embedCode: string;
}

export class OnVoard extends EditorComponent<Value> {
  static get componentId(): "OnVoard" {
    return "OnVoard";
  }
  static defaultValue = defaultValue;
  renderForEdit(v: Value): ReactNode {
    const { embedCode, widgetType } = v;

    return (
      <Toolbar {...this.makeToolbarPropsFromConfig2(toolbar, sidebar)}>
        <Wrapper
          {...this.makeWrapperProps({
            className: "brz-shopify-onvoard-notifications"
          })}
        >
          {IS_PREVIEW && widgetType !== "" ? (
            <div
              {...makeDataAttr({
                name: "pf-type",
                value: "OnvoardBackInStock"
              })}
              dangerouslySetInnerHTML={{ __html: embedCode }}
            />
          ) : (
            <Placeholder icon="img" />
          )}
        </Wrapper>
      </Toolbar>
    );
  }
}
