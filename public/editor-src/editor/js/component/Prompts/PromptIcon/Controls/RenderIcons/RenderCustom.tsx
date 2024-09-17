import React, { useMemo } from "react";
import _ from "underscore";
import { PromiseComponent } from "visual/component/PromiseComponent";
import { getTypeIcons } from "visual/config/icons/icons";
import { TypeId } from "visual/config/icons/Type";
import Config from "visual/global/Config";
import { FCC } from "visual/utils/react/types";
import { CustomIcon } from "../CustomIcon";
import { normalizeCustomIcons } from "../CustomIcon/utils";
import { CustomIconProps as Props } from "./types";

export const RenderCustom: FCC<Props> = ({ name, onIconClick }) => {
  const canUpload = useMemo(
    () => typeof Config.getAll().api?.customIcon?.add === "function",
    []
  );

  return (
    <PromiseComponent
      getPromise={() => getTypeIcons(TypeId.Custom)}
      renderWaiting={() => (
        <CustomIcon
          icons={[]}
          canUpload={false}
          onChange={_.noop}
          name={name}
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
          />
        );
      }}
    />
  );
};
