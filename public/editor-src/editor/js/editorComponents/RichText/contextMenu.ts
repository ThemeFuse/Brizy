import { ElementModel } from "visual/component/Elements/Types";
import { t } from "visual/utils/i18n";
import { ContextGetItems, ContextMenuItem } from "../EditorComponent/types";
import {
  getInnerElement,
  handlePasteStyles,
  handleRenderText
} from "./utils/ContextMenu";

const getItems: ContextGetItems<ElementModel> = (
  _,
  component
): ContextMenuItem[] => {
  const innerElement = getInnerElement();
  const canPaste = component.getComponentId() === innerElement?.type;

  return [
    {
      id: "main",
      type: "group",
      title: t("Text"),
      items: [
        {
          id: "copy",
          type: "button",
          title: t("Copy"),
          helperText: handleRenderText(["C"])
        },
        {
          id: "paste",
          type: "button",
          title: t("Paste"),
          helperText: handleRenderText(["V"]),
          inactive: !innerElement
        },
        {
          id: "pasteStyles",
          type: "button",
          title: t("Paste Styles"),
          inactive: !canPaste,
          helperText: handleRenderText(["⇧", "V"]),
          onChange: () => {
            if (!innerElement || !innerElement.value) return;
            handlePasteStyles(
              innerElement,
              // @ts-expect-error couldn't extend component type
              component.handleChange,
              component.getValue()
            );
          }
        },
        {
          id: "duplicate",
          type: "button",
          title: t("Duplicate"),
          helperText: handleRenderText(["D"])
        },
        {
          id: "remove",
          type: "button",
          title: t("Delete"),
          helperText: handleRenderText(["delete"])
        }
      ]
    }
  ];
};

export default { getItems };
