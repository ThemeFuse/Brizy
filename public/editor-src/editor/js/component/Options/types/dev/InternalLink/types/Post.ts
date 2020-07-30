import { Reader } from "visual/utils/types/Type";
import { NumberSpec } from "visual/utils/math/number";
import { String } from "visual/utils/string/specs";
import { IsEqual } from "visual/utils/types/Eq";

export type Post = {
  id: number;
  title: string;
};

export const read: Reader<Post> = v => {
  if (typeof v !== "object") {
    return undefined;
  }

  const id = NumberSpec.read((v as Post)?.id);
  const title = String.read((v as Post)?.title);

  return id && title ? { id, title } : undefined;
};

export const eq: IsEqual<Post> = (a, b) => a.id === b.id;
