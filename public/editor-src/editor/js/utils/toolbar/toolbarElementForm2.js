import _ from "underscore";
import { t } from "visual/utils/i18n";
import Config from "visual/global/Config";
import {
  defaultValueKey,
  defaultValueValue,
  saveOnChanges
} from "visual/utils/onChange";

export function toolbarElementForm2SpacingPx({
  v,
  device,
  state,
  devices = "all"
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  return {
    devices,
    id: dvk("padding"),
    type: "slider",
    label: t("Spacing"),
    slider: {
      min: 0,
      max: 100
    },
    input: {
      show: true
    },
    suffix: {
      show: true,
      choices: [{ title: "px", value: "px" }]
    },
    value: {
      value: dvv("padding")
    },
    onChange: ({ value }) => ({
      [dvk("padding")]: value,
      [dvk("paddingRight")]: value,
      [dvk("paddingBottom")]: value,
      [dvk("paddingLeft")]: value
    })
  };
}

export function toolbarElementForm2RadioCheckboxOptions({
  v,
  device,
  state,
  devices = "all"
}) {
  if (v.type !== "Checkbox" && v.type !== "Radio") {
    return [];
  }
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  return [
    {
      devices,
      id: dvk("columns"),
      type: "select",
      position: 50,
      label: t("Columns"),
      choices: [
        { title: "1", value: 1 },
        { title: "2", value: 2 },
        { title: "3", value: 3 },
        { title: "4", value: 4 },
        { title: "5", value: 5 },
        { title: "6", value: 6 }
      ],
      value: dvv("columns")
    }
  ];
}

export function toolbarElementForm2DateTimeOptions({
  v,
  device,
  state,
  devices = "all"
}) {
  if (v.type !== "Date" && v.type !== "Time") {
    return [];
  }
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  const data = {
    Date: {
      placeholder: "YYYY-MM-DD",
      labelMin: t("Min Date"),
      labelMax: t("Max Date")
    },
    Time: {
      placeholder: "HH:MM",
      labelMin: t("Min Time"),
      labelMax: t("Max Time")
    }
  };
  const { labelMin, labelMax, placeholder } = data[v.type];

  return [
    {
      devices,
      id: dvk("min"),
      type: "input",
      position: 20,
      label: labelMin,
      placeholder: placeholder,
      value: {
        value: dvv("min")
      },
      onChange: ({ value }) => ({ min: value })
    },
    {
      devices,
      id: dvk("max"),
      type: "input",
      position: 30,
      label: labelMax,
      placeholder: placeholder,
      value: {
        value: dvv("max")
      },
      onChange: ({ value }) => ({ max: value })
    },
    {
      devices,
      id: dvk("nativeHtml"),
      type: "switch",
      position: 40,
      label: t("Native HTML5"),
      value: dvv("nativeHtml")
    }
  ];
}

export function toolbarElementForm2FileUploadOptions({
  v,
  device,
  state,
  devices = "all"
}) {
  if (v.type !== "FileUpload") {
    return [];
  }
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  const { maxUploadSize } = Config.get("server") || {};
  let fileUploadSizes = [];
  const maxFileUpload = Number(maxUploadSize);

  for (let idx = 1; idx <= maxFileUpload; idx++) {
    fileUploadSizes.push({ title: `${idx} MB`, value: `${idx}mb` });
  }

  return [
    {
      devices,
      id: dvk("fileMaxSize"),
      type: "select",
      label: t("Max. File Size"),
      position: 20,
      helper: true,
      helperContent: t(
        "If you need to increase max upload size please contact your hosting."
      ),
      choices: fileUploadSizes,
      value: dvv("fileMaxSize")
    },
    {
      devices,
      id: dvk("fileTypes"),
      type: "input",
      label: t("Allowed File Types"),
      position: 30,
      helper: true,
      helperContent: t(
        "Enter the allowed file types, separated by a comma (jpg, gif, pdf, etc)."
      ),
      inputSize: "medium",
      value: {
        value: dvv("fileTypes")
      },
      onChange: ({ value }) => ({ fileTypes: value })
    }
  ];
}

export function toolbarElementForm2SelectOptions({
  v,
  device,
  state,
  devices = "all"
}) {
  if (v.type !== "Select") {
    return [];
  }
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  return [
    {
      devices,
      id: dvk("multipleSelection"),
      type: "switch",
      label: t("Multiple Selection"),
      position: 40,
      value: dvv("multipleSelection")
    }
  ];
}

export function toolbarElementForm2NumberOptions({
  v,
  device,
  state,
  devices = "all"
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  if (dvv("type") !== "Number") {
    return [];
  }

  return [
    {
      devices,
      id: dvk("min"),
      type: "input",
      label: t("Min"),
      position: 20,
      placeholder: t("Min"),
      value: {
        value: dvv("min")
      },
      onChange: ({ value }) => ({ [dvk("min")]: value })
    },
    {
      devices,
      id: dvk("max"),
      type: "input",
      label: t("Max"),
      position: 30,
      placeholder: t("Max"),
      value: {
        value: dvv("max")
      },
      onChange: ({ value }) => ({ [dvk("max")]: value })
    }
  ];
}

export function toolbarElementForm2Type({
  v,
  device,
  state,
  types,
  devices = "all"
}) {
  const getTypeChoices = _.map(types, item => ({
    title: item.componentTitle,
    value: item.componentType
  }));
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  return [
    {
      devices,
      id: dvk("type"),
      type: "select",
      label: t("Type"),
      position: 10,
      choices: getTypeChoices,
      value: dvv("type")
    }
  ];
}

export function toolbarElementForm2Required({
  v,
  device,
  state,
  devices = "all"
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  if (dvv("type") === "Hidden") {
    return [];
  }

  return [
    {
      devices,
      id: dvk("required"),
      type: "switch",
      label: t("Required"),
      position: 50,
      value: dvv("required")
    }
  ];
}

export function toolbarElementForm2Apps({ v, device, state, devices = "all" }) {
  const fields = _.pluck(v.items[0].value.items, "value");
  const dvk = key => defaultValueKey({ key, device, state });

  return {
    devices,
    id: dvk("apps"),
    type: "formApps",
    icon: "nc-extensions-2",
    value: { id: v._id, fields }
  };
}

export function toolbarElementForm2LabelSwitch({
  v,
  device,
  state,
  devices = "all"
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  return {
    devices,
    id: dvk("label"),
    type: "switch",
    label: t("Label"),
    position: 15,
    value: dvv("label")
  };
}

export function toolbarElementForm2Size({ v, device, state, devices = "all" }) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });
  const sizeToPadding = {
    small: dvv("sizeSmallPadding"),
    medium: dvv("sizeMediumPadding"),
    large: dvv("sizeLargePadding")
  };

  return {
    devices,
    id: dvk("size"),
    label: t("Size"),
    type: "radioGroup",
    position: 17,
    choices: [
      { icon: "nc-small", value: "small" },
      { icon: "nc-medium", value: "medium" },
      { icon: "nc-large", value: "large" }
    ],
    value: dvv("size"),
    onChange: size => ({
      [dvk("size")]: size,
      [dvk("paddingTop")]: sizeToPadding[size],
      [dvk("paddingRight")]: sizeToPadding[size] + 10,
      [dvk("paddingBottom")]: sizeToPadding[size],
      [dvk("paddingLeft")]: sizeToPadding[size] + 10
    })
  };
}

export function toolbarElementForm2BorderRadius({
  v,
  device,
  state,
  onChange,
  devices = "all"
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  return {
    devices,
    id: dvk("borderRadius"),
    label: t("Corner"),
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
      choices: [{ title: "px", value: "px" }]
    },
    value: {
      value: dvv("borderRadius")
    },
    onChange: ({ value }, { sliderDragEnd }) => {
      const values = {
        ...{ v, device, state, onChange },
        ...{ value, sliderDragEnd }
      };
      return saveOnChanges(values);
    }
  };
}

export function toolbarElementForm2PlaceholderSwitch({
  v,
  device,
  state,
  devices = "all"
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  return {
    devices,
    id: dvk("placeholder"),
    type: "switch",
    label: t("Placeholder"),
    position: 16,
    value: dvv("placeholder")
  };
}

export function toolbarElementForm2FieldsLabelSpacing({
  v,
  device,
  state,
  devices = "all"
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  return {
    devices,
    id: dvk("labelPaddingBottom"),
    type: "slider",
    label: t("Spacing"),
    position: 60,
    slider: {
      min: 0,
      max: 100
    },
    input: {
      show: true
    },
    suffix: {
      show: true,
      choices: [{ title: "px", value: "px" }]
    },
    value: {
      value: dvv("labelPaddingBottom")
    },
    onChange: ({ value }) => ({
      [dvk("labelPaddingBottom")]: value
    })
  };
}
