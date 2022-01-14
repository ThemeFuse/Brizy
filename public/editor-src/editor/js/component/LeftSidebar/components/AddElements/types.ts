import { SortablePluginOptions } from "visual/component/Sortable/plugin/types";

type OnSort = Required<SortablePluginOptions>["onSort"];

export type SortData = Parameters<OnSort>[0];
