import type { IsEqual } from "visual/utils/types/Eq";

export interface Image {
  uid: string;
  fileName?: string;
  width: number;
  height: number;
}

export type AddImageData = Pick<Image, "uid" | "fileName">;

export const eq: IsEqual<Image> = (a, b) =>
  a.uid === b.uid && a.width === b.width && a.height === b.height;
