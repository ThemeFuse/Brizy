import React, { ReactNode } from "react";
import { Option } from "visual/component/LeftSidebar/options";
import { SidebarAlign } from "visual/redux/types";

export enum SidebarModes {
  EDIT = "EDIT",
  PIN = "PIN"
}

export interface SidebarProps {
  options: Array<Option>;
}

export interface SidebarHeadProps {
  align: SidebarAlign;
  children?: ReactNode;
  title?: ReactNode;
  onAlign?: VoidFunction;
}

export interface SidebarBodyProps {
  children: React.ReactNode;
  attr?: React.HTMLAttributes<HTMLElement>;
  className?: string;
}
