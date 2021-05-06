import React, { FC } from "react";
import * as Option from "visual/component/Options/Type";
import Options, { filterOptionsData } from "visual/component/Options";
import { Group as Control } from "visual/component/Controls/Group";
import { WithClassName } from "visual/utils/options/attributes";
import { OptionDefinition } from "visual/component/Options/Type";

export type Props = Option.Props<undefined> &
  WithClassName & {
    options: OptionDefinition[];
  };

export const Group: FC<Props> &
  Option.OptionType<undefined> &
  Option.SelfFilter<Props> = ({ className, options, toolbar }) => {
  return (
    <Control className={className}>
      <Options wrapOptions={false} data={options} toolbar={toolbar} />
    </Control>
  );
};

const getModel: Option.GetModel<undefined> = () => undefined;

const getElementModel: Option.GetElementModel<undefined> = () => ({});

Group.getModel = getModel;

Group.getElementModel = getElementModel;

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
Group.defaultValue = undefined;

Group.shouldOptionBeFiltered = ({ options }): boolean =>
  filterOptionsData(options ?? []).length === 0;
