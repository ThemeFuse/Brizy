import React from "react";
import * as Option from "visual/component/Options/Type";
import { WithConfig } from "visual/utils/options/attributes";

export type Config = {
  html: string;
};

export type Props = Option.Props<undefined> & WithConfig<Config>;

export const Alert: React.FC<Props> = ({ config, label }) => {
  return (
    <>
      {label}
      <div
        style={{ width: "100%" }}
        dangerouslySetInnerHTML={{ __html: config?.html || "" }}
      />
    </>
  );
};
