import { ElementModel } from "visual/component/Elements/Types";
import { Migration } from "visual/utils/migration";
import { m2 } from "./2";
import { m3 } from "./3";

export const migrations: Migration<ElementModel>[] = [m2, m3];
