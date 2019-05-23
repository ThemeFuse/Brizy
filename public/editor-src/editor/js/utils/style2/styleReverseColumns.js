import { defaultValueValue } from "visual/utils/onChange";

export function styleReverseColumnsRow({ v, device }) {
  const reverseColumnsValue = defaultValueValue({
    v,
    key: "reverseColumns",
    device
  });

  return reverseColumnsValue === "on" ? "row-reverse" : "row";
}

export function styleReverseColumnsWrap({ v, device }) {
  const reverseColumnsValue = defaultValueValue({
    v,
    key: "reverseColumns",
    device
  });

  return reverseColumnsValue === "on" ? "wrap-reverse" : "wrap";
}

export function styleReverseColumnsJustify({ v, device }) {
  const reverseColumnsValue = defaultValueValue({
    v,
    key: "reverseColumns",
    device
  });

  return reverseColumnsValue === "on" ? "flex-end" : "flex-start";
}
