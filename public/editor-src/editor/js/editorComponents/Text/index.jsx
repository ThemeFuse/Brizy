import React from "react";
import { TextEditor } from "visual/component/Controls/TextEditor";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import defaultValue from "./defaultValue.json";

export default class Text extends EditorComponent {
  static get componentId() {
    return ElementTypes.Text;
  }

  static defaultValue = defaultValue;

  render(v) {
    return (
      <div className="brz-text">
        <TextEditor value={v.text} />
      </div>
    );
  }
}
