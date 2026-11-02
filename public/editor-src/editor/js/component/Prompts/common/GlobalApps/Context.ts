import { noop } from "es-toolkit";
import React from "react";
import type { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import type { BaseKey } from "./BaseApp";
import type { BaseIntegrationContext } from "./type";

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
  onError: noop,
  config: {} as ConfigCommon
});
