import React, { type ReactElement, useMemo } from "react";
import type * as Option from "visual/component/Options/Type";
import type { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import type { WithConfig } from "visual/types/attributes";
import { Uploader } from "./components/Uploader";
import type { Value } from "./types/Value";

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
