import { type Cloud, isCloud, isCMS } from "./configs/Cloud";
import { isWp, type WP } from "./configs/WP";

export type Config = Cloud | WP;
export { isCloud, isCMS, isWp };
