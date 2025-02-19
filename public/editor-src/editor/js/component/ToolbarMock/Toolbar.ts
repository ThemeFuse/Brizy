import React, { PropsWithChildren, ReactNode } from "react";
import { PortalToolbarProps } from "visual/component/Toolbar/PortalToolbar/types";

/**
 * THis component is used to replace the PortalToolbar in export build
 * @internal, Do no use it for any production code
 */

const PortalToolbar = ({
  children
}: PropsWithChildren<PortalToolbarProps>): ReactNode => children;

const CollapsibleToolbar = PortalToolbar;
const ToolbarExtend = PortalToolbar;
const ToolbarExtendContext = React.createContext(undefined);

export {
  PortalToolbar,
  CollapsibleToolbar,
  ToolbarExtendContext,
  ToolbarExtend
};

export default PortalToolbar;

export const hideToolbar = (): void => undefined;
export const showLastHiddenToolbar = (): void => undefined;
