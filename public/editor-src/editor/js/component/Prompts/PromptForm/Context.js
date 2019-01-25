import React from "react";

export const Context = React.createContext({
  app: {},
  connectedApps: [],
  formId: "",
  formFields: [],
  stages: [],
  onChange: () => {},
  onChangeNext: () => {},
  onChangePrev: () => {},
  onSkipStage: () => {},
  onConnectApp: () => {},
  onDisconnectApp: () => {}
});
