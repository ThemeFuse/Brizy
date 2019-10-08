import React from "react";
import classnames from "classnames";
import EditorIcon from "visual/component/EditorIcon";
import { capitalize } from "visual/utils/string";

export default function ItemWrapper({
  showTypeButton = true,
  active,
  children,
  onChange,
  onRemove
}) {
  const ruleActive = active ? "include" : "exclude";
  const ruleActiveIcon = active ? (
    <EditorIcon icon="nc-include" />
  ) : (
    <EditorIcon icon="nc-none" />
  );

  const className = classnames(
    "brz-ed-popup-conditions__type",
    `brz-ed-popup-conditions__type-${ruleActive}`
  );

  return (
    <div className="brz-ed-popup-conditions__condition brz-d-xs-flex">
      {showTypeButton && (
        <div
          className={className}
          onClick={() => onChange({ active: !active })}
        >
          <span className="brz-ed-popup-conditions__type-text">
            {ruleActiveIcon}
            {capitalize(ruleActive)}
          </span>
        </div>
      )}
      <div className="brz-ed-popup-conditions__select brz-d-xs-flex">
        {children}
      </div>
      <div className="brz-ed-popup-conditions__remove" onClick={onRemove}>
        <EditorIcon icon="nc-trash" />
      </div>
    </div>
  );
}
