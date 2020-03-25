import React from "react";
import T from "prop-types";
import classNames from "classnames";
import Select from "visual/component/Controls/Select";
import SelectItem from "visual/component/Controls/Select/SelectItem";
import EditorIcon from "visual/component/EditorIcon";

export const FontStyle = props => {
  const className = classNames("brz-ed-control__font-style", props.className);
  return (
    <div className={className}>
      <Select
        className="brz-control__select--dark"
        defaultValue={props.value}
        itemHeight={30}
        onChange={props.onChange}
      >
        {props.styles.map(({ id, title }) => {
          return (
            <SelectItem key={id} active={props.value === id} value={id}>
              {title}
            </SelectItem>
          );
        })}
      </Select>
      {props.openSettings && (
        <div
          className="brz-ed-control__font-style--settings"
          onClick={props.openSettings}
        >
          <EditorIcon icon="nc-cog" />
        </div>
      )}
    </div>
  );
};

FontStyle.propTypes = {
  className: T.string,
  styles: T.arrayOf(
    T.shape({
      id: T.string,
      title: T.string
    })
  ).isRequired,
  label: T.string,
  value: T.string.isRequired,
  onChange: T.func.isRequired,
  openSettings: T.func
};

FontStyle.defaultProps = {
  className: ""
};
