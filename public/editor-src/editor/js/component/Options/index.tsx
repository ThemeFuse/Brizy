import classNames from "classnames";
import React from "react";
import type { Props as OptionProps } from "./Option";
import Option from "./Option";

interface OptionsProps
  extends Omit<OptionProps, "isPro" | "upgradeToPro" | "data"> {
  data: unknown;
  wrapOptions?: boolean;
  isPro?: boolean;
  upgradeToPro?: string;
  optionClassName?: string;
}

function Options(props: OptionsProps) {
  const {
    data = null,
    className,
    optionClassName,
    toolbar,
    location = "",
    wrapOptions = true,
    isPro = false,
    upgradeToPro = ""
  } = props;

  //@ts-expect-error need to add types to "data"
  const options = data.map((optionData, index) => (
    <Option
      key={optionData.id || index}
      className={classNames(optionClassName, optionData.parentClassName)}
      toolbar={toolbar}
      data={optionData}
      location={location}
      isPro={isPro}
      upgradeToPro={upgradeToPro}
    />
  ));

  return wrapOptions ? <div className={className}>{options}</div> : options;
}

export default Options;
