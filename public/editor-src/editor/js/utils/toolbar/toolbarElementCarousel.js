import { t } from "visual/utils/i18n";
import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";

export function toolbarElementCarouselAutoPlay({
  v,
  device,
  state,
  disabled = false,
  devices = "all"
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  return {
    devices,
    disabled,
    type: "multiPicker",
    picker: {
      id: dvk("sliderAutoPlay"),
      label: t("Auto Play"),
      type: "switch",
      value: dvv("sliderAutoPlay")
    },
    choices: {
      on: [
        {
          id: "sliderAutoPlaySpeed",
          label: t("Speed"),
          type: "slider-dev",
          config: {
            min: 1,
            max: 6,
            units: [{ value: "s", title: "s" }]
          }
        }
      ]
    }
  };
}

export function toolbarElementCarouselNavigationArrow({
  v,
  device,
  state,
  devices = "all",
  disabled = false
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  return {
    devices,
    disabled,
    type: "multiPicker",
    picker: {
      id: dvk("sliderArrows"),
      label: t("Arrows"),
      type: "select",
      choices: [
        {
          title: t("None"),
          icon: "nc-none",
          value: "none"
        },
        {
          title: t("Thin"),
          icon: "nc-right-arrow-thin",
          value: "thin"
        },
        {
          title: t("Heavy"),
          icon: "nc-right-arrow-heavy",
          value: "heavy"
        },
        {
          title: t("Tail"),
          icon: "nc-right-arrow-tail",
          value: "tail"
        },
        {
          title: t("Round"),
          icon: "nc-right-arrow-filled",
          value: "filled"
        },
        {
          title: t("Outline"),
          icon: "nc-right-arrow-outline",
          value: "outline"
        }
      ],
      value: dvv("sliderArrows")
    },
    choices: {
      [dvv("sliderArrows")]: [
        {
          id: "sliderArrowsSpacing",
          label: t("Spacing"),
          type: "slider-dev",
          config: {
            min: 0,
            max: 100,
            units: [{ value: "px", title: "px" }]
          }
        }
      ],
      none: []
    }
  };
}

export function toolbarElementCarouselNavigationDots({
  v,
  device,
  state,
  disabled = false,
  devices = "all"
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  return {
    id: dvk("sliderDots"),
    label: t("Dots"),
    type: "select",
    devices,
    disabled,
    choices: [
      {
        title: t("None"),
        icon: "nc-none",
        value: "none"
      },
      {
        title: t("Circle"),
        icon: "nc-circle-outline",
        value: "circle"
      },
      {
        title: t("Diamond"),
        icon: "nc-diamond-outline",
        value: "diamond"
      },
      {
        title: t("Square"),
        icon: "nc-square-outline",
        value: "square"
      }
    ],
    value: dvv("sliderDots")
  };
}

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

export function toolbarElementCarouselOrderBy({
  v,
  device,
  state,
  devices = "all",
  disabled = false
}) {
  const dvv = key => defaultValueValue({ v, key, device, state });
  const dvk = key => defaultValueKey({ key, device, state });

  return {
    id: dvk("orderBy"),
    label: t("Filter By"),
    devices,
    disabled,
    type: "select",
    choices: [
      { title: t("ID"), value: "ID" },
      { title: t("Title"), value: "title" },
      { title: t("Date"), value: "date" },
      { title: t("Random"), value: "rand" },
      { title: t("Comment Count"), value: "comment_count" }
    ],
    value: dvv("orderBy")
  };
}

export function toolbarElementCarouselOrder({
  v,
  device,
  state,
  devices = "all",
  disabled = false
}) {
  const dvv = key => defaultValueValue({ v, key, device, state });
  const dvk = key => defaultValueKey({ key, device, state });

  return {
    type: "multiPicker",
    disabled,
    devices,
    picker: {
      id: dvk("order"),
      label: t("Order"),
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
    id: dvk("sliderPaddingType"),
    type: "multiPicker",
    value: dvv("sliderPaddingType"),
    disabled,
    devices,
    position: 50,
    picker: {
      id: dvk("sliderPaddingType"),
      label: t("Padding"),
      type: "radioGroup",
      choices: [
        {
          value: "grouped",
          icon: "nc-styling-all"
        },
        {
          value: "ungrouped",
          icon: "nc-styling-individual"
        }
      ],
      value: dvv("sliderPaddingType")
    },
    choices: {
      grouped: [
        {
          id: dvk("sliderPadding"),
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
              },
              {
                title: "%",
                value: "%"
              }
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
        }
      ],
      ungrouped: [
        {
          id: dvk("sliderPaddingTop"),
          icon: "nc-styling-top",
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
              },
              {
                title: "%",
                value: "%"
              }
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
              },
              {
                title: "%",
                value: "%"
              }
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
              },
              {
                title: "%",
                value: "%"
              }
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
              },
              {
                title: "%",
                value: "%"
              }
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
    }
  };
}
