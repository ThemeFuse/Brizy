import { WithPayload } from "./Base";

enum Types {
  WithoutToken = "list:WithoutToken",
  WithToken = "list:WithToken"
}

type Payload = {
  collectionId: number;
  user: { isPro: boolean };
  apiUrl: string;
  previewUrl: string;
  projectSettings: string;
  mediaUrl: string;
};

type WithoutToken = WithPayload<Types.WithoutToken, Payload>;

type WithToken = WithPayload<Types.WithToken, Payload & { token: string }>;

export type List = WithoutToken | WithToken;

export const listWithoutToken = (
  payload: WithoutToken["payload"]
): WithoutToken => ({
  type: Types.WithoutToken,
  payload
});

export const listWithToken = (payload: WithToken["payload"]): WithToken => ({
  type: Types.WithToken,
  payload
});
