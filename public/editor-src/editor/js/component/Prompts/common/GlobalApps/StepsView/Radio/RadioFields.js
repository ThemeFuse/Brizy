import { noop } from "es-toolkit";
import React, { Component } from "react";
import Scrollbars from "react-custom-scrollbars";
import Radio from "visual/component/Controls/Radio";
import RadioItem from "visual/component/Controls/Radio/RadioItem";
import Select from "visual/component/Controls/Select";
import SelectItem from "visual/component/Controls/Select/SelectItem";
import EditorIcon from "visual/component/EditorIcon";
import { Button } from "visual/component/Prompts/common/Button";
import { t } from "visual/utils/i18n";

class RadioFields extends Component {
  static defaultProps = {
    id: "",
    title: "",
    shortTitle: "",
    description: "",
    img: "",
    active: "",
    listPro: false,
    lists: [],
    listsCreate: [],
    apiKeyValue: {},
    hasConfirmation: false,
    createLoading: false,
    confirmationNeeded: false,
    nextLoading: null,
    prevLoading: null,
    error: null,
    onActive: noop,
    onConfirm: noop,
    onCreateList: noop,
    onPrev: noop,
    onNext: noop
  };

  handleConfirmation = (confirmation) => {
    this.props.onConfirm(confirmation === "true");
  };

  renderError() {
    return (
      <div className="brz-ed-alert brz-ed-alert-error">
        <span className="brz-span">{this.props.error}</span>
      </div>
    );
  }

  renderList() {
    const { active, lists, onActive } = this.props;
    const options = lists.map(({ name, id }) => {
      return (
        <RadioItem value={id} key={id}>
          {name ? name : `List ${id}`}
        </RadioItem>
      );
    });

    return (
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
    );
  }

  renderConfirmation() {
    const { confirmationNeeded } = this.props;

    return (
      <div className="brz-ed-popup-integrations__confirmation">
        <p className="brz-p">{t("Email confirmation to join the list")}</p>
        <Select
          defaultValue={confirmationNeeded ? "true" : "false"}
          className="brz-control__select--white"
          maxItems="6"
          itemHeight="30"
          onChange={this.handleConfirmation}
        >
          <SelectItem value="false">{t("Not Required")}</SelectItem>
          <SelectItem value="true">{t("Required")}</SelectItem>
        </Select>
      </div>
    );
  }

  renderCreateList() {
    const { createLoading, onCreateList } = this.props;

    return (
      <div
        className="brz-ed-popup-integrations-new__option"
        onClick={onCreateList}
      >
        <EditorIcon
          icon={createLoading ? "nc-circle-02" : "nc-add"}
          className={createLoading ? "brz-ed-animated--spin" : ""}
        />
        {t("Create a new list")}
      </div>
    );
  }

  renderProList() {
    // Render e fake List

    return (
      <Radio
        className="brz-ed-popup-integrations-option__radio"
        name="proList"
        defaultValue="none"
      >
        <RadioItem value="none">{t("None")}</RadioItem>
      </Radio>
    );
  }

  render() {
    const {
      listPro,
      lists,
      listsCreate,
      hasConfirmation,
      error,
      nextLoading,
      prevLoading,
      onPrev,
      onNext
    } = this.props;
    const hasLists = lists.length > 0;
    const hasListToCreate = listsCreate && listsCreate.length > 0;

    return (
      <div className="brz-ed-popup-integrations-step brz-ed-popup-integrations-step__lists">
        <div className="brz-ed-popup-integrations-step__head">
          <p className="brz-p">
            <strong className="brz-strong">{t("SELECT LIST")}</strong>
          </p>
        </div>
        <div className="brz-ed-popup-integrations-step__body">
          {error && this.renderError()}
          {hasLists && this.renderList()}
          {listPro && this.renderProList()}
          {hasListToCreate && this.renderCreateList()}
          {hasConfirmation && this.renderConfirmation()}

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
                size={hasLists || listPro ? 1 : 3}
                color={hasLists || listPro ? "teal" : "gray"}
                rightIcon="nc-arrow-right"
                loading={nextLoading}
                onClick={hasLists || listPro ? onNext : null}
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

export default RadioFields;
