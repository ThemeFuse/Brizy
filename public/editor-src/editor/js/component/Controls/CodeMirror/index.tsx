import loadable from "@loadable/component";
import React, { type ReactElement } from "react";
import { LoadableLoading } from "visual/component/LoadableLoading";
import type { Props } from "./types";

const LazyCodeMirror = loadable(
  () => import(/* webpackChunkName: "codemirror" */ "./CodeMirrorImpl"),
  { fallback: LoadableLoading }
);

export const CodeMirror = (props: Props): ReactElement => (
  <LazyCodeMirror {...props} />
);
