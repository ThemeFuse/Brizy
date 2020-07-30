import { t } from "visual/utils/i18n";
import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";

export function toolbarElementCarouselTaxonomy({
  v,
  device,
  state,
  choices = [],
  disabled = false,
  devices = "all"
}) {
  const dvv = key => defaultValueValue({ v, key, device, state });
  const dvk = key => defaultValueKey({ key, device, state });

  return {
    id: dvk("taxonomy"),
    label: t("Categories"),
    disabled,
    devices,
    type: "select",
    choices,
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

export function toolbarElementCarouselPadding({
  v,
  device,
  state,
  disabled = false,
  devices = "all"
}) {
  const dvv = key => defaultValueValue({ v, key, device, state });
  const dvk = key => defaultValueKey({ key, device, state });

  return {
    id: "sliderPaddingType",
    type: "group-dev",
    disabled,
    devices,
    position: 50,
    options: [
      {
        id: "sliderPaddingType",
        label: t("Padding"),
        type: "radioGroup-dev",
        choices: [
          { value: "grouped", icon: "nc-styling-all" },
          { value: "ungrouped", icon: "nc-styling-individual" }
        ]
      },
      {
        id: dvk("sliderPadding"),
        type: "slider",
        disabled: dvv("sliderPaddingType") !== "grouped",
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
            { title: "px", value: "px" },
            { title: "%", value: "%" }
          ]
        },
        value: {
          value: dvv("sliderPadding"),
          suffix: dvv("sliderPaddingSuffix")
        },
        onChange: ({ value: sliderPadding, suffix: sliderPaddingSuffix }) => {
          return {
            [dvk("sliderPadding")]: sliderPadding,
            [dvk("sliderPaddingSuffix")]: sliderPaddingSuffix,
            [dvk("sliderPaddingTop")]: sliderPadding,
            [dvk("sliderPaddingRight")]: sliderPadding,
            [dvk("sliderPaddingBottom")]: sliderPadding,
            [dvk("sliderPaddingLeft")]: sliderPadding
          };
        }
      },
      {
        id: dvk("sliderPaddingTop"),
        icon: "nc-styling-top",
        type: "slider",
        disabled: dvv("sliderPaddingType") !== "ungrouped",
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
            { title: "px", value: "px" },
            { title: "%", value: "%" }
          ]
        },
        value: {
          value: dvv("sliderPaddingTop"),
          suffix: dvv("sliderPaddingTopSuffix")
        },
        onChange: ({
          value: sliderPaddingTop,
          suffix: sliderPaddingTopSuffix
        }) => {
          return {
            [dvk("sliderPaddingTop")]: sliderPaddingTop,
            [dvk("sliderPaddingTopSuffix")]: sliderPaddingTopSuffix,
            [dvk("sliderPadding")]:
              sliderPaddingTop === dvv("sliderPaddingRight") &&
              sliderPaddingTop === dvv("sliderPaddingLeft") &&
              sliderPaddingTop === dvv("sliderPaddingBottom")
                ? sliderPaddingTop
                : dvv("sliderPadding")
          };
        }
      },
      {
        id: dvk("sliderPaddingRight"),
        icon: "nc-styling-right",
        type: "slider",
        disabled: dvv("sliderPaddingType") !== "ungrouped",
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
            { title: "px", value: "px" },
            { title: "%", value: "%" }
          ]
        },
        value: {
          value: dvv("sliderPaddingRight"),
          suffix: dvv("sliderPaddingRightSuffix")
        },
        onChange: ({
          value: sliderPaddingRight,
          suffix: sliderPaddingRightSuffix
        }) => {
          return {
            [dvk("sliderPaddingRight")]: sliderPaddingRight,
            [dvk("sliderPaddingRightSuffix")]: sliderPaddingRightSuffix,
            [dvk("sliderPadding")]:
              sliderPaddingRight === dvv("sliderPaddingTop") &&
              sliderPaddingRight === dvv("sliderPaddingLeft") &&
              sliderPaddingRight === dvv("sliderPaddingBottom")
                ? sliderPaddingRight
                : dvv("sliderPadding")
          };
        }
      },
      {
        id: dvk("sliderPaddingBottom"),
        icon: "nc-styling-bottom",
        type: "slider",
        disabled: dvv("sliderPaddingType") !== "ungrouped",
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
            { title: "px", value: "px" },
            { title: "%", value: "%" }
          ]
        },
        value: {
          value: dvv("sliderPaddingBottom"),
          suffix: dvv("sliderPaddingBottomSuffix")
        },
        onChange: ({
          value: sliderPaddingBottom,
          suffix: sliderPaddingBottomSuffix
        }) => {
          return {
            [dvk("sliderPaddingBottom")]: sliderPaddingBottom,
            [dvk("sliderPaddingBottomSuffix")]: sliderPaddingBottomSuffix,
            [dvk("sliderPadding")]:
              sliderPaddingBottom === dvv("sliderPaddingRight") &&
              sliderPaddingBottom === dvv("sliderPaddingLeft") &&
              sliderPaddingBottom === dvv("sliderPaddingTop")
                ? sliderPaddingBottom
                : dvv("sliderPadding")
          };
        }
      },
      {
        id: dvk("sliderPaddingLeft"),
        icon: "nc-styling-left",
        type: "slider",
        disabled: dvv("sliderPaddingType") !== "ungrouped",
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
            { title: "px", value: "px" },
            { title: "%", value: "%" }
          ]
        },
        value: {
          value: dvv("sliderPaddingLeft"),
          suffix: dvv("sliderPaddingLeftSuffix")
        },
        onChange: ({
          value: sliderPaddingLeft,
          suffix: sliderPaddingLeftSuffix
        }) => {
          return {
            [dvk("sliderPaddingLeft")]: sliderPaddingLeft,
            [dvk("sliderPaddingLeftSuffix")]: sliderPaddingLeftSuffix,
            [dvk("sliderPadding")]:
              sliderPaddingLeft === dvv("sliderPaddingRight") &&
              sliderPaddingLeft === dvv("sliderPaddingTop") &&
              sliderPaddingLeft === dvv("sliderPaddingBottom")
                ? sliderPaddingLeft
                : dvv("sliderPadding")
          };
        }
      }
    ]
  };
}
