interface Config {
  url: string;
  hash: string;
  editorVersion: string;
}

export const getConfig = (): Config | undefined => {
  if (!window.__BRZ_PLUGIN_ENV__) {
    throw "missing __BRZ_PLUGIN_ENV__";
  }

  return {
    url: "",
    hash: "",
    editorVersion: window.__BRZ_PLUGIN_ENV__.editorVersion,
  };
};
