import { t } from "visual/utils/i18n";
import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";

export function toolbarElementTimelineOrientation({
  v,
  device,
  devices = "all",
  state
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  return {
    type: "multiPicker",
    roles: ["admin"],
    devices,
    picker: {
      id: dvk("verticalMode"),
      label: t("Orientation"),
      type: "radioGroup",
      devices,
      choices: [
        {
          value: "on",
          icon: "nc-vertical-items"
        },
        {
          value: "off",
          icon: "nc-horizontal-items"
        }
      ],
      value: dvv("verticalMode"),
      onChange: value => ({
        [dvk("verticalMode")]: value
      })
    }
  };
}

export function toolbarElementTimelineStyle({
  v,
  device,
  devices = "all",
  state
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  const vertical = dvv(dvk("verticalMode")) === "off";

  return {
    type: "multiPicker",
    roles: ["admin"],
    devices,
    picker: {
      id: dvk("timelineStyle"),
      label: t("Style"),
      type: "radioGroup",
      devices,
      choices: [
        ...(vertical
          ? [
              {
                value: "style-1",
                icon: "nc-timeline-style-2"
              },
              {
                value: "style-2",
                icon: "nc-timeline-style-1"
              },
              {
                value: "style-3",
                icon: "nc-timeline-style-3"
              }
            ]
          : [
              {
                value: "style-1",
                icon: "nc-timeline-style-4"
              },
              {
                value: "style-2",
                icon: "nc-timeline-style-5"
              },
              {
                value: "style-3",
                icon: "nc-timeline-style-6"
              }
            ])
      ],
      value: dvv("timelineStyle"),
      onChange: value => ({
        [dvk("timelineStyle")]: value
      })
    }
  };
}
