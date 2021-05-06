export type Edge = "all" | "top" | "right" | "bottom" | "left";

export const edges = ["all", "top", "right", "bottom", "left"] as const;

export type Type = "grouped" | "ungrouped";

export const types = ["grouped", "ungrouped"] as const;
