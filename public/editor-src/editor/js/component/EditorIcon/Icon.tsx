import {
  MinistryBrandsEventCalendar,
  MinistryBrandsEventDetail,
  MinistryBrandsEventFeatured,
  MinistryBrandsEventLayout,
  MinistryBrandsEventList,
  MinistryBrandsGroupDetail,
  MinistryBrandsGroupFeatured,
  MinistryBrandsGroupLayout,
  MinistryBrandsGroupList,
  MinistryBrandsGroupSlider,
  MinistryBrandsSermonDetail,
  MinistryBrandsSermonFeatured,
  MinistryBrandsSermonLayout,
  MinistryBrandsSermonList
} from "@brizy/ui-icons";
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
  "t2-group-layout": MinistryBrandsGroupLayout
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
