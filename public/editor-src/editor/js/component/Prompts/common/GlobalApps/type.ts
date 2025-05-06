import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { BaseKey } from "./BaseApp";

export type FormField = {
  label: string;
  options: Array<string>;
  required: "on" | "off";
  type: string;
  _id: string;
};

export interface BaseIntegrationProps {
  className: string;
  tab: Record<string, unknown>;
  stage: string;
  stages: AppData["stages"];
  onLoading: (l: boolean) => void;
  onTabUpdate: () => void;
  onClose: () => void;
  formId?: string;
  config: ConfigCommon;
}

export interface BaseIntegrationState {
  loading: boolean;
  showProgress: boolean;
  connectedApp: string;
  connectedApps: Array<string>;
  stage: BaseIntegrationProps["stage"];
  stages: BaseIntegrationProps["stages"];
  oldStage: string;
  data: {
    [key: string]: AppData;
  };
  error: null | string;
  appError: null | string;
}

export interface BaseIntegrationContext {
  app: AppData;
  connectedApps: Array<string>;
  stages: AppData["stages"];
  stage: string;
  oldStage: string;
  onChange: (
    id: string,
    data: Record<string, unknown> | null,
    next?: VoidFunction
  ) => void;
  onChangeNext: (stage?: BaseKey) => void;
  onChangePrev: (stage: BaseKey) => void;
  onConnectApp: (data: AppData) => void;
  onDisconnectApp: (appId: string) => void;
  onChangeProgress: (progress: { showProgress: boolean }) => void;
  onError: (error: null | string) => void;
  config: ConfigCommon;
}

export type AppData = {
  id: string;
  img: string;
  title: string;
  shortTitle: string;
  stages: Array<{ type: BaseKey; title?: string; hideProgress?: boolean }>;
  pro?: boolean;
  restrictions?: { [key: string]: unknown };
  descriptions?: string;
  docsUrl?: string;
  data?: {
    id: string;
    formId: string;
    type: string;
    confirmationNeeded: boolean;
    usedList: string;
    usedFolder: string;
    fieldsMap: string;
    usedAccount?: string | null;
    completed?: boolean;
  };
};
