import React, { useMemo } from "react";
import * as Option from "visual/component/Options/Type";
import { WithConfig } from "visual/utils/options/attributes";
import { Uploader } from "./components/Uploader";
import { Value } from "./types/Value";

export type Config = {
  allowedExtensions?: string[];
};

export type Props = Option.Props<Value | undefined> & WithConfig<Config>;

export const FileUpload: React.FC<Props> = ({
  config,
  label,
  value,
  onChange
}) => {
  const extensions = useMemo(
    () => config?.allowedExtensions ?? [],
    [config?.allowedExtensions]
  );

  return (
    <>
      {label}
      <Uploader extensions={extensions} value={value} onChange={onChange} />
    </>
  );
};
