import classNames from "classnames";
import React, { FC, useMemo } from "react";
import { Item } from "visual/component/Controls/MultiSelect/Item";
import { Select2 } from "visual/component/Controls/Select2";
import EditorIcon from "visual/component/EditorIcon";
import Config from "visual/global/Config";
import { isCloud, isShopify } from "visual/global/Config/types/configs/Cloud";
import { FontStyleProps as Props } from "./types/Props";

export const FontStyle: FC<Props> = ({
  className,
  styles,
  openSettings,
  onChange,
  value
}) => {
  const _className = classNames("brz-ed-control__font-style", className);

  const config = useMemo(() => Config.getAll(), []);
  const disableSettings = useMemo(
    () => isCloud(config) && isShopify(config),
    []
  );

  return (
    <div className={_className}>
      <Select2<string>
        value={value}
        onChange={onChange}
        editable={false}
        size="medium"
      >
        {styles.map(({ id, title }) => (
          <Item<string> key={id} value={id}>
            {title}
          </Item>
        ))}
      </Select2>
      {!disableSettings && openSettings && (
        <div
          className="brz-ed-control__font-style--settings"
          onClick={openSettings}
        >
          <EditorIcon icon="nc-cog" />
        </div>
      )}
    </div>
  );
};
