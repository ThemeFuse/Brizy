import React, { ReactElement } from "react";
import { OnChange } from "visual/component/Options/Type";
import { OptionLabel } from "visual/component/OptionLabel";
import { OptionWrapper } from "visual/component/OptionWrapper";
import { Select2 } from "visual/component/Controls/Select2";
import { Item } from "visual/component/Controls/Select2/Item";

export type Props<T extends string> = {
  value: T;
  onChange: OnChange<T>;
  directions: Array<[T, string]>;
  label: string;
};

export function Direction<T extends string>({
  value,
  onChange,
  directions,
  label
}: Props<T>): ReactElement {
  return (
    <OptionWrapper className={"brz-ed-option"}>
      <OptionLabel label={label} />
      <Select2<T> value={value} onChange={onChange} editable={false}>
        {directions.map(([d, title]) => (
          <Item<T> key={d} value={d}>
            {title}
          </Item>
        ))}
      </Select2>
    </OptionWrapper>
  );
}
