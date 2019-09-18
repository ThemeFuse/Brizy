import _ from "underscore";
import Config from "visual/global/Config";
import { objectToQueryString } from "visual/utils/url";

export const getFilter = options => {
  const roundedOptions = _.mapObject(options, val =>
    val === "number" ? Math.round(val) : val
  );

  return objectToQueryString(roundedOptions);
};

export default function imageUrl(
  imageSrc,
  options = {
    iW: 5000,
    iH: "any"
  }
) {
  if (imageSrc) {
    const filter = getFilter(options);
    return [Config.get("urls").image, filter, imageSrc].join("/");
  }

  return null;
}
