import React, { ReactElement, useMemo } from "react";
import Select from "visual/component/Controls/Select";
import SelectItem from "visual/component/Controls/Select/SelectItem";
import { Switch } from "visual/component/Controls/Switch";
import { Field } from "visual/component/Prompts/common/PromptPage/Field";
import { Layout } from "visual/component/Prompts/common/PromptPage/types";
import { t } from "visual/utils/i18n";
import { Content } from "../Content";

interface Props {
  headTitle: string;
  inlineFooter: boolean;
  footer: JSX.Element;
  value: string | undefined;
  error?: string;
  onChange: (s: string) => void;
  layouts: Layout[];
  isHomePage?: boolean;
  onSwitchChange?: (v: boolean) => void;
}

export const SettingsTab = ({
  headTitle,
  inlineFooter,
  footer,
  value,
  error,
  onChange,
  layouts,
  isHomePage,
  onSwitchChange
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
      {typeof isHomePage === "boolean" && typeof onSwitchChange === "function" && (
        <Field
          className="brz-ed-popup-integrations-step__fields-option-home-page"
          label={t("Set as Homepage")}
          required={false}
        >
          <Switch value={isHomePage} onChange={onSwitchChange} />
        </Field>
      )}
    </Content>
  );
};
