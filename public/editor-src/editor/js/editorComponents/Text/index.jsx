import React from "react";
import EditorComponent from "visual/editorComponents/EditorComponent";
import TextEditor from "./Editor";
import defaultValue from "./defaultValue.json";

class Text extends EditorComponent {
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

export default Text;
