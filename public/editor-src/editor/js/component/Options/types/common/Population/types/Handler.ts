import { Response } from "visual/global/Config/types/configs/common";
import { Literal } from "visual/utils/types/Literal";

export type Handler<T extends Literal> = (
  res: Response<T>,
  rej: Response<string>,
  extra?: { keyCode?: string; placeholder: T }
) => void;
