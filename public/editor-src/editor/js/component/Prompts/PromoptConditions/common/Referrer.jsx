import React from "react";
import classnames from "classnames";
import Select from "visual/component/Controls/Select";
import SelectItem from "visual/component/Controls/Select/SelectItem";

export default function Referrer(props) {
  const { value: triggerValue = "", onChange = () => {} } = props;

  return (
    <React.Fragment>
      <Select
        className="brz-control__select--light"
        itemHeight={30}
        defaultValue={triggerValue.value}
        onChange={value => onChange({ ...triggerValue, value })}
      >
        <SelectItem key="show" value="show">
          Show
        </SelectItem>
        <SelectItem key="hide" value="hide">
          Hide
        </SelectItem>
        <SelectItem key="regex" value="regex">
          Regex
        </SelectItem>
        <SelectItem key="source" value="source">
          Source
        </SelectItem>
      </Select>
      {triggerValue.value === "source" ? (
        <Select
          className="brz-control__select--light"
          itemHeight={30}
          defaultValue={triggerValue.source}
          onChange={value => onChange({ ...triggerValue, source: value })}
        >
          <SelectItem key="search_engines" value="search_engines">
            Search Engines
          </SelectItem>
          <SelectItem key="external" value="external">
            External Links
          </SelectItem>
          <SelectItem key="internal" value="internal">
            Internal Links
          </SelectItem>
        </Select>
      ) : (
        <div className="brz-control__select">
          <input
            className="brz-input"
            type="text"
            placeholder="URL"
            value={triggerValue.url}
            onChange={({ target: { value } }) =>
              onChange({ ...triggerValue, url: value })
            }
          />
        </div>
      )}
    </React.Fragment>
  );
}
