import { t } from "visual/utils/i18n";
import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";
import { capitalize } from "visual/utils/string";

export function toolbarContainerPopup2ContainerWidth({
  v,
  device,
  state,
  devices = "all"
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  const widthSuffix = dvv("widthSuffix");

  return {
    id: dvk("width"),
    label: t("Width"),
    type: "slider",
    devices,
    position: 100,
    slider: {
      min: widthSuffix === "px" ? 200 : 20,
      max: widthSuffix === "px" ? 1170 : 100
    },
    input: {
      show: true,
      min: widthSuffix === "px" ? 200 : 20,
      max: widthSuffix === "px" ? 9999 : 100
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
      value: dvv("width"),
      suffix: widthSuffix
    },
    onChange: ({ value, suffix }) => ({
      [dvk("width")]: value,
      [dvk("widthSuffix")]: suffix
    })
  };
}

export function toolbarContainerPopup2ContainerTypeAndHeight({
  v,
  device,
  state,
  devices = "all",
  position = 100,
  disabled = false
}) {
  const picker =
    v.columnsHeightStyle === "custom"
      ? toolbarContainerPopup2ContainerType2({
          v,
          device,
          state
        })
      : toolbarContainerPopup2ContainerType({
          v,
          device,
          state
        });
  return {
    type: "multiPicker",
    devices,
    position,
    disabled,
    picker: picker,
    choices: {
      custom: [
        toolbarContainerPopup2ContainerHeight({
          v,
          device,
          state
        })
      ],
      custom2: [
        toolbarContainerPopup2ContainerHeight({
          v,
          device,
          state
        })
      ]
    }
  };
}

function toolbarContainerPopup2ContainerType({
  v,
  device,
  state,
  devices = "all",
  disabled = false
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  return {
    id: dvk("columnsHeightStyle"),
    label: t("Height"),
    type: "select",
    devices,
    disabled,
    choices: [
      {
        title: t("Auto"),
        value: "auto"
      },
      {
        title: t("Custom"),
        value: "custom2"
      },
      {
        title: t("Full Height"),
        value: "fullHeight"
      }
    ],
    value: dvv("columnsHeightStyle")
  };
}

function toolbarContainerPopup2ContainerType2({
  v,
  device,
  state,
  devices = "all",
  disabled = false
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  return {
    id: dvk("columnsHeightStyle"),
    label: t("Height"),
    type: "select",
    devices,
    disabled,
    choices: [
      {
        title: t("Auto"),
        value: "auto"
      },
      {
        title: t("Height"),
        value: "custom"
      },
      {
        title: t("Custom"),
        value: "custom2"
      },
      {
        title: t("Full Height"),
        value: "fullHeight"
      }
    ],
    value: dvv("columnsHeightStyle")
  };
}

function toolbarContainerPopup2ContainerHeight({
  v,
  device,
  state,
  devices = "all",
  disabled = false
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  const columnsHeightSuffix = dvv("columnsHeightSuffix");

  return {
    id: dvk("columnsHeight"),
    devices,
    disabled,
    type: "slider",
    slider: {
      min: 20,
      max: columnsHeightSuffix === "px" ? 500 : 100
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
          value: "vh"
        }
      ]
    },
    value: {
      value: dvv("columnsHeight"),
      suffix: columnsHeightSuffix
    },
    onChange: ({ value: columnsHeight, suffix: columnsHeightSuffix }) => ({
      columnsHeight,
      columnsHeightSuffix
    })
  };
}

export function toolbarContainerPopup2CloseHorizontalPosition({
  v,
  device,
  state,
  devices = "all"
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  return {
    id: dvk("closeHorizontalPosition"),
    label: t("Lateral"),
    type: "slider",
    devices,
    slider: {
      min: -50,
      max: 50
    },
    input: {
      show: true
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
      value: dvv("closeHorizontalPosition")
    },
    onChange: ({ value }) => {
      return {
        [dvk("closeHorizontalPosition")]: value
      };
    }
  };
}

export function toolbarContainerPopup2CloseVerticalPosition({
  v,
  device,
  state,
  devices = "all"
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });
  return {
    id: dvk("closeVerticalPosition"),
    label: t("Vertical"),
    type: "slider",
    devices,
    slider: {
      min: -50,
      max: 50
    },
    input: {
      show: true
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
      value: dvv("closeVerticalPosition")
    },
    onChange: ({ value }) => {
      return {
        [dvk("closeVerticalPosition")]: value
      };
    }
  };
}

export function toolbarContainerPopup2CloseFill({
  v,
  device,
  devices = "all",
  disabled = false,
  state
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  return {
    id: dvk("closeFillType"),
    label: t("Fill"),
    devices,
    disabled,
    type: "radioGroup",
    choices: [
      {
        value: "filled",
        icon: "nc-circle"
      },
      {
        value: "outline",
        icon: "nc-outline"
      },
      {
        value: "default",
        icon: "nc-close"
      }
    ],
    value: dvv("closeFillType"),
    onChange: value => {
      return {
        [dvk("closeFillType")]: value,
        [dvk("tempCloseFillType")]:
          value !== "default" ? value : dvv("tempCloseFillType")
      };
    }
  };
}

export function toolbarContainerPopup2CloseBorderRadius({
  v,
  device,
  devices = "all",
  disabled = false,
  state
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  return {
    type: "multiPicker",
    disabled,
    devices,
    picker: {
      id: dvk("closeBorderRadiusShape"),
      label: t("Corner"),
      type: "radioGroup",
      choices: [
        {
          value: "square",
          icon: "nc-corners-square"
        },
        {
          value: "rounded",
          icon: "nc-corners-round"
        },
        {
          value: "custom",
          icon: "nc-more"
        }
      ],
      value: dvv("closeBorderRadiusShape"),
      onChange: value => {
        return {
          [dvk("closeBorderRadiusShape")]: value,
          [dvk("tempCloseBorderRadiusShape")]:
            value !== ""
              ? value
              : defaultValueValue("tempCloseBorderRadiusShape"),
          [dvk("closeBorderRadius")]:
            value === "rounded" ? 50 : dvv("tempCloseBorderRadius")
        };
      }
    },
    choices: {
      custom: [
        {
          id: dvk("closeBorderRadius"),
          type: "slider",
          slider: {
            min: 0,
            max: 50
          },
          input: {
            show: true
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
            value: dvv("closeBorderRadius")
          },
          onChange: ({ value }) => {
            return {
              [dvk("closeBorderRadius")]: value,
              [dvk("tempCloseBorderRadius")]: value
            };
          }
        }
      ]
    }
  };
}

export function toolbarContainerPopup2CloseCustomSize({
  v,
  device,
  state,
  devices = "all"
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  return {
    type: "multiPicker",
    devices,
    roles: ["admin"],
    picker: {
      id: dvk("closeSize"),
      label: t("Size"),
      type: "radioGroup",
      choices: [
        {
          value: "small",
          icon: "nc-16"
        },
        {
          value: "medium",
          icon: "nc-24"
        },
        {
          value: "large",
          icon: "nc-32"
        },
        {
          value: "custom",
          icon: "nc-more"
        }
      ],
      value: dvv("closeSize"),
      onChange: value => {
        return {
          [dvk("closeSize")]: value,

          [dvk("closeCustomSize")]:
            value !== "custom"
              ? dvv(`close${capitalize(value)}Size`)
              : dvv("closeCustomSize")
        };
      }
    },
    choices: {
      custom: [
        {
          id: dvk("closeCustomSize"),
          type: "slider",
          devices,
          slider: {
            min: 8,
            max: 50
          },
          input: {
            show: true
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
            value: dvv("closeCustomSize")
          },
          onChange: ({ value }) => {
            return {
              [dvk("closeCustomSize")]: value
            };
          }
        }
      ]
    }
  };
}

export function toolbarContainerPopup2CloseBgSize({
  v,
  device,
  state,
  devices = "all"
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  return {
    id: dvk("closeBgSize"),
    label: t("Size"),
    type: "slider",
    devices,
    slider: {
      min: 0,
      max: 30
    },
    input: {
      show: true
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
      value: dvv("closeBgSize")
    },
    onChange: ({ value }) => {
      return {
        [dvk("closeBgSize")]: value,
        [dvk("tempCloseBgSize")]: value
      };
    }
  };
}

export function toolbarContainerPopup2ScrollPage({
  v,
  device,
  state,
  devices = "desktop",
  disabled = false
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  return {
    id: dvk("scrollPage"),
    label: t("Scroll Page Behind"),
    type: "switch",
    devices,
    disabled,
    position: 100,
    value: dvv("scrollPage")
  };
}

export function toolbarContainerPopup2ClickOutsideToClose({
  v,
  device,
  state,
  devices = "all",
  disabled = false
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  return {
    id: dvk("clickOutsideToClose"),
    label: t("Click Outside to Close"),
    type: "switch",
    devices,
    disabled,
    value: dvv("clickOutsideToClose")
  };
}

export function toolbarContainerPopup2ShowCloseButton({
  v,
  device,
  state,
  devices = "all"
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  return {
    type: "multiPicker",
    devices,
    picker: {
      id: dvk("showCloseButton"),
      label: t("Display Close Button"),
      type: "switch",
      value: dvv("showCloseButton")
    },
    choices: {
      on: [
        toolbarContainerPopup2ShowCloseButtonAfter({
          v,
          device,
          state,
          devices
        })
      ]
    }
  };
}

function toolbarContainerPopup2ShowCloseButtonAfter({
  v,
  device,
  state,
  devices = "all",
  disabled = false
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  return {
    id: dvk("showCloseButtonAfter"),
    label: t("Delay"),
    type: "slider",
    devices,
    disabled,
    slider: {
      min: 0,
      max: 10
    },
    input: {
      show: true
    },
    suffix: {
      show: true,
      choices: [
        {
          title: "s",
          value: "s"
        }
      ]
    },
    value: {
      value: dvv("showCloseButtonAfter")
    },
    onChange: ({ value }) => ({
      [dvk("showCloseButtonAfter")]: value
    })
  };
}
