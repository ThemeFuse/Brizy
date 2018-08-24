import React from "react";
import classnames from "classnames";
import EditorIcon from "visual/component-new/EditorIcon";

export default function PopulationInput(props) {
  const { className: _className, title, onClear } = props;
  const className = classnames("brz-ed-option__input-container", _className);

  return (
    <div className={className}>
      <div className="brz-ed-option__input__population">{title}</div>
      <EditorIcon icon="nc-circle-remove" onClick={onClear} />
    </div>
  );
}
