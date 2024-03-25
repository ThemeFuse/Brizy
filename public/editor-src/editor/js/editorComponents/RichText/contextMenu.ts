import { mergeDeep, setIn } from "timm";
import { ElementModel } from "visual/component/Elements/Types";
import { updateCopiedElement } from "visual/redux/actions2";
import { pageDataNoRefsSelector } from "visual/redux/selectors";
import { t } from "visual/utils/i18n";
import { createFullModelPath } from "visual/utils/models";
import { read as strRead } from "visual/utils/reader/string";
import { ContextGetItems, ContextMenuItem } from "../EditorComponent/types";
import {
  getInnerElement,
  handleClearFormatting,
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
          helperText: handleRenderText(["C"]),
          onChange: () => {
            const dispatch = component.getReduxDispatch();
            const componentValue = component.getValue();

            const data = pageDataNoRefsSelector(component.getReduxState());
            const { wrapperAnimationId } = component.props.meta;
            const wrapperId = strRead(wrapperAnimationId);
            if (!wrapperId) return;

            const id = component.getId();
            const shortcodePath = createFullModelPath(data, [wrapperId]);

            const newValue = setIn(
              data,
              createFullModelPath(data, [id]),
              componentValue
            );

            if (typeof dispatch === "function" && newValue) {
              dispatch(
                updateCopiedElement({
                  path: shortcodePath,
                  // @ts-expect-error: Type 'object' is not assignable to type 'Record<string, unknown>'
                  value: mergeDeep(data, newValue)
                })
              );
            }
          }
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
          id: "clearFormatting",
          type: "button",
          title: t("Clear formatting"),
          helperText: handleRenderText(["\\"]),
          onChange: () => {
            // @ts-expect-error couldn't extend component type
            handleClearFormatting(component.handleChange);
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
