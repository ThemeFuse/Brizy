import { ComponentType } from "react";

interface Component {
  id: string;
  title: string;
  component: {
    view: ComponentType;
  };
}

export interface ThirdPartyComponents {
  [key: string]: Component;
}
