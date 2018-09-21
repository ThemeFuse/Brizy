import { getTaxonomies } from "visual/utils/options";
import { t } from "visual/utils/i18n";

export function getItemsForDesktop(v) {
  return [
    {
      id: "toolbarPosts",
      type: "popover",
      icon: "nc-wp-shortcode",
      title: t("Posts"),
      roles: ["admin"],
      position: 80,
      options: [
        {
          id: "gridColumn",
          label: t("Column"),
          type: "slider",
          slider: {
            min: 1,
            max: 6
          },
          input: {
            show: true,
            min: 1,
            max: 6
          },
          value: {
            value: v.gridColumn
          },
          onChange: ({ value: gridColumn }) => ({
            gridColumn
          })
        },
        {
          id: "gridRow",
          label: t("Row"),
          type: "slider",
          slider: {
            min: 1,
            max: 10
          },
          input: {
            show: true,
            min: 1,
            max: 10
          },
          value: {
            value: v.gridRow
          },
          onChange: ({ value: gridRow }) => ({ gridRow })
        },
        {
          id: "padding",
          label: t("Padding"),
          type: "slider",
          position: 20,
          slider: {
            min: 0,
            max: 100
          },
          input: {
            show: true,
            min: 0,
            max: 100
          },
          value: {
            value: v.padding
          },
          onChange: ({ value: padding }) => ({
            padding
          })
        },
        {
          id: "taxonomy",
          label: t("Taxonomy"),
          className: "brz-ed-option__select-taxonomy",
          type: "select",
          choices: getTaxonomies(),
          value: `${v.taxonomy}|${v.taxonomyId}`,
          onChange: _taxonomy => {
            const [taxonomy, taxonomyId] = _taxonomy.split("|");

            return {
              taxonomy,
              taxonomyId
            };
          }
        }
      ]
    }
  ];
}

export function getItemsForMobile(v) {
  return [
    {
      id: "mobileToolbarPosts",
      type: "popover",
      icon: "nc-wp-shortcode",
      title: t("Posts"),
      roles: ["admin"],
      position: 80,
      options: [
        {
          id: "mobilePadding",
          label: t("Padding"),
          type: "slider",
          slider: {
            min: 0,
            max: 100
          },
          input: {
            show: true,
            min: 0,
            max: 100
          },
          value: {
            value: v.mobilePadding === null ? v.padding : v.mobilePadding
          },
          onChange: ({ value: mobilePadding }) => ({
            mobilePadding
          })
        }
      ]
    }
  ];
}
