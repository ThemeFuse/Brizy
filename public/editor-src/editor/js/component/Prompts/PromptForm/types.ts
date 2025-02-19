import type { ComponentClass } from "react";

export interface ConfigTab {
  id: string;
}

export interface Tab {
  id: string;
  title: string;
  icon: string;
  // eslint-disable-next-line
  component: ComponentClass<any>;
}
