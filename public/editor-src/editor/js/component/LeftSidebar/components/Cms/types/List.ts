import { WhiteLabel } from "./WhiteLabel";
import { Authorize } from "./Authorize";
import { WithPayload } from "./Base";
import { ProjectId } from "visual/component/LeftSidebar/components/Cms/types/ProjectId";

export interface Cloud {
  __type: "cloud";
  development: boolean;
  protectedPagePassword: string;
  previewUrl: string;
  settingsUrl: string;
  user: {
    isPro: boolean;
  };
  whiteLabel: WhiteLabel;
  projectApi: Authorize;
  userApi: Authorize;
  appointmentsApi: Authorize;
  translationApi: string;
  mediaUrl: string;
  shop: Authorize;
  projectId: ProjectId;
}

export type Context = Cloud;

export type List = WithPayload<"list", Context>;

export const cloud = (payload: Cloud): List => ({ type: "list", payload });
