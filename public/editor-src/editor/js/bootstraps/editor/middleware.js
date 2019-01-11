import thunk from "redux-thunk";
import { sideEffects, api } from "visual/redux/middleware";

export default [
  thunk,
  sideEffects({ document, parentDocument: window.parent.document }),
  api
];
