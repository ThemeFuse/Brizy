import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";

export interface Column {
  id: string;
  size?: 1 | 2 | 3 | 4 | 5 | 6 | "auto";
  align?: "start" | "end" | "center";
  options: ToolbarItemType[];
}

export interface Config {
  separator?: boolean;
}
