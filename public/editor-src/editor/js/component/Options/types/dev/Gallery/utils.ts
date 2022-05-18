import { WithId } from "visual/utils/options/attributes";

export const allowedExtensions = ["jpeg", "jpg", "png", "gif", "svg"];

export const maxId = <T extends WithId<number>>(ts: T[]): number =>
  ts.reduce((id, i) => (i.id > id ? i.id : id), 0);
