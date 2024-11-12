import type { GetItems } from "visual/editorComponents/EditorComponent/types";
import { t } from "visual/utils/i18n";
import { Value, Props } from "./type";
import {
  ElementTypes,
  readElementType
} from "visual/global/Config/types/configs/ElementTypes";
import { getDynamicContentOption } from "visual/utils/options";
import { DCTypes } from "visual/global/Config/types/DynamicContent";
import Config from "visual/global/Config";
import { isPopup, isStory } from "visual/utils/models";
import { toolbarLinkAnchor } from "visual/utils/toolbar";
import { defaultValueValue } from "visual/utils/onChange";

export const getItems: GetItems<Value, Props> = ({
  v,
  device,
  component,
  context
}) => {
  const dvv = (key: string) => defaultValueValue({ v, key, device });
  const inPopup = Boolean(component.props.meta.sectionPopup);
  const inPopup2 = Boolean(component.props.meta.sectionPopup2);

  const type = readElementType(component.props.type);
  const isCheckbox = type === ElementTypes.Checkbox;

  const linkDC = getDynamicContentOption({
    options: context.dynamicContent.config,
    type: DCTypes.link
  });

  const config = Config.getAll();
  const IS_STORY = isStory(config);
  const IS_GLOBAL_POPUP = isPopup(config);

  return [
    {
      id: "toolbarLinkCheckbox",
      type: "popover",
      config: {
        icon: "nc-link",
        size: "medium",
        title: t("Link")
      },
      devices: "desktop",
      disabled: !isCheckbox,
      position: 90,
      options: [
        {
          id: "linkType",
          type: "tabs",
          config: {
            saveTab: true
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
                    placeholder: "http://"
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
                toolbarLinkAnchor({
                  v,
                  device,
                  state: "normal",
                  disabled: IS_GLOBAL_POPUP || IS_STORY
                })
              ]
            },
            {
              id: "popup",
              label: t("Popup"),
              options: [
                {
                  id: "linkPopup",
                  type: "promptAddPopup",
                  disabled: inPopup || inPopup2 || IS_GLOBAL_POPUP || IS_STORY,
                  label: t("Popup"),
                  config: {
                    popupKey: `${component.getId()}_${dvv("linkPopup")}`
                  }
                }
              ]
            },
            {
              id: "story",
              label: t("Slides"),
              options: [
                {
                  id: "linkToSlide",
                  type: "number",
                  label: t("Slide"),
                  disabled: !IS_STORY,
                  config: {
                    min: 1,
                    max: 1000000,
                    spinner: true
                  }
                }
              ]
            }
          ]
        }
      ]
    }
  ];
};
