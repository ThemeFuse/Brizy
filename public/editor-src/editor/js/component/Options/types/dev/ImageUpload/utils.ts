import { Size } from "./Types";

export const configSizeToSize = (size: {
  label: string;
  name: string;
}): Size => ({
  value: size.name,
  label: size.label
});
