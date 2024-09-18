import React, { ReactElement } from "react";
import { Select2 } from "visual/component/Controls/Select2";
import { Item } from "visual/component/Controls/Select2/Item";
import { OptionLabel } from "visual/component/OptionLabel";
import { OptionWrapper } from "visual/component/OptionWrapper";
import { OnChange } from "visual/component/Options/Type";
import { t } from "visual/utils/i18n";
import {
  Style,
  styleTitle
} from "visual/utils/options/Animation/types/effects/Attention";

export interface Props<T extends Style> {
  styles: T[];
  value: T;
  onChange: OnChange<T>;
}

export function AttentionStyle<T extends Style>({
  styles,
  value,
  onChange
}: Props<T>): ReactElement {
  return (
    <OptionWrapper display={"inline"} className={"brz-ed-option"}>
      <OptionLabel label={t("Style")} />
      <Select2<T> value={value} onChange={onChange} editable={false}>
        {styles.map((s) => {
          return (
            <Item<Style> key={s} value={s}>
              {styleTitle(s)}
            </Item>
          );
        })}
      </Select2>
    </OptionWrapper>
  );
}
