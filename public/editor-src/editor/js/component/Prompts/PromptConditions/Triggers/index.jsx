import React from "react";
import { connect } from "react-redux";
import { removeAt, setIn } from "timm";
import Select from "visual/component/Controls/Select";
import SelectItem from "visual/component/Controls/Select/SelectItem";
import { Switch } from "visual/component/Controls/Switch";
import EditorIcon from "visual/component/EditorIcon";
import { Scrollbar } from "visual/component/Scrollbar";
import { updateTriggers } from "visual/redux/actions";
import { triggersSelector } from "visual/redux/selectors";
import { pendingRequest } from "visual/utils/api";
import { isPro } from "visual/utils/env";
import { t } from "visual/utils/i18n";
import Buttons from "../Buttons";
import ItemWrapper from "../common/ItemWrapper";
import getItems from "./items";

class Triggers extends React.Component {
  constructor(props) {
    super(props);

    const triggerOnce =
      props.values.find(({ id }) => id === "triggerOnce") || {};

    const values = removeAt(props.values, props.values.indexOf(triggerOnce));

    this.state = {
      triggerOnce: triggerOnce.value || false,
      values: values,
      loading: false
    };
    this.isPro = isPro(props.config);
  }

  handleChange = () => {
    if (this.isPro) {
      const { values, triggerOnce } = this.state;

      const triggerOnceObj = {
        id: "triggerOnce",
        active: true,
        value: triggerOnce
      };

      this.setState({ loading: true }, async () => {
        await pendingRequest(300);
        const meta = {
          syncSuccess: () =>
            this.setState({
              loading: false
            }),
          syncFail: () =>
            this.setState({
              loading: false
            })
        };

        this.props.dispatch(updateTriggers([...values, triggerOnceObj], meta));
      });
    }
  };

  handleTriggerOnceChange = (triggerOnce) => {
    if (this.isPro) {
      this.setState({ triggerOnce });
    }
  };

  handleWrapperTriggerChange = (index, value) => {
    if (this.isPro) {
      this.setState({
        values: setIn(this.state.values, [index], {
          ...this.state.values[index],
          ...value
        })
      });
    }
  };

  handleWrapperTriggerRemove = (index) => {
    if (this.isPro) {
      this.setState({ values: removeAt(this.state.values, index) });
    }
  };

  handleTriggerChange(oldTriggerIndex, newName) {
    const { values } = this.state;

    const { defaultValue } = getItems().find(({ id }) => id === newName);

    const newTriggers = setIn(values, [oldTriggerIndex], {
      ...values[oldTriggerIndex],
      id: newName,
      value: defaultValue
    });

    this.setState({
      values: newTriggers
    });
  }

  handleValueChange = (index, value) => {
    if (this.isPro) {
      this.setState({
        values: setIn(this.state.values, [index, "value"], value)
      });
    }
  };

  handleAdd = () => {
    if (this.isPro) {
      const { values } = this.state;
      const availableItems = this.getAvailableItems();

      if (availableItems[0]) {
        this.setState({
          values: [
            ...values,
            {
              id: availableItems[0].id,
              active: true,
              value: availableItems[0].defaultValue
            }
          ]
        });
      }
    }
  };

  getAvailableItems(currentId) {
    const { values } = this.state;
    let currentDuplicatesAmount = values.reduce((acc, { id }) => {
      if (!acc[id]) {
        acc[id] = 1;
      } else {
        acc[id]++;
      }

      return acc;
    }, {});

    return getItems()
      .filter(({ id, duplicatesAmount = 1 }) => {
        const isAlreadyInValues = values.find((trigger) => trigger.id === id);
        const currentDuplicatesAreLess =
          currentDuplicatesAmount[id] &&
          duplicatesAmount > currentDuplicatesAmount[id];

        return (
          currentId === id || currentDuplicatesAreLess || !isAlreadyInValues
        );
      })
      .sort(
        (
          { id: prevId, duplicatesAmount: prevDuplicatesAmount = 0 },
          { id: nextId, duplicatesAmount: nextDuplicatesAmount = 0 }
        ) => {
          const isPrevAlreadyInValues = values.find(
            (trigger) => trigger.id === prevId
          );
          const isNextAlreadyInValues = values.find(
            (trigger) => trigger.id === nextId
          );
          if (isPrevAlreadyInValues) {
            return 1;
          }
          if (isNextAlreadyInValues) {
            return -1;
          }

          if (prevDuplicatesAmount > nextDuplicatesAmount) {
            return 1;
          }
          if (prevDuplicatesAmount < nextDuplicatesAmount) {
            return -1;
          }

          return 0;
        }
      );
  }

  renderTriggers(index) {
    const { values } = this.state;
    const currentId = values[index].id;
    const triggersList = this.getAvailableItems(currentId).map(
      ({ id, title }, index) => (
        <SelectItem key={index} value={id} title={title}>
          {title}
        </SelectItem>
      )
    );

    return (
      <Select
        className="brz-control__select--light"
        itemHeight={30}
        defaultValue={currentId}
        onChange={(newValue) => this.handleTriggerChange(index, newValue)}
        inPortal={true}
      >
        {triggersList}
      </Select>
    );
  }

  render() {
    const { values, triggerOnce } = this.state;

    const content = values.map((trigger, index) => {
      const { Component, ...item } =
        getItems().find(({ id }) => id === trigger.id) || {};

      const content = Component ? (
        <Component
          {...item}
          {...trigger}
          availableRoles={this.props.config?.wp?.availableRoles}
          onChange={(value) => this.handleValueChange(index, value)}
        />
      ) : null;

      return (
        <ItemWrapper
          showTypeButton={false}
          key={index}
          active={trigger.active}
          onChange={(value) => this.handleWrapperTriggerChange(index, value)}
          onRemove={() => this.handleWrapperTriggerRemove(index)}
        >
          {this.renderTriggers(index)}
          {content}
        </ItemWrapper>
      );
    });

    return (
      <>
        <div className="brz-ed-popup-conditions__trigger-once">
          <div>{t("Trigger Popup Only Once")}</div>
          <Switch value={triggerOnce} onChange={this.handleTriggerOnceChange} />
        </div>
        <Scrollbar autoHeightMax="350px" theme="light">
          {content}
          <div
            className="brz-ed-popup-conditions__add-condition"
            onClick={this.handleAdd}
          >
            <EditorIcon icon="nc-add" /> {t("Add new trigger condition")}
          </div>
        </Scrollbar>
        <Buttons
          loading={this.state.loading}
          onChange={this.handleChange}
          onClose={this.props.onClose}
        />
      </>
    );
  }
}

const stateToProps = (state) => ({ values: triggersSelector(state) });

const mapDispatchToProps = (dispatch) => ({
  dispatch
});

export default connect(stateToProps, mapDispatchToProps)(Triggers);
