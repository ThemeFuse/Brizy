import React from "react";
import { PriceStyle } from "widget/Shopify/Price/types";
import { DynamicContentHelper } from "visual/editorComponents/WordPress/common/DynamicContentHelper";

export const useContent = (
  style: PriceStyle,
  sourceID: number,
  sourceType: string
) => {
  switch (style) {
    case PriceStyle.S1:
      return (
        <>
          <DynamicContentHelper
            props={{className: "brz-shopify-price-style1"}}
            placeholder={`{{ price type='${sourceType}' id='${sourceID}' }}`}
            tagName={"span"}
            placeholderIcon={"shopify"}
            blocked={false}
          />

          <DynamicContentHelper
            props={{className: "brz-shopify-price-style2"}}
            placeholder={`{{ compareAtPrice type='${sourceType}' id='${sourceID}' }}`}
            tagName={"span"}
            placeholderIcon={"shopify"}
            fallbackComponent={<></>}
            blocked={false}
          />
        </>
      );
    case PriceStyle.S2:
      return (
        <DynamicContentHelper
          props={{className: "brz-shopify-price-style1"}}
          placeholder={`{{ price type='${sourceType}' id='${sourceID}' }}`}
          tagName={"span"}
          placeholderIcon={"shopify"}
          blocked={false}
        />
      );

    case PriceStyle.S3:
      return (
        <DynamicContentHelper
          props={{className: "brz-shopify-price-style2"}}
          placeholder={`{{ compareAtPrice type='${sourceType}' id='${sourceID}' }}`}
          tagName={"span"}
          placeholderIcon={"shopify"}
          blocked={false}
        />
      );
  }
};
