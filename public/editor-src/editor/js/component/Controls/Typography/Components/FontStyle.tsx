import classNames from "classnames";
import React from "react";
import { Select2 } from "visual/component/Controls/Select2";
import { Item } from "visual/component/Controls/Select2/Item";
import EditorIcon from "visual/component/EditorIcon";
import { isCloud, isShopify } from "visual/global/Config/types/configs/Cloud";
import { useConfig } from "visual/global/hooks";
import { FontStyleProps as Props } from "../types/Props";

export const FontStyle = ({
  className,
  styles,
  openSettings,
  onChange,
  value,
  isFontStyleSettingsDisabled
}: Props): JSX.Element => {
  const _className = classNames("brz-ed-control__font-style", className);
  const config = useConfig();
  const disableSettings =
    isFontStyleSettingsDisabled || (isCloud(config) && isShopify(config));

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
