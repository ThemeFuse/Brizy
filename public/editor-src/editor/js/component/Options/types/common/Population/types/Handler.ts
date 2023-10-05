import { Response } from "visual/global/Config/types/configs/common";

export type Handler<T extends string | number> = (
  res: Response<T>,
  rej: Response<string>
) => void;
