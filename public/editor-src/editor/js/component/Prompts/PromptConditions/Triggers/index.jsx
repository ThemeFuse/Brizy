import React from "react";
import { setIn, removeAt } from "timm";
import EditorIcon from "visual/component/EditorIcon";
import ItemWrapper from "../common/ItemWrapper";
import Switch from "visual/component/Controls/Switch";
import ScrollPane from "visual/component/ScrollPane";
import Select from "visual/component/Controls/Select";
import SelectItem from "visual/component/Controls/Select/SelectItem";
import Buttons from "../Buttons";

import { connect } from "react-redux";
import { triggersSelector } from "visual/redux/selectors";
import { updateTriggers } from "visual/redux/actions";

import items from "./items";
import { IS_PRO } from "visual/utils/env";
import { t } from "visual/utils/i18n";

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
  }

  handleChange = () => {
    if (IS_PRO) {
      const { values, triggerOnce } = this.state;

      const triggerOnceObj = {
        id: "triggerOnce",
        active: true,
        value: triggerOnce
      };

      this.setState({ loading: true }, () => {
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

  handleTriggerOnceChange = triggerOnce => {
    if (IS_PRO) {
      this.setState({ triggerOnce });
    }
  };

  handleWrapperTriggerChange = (index, value) => {
    if (IS_PRO) {
      this.setState({
        values: setIn(this.state.values, [index], {
          ...this.state.values[index],
          ...value
        })
      });
    }
  };

  handleWrapperTriggerRemove = index => {
    if (IS_PRO) {
      this.setState({ values: removeAt(this.state.values, index) });
    }
  };

  handleTriggerChange(oldTriggerIndex, newName) {
    const { values } = this.state;

    const { defaultValue } = items.find(({ id }) => id === newName);

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
    if (IS_PRO) {
      this.setState({
        values: setIn(this.state.values, [index, "value"], value)
      });
    }
  };

  handleAdd = () => {
    if (IS_PRO) {
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

    return items
      .filter(({ id, duplicatesAmount = 1 }) => {
        const isAlreadyInValues = values.find(trigger => trigger.id === id);
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
            trigger => trigger.id === prevId
          );
          const isNextAlreadyInValues = values.find(
            trigger => trigger.id === nextId
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
        <SelectItem key={index} value={id}>
          {title}
        </SelectItem>
      )
    );

    return (
      <Select
        className="brz-control__select--light"
        itemHeight={30}
        defaultValue={currentId}
        onChange={newValue => this.handleTriggerChange(index, newValue)}
      >
        {triggersList}
      </Select>
    );
  }

  render() {
    const { values, triggerOnce } = this.state;

    const content = values.map((trigger, index) => {
      const { Component, ...item } =
        items.find(({ id }) => id === trigger.id) || {};

      const content = Component ? (
        <Component
          {...item}
          {...trigger}
          onChange={value => this.handleValueChange(index, value)}
        />
      ) : null;

      return (
        <ItemWrapper
          showTypeButton={false}
          key={index}
          active={trigger.active}
          onChange={value => this.handleWrapperTriggerChange(index, value)}
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
          <Switch
            defaultValue={triggerOnce}
            onChange={this.handleTriggerOnceChange}
          />
        </div>
        <ScrollPane
          style={{
            overflow: "hidden",
            height: "350px"
          }}
          className="brz-ed-scroll--medium brz-ed-scroll--new-dark"
        >
          {content}
          <div
            className="brz-ed-popup-conditions__add-condition"
            onClick={this.handleAdd}
          >
            <EditorIcon icon="nc-add" /> {t("Add new trigger condition")}
          </div>
        </ScrollPane>
        <Buttons
          loading={this.state.loading}
          onChange={this.handleChange}
          onClose={this.props.onClose}
        />
      </>
    );
  }
}

const stateToProps = state => ({ values: triggersSelector(state) });

const mapDispatchToProps = dispatch => ({
  dispatch
});

export default connect(stateToProps, mapDispatchToProps)(Triggers);
