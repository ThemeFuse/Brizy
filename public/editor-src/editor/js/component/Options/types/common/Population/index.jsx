import React from "react";
import Input from "./Input";
import Select from "./Select";

export default function Population({
  choices,
  value = "",
  renderUnset,
  onChange
}) {
  let input;

  if (value) {
    const activeItem = choices.find(item => item.value === value) || {};
    input = <Input value={activeItem.title} onChange={onChange} />;
  } else {
    input = renderUnset();
  }

  return (
    <React.Fragment>
      {input}
      <Select choices={choices} value={value} onChange={onChange} />
    </React.Fragment>
  );
}
