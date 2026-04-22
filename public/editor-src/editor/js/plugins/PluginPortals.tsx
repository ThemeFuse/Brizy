/**
 * Renders plugin contributions for portal-based slots (floatingPanel).
 */
import React from "react";
import { usePluginSlot } from "./PluginProvider";

export function PluginPortals(): JSX.Element {
  const floatingPanels = usePluginSlot("floatingPanel");

  return (
    <>
      {floatingPanels.map((c) => c.component && <c.component key={c.id} />)}
    </>
  );
}
