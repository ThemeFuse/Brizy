import React, { ReactElement } from "react";
import { OnChange } from "visual/component/Options/Type";
import { t } from "visual/utils/i18n";
import { Select2 } from "visual/component/Controls/Select2";
import { Item } from "visual/component/Controls/MultiSelect/Item";
import { OptionWrapper } from "visual/component/OptionWrapper";
import { OptionLabel } from "visual/component/OptionLabel";

export interface Props<T extends number | string> {
  directions: Array<[T, string]>;
  value: T;
  onChange: OnChange<T>;
}

export function Direction<T extends number | string>({
  value,
  onChange,
  directions
}: Props<T>): ReactElement | null {
  return directions.length > 1 ? (
    <OptionWrapper display={"inline"} className={"brz-ed-option"}>
      <OptionLabel label={t("Direction")} />
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
