export type Dictionary<T> = {
  [k: string]: T | undefined;
};

export type JsonOutput = {
  html: string;
  assets: {
    freeStyles: Record<string, unknown>;
    freeScripts: Record<string, unknown>;
    proStyles?: Record<string, unknown>;
    proScripts?: Record<string, unknown>;
  };
};

export type HtmlOutput = {
  html: string;
  styles: Array<string>;
  scripts: Array<string>;
};

export type Output = JsonOutput | HtmlOutput;
