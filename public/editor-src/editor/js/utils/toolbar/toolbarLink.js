import { t } from "visual/utils/i18n";
import { getDynamicContentChoices } from "visual/utils/options";
import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";
import { capByPrefix } from "visual/utils/string";

export function toolbarLinkAnchor({ v, device, state, devices = "all" }) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  return {
    id: dvk("linkAnchor"),
    label: t("Block"),
    type: "blockThumbnail",
    devices,
    value: dvv("linkAnchor")
  };
}

export function toolbarLinkUpload({ v, device, state, devices = "all" }) {
  return {
    id: defaultValueKey({ key: "linkUpload", device, state }),
    label: t("File"),
    type: "fileUpload",
    devices,
    value: defaultValueValue({ v, key: "linkUpload", device, state })
  };
}

export function toolbarLinkExternal({ v, devices = "all" }) {
  const linkDynamicContentChoices = getDynamicContentChoices("link");

  return {
    id: "linkExternal",
    type: "input",
    devices,
    label: t("Link to"),
    placeholder: "http://",
    population: {
      show: linkDynamicContentChoices.length > 0,
      choices: linkDynamicContentChoices
    },
    value: {
      value: v.linkExternal,

      population: v.linkPopulation
    },
    onChange: (
      { value: linkExternal, population: linkPopulation },
      { changed }
    ) => {
      return {
        linkExternal,
        linkPopulation,
        linkExternalType:
          changed === "value" || linkPopulation === ""
            ? "linkExternal"
            : "linkPopulation"
      };
    }
  };
}

export function toolbarLinkExternalBlank({
  v,
  device,
  state,
  devices = "all"
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  return {
    id: dvk("linkExternalBlank"),
    type: "switch",
    label: t("Open In New Tab"),
    devices,
    value: dvv("linkExternalBlank")
  };
}

export function toolbarLinkExternalRel({ v, device, state, devices = "all" }) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  return {
    id: dvk("linkExternalRel"),
    type: "switch",
    label: t("Make it Nofollow"),
    devices,
    value: dvv("linkExternalRel")
  };
}

export function toolbarLinkPopup({
  v,
  device,
  state,
  canDelete = true,
  disabled = false,
  component,
  devices = "all"
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  return {
    id: dvk("linkPopup"),
    type: "promptAddPopup",
    label: t("Popup"),
    canDelete,
    disabled,
    popupKey: `${component.getId()}_${dvv("linkPopup")}`,
    devices,
    value: {
      value: dvv("linkPopup"),
      popups: dvv("popups")
    },
    onChange: ({ value, popups }) => ({
      [dvk("linkPopup")]: value,
      [dvk("popups")]: popups
    })
  };
}

export function toolbarLinkTargetUrl({ v, device, devices = "all", state }) {
  return {
    id: defaultValueKey({ key: "targetUrl", device, state }),
    label: t("Target URL"),
    devices,
    type: "select",
    choices: [
      {
        title: t("Current Page"),
        value: "current"
      },
      {
        title: t("Custom Page"),
        value: "custom"
      }
    ],
    value: defaultValueValue({ v, key: "targetUrl", device, state })
  };
}

export function toolbarLinkHref({ v, device, devices = "all", state }) {
  return {
    id: defaultValueKey({ key: "href", device, state }),
    label: t("Link"),
    devices,
    type: "input",
    disabled: v.targetUrl === "current",
    placeholder: "http://",
    value: {
      value: defaultValueValue({ v, key: "href", device, state })
    },
    onChange: ({ value }) => ({
      [defaultValueKey({ v, key: "href", device })]: value
    })
  };
}

export function toolbarActionClosePopup({
  v,
  device,
  state,
  devices = "desktop",
  disabled = true
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  return {
    id: dvk("actionClosePopup"),
    label: t("Close Popup"),
    type: "switch",
    devices,
    disabled,
    value: dvv("actionClosePopup")
  };
}

export function toolbarLinkMessageSuccess({
  v,
  device,
  state,
  prefix = "",
  devices = "all"
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });
  const message = dvk(capByPrefix(prefix, "messageSuccess"));

  return {
    devices,
    id: message,
    type: "input",
    label: t("Success"),
    placeholder: t("Message sent"),
    value: {
      value: dvv(message)
    },
    onChange: ({ value }) => ({ [message]: value })
  };
}

export function toolbarLinkMessageError({
  v,
  device,
  state,
  prefix = "",
  devices = "all"
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });
  const message = dvk(capByPrefix(prefix, "messageError"));

  return {
    devices,
    id: message,
    type: "input",
    label: t("Error"),
    placeholder: t("Message not sent"),
    value: {
      value: dvv(message)
    },
    onChange: ({ value }) => ({ [message]: value })
  };
}

export function toolbarLinkMessageRedirect({
  v,
  device,
  state,
  prefix = "",
  devices = "all"
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });
  const message = dvk(capByPrefix(prefix, "messageRedirect"));

  return {
    devices,
    id: message,
    type: "input",
    label: t("Go to"),
    placeholder: "http://",
    value: {
      value: dvv(message)
    },
    onChange: ({ value }) => ({ [message]: value })
  };
}
