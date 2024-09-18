import type { ElementModel } from "visual/component/Elements/Types";
import type { ComponentsMeta } from "visual/editorComponents/EditorComponent/types";
import type { WithClassName } from "visual/types/attributes";
import type { Switch } from "../utils/types";

export interface Props extends WithClassName {
  meta: ComponentsMeta;
}

export interface Value extends ElementModel {
  showImages: Switch;
  showMeetingDay: Switch;
  showCategory: Switch;
  showGroup: Switch;
  showStatus: Switch;
  showChildcare: Switch;
  showResourceLink: Switch;
  showPreview: Switch;
  detailPage: string;
  source: string;
  detailPageTitle: string;
  detailButtonText: string;
  countPerPage: number;
  parentCategory: string;
  showCategoryFilter: Switch;
  categoryFilterParent: string;
  categoryFilterHeading: string;
  showGroupFilter: Switch;
  groupFilterHeading: string;
  showSearch: Switch;
  searchPlaceholder: string;
  showPagination: Switch;
  showMetaIcons: Switch;
  addCategoryFilter: Switch;
  addCategoryFilterParent: string;
  addCategoryFilterHeading: string;
  addCategoryFilter2: Switch;
  addCategoryFilterParent2: string;
  addCategoryFilterHeading2: string;
  addCategoryFilter3: Switch;
  addCategoryFilterParent3: string;
  addCategoryFilterHeading3: string;
  dateFormat: string;
  groupSlug: string;
}
