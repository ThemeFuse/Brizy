import React from "react";
import EditorIcon from "visual/component/EditorIcon";

export const PopulationIcon = React.forwardRef<
  HTMLDivElement,
  { className?: string; onClick: VoidFunction }
>(({ className, onClick }, ref) => (
  <div ref={ref} className={className} onClick={onClick}>
    <EditorIcon icon={"nc-dynamic"} />
  </div>
));

PopulationIcon.displayName = "PopulationIcon";
