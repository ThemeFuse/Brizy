import React from "react";
import EditorIcon from "visual/component/EditorIcon";

const Buttons = props => (
  <div className="brz-ed-popup-conditions__buttons">
    <button className="brz-button brz-button__cancel" onClick={props.onClose}>
      Cancel
    </button>
    <button className="brz-button brz-button__save" onClick={props.onChange}>
      {props.loading ? (
        <EditorIcon icon="nc-circle-02" className="brz-ed-animated--spin" />
      ) : (
        "Save"
      )}
    </button>
  </div>
);

export default Buttons;
