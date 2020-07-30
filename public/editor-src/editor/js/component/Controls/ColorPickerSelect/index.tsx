import React, { ComponentProps, ReactElement, useCallback } from "react";
import classNames from "classnames";
import { ColorPicker3 } from "visual/component/Controls/ColorPicker3";
import { Select2 } from "visual/component/Controls/Select2";
import { WithClassName } from "visual/utils/options/attributes";
import { Props as ItemProps } from "visual/component/Controls/MultiSelect/Item";
import { PaletteObject } from "visual/component/Controls/ColorPalette/entities/PaletteObject";
import { Value, Meta } from "./entities";
import { Literal } from "visual/utils/types/Literal";

type C3Props = ComponentProps<typeof ColorPicker3>;
type ItemType<T> = ReactElement<ItemProps<T>>;

export type Props<T extends Literal> = WithClassName & {
  children: ItemType<T>[];
  onChange: (v: Value<T>, m: Meta) => void;
  value: Value<T>;
  paletteOpenSettings: () => void;
  palette: PaletteObject[];
  opacity: boolean;
};

export function ColorPickerSelect<T extends Literal>(
  props: Props<T>
): ReactElement {
  const className = classNames(
    props.className,
    "brz-ed-control__colorPickerSelect"
  );

  const onColorChange: C3Props["onChange"] = (v, m): void => {
    props.onChange({ ...v, select: props.value.select }, m);
  };
  const onSelectChange = useCallback(
    (select: T): void => {
      props.onChange({ ...props.value, select }, { isChanged: "select" });
    },
    [props.onChange, props.value]
  );

  return (
    <div className={className}>
      {props.children.length && (
        <Select2<T>
          className="brz-control__select--dark brz-control__select__auto brz-ed-control__colorPickerSelect--select"
          value={props.value.select}
          editable={false}
          onChange={onSelectChange}
          size={"short"}
          search={(): boolean => true}
        >
          {props.children}
        </Select2>
      )}
      <ColorPicker3
        onChange={onColorChange}
        palette={props.palette}
        paletteOpenSettings={props.paletteOpenSettings}
        opacity={props.opacity}
        value={props.value}
      />
    </div>
  );
}
