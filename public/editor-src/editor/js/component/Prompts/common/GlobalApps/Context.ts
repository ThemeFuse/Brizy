import React from "react";
import { noop } from "underscore";
import { AppData } from "./type";
import { BaseKey } from "./BaseApp";

type FormField = {
  label: string;
  options: Array<string>;
  required: "on" | "off";
  type: string;
  _id: string;
};

export type ContextIntegration = {
  app: object;
  connectedApps: Array<string>;
  formId: string;
  formFields: FormField[];
  stages: AppData["stages"];
  stage: string;
  oldStage: string;
  onChange: (id: string, data: object) => void;
  onChangeNext: (stage: BaseKey) => void;
  onChangePrev: (stage: BaseKey) => void;
  onConnectApp: (data: AppData) => void;
  onDisconnectApp: (appId: string) => void;
  onChangeProgress: (progress: { showProgress: boolean }) => void;
  onError: (error: null | string) => void;
};

export const Context = React.createContext<ContextIntegration>({
  app: {},
  connectedApps: [],
  formId: "",
  formFields: [],
  stages: [],
  stage: "",
  oldStage: "",
  // eslint-disable-next-line @typescript-eslint/no-empty-function,@typescript-eslint/no-unused-vars
  onChange: (id: string, data: object): void => {},
  onChangeNext: noop,
  onChangePrev: noop,
  onConnectApp: noop,
  onDisconnectApp: noop,
  onChangeProgress: noop,
  onError: noop
});
