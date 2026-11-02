import React, { type ReactElement } from "react";
import Options from "visual/component/Options";
import type { ContentProps } from "./types";

export const Content = ({ options }: ContentProps): ReactElement => (
  <div className="brz-d-xs-flex brz-flex-xs-wrap">
    <Options
      className="brz-ed-popover__options"
      optionClassName="brz-ed-popover__option"
      data={options}
    />
  </div>
);
