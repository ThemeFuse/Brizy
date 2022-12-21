declare global {
  namespace NodeJS {
    interface Global {
      "process.env.IS_PRODUCTION": boolean;
    }
  }
  interface Window {
    __BRZ_PLUGIN_ENV__?: {
      hash: string;
      editorVersion: string;
    };
    __VISUAL_CONFIG__?: {
      api?: {};
    };
  }
}
