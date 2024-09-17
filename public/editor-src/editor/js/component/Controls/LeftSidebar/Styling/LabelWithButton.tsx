import React from "react";
import Tooltip from "visual/component/Controls/Tooltip";
import EditorIcon from "visual/component/EditorIcon";

export interface Props {
  label: string;
  tooltip: string;
  onClick: VoidFunction;
  loading: boolean;
}

export const LabelWithButton = ({
  label,
  loading,
  tooltip,
  onClick
}: Props): JSX.Element => {
  return (
    <div className={"brz-ed-sidebar__ai-label"}>
      <div className="brz-ed-sidebar__ai-label-title">{label}</div>
      <Tooltip
        size={"auto"}
        placement={"top"}
        openOnClick={false}
        overlay={
          <div className="brz-ed-sidebar__ai-label-tooltip">{tooltip}</div>
        }
      >
        <div className={"brz-ed-sidebar__ai-label-button"} onClick={onClick}>
          {loading ? (
            <EditorIcon icon="nc-circle-02" className="brz-ed-animated--spin" />
          ) : (
            <EditorIcon icon="t2-star-shapes" />
          )}
        </div>
      </Tooltip>
    </div>
  );
};
