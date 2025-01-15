import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";

type SelectChoices = {
  title: string;
  value?: string;
  optgroup?: SelectChoices[];
};

export const getTaxonomies = (
  taxonomies: ConfigCommon["taxonomies"]
): SelectChoices[] => {
  if (!taxonomies) {
    return [{ title: "-", value: "" }];
  }

  return taxonomies.map((taxonomy) => {
    const { id = "", label = "", name = "", terms = [] } = taxonomy;

    if (!id && !label && !name) {
      return {
        title: "-",
        value: ""
      };
    }

    if (terms && terms.length) {
      return {
        title: label,
        optgroup: terms.map((term) => ({
          title: term.name,
          value: `${name}|${term.id}`
        }))
      };
    }

    return {
      title: label,
      value: `${name}|${id}`
    };
  });
};

export const getTaxonomiesMultiOptions = (
  postTypesTaxs: ConfigCommon["postTypesTaxs"]
): SelectChoices[] => {
  if (!postTypesTaxs) {
    return [{ title: "-", value: "" }];
  }

  return postTypesTaxs.map((i) => ({
    value: i.name,
    title: i.label
  }));
};

export const getTaxonomiesMultiOptionsSub = (
  postTypesTaxs: ConfigCommon["postTypesTaxs"],
  taxonomies: string
): SelectChoices[] => {
  if (!taxonomies || !postTypesTaxs) {
    return [{ title: "-", value: "" }];
  }

  return postTypesTaxs
    .filter(
      (item) =>
        item.taxonomies && item.taxonomies.length && item.name === taxonomies
    )
    .reduce((acc, curr) => {
      if (curr.taxonomies) {
        const taxonomies = curr.taxonomies.map((item) => ({
          value: item.id,
          title: item.name
        }));
        return acc.concat(taxonomies);
      }

      return acc;
    }, [] as SelectChoices[]);
};
