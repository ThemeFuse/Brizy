import React, { FC } from "react";
import { Popover } from "visual/component/Controls/Popover";
import EditorIcon from "visual/component/EditorIcon";

export type Props = {
  value: string;
  onRemove: VoidFunction;
};

export const PopulationInput: FC<Props> = ({ value, onRemove, children }) => {
  return (
    <div className="brz-ed-control__population__input" title={value}>
      <span className="brz-span">{value}</span>
      {children ? (
        <Popover
          trigger={<EditorIcon icon="nc-cog" />}
          size="medium"
          placement={"bottom"}
          clickOutsideExceptions={[".media-modal", ".media-modal-backdrop"]}
        >
          {children}
        </Popover>
      ) : null}
      <EditorIcon icon="nc-circle-remove" onClick={onRemove} />
    </div>
  );
};

export default PopulationInput;
