import { MigrationRichText } from "./types";
import { m2 } from "./version2";
import { m3 } from "./version3";

export const migrations: MigrationRichText[] = [m2, m3];
