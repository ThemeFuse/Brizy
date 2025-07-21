import { defaults } from "es-toolkit/compat";
import React, { useContext, useMemo } from "react";
import { FCC } from "visual/utils/react/types";
import { PortalToolbarProps } from "./PortalToolbar/types";

export type ToolbarExtendProps = Pick<
  PortalToolbarProps,
  "position" | "onEscape" | "placement"
>;
export type ToolbarExtendContextType = ToolbarExtendProps | undefined;

export const ToolbarExtendContext =
  React.createContext<ToolbarExtendContextType>(undefined);

export const ToolbarExtend: FCC<ToolbarExtendProps> = ({
  children,
  position,
  onEscape,
  placement
}) => {
  const parentToolbarExtendProps = useContext(ToolbarExtendContext);
  const props = useMemo((): ToolbarExtendProps => {
    return defaults({ position, onEscape, placement }, [
      parentToolbarExtendProps
    ]);
  }, [position, onEscape, placement, parentToolbarExtendProps]);

  return (
    <ToolbarExtendContext.Provider value={props}>
      {children}
    </ToolbarExtendContext.Provider>
  );
};
