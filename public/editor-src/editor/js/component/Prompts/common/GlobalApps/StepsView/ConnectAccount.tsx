import React, { FC, ReactNode } from "react";
import Scrollbars from "react-custom-scrollbars";
import Radio from "visual/component/Controls/Radio";
import EditorIcon from "visual/component/EditorIcon";
import { Button } from "visual/component/Prompts/common/Button";
import { useTranslation } from "visual/providers/I18nProvider";
import { t } from "visual/utils/i18n";

interface Props {
  error: string | null;
  onConnect: VoidFunction;
  connectLoading: boolean;
  prevLoading: boolean;
  onPrev: VoidFunction;
  nextLoading: boolean;
  onNext: VoidFunction;
  hasAccounts: boolean;
  active: string;
  onActive: (value: string) => void;
  options: ReactNode;
}

const ConnectAccountError: FC<Pick<Props, "error" | "hasAccounts">> = ({
  error,
  hasAccounts
}) => {
  const { t } = useTranslation();

  return (
    <div className="brz-ed-alert brz-ed-alert-error">
      <span className="brz-span">
        {!hasAccounts &&
          t("Accounts are empty. Please connect a new account and try again.")}
        {error}
      </span>
    </div>
  );
};

export const ConnectAccount: FC<Props> = ({
  onConnect,
  connectLoading,
  prevLoading,
  onPrev,
  nextLoading,
  onNext,
  error,
  active,
  onActive,
  hasAccounts,
  options
}) => (
  <div className="brz-ed-popup-integrations-step brz-ed-popup-integrations-step__account">
    <div className="brz-ed-popup-integrations-step__head">
      <p className="brz-p">
        <strong className="brz-strong">{t("SELECT ACCOUNT")}</strong>
      </p>
    </div>
    <div className="brz-ed-popup-integrations-step__body">
      {(!hasAccounts || error) && (
        <ConnectAccountError error={error} hasAccounts={hasAccounts} />
      )}
      {hasAccounts && (
        <Scrollbars
          autoHeight={true}
          autoHeightMax="100%"
          style={{ height: "auto" }}
        >
          <Radio
            className="brz-ed-popup-integrations-option__radio"
            name="list"
            defaultValue={active}
            onChange={onActive}
          >
            {options}
          </Radio>
        </Scrollbars>
      )}
      <div
        className="brz-ed-popup-integrations-new__option"
        onClick={onConnect}
      >
        <EditorIcon
          icon={connectLoading ? "nc-circle-02" : "nc-add"}
          className={connectLoading ? "brz-ed-animated--spin" : ""}
        />
        {t("Connect a new account")}
      </div>
      <div className="brz-ed-popup-integrations-step__buttons">
        <Button
          size={3}
          leftIcon="nc-arrow-left"
          loading={prevLoading}
          onClick={onPrev}
        >
          {t("Back")}
        </Button>
        <Button
          color="teal"
          rightIcon="nc-arrow-right"
          loading={nextLoading}
          onClick={onNext}
        >
          {t("Continue")}
        </Button>
      </div>
    </div>
  </div>
);
