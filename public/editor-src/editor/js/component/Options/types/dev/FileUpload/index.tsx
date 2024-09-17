import React, { ReactElement, useMemo } from "react";
import * as Option from "visual/component/Options/Type";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { WithConfig } from "visual/types/attributes";
import { Uploader } from "./components/Uploader";
import { Value } from "./types/Value";

export type Config = {
  allowedExtensions?: string[];
  componentId?: ElementTypes;
};

export type Props = Option.Props<Value | undefined> & WithConfig<Config>;

export const FileUpload = ({
  config,
  label,
  value,
  onChange
}: Props): ReactElement => {
  const extensions = useMemo(
    () => config?.allowedExtensions ?? [],
    [config?.allowedExtensions]
  );

  const componentId = useMemo(() => config?.componentId, [config?.componentId]);

  return (
    <>
      {label}
      <Uploader
        extensions={extensions}
        value={value}
        onChange={onChange}
        componentId={componentId}
      />
    </>
  );
};
