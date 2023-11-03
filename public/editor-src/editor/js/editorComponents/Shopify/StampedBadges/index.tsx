import React, { ReactNode } from "react";
import { ElementModel } from "visual/component/Elements/Types";
import Placeholder from "visual/component/Placeholder";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { hexToRgba } from "visual/utils/color";
import { makeAttr, makeDataAttr } from "visual/utils/i18n/attribute";
import { Wrapper } from "../../tools/Wrapper";
import defaultValue from "./defaultValue.json";
import * as sidebarConfig from "./sidebar";
import * as toolbarConfig from "./toolbar";

export type BadgeType = "minimal" | "standard";

export interface Value extends ElementModel {
  badgeType: BadgeType;
  headerTitle: string;
  starSize: number;
  starSizeSuffix: string;
  feedHeight: number;
  feedHeightSuffix: string;
  reviewIDs: string;
  productIDs: string;
  productType: string;
  productVendor: string;
  feedTags: string;
  limitWords: number;
  minimumRating: string;
  textColorOpacity: number;
  textColorHex: string;
  starColorHex: string;
  starColorOpacity: number;
  ribbonOuterColorHex: string;
  ribbonOuterColorOpacity: number;
  ribbonInnerColorHex: string;
  ribbonInnerColorOpacity: number;
  ribbonColorHex: number;
  ribbonColorOpacity: number;
  fillEmpty: string;
  randomizer: string;
}

export class StampedBadge extends EditorComponent<Value> {
  static get componentId(): "StampedBadge" {
    return "StampedBadge";
  }

  static defaultValue = defaultValue;

  renderStampedBadge(type: BadgeType, v: Value): ReactNode {
    const {
      headerTitle,
      starSize,
      starSizeSuffix,
      feedHeight,
      feedHeightSuffix,
      reviewIDs,
      productIDs,
      productType,
      productVendor,
      feedTags,
      limitWords,
      minimumRating,
      textColorOpacity,
      textColorHex,
      starColorHex,
      starColorOpacity,
      ribbonOuterColorHex,
      ribbonOuterColorOpacity,
      ribbonInnerColorHex,
      ribbonInnerColorOpacity,
      ribbonColorHex,
      ribbonColorOpacity,
      fillEmpty,
      randomizer
    } = v;

    const attr: Record<string, string> = {};

    if (fillEmpty === "on") {
      attr[`${makeAttr("fill-empty")}`] = "true";
    }

    if (randomizer === "on") {
      attr[`${makeAttr("random")}`] = "true";
    }
    if (reviewIDs !== "") {
      attr[`${makeAttr("review-ids")}`] = reviewIDs.trim().replace(/ /g, ",");
    }
    if (productIDs !== "") {
      attr[`${makeAttr("product-ids")}`] = productIDs.trim().replace(/ /g, ",");
    }
    if (productType !== "") {
      attr[`${makeAttr("product-category")}`] = productType;
    }
    if (productVendor !== "") {
      attr[`${makeAttr("product-brand")}`] = productVendor;
    }
    if (feedTags !== "") {
      attr[`${makeAttr("tags")}`] = feedTags.trim().replace(/ /g, ",");
    }
    if (headerTitle !== "") {
      attr[`${makeAttr("title")}`] = headerTitle;
    }

    const limitWordsDataFromAttr = makeDataAttr({
      name: "limit-words",
      value: limitWords
    });

    const minimumRatingDataFromAttr = makeDataAttr({
      name: "min-rating",
      value: minimumRating
    });

    const hexToRgbColorTextDataFromAttr = makeDataAttr({
      name: "color-text",
      value: hexToRgba(textColorHex, textColorOpacity)
    });

    const hexToRgbaStartDataFromAttr = makeDataAttr({
      name: "color-stars",
      value: hexToRgba(starColorHex, starColorOpacity)
    });

    const hexToRgbStyleColorTextDataFromAttr = makeDataAttr({
      name: "style-color-text",
      value: hexToRgba(textColorHex, textColorOpacity)
    });

    switch (type) {
      case "minimal":
        return (
          <div
            id="stamped-reviews-widget"
            {...makeDataAttr({ name: "widget-type", value: "site-badge" })}
            {...makeDataAttr({ name: "badge-type", value: "minimal" })}
            {...hexToRgbColorTextDataFromAttr}
            {...hexToRgbaStartDataFromAttr}
            {...makeDataAttr({
              name: "star-size",
              value: `${starSize}${starSizeSuffix}`
            })}
            {...limitWordsDataFromAttr}
            {...minimumRatingDataFromAttr}
            {...makeDataAttr({ name: "style-color-star", value: "false" })}
            {...hexToRgbStyleColorTextDataFromAttr}
            {...attr}
          />
        );

      case "standard":
        return (
          <div
            id="stamped-reviews-widget"
            {...makeDataAttr({ name: "widget-type", value: "site-badge" })}
            {...makeDataAttr({
              name: "height",
              value: `${feedHeight}${feedHeightSuffix}`
            })}
            {...makeDataAttr({ name: "with-photos", value: "false" })}
            {...makeDataAttr({ name: "badge-type", value: "badge" })}
            {...makeDataAttr({
              name: "color-outer",
              value: hexToRgba(ribbonOuterColorHex, ribbonOuterColorOpacity)
            })}
            {...makeDataAttr({
              name: "color-inner",
              value: hexToRgba(ribbonInnerColorHex, ribbonInnerColorOpacity)
            })}
            {...makeDataAttr({
              name: "color-ribbon",
              value: hexToRgba(ribbonColorHex, ribbonColorOpacity)
            })}
            {...hexToRgbColorTextDataFromAttr}
            {...hexToRgbaStartDataFromAttr}
            {...limitWordsDataFromAttr}
            {...minimumRatingDataFromAttr}
            {...makeDataAttr({ name: "style-color-star", value: "false" })}
            {...hexToRgbStyleColorTextDataFromAttr}
            {...attr}
          />
        );
    }
  }

  renderForEdit(): ReactNode {
    return (
      <Toolbar
        {...this.makeToolbarPropsFromConfig2(toolbarConfig, sidebarConfig)}
      >
        <Wrapper
          {...this.makeWrapperProps({
            className: "brz-shopify-stamped-badge"
          })}
        >
          <Placeholder icon="img" />
        </Wrapper>
      </Toolbar>
    );
  }

  renderForView(v: Value): ReactNode {
    const { badgeType } = v;

    return (
      <Wrapper
        {...this.makeWrapperProps({ className: "brz-shopify-stamped-badge" })}
      >
        {this.renderStampedBadge(badgeType, v)}
      </Wrapper>
    );
  }
}
