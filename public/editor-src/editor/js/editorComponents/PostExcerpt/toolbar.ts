import { ElementModel } from "visual/component/Elements/Types";
import type { GetItems } from "visual/editorComponents/EditorComponent/types";
import Config from "visual/global/Config";
import { DCGroup, DCTypes } from "visual/global/Config/types/DynamicContent";
import { hexToRgba } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { isPopup } from "visual/utils/models";
import { defaultValueValue } from "visual/utils/onChange";
import {
  getDynamicContentChoices,
  getDynamicContentOption,
  getOptionColorHexByPalette
} from "visual/utils/options";
import { popupToOldModel } from "visual/utils/options/PromptAddPopup/utils";
import { HOVER, NORMAL } from "visual/utils/stateMode";
import { isChoice } from "visual/utils/options/getDynamicContentChoices";

export const getItems: GetItems<ElementModel> = ({
  v,
  device,
  component,
  context
}) => {
  const dvv = (key: string): unknown =>
    defaultValueValue({ v, key, device, state: "normal" });

  const { hex: colorHex } = getOptionColorHexByPalette(
    dvv("colorHex"),
    dvv("colorPalette")
  );

  const inPopup = Boolean(component.props.meta.sectionPopup);
  const inPopup2 = Boolean(component.props.meta.sectionPopup2);

  const config = Config.getAll();

  const IS_GLOBAL_POPUP = isPopup(config);

  const activeChoice = config?.contentDefaults?.PostExcerpt?.textPopulation;
  const disablePredefinedPopulation =
    config.elements?.postExcerpt?.predefinedPopulation === false;

  const disableSourceTypeOption =
    config?.elements?.postExcerpt?.sourceTypeOption === false;
  const contextConfig =
    context.dynamicContent.config ??
    ([] as unknown as DCGroup<"wp"> | DCGroup<"cloud">);

  const predefinedChoices =
    getDynamicContentChoices(contextConfig, DCTypes.richText)?.filter(
      isChoice
    ) ?? [];

  const linkDC = getDynamicContentOption({
    options: component.context.dynamicContent.config,
    type: DCTypes.link
  });

  const linkPopup = dvv("linkPopup");

  return [
    {
      id: "posts",
      type: "popover",
      config: {
        icon: "nc-wp-post-excerpt",
        size: "auto",
        title: t("Context")
      },
      position: 70,
      disabled: dvv("type") === "wp" || disableSourceTypeOption,
      options: [
        {
          id: "sourceType",
          type: "select",
          label: t("Context Type"),
          devices: "desktop",
          choices: [
            { value: "auto", title: t("Auto") },
            { value: "profile", title: t("Profile") }
          ]
        }
      ]
    },
    {
      id: "popoverTypography",
      type: "popover",
      config: {
        icon: "nc-font",
        size: device === "desktop" ? "xlarge" : "auto",
        title: t("Typography")
      },
      roles: ["admin"],
      position: 70,
      options: [
        {
          id: "gridTypography",
          type: "grid",
          config: { separator: true },
          columns: [
            {
              id: "col-1",
              size: 1,
              align: "center",
              options: [
                {
                  id: "",
                  type: "typography",
                  config: {
                    fontFamily: device === "desktop"
                  }
                }
              ]
            },
            {
              id: "col-2",
              size: 1,
              align: "center",
              options: [
                {
                  id: "text",
                  devices: "desktop",
                  type: "predefinedPopulation",
                  disabled: disablePredefinedPopulation || !activeChoice,
                  config: {
                    activeChoice: activeChoice ?? "",
                    choices: predefinedChoices
                  }
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "toolbarColor",
      type: "popover",
      config: {
        size: "medium",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor: hexToRgba(colorHex, dvv("colorOpacity"))
          }
        }
      },
      roles: ["admin"],
      devices: "desktop",
      position: 90,
      options: [
        {
          id: "color",
          type: "colorPicker",
          states: [NORMAL, HOVER]
        }
      ]
    },
    {
      id: "toolbarLink",
      type: "popover",
      config: {
        icon: "nc-link",
        size: "medium",
        title: t("Link")
      },
      devices: "desktop",
      position: 90,
      options: [
        {
          id: "linkType",
          type: "tabs",
          config: {
            saveTab: true,
            showSingle: true
          },
          tabs: [
            {
              id: "page",
              label: t("Page"),
              options: [
                {
                  id: "linkPage",
                  type: "internalLink",
                  label: t("Find Page")
                },
                {
                  id: "linkInternalBlank",
                  label: t("Open In New Tab"),
                  type: "switch"
                }
              ]
            },
            {
              id: "external",
              label: t("URL"),
              options: [
                {
                  id: "link",
                  type: "population",
                  label: t("Link to"),
                  config: linkDC,
                  option: {
                    id: "linkExternal",
                    type: "inputText",
                    placeholder: "http://",
                    config: {
                      size: "medium"
                    }
                  }
                },
                {
                  id: "linkExternalBlank",
                  label: t("Open In New Tab"),
                  type: "switch"
                },
                {
                  id: "linkExternalRel",
                  label: t("Make it Nofollow"),
                  type: "switch"
                }
              ]
            },
            {
              id: "anchor",
              label: t("Block"),
              options: [
                {
                  id: "linkAnchor",
                  label: t("Block"),
                  type: "blockThumbnail",
                  disabled: IS_GLOBAL_POPUP
                }
              ]
            },
            {
              id: "popup",
              label: t("Popup"),
              options: [
                {
                  id: "linkPopup",
                  type: "promptAddPopup",
                  label: t("Popup"),
                  config: {
                    popupKey: `${component.getId()}_${linkPopup}`,
                    canDelete: device === "desktop"
                  },
                  disabled:
                    device === "desktop"
                      ? inPopup || inPopup2 || IS_GLOBAL_POPUP
                      : dvv("linkType") !== "popup" || linkPopup === "",
                  dependencies: popupToOldModel
                }
              ]
            }
          ]
        }
      ]
    },
    { id: "horizontalAlign", type: "toggle", choices: [], disabled: true },
    {
      id: "contentHorizontalAlign",
      type: "toggle",
      position: 100,
      choices: [
        { icon: "nc-text-align-left", title: t("Align"), value: "left" },
        { icon: "nc-text-align-center", title: t("Align"), value: "center" },
        { icon: "nc-text-align-right", title: t("Align"), value: "right" },
        { icon: "nc-text-align-justify", title: t("Align"), value: "justify" }
      ]
    },
    {
      id: "advancedSettings",
      type: "advancedSettings",
      position: 110,
      title: t("Settings"),
      roles: ["admin"],
      devices: "desktop"
    }
  ];
};
