import classnames from "classnames";
import React from "react";
import EditorIcon from "visual/component/EditorIcon";

interface Props {
  onClick: VoidFunction;
  iconElement: JSX.Element;
  isDisabled?: boolean;
  isChecked: boolean;
}

export const ShortcodeElement = ({
  onClick,
  iconElement,
  isDisabled,
  isChecked
}: Props): JSX.Element => {
  const className = classnames(
    "brz-ed-sidebar__add-elements__item brz-ed-sidebar__add-elements__item-edit",
    {
      "brz-ed-sidebar__add-elements__item--disabled": isDisabled
    }
  );

  const checkedClassname = classnames("brz-ed-sidebar__edit", {
    "brz-ed-sidebar__edit--checked": isChecked
  });

  return (
    <div className={className}>
      <div className={checkedClassname} onClick={onClick}>
        <span className="brz-ed-sidebar__checked">
          <EditorIcon icon="nc-check-circle" />
        </span>
      </div>
      {iconElement}
    </div>
  );
};
