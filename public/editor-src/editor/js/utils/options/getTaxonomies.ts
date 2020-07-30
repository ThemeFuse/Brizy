import Config from "visual/global/Config";

type SelectChoices = {
  title: string;
  value?: string;
  optgroup?: SelectChoices[];
};

type Taxonomies = {
  id: string;
  label: string;
  name: string;
  terms?: Taxonomies[];
};

type PostTypes = {
  id: string;
  name: string;
  label: string;
  taxonomies?: [{ id: string; name: string }];
};

export const getTaxonomies = (): SelectChoices[] => {
  const taxonomies: Taxonomies[] | undefined = Config.get("taxonomies");

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

export const getTaxonomiesMultiOptions = (): SelectChoices[] => {
  const postTypesTaxs: PostTypes[] | undefined = Config.get("postTypesTaxs");

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
  const postTypesTaxs: PostTypes[] | undefined = Config.get("postTypesTaxs");

  if (!taxonomies || !postTypesTaxs) {
    return [{ title: "-", value: "" }];
  }

  return postTypesTaxs
    .filter(
      item =>
        item.taxonomies && item.taxonomies.length && item.name === taxonomies
    )
    .reduce(
      (acc, curr) => {
        if (curr.taxonomies) {
          const taxonomies = curr.taxonomies.map(item => ({
            value: item.id,
            title: item.name
          }));
          return acc.concat(taxonomies);
        }

        return acc;
      },
      [] as SelectChoices[]
    );
};
