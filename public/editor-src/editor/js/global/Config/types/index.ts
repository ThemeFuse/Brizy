import { Cloud, isCMS, isCloud } from "./configs/Cloud";
import { WP, isWp } from "./configs/WP";

export type Config = Cloud | WP;
export { isWp, isCMS, isCloud };
