import Config from "visual/global/Config";
import { makeUrl, parseJSON } from "visual/component/Prompts/common/utils";
import { request2 } from "visual/utils/api";
import { SignIn, SignUp } from "./types";
import { ResponseWithBody } from "visual/component/Prompts/common/utils/Request";

export const signIn = (data: SignIn): Promise<ResponseWithBody<unknown>> => {
  const { hash, url, cloudSignIn } = Config.get("wp").api;
  const version = Config.get("editorVersion");
  const urls = makeUrl(url, {
    hash,
    version,
    action: cloudSignIn
  });

  return request2(urls, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    },
    body: JSON.stringify(data)
  })
    .then(parseJSON)
    .then(res => res);
};

export const signUp = (data: SignUp): Promise<ResponseWithBody<unknown>> => {
  const { hash, url, cloudSignUp } = Config.get("wp").api;
  const version = Config.get("editorVersion");
  const urls = makeUrl(url, {
    hash,
    version,
    action: cloudSignUp
  });

  return request2(urls, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    },
    body: JSON.stringify(data)
  })
    .then(parseJSON)
    .then(res => res);
};

export const recoveryEmail = (
  email: string
): Promise<ResponseWithBody<unknown>> => {
  const { hash, url, cloudResetPassword } = Config.get("wp").api;
  const version = Config.get("editorVersion");
  const urls = makeUrl(url, {
    hash,
    version,
    action: cloudResetPassword
  });

  return request2(urls, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    },
    body: JSON.stringify({ email })
  })
    .then(parseJSON)
    .then(res => res);
};

export const logout = (): Promise<ResponseWithBody<unknown>> => {
  const { hash, url, cloudSignOut } = Config.get("wp").api;
  const version = Config.get("editorVersion");
  const urls = makeUrl(url, {
    hash,
    version,
    action: cloudSignOut
  });

  return request2(urls, {
    method: "GET",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    }
  })
    .then(parseJSON)
    .then(res => res);
};

export const sync = (): Promise<ResponseWithBody<unknown>> => {
  const { hash, url, cloudSync } = Config.get("wp").api;
  const version = Config.get("editorVersion");
  const urls = makeUrl(url, {
    hash,
    version,
    action: cloudSync
  });

  return new Promise((res, rej) => {
    request2(urls, {
      method: "GET",
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      }
    })
      .then(r => parseJSON<{ synchronized: number }>(r))
      .then(r => {
        const { status, data } = r;

        if (!status || status >= 400) {
          throw r;
        } else {
          const { synchronized } = data;

          if (synchronized === 0) {
            res(r);
          } else {
            sync()
              .then(res)
              .catch(rej);
          }
        }
      })
      .catch(rej);
  });
};

export const checkCompatibility = (): Promise<ResponseWithBody<unknown>> => {
  const { hash, url, cloudSyncAllowed } = Config.get("wp").api;
  const version = Config.get("editorVersion");
  const urls = makeUrl(url, { hash, version, action: cloudSyncAllowed });

  return request2(urls, {
    method: "GET",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    }
  })
    .then(parseJSON)
    .then(res => res);
};
