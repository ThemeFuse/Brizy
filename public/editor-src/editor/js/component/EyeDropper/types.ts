export enum Type {
  Idle = "Idle",
  Loading = "Loading",
  Active = "Active"
}

// region Idle
export interface Idle {
  type: Type.Idle;
}

export const idle = (): Idle => ({ type: Type.Idle });
// endregion

// region Loading
export interface Loading {
  type: Type.Loading;
  context: {
    node: HTMLElement;
  };
}

export const loading = (context: Loading["context"]): Loading => ({
  type: Type.Loading,
  context
});
// endregion

// region Active
export interface Active {
  type: Type.Active;
  context: {
    node: HTMLElement;
    c2d: CanvasRenderingContext2D;
  };
}

export const active = (context: Active["context"]): Active => ({
  type: Type.Active,
  context
});
// endregion

export type State = Idle | Loading | Active;

export const isPreload = (s: State): s is Idle | Loading =>
  [Type.Idle, Type.Loading].includes(s.type);

export const isLoaded = (s: State): s is Active => s.type === Type.Active;

export interface Coords {
  x: number;
  y: number;
}
