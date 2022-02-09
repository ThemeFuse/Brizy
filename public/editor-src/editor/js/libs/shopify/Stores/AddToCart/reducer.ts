import { Actions } from "./types/Actions";
import * as State from "./types/State";

export function reducer(a: Actions, s: State.State): State.State {
  switch (a.type) {
    case "SetQuantity": {
      if (a.payload !== s.quantity) {
        switch (s.type) {
          case "Ready":
            return State.ready(s.handle, a.payload, s.variationId);
          case "Submitting":
            return State.submitting(s.handle, a.payload, s.variationId);
        }
      }
      return s;
    }
    case "SetVariation": {
      switch (s.type) {
        case "Ready":
          return a.payload !== s.variationId
            ? State.ready(s.handle, s.quantity, a.payload)
            : s;
        case "Submitting":
          return a.payload !== s.variationId
            ? State.submitting(s.handle, s.quantity, a.payload)
            : s;
      }
    }
    case "Submit": {
      switch (s.type) {
        case "Ready":
          return State.submitting(s.handle, s.quantity || 1, s.variationId);
        case "Submitting":
          return s;
      }
    }
    case "SubmitErr":
    case "SubmitSuccess": {
      return s.type === "Submitting"
        ? State.ready(s.handle, 0, s.variationId)
        : s;
    }
  }
}
