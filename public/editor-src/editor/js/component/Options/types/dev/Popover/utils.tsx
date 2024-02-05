import React from "react";
import { ReactElement } from "react";
import { Icon as IconProp } from "visual/component/Options/types/dev/Popover/types";
import { Html } from "./triggers/Html";
import { Icon } from "./triggers/Icon";

export const getTrigger = (t: IconProp): ReactElement => {
  switch (typeof t) {
    case "object":
      return <Html {...t} />;
    case "string":
      return <Icon icon={t} />;
  }
};
