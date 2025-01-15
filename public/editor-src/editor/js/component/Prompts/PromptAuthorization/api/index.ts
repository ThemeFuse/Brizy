import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { request } from "visual/utils/api";
import { SignIn, SignUp } from "./types";

export const signIn = (
  data: SignIn,
  config: ConfigCommon
): Promise<Response> => {
  const apiUrl = config?.urls?.api;

  return request(`${apiUrl}/sign_ins`, {
    method: "POST",
    body: new URLSearchParams(data)
  });
};

export const signUp = (
  data: SignUp,
  config: ConfigCommon
): Promise<Response> => {
  const apiUrl = config?.urls?.api;
  const { email, password, confirmPassword } = data;

  return request(`${apiUrl}/sign_ups`, {
    method: "POST",
    body: new URLSearchParams({
      email,
      new_password: password,
      confirm_password: confirmPassword
    })
  });
};

export const recoveryEmail = (
  email: string,
  config: ConfigCommon
): Promise<Response> => {
  const apiUrl = config?.urls?.api;

  return request(`${apiUrl}/recover_passwords`, {
    method: "POST",
    body: new URLSearchParams(email)
  });
};

export const logout = (config: ConfigCommon): Promise<Response> => {
  const apiUrl = config?.urls?.api;

  return request(
    `${apiUrl}/logout`,
    {
      method: "POST"
    },
    config
  );
};

export const sync = (config: ConfigCommon): Promise<Response> => {
  const apiUrl = config?.urls?.api;

  return request(
    `${apiUrl}/sync`,
    {
      method: "POST"
    },
    config
  );
};

export const checkCompatibility = (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _: ConfigCommon
): Promise<{
  status: number;
  data?: { isSyncAllowed: boolean };
}> => {
  return Promise.resolve({
    status: 200
  });
};
