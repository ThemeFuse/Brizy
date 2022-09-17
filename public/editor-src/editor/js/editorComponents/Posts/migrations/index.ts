import { Migration } from "visual/utils/migration";
import { Context } from "../types";
import { m2 } from "./2";
import { m3 } from "./3";

type GetCollectionTypesInfoResult = Context["collectionTypesInfo"];

export const migrations: Migration<GetCollectionTypesInfoResult>[] = [m2, m3];
