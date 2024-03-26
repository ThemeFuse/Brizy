import { Response } from "../types/Response";
export interface ErrorResponse {
  success: false;
  data: string;
}

export interface SendHeartBeat {
  sendHandler: (
    res: Response<{
      locked: boolean;
      lockedBy: boolean | { user_email: string };
    }>,
    rej: Response<string>
  ) => void;
  takeOverHandler: (res: Response<unknown>, rej: Response<string>) => void;
}
