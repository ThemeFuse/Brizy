import { Config } from "../models/Config";
import { HtmlOutputType } from "../models/common";

export enum ActionKind {
  idle = "idle",
  init = "init",
  load = "load",
  ready = "ready",
  error = "error"
}

// An interface for our actions
export interface Action {
  type: ActionKind;
  error?: string;
}

// An interface for our state
export interface State {
  status: ActionKind;
  error?: string;
}

export interface API {
  save: VoidFunction;
}

type CB = (api: API) => void;

export type Init<T extends HtmlOutputType> = (
  token: string,
  config: Config<T>,
  cb: CB
) => void;

export type Builder<T extends HtmlOutputType> = {
  init: Init<T>;
};

export type Instance = {
  save: VoidFunction;
};

export type BuilderGlobal<T extends HtmlOutputType> = Builder<T>;
