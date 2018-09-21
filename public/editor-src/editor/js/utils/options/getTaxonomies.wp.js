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
    const { label, name, terms } = taxonomy;

    return {
      title: label,
      optgroup: terms.map(term => ({
        title: term.name,
        value: `${name}|${term.id}`
      }))
    };
  });
};
