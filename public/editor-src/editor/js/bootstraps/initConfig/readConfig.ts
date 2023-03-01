import { Cloud } from "visual/global/Config/types/configs/Cloud";
import { withDefaultConfig } from "./default";

export const readConfig = (config: unknown): Cloud =>
  withDefaultConfig(config as Cloud);
