import { get } from "lodash";
import { request } from "../api";
import { getConfig } from "../config";
import { Action, Conversation, RequestOptions, Role } from "../types/AiText";
import { t } from "../utils/i18n";
import * as Str from "../utils/reader/string";

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
    const conversation: Conversation[] = [];

    switch (action) {
      case Action.Extend:
        conversation.push({
          role: Role.User,
          content: "Expand the following text by 2 times: "
        });
        conversation.push({
          role: Role.Assistant,
          content: `${prompt}`
        });
        break;
      case Action.Shorten:
        conversation.push({
          role: Role.User,
          content: "Make the following text shorter: "
        });
        conversation.push({
          role: Role.Assistant,
          content: `${prompt}`
        });
        break;
      case Action.Simplify:
        conversation.push({
          role: Role.User,
          content:
            "Simplify the language(do not translate initial text) of following text "
        });
        conversation.push({
          role: Role.Assistant,
          content: `${prompt}`
        });
        break;
      case Action.English:
      case Action.German:
      case Action.French:
      case Action.Spanish:
      case Action.Italian:
      case Action.Dutch:
      case Action.Portuguese:
      case Action.Polish:
        conversation.push({
          role: Role.Assistant,
          content: `Translate text to ${action}: ${prompt}`
        });
        break;
      case Action.Professional:
      case Action.Casual:
      case Action.Confident:
      case Action.Friendly:
        conversation.push({
          role: Role.User,
          content: `Change the tone of the following text to '${action}', also do not translate the response into another language: ${prompt}`
        });
        break;
      default:
        conversation.push({
          role: Role.Assistant,
          content: prompt
        });
        break;
    }

    const r = await request(config.api.openAIUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        messages: conversation,
        model: RequestOptions.Model,
        temperature: RequestOptions.Temperature
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
