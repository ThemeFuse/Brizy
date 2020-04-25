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
  value: {
    formId: string;
    formFields: FormField[];
  };
  tab: object;
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

export type AppData = {
  id: string;
  pro: boolean;
  img: string;
  title: string;
  stages: Array<{ type: BaseKey; title: string; hideProgress?: boolean }>;
};
