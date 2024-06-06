import classNames from "classnames";
import React from "react";
import EditorIcon from "visual/component/EditorIcon";
import { WithClassName, WithOnChange } from "visual/utils/options/attributes";
import { ColorPaletteItem } from "./entities/Item";
import { PaletteObject } from "./entities/PaletteObject";

type Props = WithClassName &
  WithOnChange<string> & {
    palette: PaletteObject[];
    value: string;
    openSettings?: () => void;
  };

export const ColorPalette = ({
  className = "",
  palette,
  onChange,
  openSettings,
  value = ""
}: Props): JSX.Element => {
  const wrapperClassName = classNames(
    "brz-ed-control__color-palette",
    className
  );

  return (
    <div className={wrapperClassName}>
      {palette.map(({ id, hex }) => (
        <ColorPaletteItem
          key={id}
          id={id}
          hex={hex}
          value={value}
          onChange={onChange}
        />
      ))}

      {openSettings && (
        <div
          className="brz-ed-control__color-palette__icon"
          onClick={openSettings}
        >
          <EditorIcon icon="nc-cog" />
        </div>
      )}
    </div>
  );
};
