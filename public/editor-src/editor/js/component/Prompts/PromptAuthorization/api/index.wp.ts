import { Str } from "@brizy/readers";
import { makeUrl, parseJSON } from "visual/component/Prompts/common/utils";
import { ResponseWithBody } from "visual/component/Prompts/common/utils/Request";
import { WP } from "visual/global/Config";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { request } from "visual/utils/api/index.wp";
import { SignIn, SignUp } from "./types";

export const signIn = (
  data: SignIn,
  config: ConfigCommon
): Promise<ResponseWithBody<unknown>> => {
  const { hash, url, cloudSignIn } = (config as WP).wp.api;
  const version = config.editorVersion;

  const urls = makeUrl(url, {
    hash,
    version,
    action: Str.read(cloudSignIn) ?? ""
  });

  return request(urls, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    },
    body: JSON.stringify(data)
  })
    .then(parseJSON)
    .then((res) => res);
};

export const signUp = (
  data: SignUp,
  config: ConfigCommon
): Promise<ResponseWithBody<unknown>> => {
  const { hash, url, cloudSignUp } = (config as WP).wp.api;
  const version = config.editorVersion;

  const urls = makeUrl(url, {
    hash,
    version,
    action: Str.read(cloudSignUp) ?? ""
  });

  return request(urls, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    },
    body: JSON.stringify(data)
  })
    .then(parseJSON)
    .then((res) => res);
};

export const recoveryEmail = (
  email: string,
  config: ConfigCommon
): Promise<ResponseWithBody<unknown>> => {
  const { hash, url, cloudResetPassword } = (config as WP).wp.api;
  const version = config.editorVersion;
  const urls = makeUrl(url, {
    hash,
    version,
    action: Str.read(cloudResetPassword) ?? ""
  });

  return request(urls, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    },
    body: JSON.stringify({ email })
  })
    .then(parseJSON)
    .then((res) => res);
};

export const logout = (
  config: ConfigCommon
): Promise<ResponseWithBody<unknown>> => {
  const { hash, url, cloudSignOut } = (config as WP).wp.api;
  const version = config.editorVersion;
  const urls = makeUrl(url, {
    hash,
    version,
    action: Str.read(cloudSignOut) ?? ""
  });

  return request(urls, {
    method: "GET",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    }
  })
    .then(parseJSON)
    .then((res) => res);
};

export const sync = (
  config: ConfigCommon
): Promise<ResponseWithBody<unknown>> => {
  const { hash, url, cloudSync } = (config as WP).wp.api;
  const version = config.editorVersion;
  const urls = makeUrl(url, {
    hash,
    version,
    action: Str.read(cloudSync) ?? ""
  });

  return new Promise((res, rej) => {
    request(urls, {
      method: "GET",
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      }
    })
      .then((r) => parseJSON<{ synchronized: number }>(r))
      .then((r) => {
        const { status, data } = r;

        if (!status || status >= 400) {
          throw r;
        } else {
          const { synchronized } = data;

          if (synchronized === 0) {
            res(r);
          } else {
            sync(config).then(res).catch(rej);
          }
        }
      })
      .catch(rej);
  });
};

export const checkCompatibility = (
  config: ConfigCommon
): Promise<ResponseWithBody<unknown>> => {
  const { hash, url, cloudSyncAllowed } = (config as WP).wp.api;
  const version = config.editorVersion;
  const urls = makeUrl(url, {
    hash,
    version,
    action: Str.read(cloudSyncAllowed) ?? ""
  });

  return request(urls, {
    method: "GET",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    }
  })
    .then(parseJSON)
    .then((res) => res);
};
