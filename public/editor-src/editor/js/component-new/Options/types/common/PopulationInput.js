import React from "react";
import classnames from "classnames";
import EditorIcon from "visual/component-new/EditorIcon";

export default function PopulationInput({
  className: _className,
  value,
  onClear
}) {
  const className = classnames("brz-ed-option__input-container", _className);

  return (
    <div className={className}>
      <div className="brz-ed-option__input__population">{value}</div>
      <EditorIcon icon="nc-circle-remove" onClick={onClear} />
    </div>
  );
}
