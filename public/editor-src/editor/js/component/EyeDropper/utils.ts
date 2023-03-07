import { Coords, State, Type } from "./types";

export const nodeClasses: { [k in State["type"]]: string[] } = {
  Idle: [],
  Loading: ["brz-ed-eyeDropper", "loading"],
  Active: ["brz-ed-eyeDropper", "active"]
};

export const scrollValue = (s: State): Coords => {
  switch (s.type) {
    case Type.Idle:
      return { x: 0, y: 0 };
    case Type.Loading:
    case Type.Active: {
      const viewport = s.context.node.getBoundingClientRect();
      return {
        x: viewport.left,
        y: viewport.top
      };
    }
  }
};
