import React from "react";
import { omit } from "timm";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { isEditor } from "visual/providers/RenderProvider";
import { blocksDataSelector } from "visual/redux/selectors-new";
import { Block } from "visual/types/Block";
import EditorComponent from "../EditorComponent";
import defaultValue from "./defaultValue.json";
import { Value } from "./type";

export class BaseLottie extends EditorComponent<Value> {
  static defaultValue = defaultValue;
  state = {
    animation: null,
    previousLink: null
  };

  static get componentId(): ElementTypes.Lottie {
    return ElementTypes.Lottie;
  }

  renderPopups(): React.JSX.Element {
    const meta = this.props.meta;
    const popupsProps = this.makeSubcomponentProps({
      bindWithKey: "popups",
      itemProps: (itemData: Block) => {
        let {
          value: { popupId }
        } = itemData;

        const { blockId } = itemData;

        let newMeta = omit(meta, ["globalBlockId"]);

        if (itemData.type === "GlobalBlock") {
          // TODO: some kind of error handling
          const globalBlocks = blocksDataSelector(this.getReduxState());
          const globalBlockId = itemData.value._id;
          const blockData = globalBlocks[globalBlockId];

          if (blockData) {
            popupId = blockData.value.popupId;
          }

          newMeta = {
            ...newMeta,
            globalBlockId
          };
        }

        return {
          blockId,
          meta: newMeta,
          ...(isEditor(this.props.renderContext) && {
            instanceKey: `${this.getId()}_${popupId}`
          })
        };
      }
    });

    // @ts-expect-error: Need transform EditorArrayComponents to ts
    return <EditorArrayComponent {...popupsProps} />;
  }
}
