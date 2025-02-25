import { defaults } from "es-toolkit/compat";
import React, { useContext, useMemo } from "react";
import { FCC } from "visual/utils/react/types";
import { PortalToolbarProps } from "./PortalToolbar/types";

export type ToolbarExtendProps = Pick<
  PortalToolbarProps,
  "position" | "onEscape"
>;
export type ToolbarExtendContextType = ToolbarExtendProps | undefined;

export const ToolbarExtendContext =
  React.createContext<ToolbarExtendContextType>(undefined);

export const ToolbarExtend: FCC<ToolbarExtendProps> = ({
  children,
  position,
  onEscape
}) => {
  const parentToolbarExtendProps = useContext(ToolbarExtendContext);
  const props = useMemo((): ToolbarExtendProps => {
    return defaults({ position, onEscape }, [parentToolbarExtendProps]);
  }, [position, onEscape, parentToolbarExtendProps]);

  return (
    <ToolbarExtendContext.Provider value={props}>
      {children}
    </ToolbarExtendContext.Provider>
  );
};
