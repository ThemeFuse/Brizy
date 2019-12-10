import React from "react";
import T from "prop-types";
import classNames from "classnames";
import EditorIcon from "visual/component/EditorIcon";

export const ColorPalette = ({
  className,
  palette,
  onChange,
  openSettings,
  value
}) => {
  const wrapperClassName = classNames(
    "brz-ed-control__color-palette",
    className
  );
  return (
    <div className={wrapperClassName}>
      {palette.map(({ id, hex }) => {
        const className = classNames({
          "brz-ed-control__color-palette__item": true,
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
      <div
        className="brz-ed-control__color-palette__icon"
        onClick={openSettings}
      >
        <EditorIcon icon="nc-cog" />
      </div>
    </div>
  );
};

ColorPalette.propTypes = {
  className: T.string,
  palette: T.arrayOf(
    T.shape({
      id: T.string,
      hex: T.string
    })
  ).isRequired,
  value: T.string,
  onChange: T.func.isRequired,
  openSettings: T.func
};

ColorPalette.defaultProps = {
  className: "",
  value: ""
};
