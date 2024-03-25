export interface Pro {
  version?: string;
  whiteLabel?: boolean;
  urls: {
    assets: string;
    compileAssets?: string;
  };
}
