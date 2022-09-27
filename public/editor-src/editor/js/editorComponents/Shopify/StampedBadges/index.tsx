import React, { ReactNode } from "react";
import { ElementModel } from "visual/component/Elements/Types";
import Placeholder from "visual/component/Placeholder";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { hexToRgba } from "visual/utils/color";
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
      attr["data-fill-empty"] = "true";
    }

    if (randomizer === "on") {
      attr["data-random"] = "true";
    }
    if (reviewIDs !== "") {
      attr["data-review-ids"] = reviewIDs.trim().replace(/ /g, ",");
    }
    if (productIDs !== "") {
      attr["data-product-ids"] = productIDs.trim().replace(/ /g, ",");
    }
    if (productType !== "") {
      attr["data-product-category"] = productType;
    }
    if (productVendor !== "") {
      attr["data-product-brand"] = productVendor;
    }
    if (feedTags !== "") {
      attr["data-tags"] = feedTags.trim().replace(/ /g, ",");
    }
    if (headerTitle !== "") {
      attr["data-title"] = headerTitle;
    }

    switch (type) {
      case "minimal":
        return (
          <div
            id="stamped-reviews-widget"
            data-widget-type="site-badge"
            data-badge-type="minimal"
            data-color-text={hexToRgba(textColorHex, textColorOpacity)}
            data-color-stars={hexToRgba(starColorHex, starColorOpacity)}
            data-star-size={`${starSize}${starSizeSuffix}`}
            data-limit-words={limitWords.toString()}
            data-min-rating={minimumRating}
            data-style-color-star="false"
            data-style-color-text={hexToRgba(textColorHex, textColorOpacity)}
            {...attr}
          />
        );

      case "standard":
        return (
          <div
            id="stamped-reviews-widget"
            data-widget-type="site-badge"
            data-height={`${feedHeight}${feedHeightSuffix}`}
            data-with-photos="false"
            data-badge-type="badge"
            data-color-outer={hexToRgba(
              ribbonOuterColorHex,
              ribbonOuterColorOpacity
            )}
            data-color-inner={hexToRgba(
              ribbonInnerColorHex,
              ribbonInnerColorOpacity
            )}
            data-color-ribbon={hexToRgba(ribbonColorHex, ribbonColorOpacity)}
            data-color-text={hexToRgba(textColorHex, textColorOpacity)}
            data-color-stars={hexToRgba(starColorHex, starColorOpacity)}
            data-limit-words={limitWords.toString()}
            data-min-rating={minimumRating}
            data-style-color-star="false"
            data-style-color-text={hexToRgba(textColorHex, textColorOpacity)}
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
