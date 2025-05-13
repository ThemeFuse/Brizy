import { EditorConfig } from "../models/Config";

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

export type Init = (token: string, config: EditorConfig, cb: CB) => void;

export type Builder = {
  init: Init;
};

export type Instance = {
  save: VoidFunction;
};

export type BuilderGlobal = Builder;
