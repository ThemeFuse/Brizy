import type { ComponentClass } from "react";

export interface ConfigTab {
  id: string;
}

export interface Tab {
  id: string;
  title: string;
  icon: string;
  // biome-ignore lint: migrated from eslint
  component: ComponentClass<any>;
}
