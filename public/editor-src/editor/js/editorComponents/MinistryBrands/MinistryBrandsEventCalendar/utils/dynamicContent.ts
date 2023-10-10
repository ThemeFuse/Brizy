import { makePlaceholder } from "visual/utils/dynamicContent";
import { getAttr, getDetail, getFeatures } from "../../utils/helpers";
import { Value } from "../types";

export const getPlaceholder = (v: Value): string => {
  const {
    category,
    group,
    showEventTime,
    numberOfMonths,
    features,
    nonfeatures,
    detailPage
  } = v;

  const attr = [
    `category='${category}'`,
    `group='${group}'`,
    getFeatures(features, "features"),
    getFeatures(nonfeatures, "nonfeatures"),
    `howmanymonths='${numberOfMonths}'`,
    `detail_page='${getDetail(detailPage)}'`,
    getAttr(showEventTime, "time")
  ];

  return makePlaceholder({
    content: "{{ekk_event_calendar}}",
    attrStr: attr.join(" ")
  });
};
