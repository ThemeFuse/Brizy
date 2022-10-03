import _ from "underscore";
import { objectToQueryString } from "visual/utils/url";
import { FilterOption } from "./types";

export const getFilter = (options: FilterOption): string => {
  const roundedOptions = _.mapObject(options, (val) =>
    typeof val === "number" ? Math.round(val) : val
  );

  return objectToQueryString(roundedOptions);
};
