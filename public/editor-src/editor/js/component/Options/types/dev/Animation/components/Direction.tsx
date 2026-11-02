import React, { type ReactElement } from "react";
import { Select2 } from "visual/component/Controls/Select2";
import { Item } from "visual/component/Controls/Select2/Item";
import { OptionLabel } from "visual/component/OptionLabel";
import type { OnChange } from "visual/component/Options/Type";
import { OptionWrapper } from "visual/component/OptionWrapper";
import { t } from "visual/utils/i18n";

export interface Props<T extends number | string> {
  directions: Array<[T, string]>;
  value: T;
  label?: string;
  onChange: OnChange<T>;
}

export function Direction<T extends number | string>({
  value,
  onChange,
  directions,
  label
}: Props<T>): ReactElement | null {
  return directions.length > 1 ? (
    <OptionWrapper display={"inline"} className={"brz-ed-option"}>
      <OptionLabel label={label ?? t("Direction")} />
      <Select2<T> value={value} onChange={onChange} editable={false}>
        {directions.map(([k, t]) => {
          return (
            <Item<T> key={k} value={k}>
              {t}
            </Item>
          );
        })}
      </Select2>
    </OptionWrapper>
  ) : null;
}
