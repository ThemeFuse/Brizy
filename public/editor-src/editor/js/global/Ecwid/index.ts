import { Num, Str } from "@brizy/readers";
import { Literal } from "visual/utils/types/Literal";
import { MValue } from "visual/utils/value";
import { EcwidProductId, EcwidProductIdWithSlug } from "./types";

// region EcwidProductId

export const isEcwidProductId = (id: unknown): id is EcwidProductId =>
  !!Num.read(id);

export const isEcwidProductIdWithSlug = (
  id: unknown
): id is EcwidProductIdWithSlug => {
  const _id = Str.read(id);

  if (_id === undefined) {
    return false;
  }

  const regex = /ecwid-product\/\d+$/m;

  return regex.test(_id);
};

export const getEcwidProductIdFromSlug = (
  slugWithId: EcwidProductIdWithSlug
): MValue<EcwidProductId> => {
  const id = Num.read(slugWithId.split("/")[1]);

  if (isEcwidProductId(id)) {
    return id;
  }
};

export const getEcwidProductId = (id: Literal): EcwidProductId => {
  if (isEcwidProductIdWithSlug(id)) {
    const idFromSlug = getEcwidProductIdFromSlug(id);

    if (idFromSlug) {
      return idFromSlug;
    }
  }

  return id as EcwidProductId;
};
// endregion
