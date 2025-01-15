import { Shortcode } from "visual/types";
import getMinistryBrandsEventCalendar from "./MinistryBrandsEventCalendar";
import getMinistryBrandsEventDetail from "./MinistryBrandsEventDetail";
import getMinistryBrandsEventFeatured from "./MinistryBrandsEventFeatured";
import getMinistryBrandsEventLayout from "./MinistryBrandsEventLayout";
import getMinistryBrandsEventList from "./MinistryBrandsEventList";
import getMinistryBrandsFormWidget from "./MinistryBrandsFormWidget";
import getMinistryBrandsGroupDetail from "./MinistryBrandsGroupDetail";
import getMinistryBrandsGroupFeatured from "./MinistryBrandsGroupFeatured";
import getMinistryBrandsGroupLayout from "./MinistryBrandsGroupLayout";
import getMinistryBrandsGroupList from "./MinistryBrandsGroupList";
import getMinistryBrandsGroupSlider from "./MinistryBrandsGroupSlider";
import getMinistryBrandsSermonDetail from "./MinistryBrandsSermonDetail";
import getMinistryBrandsSermonFeatured from "./MinistryBrandsSermonFeatured";
import getMinistryBrandsSermonLayout from "./MinistryBrandsSermonLayout";
import getMinistryBrandsSermonList from "./MinistryBrandsSermonList";

export function sermons(): Shortcode[] {
  return [
    { component: getMinistryBrandsSermonLayout(), pro: false },
    { component: getMinistryBrandsSermonList(), pro: false },
    { component: getMinistryBrandsSermonFeatured(), pro: false },
    { component: getMinistryBrandsSermonDetail(), pro: false }
  ];
}
export function events(): Shortcode[] {
  return [
    { component: getMinistryBrandsEventCalendar(), pro: false },
    { component: getMinistryBrandsEventLayout(), pro: false },
    { component: getMinistryBrandsEventFeatured(), pro: false },
    { component: getMinistryBrandsEventList(), pro: false },
    { component: getMinistryBrandsEventDetail(), pro: false }
  ];
}
export function groups(): Shortcode[] {
  return [
    { component: getMinistryBrandsGroupLayout(), pro: false },
    { component: getMinistryBrandsGroupSlider(), pro: false },
    { component: getMinistryBrandsGroupList(), pro: false },
    { component: getMinistryBrandsGroupFeatured(), pro: false },
    { component: getMinistryBrandsGroupDetail(), pro: false }
  ];
}
export function forms(): Shortcode[] {
  return [{ component: getMinistryBrandsFormWidget(), pro: false }];
}
