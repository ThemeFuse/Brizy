import classNames from "classnames";
import React, { useMemo } from "react";
import { Item } from "visual/component/Controls/Select2/Item";
import { Select2 } from "visual/component/Controls/Select2";
import EditorIcon from "visual/component/EditorIcon";
import Config from "visual/global/Config";
import { isCloud, isShopify } from "visual/global/Config/types/configs/Cloud";
import { FontStyleProps as Props } from "./types/Props";

export const FontStyle = ({
  className,
  styles,
  openSettings,
  onChange,
  value
}: Props): JSX.Element => {
  const _className = classNames("brz-ed-control__font-style", className);

  const disableSettings = useMemo(() => {
    const config = Config.getAll();

    return isCloud(config) && isShopify(config);
  }, []);

  return (
    <div className={_className}>
      <Select2<string>
        value={value}
        onChange={onChange}
        editable={false}
        size="auto"
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
