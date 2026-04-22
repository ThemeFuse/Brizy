/**
 * React context that exposes the PluginRegistry to the component tree.
 * UI components use usePluginRegistry() to read slot contributions.
 */
import React, {
  type ReactNode,
  createContext,
  useContext,
  useMemo
} from "react";
import type { Option } from "visual/component/LeftSidebar/options";
import type { PluginRegistry } from "./PluginRegistry";
import type {
  LeftSidebarDrawerMeta,
  LeftSidebarTabMeta,
  SlotContribution,
  SlotName
} from "./types";

const PluginContext = createContext<PluginRegistry | undefined>(undefined);

interface Props {
  registry: PluginRegistry;
  children: ReactNode;
}

export const PluginProvider = ({ registry, children }: Props): JSX.Element => (
  <PluginContext.Provider value={registry}>{children}</PluginContext.Provider>
);

export const usePluginRegistry = (): PluginRegistry | undefined =>
  useContext(PluginContext);

export function usePluginSlot(slot: SlotName): SlotContribution[] {
  const registry = usePluginRegistry();

  const slots = useMemo(() => {
    if (!registry) return [];
    return registry.getSlotContributions(slot);
  }, [registry, slot]);

  return slots;
}

export function usePluginDrawerOptions(): Option[] {
  const contributions = usePluginSlot("leftSidebar.drawer");

  const options = useMemo(
    () =>
      contributions.map((c) => {
        const meta = c.meta as LeftSidebarDrawerMeta | undefined;

        return {
          id: c.id,
          type: "drawer",
          icon: meta?.icon ?? "nc-extensions",
          title: meta?.title ?? c.id,
          drawerTitle: meta?.drawerTitle ?? meta?.title ?? c.id,
          drawerComponent: c.component
        };
      }),
    [contributions]
  );

  return options;
}

export function usePluginTabOptions(): { top: Option[]; bottom: Option[] } {
  const contributions = usePluginSlot("leftSidebar.tab");

  return useMemo(() => {
    const top: Option[] = [];
    const bottom: Option[] = [];

    for (const c of contributions) {
      const meta = c.meta as LeftSidebarTabMeta | undefined;

      const option: Option = {
        id: c.id,
        type: "tab",
        icon: meta?.icon,
        iconComponent: meta?.iconComponent,
        title: meta?.title ?? c.id,
        active: meta?.active,
        onClick: meta?.onClick
      };

      if (meta?.position === "bottom") {
        bottom.push(option);
      } else {
        top.push(option);
      }
    }

    return { top, bottom };
  }, [contributions]);
}
