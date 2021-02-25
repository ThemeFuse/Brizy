import { t } from "visual/utils/i18n";

export const title = t("Text");

const getBlockTag = value => {
  switch (value) {
    case "p":
      return {
        pre: false,
        header: null
      };
    case "pre":
      return {
        header: false,
        pre: value
      };
    default:
      return {
        pre: false,
        header: value
      };
  }
};

export default function(v, onChange) {
  return { getItems: getItems(v, onChange) };
}

const getItems = (v, onChange) => () => {
  const isPopulationBlock = v.population && v.population.display === "block";

  return [
    {
      id: "settingsTabs",
      type: "tabs-dev",
      config: {
        align: "start"
      },
      devices: "desktop",
      tabs: [
        {
          id: "moreSettingsAdvanced",
          label: t("Advanced"),
          icon: "nc-cog",
          options: [
            {
              id: "tag",
              label: t("HTML Tag"),
              type: "select",
              className: "brz-control__select--small",
              disabled: isPopulationBlock,
              choices: [
                { title: t("P"), value: "p" },
                { title: t("H1"), value: "h1" },
                { title: t("H2"), value: "h2" },
                { title: t("H3"), value: "h3" },
                { title: t("H4"), value: "h4" },
                { title: t("H5"), value: "h5" },
                { title: t("H6"), value: "h6" },
                { title: t("PRE"), value: "pre" }
              ],
              onChange: tagName => onChange(getBlockTag(tagName)),
              value: v.tagName
            }
          ]
        }
      ]
    }
  ];
};
