import loadable from "@loadable/component";
import React, { ReactElement } from "react";
import { LoadableLoading } from "visual/component/LoadableLoading";
import { Props } from "./types";

const LazyCodeMirror = loadable(
  () => import(/* webpackChunkName: "codemirror" */ "./CodeMirrorImpl"),
  { fallback: LoadableLoading }
);

export const CodeMirror = (props: Props): ReactElement => (
  <LazyCodeMirror {...props} />
);
