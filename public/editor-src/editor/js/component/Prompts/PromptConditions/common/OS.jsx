import React from "react";
import Select from "visual/component/Controls/Select";
import SelectItem from "visual/component/Controls/Select/SelectItem";

const OS = {
  android: "Android",
  bada: "Bada",
  blackberry: "BlackBerry OS",
  chromeOs: "Chrome OS",
  firefoxOs: "Firefox OS",
  ios: "IOS",
  linux: "Linux",
  mac: "Mac OS",
  windows: "Windows"
};

export default function OperatingSystem(props) {
  const { value: triggerValue = "", onChange = () => {} } = props;

  return (
    <React.Fragment>
      <Select
        className="brz-control__select--light"
        itemHeight={30}
        defaultValue={triggerValue.type}
        onChange={type => onChange({ ...triggerValue, type })}
      >
        <SelectItem key="is" value="is">
          is
        </SelectItem>
        <SelectItem key="is not" value="is not">
          is not
        </SelectItem>
      </Select>
      <Select
        className="brz-control__select--light"
        itemHeight={30}
        defaultValue={triggerValue.value}
        onChange={value => onChange({ ...triggerValue, value })}
      >
        {renderSelectChoices(OS)}
      </Select>
    </React.Fragment>
  );

  function renderSelectChoices(items) {
    return Object.entries(items).map(([key, value]) => (
      <SelectItem key={key} value={key}>
        {value}
      </SelectItem>
    ));
  }
}
