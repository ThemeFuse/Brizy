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

export type ReviewType =
  | "product"
  | "testimonial"
  | "allReviews"
  | "averageRating"
  | "avgStoreRating"
  | "banner"
  | "ppMedia"
  | "inStoreMedia"
  | "ppCounter"
  | "cpCounter"
  | "ppEventFeed"
  | "generalEventFeed"
  | "eventPopups";

export interface Value extends ElementModel {
  reviewType: ReviewType;
  htmlTag: string;
}

export class FeraReviews extends EditorComponent<Value> {
  static get componentId(): "FeraReviews" {
    return "FeraReviews";
  }

  static defaultValue = defaultValue;

  renderFeraWidget(reviewType: ReviewType, embededCode: string): ReactNode {
    switch (reviewType) {
      case "product":
      case "testimonial":
      case "allReviews":
      case "averageRating":
      case "avgStoreRating":
      case "banner":
      case "ppMedia":
      case "inStoreMedia":
      case "ppCounter":
      case "cpCounter":
      case "ppEventFeed":
      case "generalEventFeed":
      case "eventPopups":
        return (
          <div
            {...makeDataAttr({ name: "pf-type", value: "Fera" })}
            dangerouslySetInnerHTML={{ __html: embededCode }}
          />
        );
    }
  }

  renderForEdit(v: Value): React.ReactNode {
    const { reviewType, htmlTag } = v;

    return (
      <Toolbar {...this.makeToolbarPropsFromConfig2(toolbar, sidebar)}>
        <Wrapper
          {...this.makeWrapperProps({
            className: "brz-shopify-fera-reviews"
          })}
        >
          {IS_EDITOR ? (
            <Placeholder icon="img" />
          ) : (
            this.renderFeraWidget(reviewType, htmlTag)
          )}
        </Wrapper>
      </Toolbar>
    );
  }
}
