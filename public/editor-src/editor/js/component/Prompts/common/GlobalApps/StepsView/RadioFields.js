import React, { Component } from "react";
import _ from "underscore";
import classnames from "classnames";
import Radio from "visual/component/Controls/Radio";
import RadioItem from "visual/component/Controls/Radio/RadioItem";
import Select from "visual/component/Controls/Select";
import SelectItem from "visual/component/Controls/Select/SelectItem";
import ScrollPane from "visual/component/ScrollPane";
import EditorIcon from "visual/component/EditorIcon";
import { t } from "visual/utils/i18n";
import Button from "../../Button";

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
    onActive: _.noop,
    onConfirm: _.noop,
    onCreateList: _.noop,
    onPrev: _.noop,
    onNext: _.noop
  };

  handleConfirmation = confirmation => {
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
    const {
      active,
      lists,
      listsCreate,
      hasConfirmation,
      onActive
    } = this.props;
    const hasListToCreate = listsCreate && listsCreate.length > 0;
    const className = classnames(
      "brz-ed-popup-integrations__scroll-pane",
      { "brz-ed-popup-integrations__scroll-pane--big": hasConfirmation },
      { "brz-ed-popup-integrations__scroll-pane--small": !hasListToCreate }
    );
    const options = lists.map(({ name, id }) => {
      return (
        <RadioItem value={id} key={id}>
          {name ? name : `List ${id}`}
        </RadioItem>
      );
    });

    return (
      <ScrollPane
        style={{ maxHeight: hasConfirmation ? 203 : 255 }}
        className={className}
      >
        <Radio
          className="brz-ed-popup-integrations-option__radio"
          name="list"
          defaultValue={active}
          onChange={onActive}
        >
          {options}
        </Radio>
      </ScrollPane>
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
        {error && this.renderError()}
        <div className="brz-ed-popup-integrations-step__head">
          <p className="brz-p">
            <strong className="brz-strong">{t("SELECT LIST")}</strong>
          </p>
        </div>
        <div className="brz-ed-popup-integrations-step__body">
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
