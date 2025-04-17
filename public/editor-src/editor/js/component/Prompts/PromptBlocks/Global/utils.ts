import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { assetUrl } from "visual/utils/asset";
import { t } from "visual/utils/i18n";
import { ALL_CAT, UNCATEGORISED_CAT } from "../types";
import { Filter, Thumbnail } from "./types";

type GlobalType = "popup" | "conditionPopup" | "block";

export const getMessage = (type: GlobalType): string => {
  switch (type) {
    case "popup":
    case "conditionPopup": {
      return t("Nothing here yet, make a global popup first.");
    }
    case "block": {
      return t("Nothing here yet, make a global block first.");
    }
  }
};

export const getSrc = (type: GlobalType, config: ConfigCommon): string => {
  switch (type) {
    case "popup": {
      return assetUrl("editor/img/global_popups_toolbar.gif", config);
    }
    case "block": {
      return assetUrl("editor/img/global_toolbar.gif", config);
    }
    case "conditionPopup": {
      return assetUrl("editor/img/global_condition_popups_toolbar.gif", config);
    }
  }
};

export const filterFn = (item: Thumbnail, currentFilter: Filter): boolean => {
  const searchMatch =
    currentFilter.search === "" ||
    new RegExp(
      currentFilter.search.replace(/[.*+?^${}()|[\]\\]/g, ""),
      "i"
    ).test(item.title || "");
  const itemTags = item.tags ?? "";
  const isAll = currentFilter.tags === ALL_CAT;
  const isUnCategorised =
    currentFilter.tags === UNCATEGORISED_CAT && !itemTags.trim();
  const persistTags = itemTags.split(",").includes(currentFilter.tags);
  const tagMatch = isAll || isUnCategorised || persistTags;

  return searchMatch && tagMatch;
};

interface Tag {
  item: string;
  deletable: boolean;
  editable: boolean;
}
export const getTags = (data: Thumbnail[]): Array<Tag> => {
  const tags = new Set([ALL_CAT, UNCATEGORISED_CAT]);

  data
    .map((item) => item.tags?.split(","))
    .flat()
    .forEach((tag) => tag && tags.add(tag));

  return [...tags].map((t) => ({
    item: t,
    deletable: t !== ALL_CAT && t !== UNCATEGORISED_CAT,
    editable: t !== ALL_CAT && t !== UNCATEGORISED_CAT
  }));
};
