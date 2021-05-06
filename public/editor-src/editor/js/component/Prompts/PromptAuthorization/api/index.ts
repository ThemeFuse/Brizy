import Config from "visual/global/Config";
import { request2 } from "visual/utils/api";
import { SignIn, SignUp } from "./types";

export const signIn = (data: SignIn): Promise<Response> => {
  const apiUrl = Config.get("urls").api;

  return request2(`${apiUrl}/sign_ins`, {
    method: "POST",
    body: new URLSearchParams(data)
  });
};

export const signUp = (data: SignUp): Promise<Response> => {
  const apiUrl = Config.get("urls").api;
  const { email, password, confirmPassword } = data;

  return request2(`${apiUrl}/sign_ups`, {
    method: "POST",
    body: new URLSearchParams({
      email,
      /* eslint-disable @typescript-eslint/camelcase */
      new_password: password,
      confirm_password: confirmPassword
      /* eslint-enable @typescript-eslint/camelcase */
    })
  });
};

export const recoveryEmail = (email: string): Promise<Response> => {
  const apiUrl = Config.get("urls").api;

  return request2(`${apiUrl}/recover_passwords`, {
    method: "POST",
    body: new URLSearchParams(email)
  });
};

export const logout = (): Promise<Response> => {
  const apiUrl = Config.get("urls").api;

  return request2(`${apiUrl}/logout`, {
    method: "POST"
  });
};

export const sync = (): Promise<Response> => {
  const apiUrl = Config.get("urls").api;

  return request2(`${apiUrl}/sync`, {
    method: "POST"
  });
};

export const checkCompatibility = (): Promise<{
  status: number;
  data?: { isSyncAllowed: boolean };
}> => {
  return Promise.resolve({
    status: 200
  });
};
