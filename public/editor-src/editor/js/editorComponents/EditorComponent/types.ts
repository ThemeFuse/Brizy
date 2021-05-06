import { Dictionary } from "visual/types/utils";
import {
  DCObjIncomplete,
  DCObjDetails,
  DCObjResult
} from "./DynamicContent/getDCObj";

export interface ECDC {
  pendingDCObjIncomplete?: DCObjIncomplete;
  keys?: DCObjDetails;
  lastCache?: DCObjResult;
}

export type ECKeyDCInfo = {
  key: string;
  hasDC: boolean;
  staticValue: unknown;
  dcValue: string;
  attr: Dictionary<unknown>;
  fallback: unknown;
};
