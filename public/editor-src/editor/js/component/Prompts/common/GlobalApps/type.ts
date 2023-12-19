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
  app: Record<string, unknown>;
  connectedApps: Array<string>;
  stages: AppData["stages"];
  stage: string;
  oldStage: string;
  onChange: (id: string, data: Record<string, unknown>) => void;
  onChangeNext: (stage: BaseKey) => void;
  onChangePrev: (stage: BaseKey) => void;
  onConnectApp: (data: AppData) => void;
  onDisconnectApp: (appId: string) => void;
  onChangeProgress: (progress: { showProgress: boolean }) => void;
  onError: (error: null | string) => void;
}

export type AppData = {
  id: string;
  pro?: boolean;
  img: string;
  title: string;
  shortTitle: string;
  restrictions?: { [key: string]: unknown };
  descriptions?: string;
  stages: Array<{ type: BaseKey; title?: string; hideProgress?: boolean }>;
  docsUrl?: string;
};
