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

export function toolbarElementPostsColumns({
  v,
  device,
  devices = "all",
  state
}) {
  const max = device === "desktop" ? 6 : Math.min(v.gridColumn * v.gridRow, 6);

  return {
    id: defaultValueKey({ key: "gridColumn", device, state }),
    type: "slider",
    label: t("Columns"),
    devices,
    className: "brz-ed-option__slider--skin-dev",
    slider: {
      min: 1,
      max,
      step: 1
    },
    input: {
      show: true,
      min: 1,
      max,
      step: 1
    },
    value: {
      value: defaultValueValue({ v, key: "gridColumn", device, state }),
      suffix: null
    },
    onChange: ({ value }) => {
      const key = defaultValueKey({ key: "gridColumn", device, state });
      const ret = {
        [key]: value,
        [`${key}Suffix`]: "" // mimic the value of slider-dev
      };

      // this is done to avoid situations where the number of items
      // that ought to be shown on responsive is greater than on desktop,
      // thus breaking the pagination
      // (because the server will render only as many items as are needed for desktop)
      if (device === "desktop") {
        const maxGridColumnsResponsive = Number(value) * Number(v.gridRow);

        if (maxGridColumnsResponsive < v.tabletGridColumn) {
          ret.tabletGridColumn = maxGridColumnsResponsive;
        }

        if (maxGridColumnsResponsive < v.mobileGridColumn) {
          ret.mobileGridColumn = maxGridColumnsResponsive;
        }
      }

      return ret;
    }
  };
}

export function toolbarElementPostsRows({ v, device, devices = "all", state }) {
  return {
    id: defaultValueKey({ key: "gridRow", device, state }),
    type: "slider",
    label: t("Rows"),
    devices,
    className: "brz-ed-option__slider--skin-dev",
    slider: {
      min: 1,
      max: 10,
      step: 1
    },
    input: {
      show: true,
      min: 1,
      max: 10,
      step: 1
    },
    value: {
      value: defaultValueValue({ v, key: "gridRow", device, state }),
      suffix: null
    },
    onChange: ({ value }) => {
      const key = defaultValueKey({ key: "gridRow", device, state });
      const ret = {
        [key]: value,
        [`${key}Suffix`]: "" // mimic the value of slider-dev
      };

      // this is done to avoid situations where the number of items
      // that ought to be shown on responsive is greater than on desktop,
      // thus breaking the pagination
      // (because the server will render only as many items as are needed for desktop)
      if (device === "desktop") {
        const maxGridColumnsResponsive = Number(value) * Number(v.gridColumn);

        if (maxGridColumnsResponsive < v.tabletGridColumn) {
          ret.tabletGridColumn = maxGridColumnsResponsive;
        }

        if (maxGridColumnsResponsive < v.mobileGridColumn) {
          ret.mobileGridColumn = maxGridColumnsResponsive;
        }
      }

      return ret;
    }
  };
}
