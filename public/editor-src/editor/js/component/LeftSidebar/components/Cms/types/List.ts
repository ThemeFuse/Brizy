import { WhiteLabel } from "visual/global/Config/types/WhiteLabel";
import { WithPayload } from "./Base";
import { ProjectId } from "./ProjectId";

enum Types {
  WithoutToken = "list:WithoutToken",
  WithToken = "list:WithToken"
}

type Payload = {
  collectionId: number;
  user: { isPro: boolean };
  apiUrl: string;
  previewUrl: string;
  projectId: ProjectId;
  projectSettings: string;
  mediaUrl: string;
  type: "cloud" | "shopify";
  protectedPagePassword: string | undefined;
  whiteLabel: WhiteLabel;
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
