import classnames from "classnames";
import React, { useCallback, useMemo, useState } from "react";
import EditorIcon from "visual/component/EditorIcon";
import Toolbar from "visual/component/Toolbar";
import { getToolbarItems } from "./toolbar";
import { Color, Props } from "./types";

export const ColorPaletteEditor = (props: Props): JSX.Element => {
  const {
    className: _className,
    label,
    helper,
    value,
    helperContent,
    attr,
    onChange
  } = props;
  const { className: attrClassName, ...rest } = attr ?? {};

  const className = classnames(
    "brz-ed-option__color-palette-editor",
    _className,
    attrClassName
  );

  const handleColorChange = useCallback(
    (newValue: Color, itemIndex: number) => {
      const _value = value.map((el, index) =>
        index === itemIndex ? { ...el, hex: newValue.hex } : el
      );

      onChange(_value);
    },
    [onChange, value]
  );

  const [active, setActive] = useState<number | null>(null);

  const labelHtml = useMemo(
    () =>
      label && label.props.label ? (
        <div className="brz-ed-option__label brz-ed-option__color-palette-editor__label">
          {label}
          {helper ? (
            <div className="brz-ed-option__helper">
              <EditorIcon icon="nc-alert-circle-que" />
              <div
                className="brz-ed-option__helper__content"
                dangerouslySetInnerHTML={{ __html: helperContent }}
              />
            </div>
          ) : null}
        </div>
      ) : null,
    [helper, helperContent, label]
  );

  const handleToolbarOpen = (index: number) => setActive(index);

  const handleToolbarClose = () => setActive(null);

  const colors = value.map((color: Color, index: number) => {
    const className = classnames("brz-ed-option__color-palette-editor__item", {
      active: index === active
    });
    const style = {
      backgroundColor: color.hex
    };

    return (
      <Toolbar
        key={index}
        getItems={() =>
          getToolbarItems(color, (value) => handleColorChange(value, index))
        }
        onOpen={() => handleToolbarOpen(index)}
        onClose={handleToolbarClose}
      >
        {({ ref }) => <div className={className} style={style} ref={ref} />}
      </Toolbar>
    );
  });

  return (
    <div {...rest} className={className}>
      {label || helper ? labelHtml : null}
      {colors}
    </div>
  );
};
