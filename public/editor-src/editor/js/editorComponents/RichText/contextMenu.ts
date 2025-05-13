import { Str } from "@brizy/readers";
import deepmerge from "deepmerge";
import { setIn } from "timm";
import { updateCopiedElement } from "visual/redux/actions2";
import { pageDataNoRefsSelector } from "visual/redux/selectors";
import { overwriteMerge } from "visual/utils/array";
import { t } from "visual/utils/i18n";
import { createFullModelPath } from "visual/utils/models";
import { ContextGetItems, ContextMenuItem } from "../EditorComponent/types";
import type { Value } from "./types";
import {
  getInnerElement,
  handleClearFormatting,
  handlePasteStyles,
  handleRenderText
} from "./utils/ContextMenu";

const getItems: ContextGetItems<Value> = (_, component): ContextMenuItem[] => {
  const config = component.getGlobalConfig();
  const state = component.getReduxStore().getState();
  const innerElement = getInnerElement(state, config.menuData);
  const canPaste = component.getComponentId() === innerElement?.type;
  const device = component.getDeviceMode();

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
            const { wrapperAnimationId, wrapperId } = component.props.meta;
            const _wrapperId = Str.read(wrapperAnimationId ?? wrapperId);
            if (!_wrapperId) return;

            const id = component.getId();
            const shortcodePath = createFullModelPath(data, [_wrapperId]);

            const newValue = setIn(
              data,
              createFullModelPath(data, [id]),
              componentValue
            );

            if (typeof dispatch === "function" && newValue) {
              dispatch(
                updateCopiedElement({
                  path: shortcodePath,
                  value: deepmerge(data, newValue, {
                    arrayMerge: overwriteMerge
                  })
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
            handlePasteStyles({
              innerElement,
              // @ts-expect-error couldn't extend component type
              onChange: component.handleChange,
              v: component.getValue(),
              device,
              config
            });
          }
        },
        {
          id: "clearFormatting",
          type: "button",
          title: t("Clear formatting"),
          helperText: handleRenderText(["\\"]),
          onChange: () => {
            handleClearFormatting({
              // @ts-expect-error couldn't extend component type
              onChange: component.handleChange,
              editorMode: component.props.editorMode,
              config
            });
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
