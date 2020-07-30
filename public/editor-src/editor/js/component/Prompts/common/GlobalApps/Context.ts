import React from "react";
import { noop } from "underscore";
import { BaseIntegrationContext } from "./type";

export const Context = React.createContext<BaseIntegrationContext>({
  app: {},
  connectedApps: [],
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
