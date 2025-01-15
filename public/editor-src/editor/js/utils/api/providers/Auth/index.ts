import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { AuthError } from "visual/utils/errors";
import { t } from "visual/utils/i18n";
import { request } from "../../";
import { APIAuthProvider, AuthProviderResponse } from "./types";
import { decrypt } from "./utils";


export class AuthProvider implements APIAuthProvider {
  private readonly authUrl: string;

  constructor(url: string) {
    this.authUrl = url;
  }

  async send(config: ConfigCommon): Promise<AuthProviderResponse> {
    const { auth } = config;

    if (auth) {
      if (auth.token === "demo") {
        return Promise.resolve({ message: "success" });
      }

      const data = decrypt(auth.token);

      try {
        const { auth } = JSON.parse(data);

        if (auth) {
          return Promise.resolve({ message: "success" });
        }
      } catch (e) {
        const r = await request(
          this.authUrl,
          {
            method: "POST",
            body: new URLSearchParams({
              token: auth.token
            })
          },
          config
        );
        if (!r.ok) {
          throw new AuthError(t("Failed to authenticate: invalid token"));
        }

        return await r.json();
      }
    }

    throw new AuthError(t("Missing Auth Token in config"));
  }
}
