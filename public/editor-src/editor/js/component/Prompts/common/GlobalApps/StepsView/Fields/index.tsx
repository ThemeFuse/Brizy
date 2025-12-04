import { noop } from "es-toolkit";
import { match } from "fp-utilities";
import React, { ChangeEvent, Component, ReactElement, ReactNode } from "react";
import { Alert } from "visual/component/Alert";
import ReactSelect from "visual/component/Controls/ReactSelect";
import { SingleValue } from "visual/component/Controls/ReactSelect/types";
import Select from "visual/component/Controls/Select";
import SelectItem from "visual/component/Controls/Select/SelectItem";
import { Switch } from "visual/component/Controls/Switch";
import Tooltip from "visual/component/Controls/Tooltip";
import EditorIcon from "visual/component/EditorIcon";
import { Scrollbar } from "visual/component/Scrollbar";
import { t } from "visual/utils/i18n";
import { Button } from "../../../Button";
import {
  InputData,
  Props,
  SearchData,
  SelectData,
  SwitchData,
  isInput,
  isSearch,
  isSelect,
  isSwitch
} from "./types";

export class Fields extends Component<Props> {
  static defaultProps: Props = {
    formId: "",
    formFields: [],
    id: "",
    headTitle: "",
    headDescription: "",
    descriptions: "",
    data: [],
    nextLoading: null,
    prevLoading: null,
    onPrev: noop,
    onNext: noop,
    onActive: noop
  };

  renderHead(): ReactNode {
    const { headTitle, headDescription } = this.props;
    const needHead = headTitle && headDescription;

    if (!needHead) {
      return;
    }

    return (
      <div className="brz-ed-popup-integrations-step__head">
        {headTitle && (
          <p className="brz-p">
            <strong className="brz-strong">{headTitle}</strong>
          </p>
        )}
        {headDescription && (
          <p className="brz-p">
            <strong className="brz-strong">{headDescription}</strong>
          </p>
        )}
      </div>
    );
  }

  renderSelect = ({ name, value, choices }: SelectData): ReactElement => {
    const options = choices.map(({ title, name }, index) => (
      <SelectItem key={`${name}-${index}`} value={name}>
        {title}
      </SelectItem>
    ));

    return (
      <div className="brz-ed-popup-integrations-step__fields-select">
        <Select
          className="brz-control__select--white"
          maxItems="6"
          itemHeight="30"
          inPortal={true}
          defaultValue={value}
          onChange={(v: string): void => {
            this.props.onActive(name, v);
          }}
        >
          {options}
        </Select>
      </div>
    );
  };

  renderInput = ({ name, value }: InputData): ReactElement => {
    return (
      <div className="brz-ed-popup-integrations-step__fields-input">
        <input
          className="brz-input"
          required
          type={name === "password" ? "password" : "text"}
          value={value ?? ""}
          onChange={(e: ChangeEvent<HTMLInputElement>): void => {
            this.props.onActive(name, e.target.value);
          }}
        />
      </div>
    );
  };

  renderSwitch = ({ name, value }: SwitchData): ReactElement => {
    return (
      <div className="brz-ed-popup-integrations-step__fields-input">
        <Switch
          className="brz-ed-control__switch--light"
          value={value ?? false}
          onChange={(checked: boolean): void => {
            this.props.onActive(name, checked);
          }}
        />
      </div>
    );
  };

  renderSearch = ({
    name,
    multiple,
    value,
    choices
  }: SearchData): ReactElement => {
    const nValue: string[] | string | undefined | null =
      Boolean(value) && multiple ? value?.split(",") : value;

    // because of this Select is using for one/multiple items at the same time, I need to check
    // if the value is an array of strings (in case of multiple items) or object (single item)
    const onChange = (value: string[] | SingleValue): void => {
      this.props.onActive(
        name,
        multiple && Array.isArray(value)
          ? value.join(",")
          : !Array.isArray(value) && typeof value === "object"
            ? value.value
            : ""
      );
    };

    return (
      <div className="brz-ed-popup-integrations-step__fields-select">
        <ReactSelect
          className="brz-control__select2--light"
          isMultiple={multiple}
          value={nValue}
          options={choices}
          onChange={onChange}
        />
      </div>
    );
  };

  renderOption = match(
    [isInput, this.renderInput],
    [isSelect, this.renderSelect],
    [isSearch, this.renderSearch],
    [isSwitch, this.renderSwitch]
  );

  getHelper(
    helper: string | ((fields: Props["formFields"]) => ReactElement)
  ): ReactNode {
    switch (typeof helper) {
      case "string": {
        return (
          <div
            className="brz-ed-popup-integrations-fields__info"
            dangerouslySetInnerHTML={{ __html: helper }}
          />
        );
      }
      case "function": {
        return helper(this.props.formFields);
      }
      default: {
        return helper;
      }
    }
  }

  renderOptions(): ReactElement {
    const options = this.props.data.map((option, index) => {
      const { title, required, helper } = option;

      return (
        <div
          key={index}
          className="brz-ed-popup-integrations-step__fields-option"
        >
          <div className="brz-d-xs-flex brz-align-items-xs-center">
            <p className="brz-p">
              {title}
              {required && (
                <strong className="brz-strong brz--required">*</strong>
              )}
            </p>
            {helper && (
              <Tooltip
                className="brz-ed-popup-integrations-fields__tooltip"
                openOnClick={false}
                inPortal={true}
                closeDelay={600}
                overlay={this.getHelper(helper)}
              >
                <EditorIcon icon="nc-alert-circle-que" />
              </Tooltip>
            )}
          </div>
          {this.renderOption(option)}
        </div>
      );
    });

    return (
      <Scrollbar theme="light" autoHeight={true} autoHeightMax="100%">
        {options}
      </Scrollbar>
    );
  }

  render(): ReactElement {
    const { descriptions, error, prevLoading, nextLoading, onPrev, onNext } =
      this.props;

    return (
      <div className="brz-ed-popup-integrations-step brz-ed-popup-integrations-step__fields">
        {this.renderHead()}
        <div className="brz-ed-popup-integrations-step__body">
          {error && <Alert message={error} type="error" />}
          {this.renderOptions()}
          {descriptions && (
            <p className="brz-p brz-ed-popup-integrations__description">
              {descriptions}
            </p>
          )}
          <div className="brz-ed-popup-integrations-step__buttons">
            {prevLoading !== null && (
              <Button
                size={3}
                leftIcon="nc-arrow-left"
                loading={prevLoading}
                onClick={onPrev}
              >
                {t("Back")}
              </Button>
            )}
            {nextLoading !== null && (
              <Button
                color="teal"
                rightIcon="nc-arrow-right"
                loading={nextLoading}
                onClick={onNext}
              >
                {t("Continue")}
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }
}
