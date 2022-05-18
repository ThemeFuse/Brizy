import React from "react";
import { noop } from "underscore";
import { BaseIntegrationContext } from "./type";

export const Context = React.createContext<BaseIntegrationContext>({
  app: {},
  connectedApps: [],
  stages: [],
  stage: "",
  oldStage: "",
  onChange: noop,
  onChangeNext: noop,
  onChangePrev: noop,
  onConnectApp: noop,
  onDisconnectApp: noop,
  onChangeProgress: noop,
  onError: noop
});
