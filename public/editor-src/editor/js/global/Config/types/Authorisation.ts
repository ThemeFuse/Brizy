import {
  Response as APIResponse,
  SuccessResponse
} from "visual/global/Config/types/configs/common";

export interface SignIn {
  password: string;
  email: string;
}

export interface SignUp {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

type R = APIResponse<SuccessResponse>;

export interface CheckCompatibilityResponse extends SuccessResponse {
  isSyncAllowed: boolean;
}

export interface Authorisation {
  signIn: (res: R, rej: APIResponse<string>, data: SignIn) => void;
  signUp: (res: R, rej: APIResponse<string>, data: SignUp) => void;
  recoveryEmail: (
    res: R,
    rej: APIResponse<string>,
    data: { email: string }
  ) => void;
  logout: (res: R, rej: APIResponse<string>) => void;
  sync: (res: R, rej: APIResponse<string>) => void;
  checkCompatibility: (
    res: APIResponse<CheckCompatibilityResponse>,
    rej: APIResponse<string>
  ) => void;
}
