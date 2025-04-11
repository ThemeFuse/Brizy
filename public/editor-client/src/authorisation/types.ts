import { SignIn, SignUp } from "@/types/Authorization";
import { Response, ResponseWithBody } from "@/types/Response";

type R = Response<ResponseWithBody<unknown>>;

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
  checkCompatibility: (res: R, rej: Response<string>) => void;
}
