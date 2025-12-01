import { ElementModel } from "visual/component/Elements/Types";
import { ComponentsMeta } from "visual/editorComponents/EditorComponent/types";
import { Switch } from "visual/editorComponents/MinistryBrands/utils/types";
import { WithClassName } from "visual/types/attributes";

export interface Props extends WithClassName {
  meta: ComponentsMeta;
}

export interface Value extends ElementModel {
  columnNumber: number;
  countPerPage: number;

  showImages: Switch;
  showVideo: Switch;
  showAudio: Switch;
  showMediaLinks: Switch;
  showTitle: Switch;
  showDate: Switch;
  showCategory: Switch;
  showGroups: Switch;
  showAuthor: Switch;
  showSeries: Switch;
  showSearch: Switch;
  showMetaHeadings: Switch;
  showPreview: Switch;
  showPagination: Switch;
  showMetaIcons: Switch;

  detailPage: string;
  detailButtonText: string;

  parentCategory: string;
  showCategoryFilter: Switch;

  categoryFilterParent: string;
  categoryFilterHeading: string;

  showGroupFilter: Switch;
  showSeriesFilter: Switch;
  showAuthorFilter: Switch;

  groupFilterHeading: string;
  seriesFilterHeading: string;
  authorFilterHeading: string;

  searchPlaceholder: string;

  addCategoryFilter: Switch;
  addCategoryFilterParent: string;
  addCategoryFilterHeading: string;
  addCategoryFilter2: Switch;
  addCategoryFilterParent2: string;
  addCategoryFilterHeading2: string;
  addCategoryFilter3: Switch;
  addCategoryFilterParent3: string;
  addCategoryFilterHeading3: string;
}
