import React from "react";
import produce from "immer";
import _ from "underscore";
import { objectTraverse, objectFromEntries } from "visual/utils/object";
import { getDynamicContent } from "visual/utils/api/editor";

export const withPopulation = Component => {
  if (TARGET !== "WP") {
    return Component;
  }

  const mappedKeys = getPopulationKeysFromDefaultValue(Component.defaultValue);
  const dcKeys = Object.keys(mappedKeys);

  class WithPopulation extends React.Component {
    static displayName = `withPopulation(${Component.displayName ||
      Component.name})`;

    dcMap = {};

    restorationMap = {};

    abortController = null;

    componentDidMount() {
      const { dbValue } = this.props;
      let updateDCMap = false;

      for (const key of dcKeys) {
        if (dbValue[key]) {
          updateDCMap = true;
        }
      }

      if (updateDCMap) {
        this.updateDCMap(dbValue).then(() => {
          this.forceUpdate();
        });
      }
    }

    componentDidUpdate(prevProps) {
      const { dbValue } = this.props;
      const { dbValue: prevDBValue } = prevProps;
      let updateDCMap = false;

      for (const key of dcKeys) {
        if (dbValue[key] !== prevDBValue[key]) {
          updateDCMap = true;
        }
      }

      if (updateDCMap) {
        this.updateDCMap(dbValue).then(() => {
          this.forceUpdate();
        });
      }
    }

    updateDCMap(v) {
      const placeholders = _.pick(v, Object.keys(mappedKeys));
      const { keys, values } = Object.entries(placeholders).reduce(
        (acc, [key, value]) => {
          acc.keys.push(key);
          acc.values.push(value);

          return acc;
        },
        { keys: [], values: [] }
      );

      if (this.abortController) {
        this.abortController.abort();
      }
      this.abortController = new AbortController();
      const signal = this.abortController.signal;

      return getDynamicContent({
        placeholders: values,
        signal
      })
        .then(r => {
          this.dcMap = objectFromEntries(_.zip(keys, r));
        })
        .catch(e => {
          if (
            process.env.NODE_ENV === "development" &&
            e.name !== "AbortError"
          ) {
            console.error(e);
          }
        })
        .finally(() => {
          this.abortController = null;
        });
    }

    handleComponentChange = newDBValue => {
      if (Object.keys(this.restorationMap).length > 0) {
        const restored = produce(newDBValue, draft => {
          for (const [key, value] of Object.entries(this.restorationMap)) {
            if (value === undefined) {
              delete draft[key];
            } else {
              draft[key] = value;
            }
          }
        });

        this.restorationMap = {};

        this.props.onChange(restored);
      } else {
        this.props.onChange(newDBValue);
      }
    };

    renderForEdit() {
      const dbValue = produce(this.props.dbValue, draft => {
        for (const key of dcKeys) {
          if (draft[key]) {
            this.restorationMap[mappedKeys[key]] = draft[mappedKeys[key]];

            draft[mappedKeys[key]] = this.dcMap[key] ?? draft[key];
          }
        }
      });

      return (
        <Component
          {...this.props}
          dbValue={dbValue}
          onChange={this.handleComponentChange}
        />
      );
    }

    renderForView() {
      if (!this.state.canRender) {
        const dbValue = produce(this.props.dbValue, draft => {
          for (const [dcKey, mapKey] of Object.entries(mappedKeys)) {
            if (draft[dcKey]) {
              draft[mapKey] = draft[dcKey];
            }
          }
        });

        return (
          <Component
            {...this.props}
            dbValue={dbValue}
            onChange={this.handleComponentChange}
          />
        );
      } else {
        return <Component {...this.props} />;
      }
    }

    render() {
      return IS_EDITOR ? this.renderForEdit() : this.renderForView();
    }
  }

  // TODO: see if this is sufficient or needs something like hoist-non-react-statics
  Object.assign(WithPopulation, {
    componentId: Component.componentId,
    defaultValue: Component.defaultValue
  });

  return WithPopulation;
};

const legacyPopulationKeys = {};

function getPopulationKeysFromDefaultValue(defaultValue) {
  const ret = {};

  objectTraverse(defaultValue, key => {
    if (isPopulationKey(key)) {
      const targetKey = populationKeyToTargetKey(key);

      if (targetKey) {
        ret[key] = targetKey;
      }
    }
  });

  return ret;
}

function isPopulationKey(key) {
  return key.endsWith("Population") || legacyPopulationKeys[key];
}

function populationKeyToTargetKey(populationKey) {
  if (populationKey.endsWith("Population")) {
    return populationKey.replace("Population", "");
  } else if (legacyPopulationKeys[populationKey]) {
    return legacyPopulationKeys[populationKey];
  }
}
