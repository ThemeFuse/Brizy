import { MinistryBrandsEventCalendar } from "@brizy/ui-icons/es/icons/MinistryBrandsEventCalendar";
import { MinistryBrandsEventDetail } from "@brizy/ui-icons/es/icons/MinistryBrandsEventDetail";
import { MinistryBrandsEventFeatured } from "@brizy/ui-icons/es/icons/MinistryBrandsEventFeatured";
import { MinistryBrandsEventLayout } from "@brizy/ui-icons/es/icons/MinistryBrandsEventLayout";
import { MinistryBrandsEventList } from "@brizy/ui-icons/es/icons/MinistryBrandsEventList";
import { MinistryBrandsGroupDetail } from "@brizy/ui-icons/es/icons/MinistryBrandsGroupDetail";
import { MinistryBrandsGroupFeatured } from "@brizy/ui-icons/es/icons/MinistryBrandsGroupFeatured";
import { MinistryBrandsGroupLayout } from "@brizy/ui-icons/es/icons/MinistryBrandsGroupLayout";
import { MinistryBrandsGroupList } from "@brizy/ui-icons/es/icons/MinistryBrandsGroupList";
import { MinistryBrandsGroupSlider } from "@brizy/ui-icons/es/icons/MinistryBrandsGroupSlider";
import { MinistryBrandsSermonDetail } from "@brizy/ui-icons/es/icons/MinistryBrandsSermonDetail";
import { MinistryBrandsSermonFeatured } from "@brizy/ui-icons/es/icons/MinistryBrandsSermonFeatured";
import { MinistryBrandsSermonLayout } from "@brizy/ui-icons/es/icons/MinistryBrandsSermonLayout";
import { MinistryBrandsSermonList } from "@brizy/ui-icons/es/icons/MinistryBrandsSermonList";
import { ShopifyPriceStyle1 } from "icons/Icons/ShopifyPriceStyle1";
import { ShopifyPriceStyle2 } from "icons/Icons/ShopifyPriceStyle2";
import { ShopifyPriceStyle3 } from "icons/Icons/ShopifyPriceStyle3";
import React, { CSSProperties, MouseEvent } from "react";

const Icons = {
  "t2-sermon-list": MinistryBrandsSermonList,
  "t2-sermon-detail": MinistryBrandsSermonDetail,
  "t2-sermon-featured": MinistryBrandsSermonFeatured,
  "t2-sermon-layout": MinistryBrandsSermonLayout,
  "t2-event-list": MinistryBrandsEventList,
  "t2-event-detail": MinistryBrandsEventDetail,
  "t2-event-featured": MinistryBrandsEventFeatured,
  "t2-event-layout": MinistryBrandsEventLayout,
  "t2-event-calendar": MinistryBrandsEventCalendar,
  "t2-group-list": MinistryBrandsGroupList,
  "t2-group-detail": MinistryBrandsGroupDetail,
  "t2-group-featured": MinistryBrandsGroupFeatured,
  "t2-group-slider": MinistryBrandsGroupSlider,
  "t2-group-layout": MinistryBrandsGroupLayout,
  "t2-shopify-price-style1": ShopifyPriceStyle1,
  "t2-shopify-price-style2": ShopifyPriceStyle2,
  "t2-shopify-price-style3": ShopifyPriceStyle3
};

export type IconNames = keyof typeof Icons;

interface Props {
  name: IconNames;
  className?: string;
  style?: CSSProperties;
  onClick?: (e: MouseEvent<SVGElement>) => void;
}

const Icon = (props: Props) => {
  const { name, className, onClick, style } = props;
  const Icon = Icons[name];
  return Icon ? (
    <Icon className={className} style={style} onClick={onClick} />
  ) : null;
};

Icon.displayName = "Icon";

export default Icon;
