import { Box as BoxIcon } from "@brizy/builder-icons/src";
import React, { ReactElement } from "react";
import { Content } from "visual/component/Prompts/common/Content";
import {
  getContentText,
  getHeadingText,
  getLinkText
} from "visual/component/Prompts/utils";
import { ShopifyTemplate } from "visual/global/Config/types/shopify/ShopifyTemplate";
import { Link } from "./Link";
import { Text } from "./Text";

interface Props {
  headingText: string;
  contentText: string;
  linkText: string;
}

export const EmptyContent = ({
  headingText,
  contentText,
  linkText
}: Props): ReactElement => (
  <Content>
    <div className="brz-ed-popup-content--empty">
      <BoxIcon className="brz-ed-popup-content--empty-icon" />
      <Text className="brz-ed-popup-content--empty-heading">{headingText}</Text>
      <Text className="brz-ed-popup-content--empty-text">{contentText}</Text>
      <Link
        className="brz-ed-popup-content--empty-link"
        href="https://admin.shopify.com/"
      >
        {linkText}
      </Link>
    </div>
  </Content>
);

export const EmptyContentWithDefaults = ({
  type
}: {
  type: ShopifyTemplate;
}): ReactElement => (
  <EmptyContent
    headingText={getHeadingText(type)}
    contentText={getContentText(type)}
    linkText={getLinkText(type)}
  />
);
