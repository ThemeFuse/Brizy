import React, { ReactElement, useMemo } from "react";
import { Content } from "../Content";
import { t } from "visual/utils/i18n";
import Select from "visual/component/Controls/Select";
import SelectItem from "visual/component/Controls/Select/SelectItem";
import { Layout } from "visual/component/Prompts/common/PromptPage/types";
import { Field } from "visual/component/Prompts/common/PromptPage/Field";

interface Props {
  headTitle: string;
  inlineFooter: boolean;
  footer: JSX.Element;
  value: string | undefined;
  error?: string;
  onChange: (s: string) => void;
  layouts: Layout[];
}

export const SettingsTab = ({
  headTitle,
  inlineFooter,
  footer,
  value,
  error,
  onChange,
  layouts
}: Props): ReactElement => {
  const options = useMemo(() => {
    return layouts.map(({ id, title }) => (
      <SelectItem key={id} value={id}>
        {title}
      </SelectItem>
    ));
  }, [layouts]);

  return (
    <Content
      head={headTitle}
      inlineFooter={inlineFooter}
      footer={footer}
      error={error}
    >
      <Field label={t("Page Layout")} required={true}>
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
    </Content>
  );
};
