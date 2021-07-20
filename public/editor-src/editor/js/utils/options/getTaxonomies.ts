import Config from "visual/global/Config";

type SelectChoices = {
  title: string;
  value?: string;
  optgroup?: SelectChoices[];
};

export const getTaxonomies = (
  taxonomies = Config.getAll().taxonomies
): SelectChoices[] => {
  if (!taxonomies) {
    return [{ title: "-", value: "" }];
  }

  return taxonomies.map(taxonomy => {
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
        optgroup: terms.map(term => ({
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

export const getTaxonomiesFilter = (type = ""): SelectChoices[] => {
  const taxonomies = Config.getAll().taxonomies.filter(item => {
    const { name } = item;

    if (type === "products") {
      return name.indexOf("product") > -1;
    }
    if (type === "posts") {
      return name.indexOf("product") < 0;
    }
    return item;
  });

  return getTaxonomies(taxonomies);
};

export const getTaxonomiesMultiOptions = (): SelectChoices[] => {
  const postTypesTaxs = Config.getAll().postTypesTaxs;

  if (!postTypesTaxs) {
    return [{ title: "-", value: "" }];
  }

  return postTypesTaxs.map(i => ({
    value: i.name,
    title: i.label
  }));
};

export const getTaxonomiesMultiOptionsSub = (
  taxonomies: string
): SelectChoices[] => {
  const postTypesTaxs = Config.getAll().postTypesTaxs;

  if (!taxonomies || !postTypesTaxs) {
    return [{ title: "-", value: "" }];
  }

  return postTypesTaxs
    .filter(
      item =>
        item.taxonomies && item.taxonomies.length && item.name === taxonomies
    )
    .reduce((acc, curr) => {
      if (curr.taxonomies) {
        const taxonomies = curr.taxonomies.map(item => ({
          value: item.id,
          title: item.name
        }));
        return acc.concat(taxonomies);
      }

      return acc;
    }, [] as SelectChoices[]);
};
