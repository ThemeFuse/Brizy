import { SignIn, SignUp } from "@/types/Authorization";
import { Response, SuccessResponse } from "@/types/Response";

type R = Response<SuccessResponse>;

export interface CheckCompatibilityResponse extends SuccessResponse {
  isSyncAllowed: boolean;
}

export interface Authorisation {
  signIn: (res: R, rej: Response<string>, data: SignIn) => void;
  signUp: (res: R, rej: Response<string>, data: SignUp) => void;
  recoveryEmail: (
    res: R,
    rej: Response<string>,
    data: { email: string }
  ) => void;
  logout: (res: R, rej: Response<string>) => void;
  sync: (res: R, rej: Response<string>) => void;
  checkCompatibility: (
    res: Response<CheckCompatibilityResponse>,
    rej: Response<string>
  ) => void;
}
