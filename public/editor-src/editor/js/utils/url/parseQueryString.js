import _ from "underscore";

export default function parseQueryString(queryString = "") {
  return _.reduce(
    queryString.split("&"),
    (memo, part) => {
      const [key, value] = part.split("=");
      memo[key] = tmp[value];

      return memo;
    },
    {}
  );
}
