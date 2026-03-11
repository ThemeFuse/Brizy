export interface Sheet {
  modulePath: string;
  chunkName: string;
  componentId?: string;
  groupName?: string;
}

export interface SCSSImport {
  modulePath: string;
  isPro: boolean;
}

export interface SCSSRegistry {
  free: Set<Sheet>;
  pro: Set<Sheet>;
}

export interface SCSSImports {
  free: Sheet[];
  pro: Sheet[];
}

export interface SCSSSheetAPI {
  getImports(): SCSSImports;
  purge(): void;
}
