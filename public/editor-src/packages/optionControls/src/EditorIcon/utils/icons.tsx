import {
  Duplicate,
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
  MinistryBrandsSermonList,
  Settings
} from "@brizy/ui-icons";
import { IconsName } from "../types";

export const Icons = {
  [IconsName.Duplicate]: Duplicate,
  [IconsName.Settings]: Settings,
  [IconsName["t2-sermon-list"]]: MinistryBrandsSermonList,
  [IconsName["t2-sermon-detail"]]: MinistryBrandsSermonDetail,
  [IconsName["t2-sermon-featured"]]: MinistryBrandsSermonFeatured,
  [IconsName["t2-sermon-layout"]]: MinistryBrandsSermonLayout,
  [IconsName["t2-event-list"]]: MinistryBrandsEventList,
  [IconsName["t2-event-detail"]]: MinistryBrandsEventDetail,
  [IconsName["t2-event-featured"]]: MinistryBrandsEventFeatured,
  [IconsName["t2-event-layout"]]: MinistryBrandsEventLayout,
  [IconsName["t2-event-calendar"]]: MinistryBrandsEventCalendar,
  [IconsName["t2-group-list"]]: MinistryBrandsGroupList,
  [IconsName["t2-group-detail"]]: MinistryBrandsGroupDetail,
  [IconsName["t2-group-featured"]]: MinistryBrandsGroupFeatured,
  [IconsName["t2-group-slider"]]: MinistryBrandsGroupSlider,
  [IconsName["t2-group-layout"]]: MinistryBrandsGroupLayout
};
