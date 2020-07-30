import React, { FC, useCallback } from "react";
import classNames from "classnames";
import EditorIcon from "visual/component/EditorIcon";
import { WithClassName, WithOnChange } from "visual/utils/options/attributes";
import { PaletteObject } from "./entities/PaletteObject";

type Props = WithClassName &
  WithOnChange<string> & {
    palette: PaletteObject[];
    value: string;
    openSettings: () => void;
  };

export const ColorPalette: FC<Props> = ({
  className = "",
  palette,
  onChange,
  openSettings,
  value = ""
}) => {
  const wrapperClassName = classNames(
    "brz-ed-control__color-palette",
    className
  );
  return (
    <div className={wrapperClassName}>
      {palette.map(({ id, hex }) => {
        const cb = useCallback(() => onChange(id), [onChange]);
        const className = classNames({
          "brz-ed-control__color-palette__item": true,
          active: id === value
        });

        return (
          <div
            key={id}
            className={className}
            style={{ backgroundColor: hex }}
            onClick={cb}
          />
        );
      })}
      <div
        className="brz-ed-control__color-palette__icon"
        onClick={openSettings}
      >
        <EditorIcon icon="nc-cog" />
      </div>
    </div>
  );
};
