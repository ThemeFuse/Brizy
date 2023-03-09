import { PropsWithChildren, ReactElement } from "react";
import { IconsName } from "../EditorIcon/types";
import { WithClassName, WithOnChange, WithValue } from "../types/attributes";

export type TabProps<T> = WithClassName &
  WithValue<T> &
  PropsWithChildren<unknown> & {
    title?: string;
    label?: string;
    icon?: IconsName;
  };

export type TabListProps<T> = WithClassName &
  WithOnChange<T> & {
    active: T;
    align: TabsProps<T>["align"];
    position: TabsProps<T>["position"];
    children: ReactElement<TabProps<T>>[];
  };

export interface TabsProps<T>
  extends WithClassName,
    WithValue<T>,
    WithOnChange<T> {
  showSingle: boolean;
  align: "start" | "center" | "end";
  position: "top" | "left";
  children: ReactElement<TabProps<T>>[];
}
