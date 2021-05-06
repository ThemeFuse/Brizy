export const isDisabled = (
  i: "left" | "right",
  v: "left" | "right" | "all" | "none"
): boolean => v === "all" || v === i;
