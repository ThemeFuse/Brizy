import { Chart } from "@brizy/builder-icons/src/Icons/Chart";
import { InstagramFeed } from "@brizy/builder-icons/src/Icons/InstagramFeed";
import { LinkedinFeed } from "@brizy/builder-icons/src/Icons/LinkedinFeed";
import { PayPal } from "@brizy/builder-icons/src/Icons/PayPal";
import { Reorder } from "@brizy/builder-icons/src/Icons/Reorder";
import { ShopifyList } from "@brizy/builder-icons/src/Icons/ShopifyList";
import { ShopifyMeta } from "@brizy/builder-icons/src/Icons/ShopifyMeta";
import { ShopifyMetafield } from "@brizy/builder-icons/src/Icons/ShopifyMetafield";
import { ShopifyPriceStyle1 } from "@brizy/builder-icons/src/Icons/ShopifyPriceStyle1";
import { ShopifyPriceStyle2 } from "@brizy/builder-icons/src/Icons/ShopifyPriceStyle2";
import { ShopifyPriceStyle3 } from "@brizy/builder-icons/src/Icons/ShopifyPriceStyle3";
import { ShopifyQuantity } from "@brizy/builder-icons/src/Icons/ShopifyQuantity";
import { ShopifyQuantityStyle1 } from "@brizy/builder-icons/src/Icons/ShopifyQuantityStyle1";
import { ShopifyQuantityStyle2 } from "@brizy/builder-icons/src/Icons/ShopifyQuantityStyle2";
import { ShopifyVariant } from "@brizy/builder-icons/src/Icons/ShopifyVariant";
import { ShopifyVariantStyleImage } from "@brizy/builder-icons/src/Icons/ShopifyVariantStyleImage";
import { ShopifyVariantStyleRadio } from "@brizy/builder-icons/src/Icons/ShopifyVariantStyleRadio";
import { ShopifyVariantStyleSelect } from "@brizy/builder-icons/src/Icons/ShopifyVariantStyleSelect";
import { ShopifyVendor } from "@brizy/builder-icons/src/Icons/ShopifyVendor";
import { MinistryBrandsArticleDetail } from "@brizy/ui-icons/es/icons/MinistryBrandsArticleDetail";
import { MinistryBrandsArticleLayout } from "@brizy/ui-icons/es/icons/MinistryBrandsArticleLayout";
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
import { MinistryBrandsStaffList } from "@brizy/ui-icons/es/icons/MinistryBrandsStaffList";
import { StarShapes } from "@brizy/ui-icons/es/icons/StarShapes";
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
  "t2-article-detail": MinistryBrandsArticleDetail,
  "t2-article-list": MinistryBrandsArticleLayout,
  "t2-staff-detail": MinistryBrandsStaffList,
  "t2-shopify-price-style1": ShopifyPriceStyle1,
  "t2-shopify-price-style2": ShopifyPriceStyle2,
  "t2-shopify-price-style3": ShopifyPriceStyle3,
  "t2-shopify-list": ShopifyList,
  "t2-shopify-meta": ShopifyMeta,
  "t2-shopify-metafield": ShopifyMetafield,
  "t2-shopify-quantity": ShopifyQuantity,
  "t2-shopify-quantity-style1": ShopifyQuantityStyle1,
  "t2-shopify-quantity-style2": ShopifyQuantityStyle2,
  "t2-shopify-variant": ShopifyVariant,
  "t2-shopify-vendor": ShopifyVendor,
  "t2-shopify-variant-style-select": ShopifyVariantStyleSelect,
  "t2-shopify-variant-style-radio": ShopifyVariantStyleRadio,
  "t2-shopify-variant-style-image": ShopifyVariantStyleImage,
  "t2-star-shapes": StarShapes,
  "t2-paypal": PayPal,
  "t2-instagram-feed": InstagramFeed,
  "t2-linkedin-feed": LinkedinFeed,
  "t2-reorder": Reorder,
  "t2-chart": Chart
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
