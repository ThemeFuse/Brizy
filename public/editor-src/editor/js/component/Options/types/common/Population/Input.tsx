import React, { FC } from "react";
import EditorIcon from "visual/component/EditorIcon";
import { OnChange } from "visual/component/Options/Type";
import { Empty, empty } from "visual/utils/string/specs";

export type Props = {
  value: string;
  onChange: OnChange<Empty>;
};

export const PopulationInput: FC<Props> = ({ value, onChange }) => {
  return (
    <div className="brz-ed-control__population__input" title={value}>
      <span className="brz-span">{value}</span>
      <EditorIcon
        icon="nc-circle-remove"
        onClick={(): void => onChange(empty)}
      />
    </div>
  );
};

export default PopulationInput;
