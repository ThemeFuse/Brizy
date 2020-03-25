import { t } from "visual/utils/i18n";
import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";
import { getTaxonomies } from "visual/utils/options";

export function toolbarElementPostsTaxonomy({
  v,
  device,
  devices = "all",
  state
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  return {
    id: dvk("taxonomy"),
    label: t("Categories"),
    className: "brz-ed-option__select-taxonomy",
    type: "select",
    devices,
    choices: getTaxonomies(),
    value: `${dvv("taxonomy")}|${dvv("taxonomyId")}`,

    onChange: _taxonomy => {
      const [taxonomy, taxonomyId] = _taxonomy.split("|");

      return {
        [dvk("taxonomy")]: taxonomy,
        [dvk("taxonomyId")]: taxonomyId
      };
    }
  };
}

export function toolbarElementPostsOrder({
  v,
  device,
  devices = "all",
  state
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  return {
    id: dvk("order"),
    label: t("Order"),
    devices,
    type: "radioGroup",
    choices: [
      {
        value: "ASC",
        icon: "nc-up"
      },
      {
        value: "DESC",
        icon: "nc-down"
      }
    ],
    value: dvv("order")
  };
}

export function toolbarElementPostsPagination({
  v,
  device,
  devices = "all",
  state
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  return {
    type: "multiPicker",
    devices,
    picker: {
      id: dvk("pagination"),
      label: t("Pagination"),
      type: "switch",
      value: dvv("pagination")
    },
    choices: {
      on: [
        {
          id: dvk("paginationSpacing"),
          label: t("Spacing"),
          type: "slider",
          slider: {
            min: 0,
            max: 100
          },
          input: {
            show: true,
            min: 0
          },
          suffix: {
            show: true,
            choices: [
              {
                title: "px",
                value: "px"
              }
            ]
          },
          value: {
            value: dvv("paginationSpacing")
          },
          onChange: ({ value }) => ({
            [dvk("paginationSpacing")]: value
          })
        }
      ]
    }
  };
}
