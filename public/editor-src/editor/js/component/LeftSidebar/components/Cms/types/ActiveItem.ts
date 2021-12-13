import { mPipe, parse, pass } from "fp-utilities";
import * as Str from "visual/utils/string/specs";
import * as Obj from "visual/utils/reader/object";

export enum ActiveItemTypes {
  Customer = "customer",
  CollectionItem = "collectionItem"
}

export type ActiveItem = {
  __type: ActiveItemTypes;
  id: string;
};

const isActiveItemTypes = (s: string): s is ActiveItemTypes =>
  Object.values(ActiveItemTypes).includes(s as ActiveItemTypes);

export const read = parse<unknown, ActiveItem>({
  __type: mPipe(
    pass(Obj.isObject),
    Obj.readKey("__type"),
    Str.read,
    pass(isActiveItemTypes)
  ),
  id: mPipe(pass(Obj.isObject), Obj.readKey("id"), Str.read)
});
