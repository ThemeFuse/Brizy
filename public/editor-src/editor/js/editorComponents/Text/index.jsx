import React from "react";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { TextEditor } from "visual/component/Controls/TextEditor";
import defaultValue from "./defaultValue.json";

export default class Text extends EditorComponent {
  static get componentId() {
    return "Text";
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
