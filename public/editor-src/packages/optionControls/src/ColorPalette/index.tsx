import classNames from "classnames";
import React from "react";
import { EditorIcon } from "../EditorIcon";
import { IconsName } from "../EditorIcon/types";
import { Props } from "./types";

export const ColorPalette = <T extends string>({
  className,
  palette,
  onChange,
  openSettings,
  value
}: Props<T>): JSX.Element => {
  const wrapperClassName = classNames(
    "brz-ed-control__color-palette",
    className
  );
  return (
    <div className={wrapperClassName}>
      {palette.map(({ id, hex }) => {
        const className = classNames("brz-ed-control__color-palette__item", {
          active: id === value
        });

        return (
          <div
            key={id}
            className={className}
            style={{ backgroundColor: hex }}
            onClick={() => onChange(id)}
          />
        );
      })}
      {openSettings && (
        <div
          className="brz-ed-control__color-palette__icon"
          onClick={openSettings}
        >
          <EditorIcon icon={IconsName.Settings} />
        </div>
      )}
    </div>
  );
};
