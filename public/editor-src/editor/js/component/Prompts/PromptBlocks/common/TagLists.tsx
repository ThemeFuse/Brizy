import classnames from "classnames";
import React, { ReactElement } from "react";
import EditorIcon from "visual/component/EditorIcon";

export interface Props {
  name: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}

export const TagLists = (props: Props): ReactElement => {
  const { name, checked, onChange } = props;
  const className = classnames(
    "brz-ed-popup-two-block__bottom-control-categories-element",
    {
      "brz-ed-popup-two-block__bottom-control-categories-element__selected":
        checked
    }
  );

  return (
    <div
      title={name}
      className={className}
      onClick={() => {
        onChange(!checked);
      }}
    >
      <EditorIcon
        icon={checked ? "nc-check-square-on" : "nc-check-square-off"}
      />
      <span className="brz-ed-popup-two-block__bottom-control-categories-element-name">
        {name}
      </span>
    </div>
  );
};
