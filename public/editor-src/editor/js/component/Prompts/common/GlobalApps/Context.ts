import React from "react";
import { noop } from "underscore";
import { BaseKey } from "./BaseApp";
import { BaseIntegrationContext } from "./type";

const app = {
  id: "",
  img: "",
  title: "",
  shortTitle: "",
  stages: [{ type: "list" as BaseKey }]
};

export const Context = React.createContext<BaseIntegrationContext>({
  app: app,
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
