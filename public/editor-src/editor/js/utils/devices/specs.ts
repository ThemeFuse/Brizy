import { Reader, Type } from "visual/utils/types/Type";
import { Append, Concat, Monoid } from "visual/utils/types/Monoid";
import { Eq, IsEqual } from "visual/utils/types/Eq";
import { String } from "visual/utils/string/specs";

export type Device = "all" | "desktop" | "responsive";

const devices: Device[] = ["all", "desktop", "responsive"];

export const read: Reader<Device> = v => {
  if (typeof v === "string") {
    return devices.includes(v as Device) ? (v as Device) : undefined;
  }

  return undefined;
};

export const empty: Device = "all";

export const append: Append<Device> = (a, b) => (a === empty ? b : a);

export const concat: Concat<Device> = as => as.reduce(append, empty);

export const eq: IsEqual<Device> = String.eq;

export const DeviceType: Type<Device> & Monoid<Device> & Eq<Device> = {
  read,
  empty,
  append,
  concat,
  eq
};
