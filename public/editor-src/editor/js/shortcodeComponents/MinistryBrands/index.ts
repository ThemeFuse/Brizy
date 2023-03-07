import { Shortcode } from "visual/types";
import MinistryBrandsEventCalendar from "./MinistryBrandsEventCalendar";
import MinistryBrandsEventDetail from "./MinistryBrandsEventDetail";
import MinistryBrandsEventFeatured from "./MinistryBrandsEventFeatured";
import MinistryBrandsEventLayout from "./MinistryBrandsEventLayout";
import MinistryBrandsEventList from "./MinistryBrandsEventList";
import MinistryBrandsFormWidget from "./MinistryBrandsFormWidget";
import MinistryBrandsGroupDetail from "./MinistryBrandsGroupDetail";
import MinistryBrandsGroupFeatured from "./MinistryBrandsGroupFeatured";
import MinistryBrandsGroupLayout from "./MinistryBrandsGroupLayout";
import MinistryBrandsGroupList from "./MinistryBrandsGroupList";
import MinistryBrandsGroupSlider from "./MinistryBrandsGroupSlider";
import MinistryBrandsSermonDetail from "./MinistryBrandsSermonDetail";
import MinistryBrandsSermonFeatured from "./MinistryBrandsSermonFeatured";
import MinistryBrandsSermonLayout from "./MinistryBrandsSermonLayout";
import MinistryBrandsSermonList from "./MinistryBrandsSermonList";

const config: Shortcode[] = [
  { component: MinistryBrandsGroupLayout, pro: false },
  { component: MinistryBrandsGroupSlider, pro: false },
  { component: MinistryBrandsEventLayout, pro: false },
  { component: MinistryBrandsEventCalendar, pro: false },
  { component: MinistryBrandsSermonLayout, pro: false },
  { component: MinistryBrandsSermonList, pro: false },
  { component: MinistryBrandsSermonFeatured, pro: false },
  { component: MinistryBrandsSermonDetail, pro: false },
  { component: MinistryBrandsGroupList, pro: false },
  { component: MinistryBrandsGroupDetail, pro: false },
  { component: MinistryBrandsEventFeatured, pro: false },
  { component: MinistryBrandsGroupFeatured, pro: false },
  { component: MinistryBrandsEventList, pro: false },
  { component: MinistryBrandsEventDetail, pro: false },
  { component: MinistryBrandsFormWidget, pro: false }
];

export default config;
