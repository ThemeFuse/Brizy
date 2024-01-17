import { franc } from "franc";
import { get } from "lodash";
import { request } from "../api";
import { getConfig } from "../config";
import { Action, RequestOptions } from "../types/AiText";
import { t } from "../utils/i18n";
import * as Str from "../utils/reader/string";
import { createConversation } from "./utils";

export const doAiRequest = async (
  res: (value: string) => void,
  rej: (error: string) => void,
  data: { prompt: string; action?: Action }
): Promise<void> => {
  const config = getConfig();

  if (!config) {
    throw new Error(t("Invalid __BRZ_PLUGIN_ENV__"));
  }

  if (typeof config.api.openAIUrl === "undefined") {
    throw new Error(t("Missing OpenAiUrl"));
  }

  try {
    const { prompt, action } = data;

    const conversation = createConversation({
      action,
      prompt,
      language: franc(data.prompt)
    });

    const r = await request(config.api.openAIUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: RequestOptions.Model,
        ...conversation
      })
    });

    const json = await r.json();

    const content = Str.read(get(json, ["choices", "0", "message", "content"]));

    if (content) {
      res(content);
    } else {
      rej(t("Something went wrong, please try again"));
    }
  } catch (e) {
    rej(t("Something went wrong, please try again"));
  }
};
