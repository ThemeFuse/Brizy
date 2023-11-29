import React, { useMemo } from "react";
import Select from "visual/component/Controls/Select";
import SelectItem from "visual/component/Controls/Select/SelectItem";
import { Field } from "visual/component/Prompts/common/PromptPage/Field";
import { Layout } from "visual/component/Prompts/common/PromptPage/types";
import { t } from "visual/utils/i18n";

interface Props {
  value: string;
  layouts: Layout[];
  onChange: (s: string) => void;
}

export const HeaderFooterField: React.FC<Props> = ({
  value,
  onChange,
  layouts
}) => {
  const options = useMemo(() => {
    return layouts.map(({ id, title }) => (
      <SelectItem key={id} value={id}>
        {title}
      </SelectItem>
    ));
  }, [layouts]);

  return (
    <Field label={t("Header & Footer")} required={true}>
      <Select
        className="brz-control__select--white"
        maxItems="6"
        itemHeight="30"
        inPortal={true}
        defaultValue={value}
        onChange={onChange}
      >
        {options}
      </Select>
    </Field>
  );
};
