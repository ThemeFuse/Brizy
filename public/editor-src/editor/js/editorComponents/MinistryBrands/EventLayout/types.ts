import type { ElementModel } from "visual/component/Elements/Types";
import type { ComponentsMeta } from "visual/editorComponents/EditorComponent";
import type { WithClassName } from "visual/utils/options/attributes";
import { Switch } from "../utils/types";

export interface Props extends WithClassName {
  meta: ComponentsMeta;
}

export interface Value extends ElementModel {
  showFeaturedView: Switch;
  featuredViewOrder: number;
  featuredViewHeading: string;
  howManyFeatured: number;
  showFeaturedImages: Switch;
  showFeaturedPreview: Switch;
  showFeaturedTitle: Switch;
  showFeaturedDate: Switch;

  showListView: Switch;
  listViewOrder: number;
  listViewHeading: string;

  showCalendarView: Switch;
  calendarViewOrder: number;
  calendarViewHeading: string;

  parentCategory: string;
  showCategoryFilter: Switch;
  categoryFilterParent: string;
  categoryFilterList: string;
  categoryFilterHeading: string;

  addCategoryFilter: Switch;
  addCategoryFilterParent: string;
  addCategoryFilterList: string;
  addCategoryFilterHeading: string;

  addCategoryFilter2: Switch;
  addCategoryFilterParent2: string;
  addCategoryFilterList2: string;
  addCategoryFilterHeading2: string;

  addCategoryFilter3: Switch;
  addCategoryFilterParent3: string;
  addCategoryFilterList3: string;
  addCategoryFilterHeading3: string;

  showGroupFilter: Switch;
  groupFilterHeading: string;

  showSearch: Switch;
  searchPlaceholder: string;

  howmanymonths: number;
  eventDetailPage: string;
}
