import React, { useContext, useMemo } from "react";
import _ from "underscore";
import { PortalToolbarProps } from "./PortalToolbar";

export type ToolbarExtendProps = Pick<
  PortalToolbarProps,
  "position" | "onEscape"
>;
export type ToolbarExtendContextType = ToolbarExtendProps | undefined;

export const ToolbarExtendContext = React.createContext<
  ToolbarExtendContextType
>(undefined);

export const ToolbarExtend: React.FC<ToolbarExtendProps> = ({
  children,
  position,
  onEscape
}) => {
  const parentToolbarExtendProps = useContext(ToolbarExtendContext);
  const props = useMemo((): ToolbarExtendProps => {
    return _.defaults({ position, onEscape }, parentToolbarExtendProps);
  }, [position, onEscape, parentToolbarExtendProps]);

  return (
    <ToolbarExtendContext.Provider value={props}>
      {children}
    </ToolbarExtendContext.Provider>
  );
};
