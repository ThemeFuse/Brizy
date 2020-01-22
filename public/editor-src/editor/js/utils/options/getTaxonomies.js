import Config from "visual/global/Config";

export const getTaxonomies = () => {
  const taxonomies = Config.get("taxonomies");

  if (!taxonomies) {
    return [
      {
        title: "-",
        value: ""
      }
    ];
  }

  return taxonomies.map(taxonomy => {
    const { id = "", label = "", name = "", terms = [] } = taxonomy;

    if (!id && !label && !name && !terms && terms.length === 0) {
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
