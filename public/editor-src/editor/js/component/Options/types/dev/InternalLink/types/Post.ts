import { String } from "visual/utils/string/specs";
import { IsEqual } from "visual/utils/types/Eq";
import { Reader } from "visual/utils/types/Type";

export interface Post {
  id: string;
  title: string;
}

export const read: Reader<Post> = (v) => {
  if (typeof v !== "object") {
    return undefined;
  }

  const id = String.read((v as Post)?.id);
  const title = String.read((v as Post)?.title);

  return id !== undefined && title !== undefined ? { id, title } : undefined;
};

export const eq: IsEqual<Post> = (a, b) => a.id === b.id;
