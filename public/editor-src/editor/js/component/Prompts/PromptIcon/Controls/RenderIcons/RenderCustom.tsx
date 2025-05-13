import { noop } from "es-toolkit";
import React, { useMemo } from "react";
import { PromiseComponent } from "visual/component/PromiseComponent";
import { TypeId } from "visual/config/icons/Type";
import { getTypeIcons } from "visual/config/icons/icons";
import { useConfig } from "visual/providers/ConfigProvider";
import { FCC } from "visual/utils/react/types";
import { CustomIcon } from "../CustomIcon";
import { normalizeCustomIcons } from "../CustomIcon/utils";
import { CustomIconProps as Props } from "./types";

export const RenderCustom: FCC<Props> = ({ name, onIconClick }) => {
  const config = useConfig();
  const { add } = config.api?.customIcon ?? {};

  const canUpload = useMemo(() => typeof add === "function", [add]);

  return (
    <PromiseComponent
      getPromise={() => getTypeIcons(TypeId.Custom, config)}
      renderWaiting={() => (
        <CustomIcon
          icons={[]}
          canUpload={false}
          onChange={noop}
          name={name}
          config={config}
        />
      )}
      renderResolved={(icons) => {
        const normalizedIcons = icons.map(normalizeCustomIcons);

        return (
          <CustomIcon
            icons={normalizedIcons}
            onChange={onIconClick}
            canUpload={canUpload}
            name={name}
            config={config}
          />
        );
      }}
    />
  );
};
