import { hexToRgba } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { ACTIVE, HOVER, NORMAL } from "visual/utils/stateMode";

const checkOrientationChoices = (isCounterOn, choices, style1, style2) => {
  if ((style1 || style2) && isCounterOn) {
    return [...choices, { value: "full", icon: "nc-filters-full" }];
  } else {
    return choices;
  }
};

const checkSpacingDisabled = ({ activeStyle, checkboxType, filterType }) => {
  if (
    (filterType === "active" && activeStyle === "style-1") ||
    filterType === "date"
  ) {
    return false;
  } else if (filterType === "checkrange") {
    return checkboxType === "style-1" ? false : true;
  } else if (filterType === "checkbox" || filterType === "radio") {
    return true;
  } else {
    return true;
  }
};

const ratingColor = () => {
  return [
    {
      id: "tabRating",
      label: t("Rating"),
      options: [
        {
          id: "ratingActiveColor",
          type: "colorPicker-dev",
          states: [NORMAL, HOVER, ACTIVE]
        }
      ]
    }
  ];
};
const rangeColor = () => {
  return [
    {
      id: "tabRangeBg",
      label: t("Stroke"),
      options: [
        {
          id: "rangeStrokeBorder",
          type: "border-dev",
          config: {
            width: ["grouped"],
            styles: ["solid"]
          },
          states: [NORMAL, ACTIVE]
        }
      ]
    },
    {
      id: "tabRangeBorder",
      label: t("Border"),
      options: [
        {
          id: "rangeBorder",
          type: "border-dev",
          config: {
            width: ["grouped"]
          },
          states: [NORMAL]
        }
      ]
    },
    {
      id: "tabRangeBtnBg",
      label: t("Points"),
      options: [
        {
          id: "rangePointsBorder",
          type: "border-dev",
          config: {
            width: ["grouped"],
            styles: ["solid"]
          },
          states: [NORMAL]
        }
      ]
    }
  ];
};
const checkColor = (type, counter, style) => {
  const isActive = type === "active";
  return [
    style === "style-1" || style === "style-2"
      ? {
          id: "tabCheckboxText",
          label: t("Text"),
          options: [
            {
              id: "checkboxTextColor",
              type: "colorPicker-dev",
              states: isActive ? [NORMAL, HOVER] : [NORMAL, HOVER, ACTIVE]
            }
          ]
        }
      : {},
    {
      id: "tabBgCheckbox",
      label: t("Bg"),
      options: [
        {
          id: "checkboxBgColor",
          type: "colorPicker-dev",
          states: isActive ? [NORMAL, HOVER] : [NORMAL, HOVER, ACTIVE]
        }
      ]
    },
    {
      id: "tabCheckboxBorder",
      label: t("Border"),
      options: [
        {
          id: "checkboxBorder",
          type: "border-dev",
          states: isActive ? [NORMAL, HOVER] : [NORMAL, HOVER, ACTIVE]
        }
      ]
    },
    {
      id: "tabCheckboxBoxShadow",
      label: t("Shadow"),
      options: [
        {
          id: "checkboxBoxShadow",
          type: "boxShadow-dev",
          devices: "desktop",
          states: isActive ? [NORMAL, HOVER] : [NORMAL, HOVER, ACTIVE]
        }
      ]
    }
  ];
};
const optionColor = () => {
  return [
    {
      id: "tabBgSelect",
      label: t("Bg"),
      options: [
        {
          id: "optionsBgColor",
          type: "colorPicker-dev",
          states: [NORMAL, HOVER]
        }
      ]
    },
    {
      id: "tabOptions",
      label: t("Text"),
      options: [
        {
          id: "optionsColor",
          type: "colorPicker-dev",
          states: [NORMAL, HOVER]
        }
      ]
    },
    {
      id: "Border",
      label: t("Border"),
      options: [
        {
          id: "optionsBorder",
          type: "border-dev",
          states: [NORMAL, HOVER]
        }
      ]
    },
    {
      id: "tabBoxShadow",
      label: t("Shadow"),
      options: [
        {
          id: "boxShadow",
          type: "boxShadow-dev",
          devices: "desktop",
          states: [NORMAL, HOVER]
        }
      ]
    }
  ];
};
const allColors = ({ filterType, checkboxType, showCounter }) => {
  if (filterType === "rating") {
    return ratingColor();
  } else if (filterType === "range") {
    return rangeColor();
  } else if (
    filterType === "checkbox" ||
    filterType === "radio" ||
    filterType === "checkrange" ||
    filterType === "active"
  ) {
    return checkColor(filterType, showCounter, checkboxType);
  } else if (
    filterType === "select" ||
    filterType === "search" ||
    filterType === "date"
  ) {
    return optionColor();
  }
};

export function getItems({ v, device }) {
  const dvv = (key) => defaultValueValue({ v, key, device });

  const { hex: optionsColor } = getOptionColorHexByPalette(
    dvv("optionsColorHex"),
    dvv("optionsColorPalette")
  );

  const { hex: checkboxColor } = getOptionColorHexByPalette(
    dvv("checkboxColorHex"),
    dvv("checkboxColorPalette")
  );

  const itemCountMoreThanOne = v.items.length > 1;

  const checkType1 = v.checkboxType === "style-1";
  const checkType2 = v.checkboxType === "style-2";
  const checkType3 = v.checkboxType === "style-3";
  const checkType4 = v.checkboxType === "style-4";

  const dataSourseManual = v.dataSource === "manual";

  const dataSourseDynamic = v.dataSource !== "manual";

  const isNotDate = v.filterType !== "date";

  const isRating = v.filterType === "rating";

  const isCheckbox = v.filterType === "checkbox";

  const isRadio = v.filterType === "radio";

  const isCheckrange = v.filterType === "checkrange";

  const isActive = v.filterType === "active";

  const isRange = v.filterType === "range";

  const isSelect = v.filterType === "select";

  const isDate = v.filterType === "date";

  const isSearch = v.filterType === "search";

  const isCounterOn = v.showCounter === "on";

  const isFullOrientation = v.checkOrientation === "full";
  const isLeftOrientation = v.checkOrientation === "on";

  const hierarchical = v.hierarchical === "on";

  const checkRadioDisabled = isCheckbox || isCheckrange || isRadio;

  const rowsCheck = checkRadioDisabled && v.checkOrientation === "off";

  const rowsCheckCustom =
    checkRadioDisabled && v.checkOrientationCustom === "off";

  const choices = [
    { value: "on", icon: "nc-filters-left" },
    { value: "off", icon: "nc-filters-columns" },
    { value: "inline", icon: "nc-filters-inline" }
  ];

  return [
    {
      id: "toolbarCurrentShortcode",
      type: "popover-dev",
      config: {
        icon: "nc-filters",
        title: t("Filter")
      },
      devices: "desktop",
      position: 70,
      options: [
        {
          id: "itemsTabs",
          type: "tabs",
          tabs: [
            {
              id: "filter",
              label: "Filter",
              position: 20,
              options: [
                {
                  id: "filterType",
                  label: t("Type"),
                  type: "select-dev",
                  position: 10,
                  choices: [
                    { value: "active", title: "Active" },
                    { value: "radio", title: "Radio" },
                    { value: "checkbox", title: "Checkbox" },
                    { value: "checkrange", title: "Check Range" },
                    { value: "select", title: "Select" },
                    { value: "search", title: "Search" },
                    { value: "range", title: "Range" },
                    { value: "date", title: "Date" },
                    { value: "rating", title: "Rating" }
                  ]
                },
                {
                  id: "dataSource",
                  label: t("Data Source"),
                  type: "select-dev",
                  position: 20,
                  disabled: !(isCheckbox || isRadio || isRange),
                  choices: [
                    { value: "manual", title: "Manual Input" },
                    { value: "taxonomies", title: "Taxonomies" },
                    { value: "posts", title: "Posts" },
                    { value: "custom", title: "Custom" }
                  ]
                },
                checkRadioDisabled && (checkType1 || checkType2)
                  ? {
                      id: "showCounter",
                      label: t("Show Counter"),
                      type: "switch-dev",
                      position: 30
                    }
                  : {},
                {
                  id: "showLabel",
                  position: 40,
                  label: t("Show Label"),
                  type: "switch-dev"
                },
                isRange
                  ? {
                      id: "showRangeText",
                      label: t("Show Text"),
                      type: "switch-dev",
                      disabled: !isRange
                    }
                  : {}
              ]
            },
            {
              id: "item",
              label: "Items",
              position: 40,
              options: [
                {
                  id: "checkboxType",
                  label: t("Style"),
                  type: "select-dev",
                  disabled: !checkRadioDisabled,
                  choices: isCheckrange
                    ? [
                        { value: "style-1", title: "Style 1" },
                        { value: "style-2", title: "Style 2" }
                      ]
                    : [
                        { value: "style-1", title: "Style 1" },
                        { value: "style-2", title: "Style 2" },
                        { value: "style-3", title: "Style 3" },
                        { value: "style-4", title: "Style 4" }
                      ]
                },
                {
                  id: "checkOrientation",
                  label: t("Position"),
                  type: "radioGroup-dev",
                  disabled: !checkRadioDisabled || checkType3,
                  choices: checkOrientationChoices(
                    isCounterOn,
                    choices,
                    checkType1,
                    checkType2
                  )
                },
                {
                  id: "checkOrientationCustom",
                  label: t("Position"),
                  type: "radioGroup-dev",
                  disabled:
                    !checkRadioDisabled ||
                    checkType1 ||
                    checkType2 ||
                    checkType4,
                  choices: [
                    { value: "on", icon: "nc-filters-left" },
                    { value: "off", icon: "nc-filters-columns" },
                    { value: "inline", icon: "nc-filters-inline" }
                  ]
                },
                (isCheckbox || isRadio) &&
                (checkType1 || checkType2) &&
                isLeftOrientation &&
                dataSourseDynamic
                  ? {
                      id: "hierarchical",
                      label: t("Hierarchical"),
                      type: "switch-dev"
                    }
                  : {},
                (isCheckbox || isRadio) &&
                dataSourseDynamic &&
                (checkType1 || checkType2) &&
                isLeftOrientation &&
                hierarchical
                  ? {
                      id: "hierarchicalSpacing",
                      label: t("Spacing"),
                      type: "slider-dev",
                      config: {
                        min: 0,
                        max: 100,
                        units: [{ value: "px", title: "px" }]
                      }
                    }
                  : {},
                {
                  id: "checkColumns",
                  label: t("Columns"),
                  type: "select-dev",
                  disabled: !rowsCheck || checkType3,
                  choices: [
                    { value: "2", title: "2" },
                    { value: "3", title: "3" },
                    { value: "4", title: "4" }
                  ]
                },
                {
                  id: "checkColumnsCustom",
                  label: t("Columns"),
                  type: "select-dev",
                  disabled:
                    !rowsCheckCustom || checkType1 || checkType2 || checkType4,
                  choices: [
                    { value: "2", title: "2" },
                    { value: "3", title: "3" },
                    { value: "4", title: "4" }
                  ]
                },
                isActive
                  ? {
                      id: "activeStyle",
                      label: t("Style"),
                      type: "select-dev",
                      choices: [
                        { value: "style-1", title: "Style 1" },
                        { value: "style-2", title: "Style 2" }
                      ]
                    }
                  : {},
                isActive
                  ? {
                      id: "activeOrientation",
                      label: t("Position"),
                      type: "radioGroup-dev",
                      choices: [
                        { value: "on", icon: { name: "nc-filters-left" } },
                        { value: "inline", icon: { name: "nc-filters-inline" } }
                      ]
                    }
                  : {},
                isActive
                  ? {
                      id: "activeColumns",
                      label: t("Columns"),
                      type: "select-dev",
                      disabled: v.activeOrientation !== "off",
                      choices: [
                        { value: "2", title: "2" },
                        { value: "3", title: "3" },
                        { value: "4", title: "4" }
                      ]
                    }
                  : {},
                isDate
                  ? {
                      id: "dateType",
                      label: t("Native HTML5"),
                      type: "switch-dev"
                    }
                  : {},
                {
                  id: "spacing",
                  label: t("Spacing"),
                  type: "slider-dev",
                  config: {
                    min: 0,
                    max: 100,
                    units: [{ value: "px", title: "px" }]
                  },
                  disabled: checkSpacingDisabled(v)
                },
                checkRadioDisabled || isActive
                  ? {
                      id: "gap",
                      label: t("Gap"),
                      type: "slider-dev",
                      config: {
                        min: 0,
                        max: 100,
                        units: [{ value: "px", title: "px" }]
                      }
                    }
                  : {},
                isSelect && itemCountMoreThanOne
                  ? {
                      id: "optionSpacing",
                      label: t("Gap"),
                      type: "slider-dev",
                      config: {
                        min: 0,
                        max: 100,
                        units: [{ value: "px", title: "px" }]
                      }
                    }
                  : {}
              ]
            },
            isCheckrange
              ? {
                  id: "itemsTabs",
                  position: 60,
                  type: "tabs",
                  tabs: []
                }
              : {},
            isRange
              ? {
                  id: "tabRange",
                  label: "Range",
                  position: 60,
                  options: [
                    {
                      id: "rangeLabel",
                      label: t("Label"),
                      type: "inputText-dev",
                      position: 20,
                      placeholder: t("Label")
                    },
                    {
                      id: "rangeMin",
                      label: t("Min"),
                      type: "number-dev",
                      disabled: dataSourseDynamic,
                      config: {
                        min: 0,
                        max: 9999999999,
                        size: "large"
                      }
                    },
                    {
                      id: "rangeMax",
                      label: t("Max"),
                      type: "number-dev",
                      disabled: dataSourseDynamic,
                      config: {
                        min: 0,
                        max: 9999999999,
                        size: "large"
                      }
                    },
                    {
                      id: "rangeStep",
                      label: t("Step"),
                      type: "number-dev",
                      config: {
                        min: 0,
                        max: 9999999999,
                        size: "large"
                      }
                    }
                  ]
                }
              : {},
            isRating
              ? {
                  id: "rating",
                  label: "Rating",
                  position: 80,
                  options: [
                    {
                      id: "icon",
                      label: t("Icon"),
                      type: "iconSetter-dev",
                      devices: "desktop"
                    },
                    {
                      id: "groupSettings",
                      type: "group-dev",
                      options: [
                        {
                          id: "iconSize",
                          label: t("Size 2"),
                          type: "radioGroup-dev",
                          choices: [
                            { value: "small", icon: "nc-16" },
                            { value: "medium", icon: "nc-24" },
                            { value: "large", icon: "nc-32" },
                            { value: "custom", icon: "nc-more" }
                          ]
                        },
                        {
                          id: "iconCustomSize",
                          type: "slider-dev",
                          disabled: v.iconSize !== "custom",
                          config: {
                            min: 8,
                            max: 50,
                            units: [{ title: "px", value: "px" }]
                          }
                        }
                      ]
                    },
                    {
                      id: "iconSpacing",
                      label: t("Spacing"),
                      type: "slider-dev",
                      config: {
                        min: 0,
                        max: 20,
                        units: [{ value: "px", title: "px" }]
                      }
                    },
                    {
                      id: "starCount",
                      label: t("Stars count"),
                      type: "select-dev",
                      choices: [
                        { value: "1", title: "1" },
                        { value: "2", title: "2" },
                        { value: "3", title: "3" },
                        { value: "4", title: "4" },
                        { value: "5", title: "5" },
                        { value: "6", title: "6" },
                        { value: "7", title: "7" },
                        { value: "8", title: "8" },
                        { value: "9", title: "9" },
                        { value: "10", title: "10" }
                      ]
                    },
                    {
                      id: "ratingEquality",
                      label: t("Inequality operator"),
                      type: "select-dev",
                      choices: [
                        { value: "one", title: "Greater than or equals (>=)" },
                        { value: "two", title: "Less than or equals (<=)" }
                      ]
                    }
                  ]
                }
              : {},
            {
              id: "apply",
              label: "Apply",
              position: 90,
              options: [
                {
                  id: "showApply",
                  label: t("Show Apply"),
                  type: "switch-dev"
                },
                {
                  id: "applyType",
                  label: t("Apply type"),
                  type: "select-dev",
                  choices: [
                    { value: "test1", title: "AJAX" },
                    { value: "test2", title: "Test 2" }
                  ]
                },
                {
                  id: "applyOn",
                  label: t("Apply on"),
                  type: "select-dev",
                  choices: [
                    { value: "test1", title: "Value change" },
                    { value: "test2", title: "Test 2" }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    isCheckbox || isRadio || isSelect
      ? {
          id: "dynamicToolbarFilter",
          type: "popover-dev",
          config: {
            icon: "nc-dynamic",
            title: t("Dynamic Content")
          },
          devices: "desktop",
          disabled: !(checkRadioDisabled || isSelect),
          position: 80,
          options: [
            {
              id: "itemsTabs",
              type: "tabs",
              tabs: [
                {
                  id: "filter",
                  label: "Filter",
                  options: [
                    v.dataSource === "taxonomies" || isSelect
                      ? {
                          id: "taxonomy",
                          label: t("Taxonomy"),
                          type: "select-dev",
                          position: 20,
                          choices: [
                            { value: "one", title: "Categories" },
                            { value: "two", title: "Etc..." }
                          ]
                        }
                      : {}
                  ]
                }
              ]
            }
          ]
        }
      : {},
    {
      id: "popoverTypography",
      type: "popover-dev",
      config: {
        icon: "nc-font",
        size: device === "desktop" ? "large" : "auto",
        title: t("Typography")
      },
      position: 80,
      options: [
        {
          id: "tabsTypography",
          type: "tabs-dev",
          tabs: [
            {
              id: "tabsTypographyTitle",
              label: t("Title"),
              options: [
                {
                  id: "title",
                  type: "typography-dev",
                  disabled: true
                }
              ]
            },
            !checkRadioDisabled && !isRating && !isRange && !isActive
              ? {
                  id: "tabsTypographyOptionsText",
                  label: t("Text"),
                  options: [
                    {
                      id: "options",
                      type: "typography-dev",
                      config: {
                        fontFamily: "desktop" === device
                      }
                    }
                  ]
                }
              : {},
            (checkRadioDisabled || isActive) &&
            !isRating &&
            !isRange &&
            (checkType1 || checkType2)
              ? {
                  id: "tabsTypographyCheckboxText",
                  label: t("Text"),
                  options:
                    checkRadioDisabled || isRating || isRange || isActive
                      ? [
                          {
                            id: "check",
                            type: "typography-dev",
                            config: {
                              fontFamily: "desktop" === device
                            }
                          }
                        ]
                      : []
                }
              : {}
          ]
        }
      ]
    },
    {
      id: "popoverColor",
      type: "popover-dev",
      config: {
        size: "auto",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor: checkRadioDisabled
              ? hexToRgba(checkboxColor, v.checkboxColorOpacity)
              : hexToRgba(optionsColor, v.optionsColorOpacity)
          }
        }
      },
      devices: "desktop",
      position: 90,
      options: [
        {
          id: "tabsColor",
          type: "tabs-dev",
          config: {
            showSingle: true,
            align: "start"
          },
          tabs: allColors(v)
        }
      ]
    },
    !isFullOrientation && !isRange && !isSearch && !isSelect && isNotDate
      ? {
          id: "horizontalAlignOption",
          type: "toggle-dev",
          position: 100,
          choices: [
            {
              icon: "nc-text-align-left",
              title: t("Align"),
              value: "left"
            },
            {
              icon: "nc-text-align-center",
              title: t("Align"),
              value: "center"
            },
            {
              icon: "nc-text-align-right",
              title: t("Align"),
              value: "right"
            }
          ]
        }
      : {},
    {
      id: "toolbarSettings",
      type: "popover-dev",
      config: {
        icon: "nc-cog",
        title: t("Settings")
      },
      position: 110,
      options: [
        checkType4 && dataSourseManual
          ? {
              id: "imgWidth",
              label: t("Width"),
              type: "slider-dev",
              config: {
                min: 1,
                max: 1000,
                units: [{ value: "px", title: "px" }]
              }
            }
          : {},
        checkType4 && dataSourseManual
          ? {
              id: "imgHeight",
              label: t("Height"),
              type: "slider-dev",
              config: {
                min: 1,
                max: 1000,
                units: [{ value: "px", title: "px" }]
              }
            }
          : {},
        checkType3
          ? {
              id: "checkColorSize",
              label: t("Size"),
              type: "slider-dev",
              config: {
                min: 1,
                max: 100,
                units: [{ value: "px", title: "px" }]
              }
            }
          : {},
        {
          id: "optionWidth",
          label: t("Width"),
          type: "slider-dev",
          config: {
            min: 1,
            max: 100,
            units: [
              { value: "%", title: "%" },
              { value: "px", title: "px" }
            ]
          }
        },
        isDate
          ? {
              id: "widthDateOption",
              label: t("Width Option"),
              type: "slider-dev",
              config: {
                min: 1,
                max: 100,
                units: [{ value: "%", title: "%" }]
              }
            }
          : {},
        !isRating
          ? {
              id: "advancedSettings",
              devices: "desktop",
              type: "advancedSettings",
              label: t("More Settings"),
              icon: "nc-cog"
            }
          : {}
      ]
    },
    dataSourseDynamic &&
    (checkType1 || checkType2) &&
    !isCheckrange &&
    !isSelect
      ? {
          id: "duplicate",
          type: "button",
          disabled: true
        }
      : {},
    dataSourseDynamic &&
    (checkType1 || checkType2) &&
    !isCheckrange &&
    !isSelect
      ? {
          id: "remove",
          type: "button",
          disabled: true
        }
      : {}
  ];
}
