import { match2, or } from "fp-utilities";
import { IsEqual } from "visual/utils/types/Eq";

export interface WithValue {
  id: string;
  name: string;
}

export const isWithValue = (v: Value): v is WithValue => !!v;

export const isNoValue = (v: Value): v is undefined => !v;

export type Value = undefined | WithValue;

export const eq: IsEqual<Value> = or(
  match2(
    [isWithValue, isWithValue, (a, b) => a.id === b.id && a.name === b.name],
    [isNoValue, isNoValue, () => true]
  ),
  () => false
);

export interface UploadData {
  filename: string;
  hash_id: string;
  id: number;
  name: string;
  uid: string;
}
