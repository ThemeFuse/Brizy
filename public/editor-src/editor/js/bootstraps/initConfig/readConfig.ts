import { Cloud } from "visual/global/Config/types/configs/Cloud";

export const readConfig = (config: unknown): Cloud => config as Cloud;
