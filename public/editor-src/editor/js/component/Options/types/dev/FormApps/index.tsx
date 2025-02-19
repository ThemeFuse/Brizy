import classNames from "classnames";
import React, { MouseEvent, ReactElement } from "react";
import { Button as Control } from "visual/component/Controls/Button";
import { ToastNotification } from "visual/component/Notifications";
import Prompts, { PromptsProps } from "visual/component/Prompts";
import { t } from "visual/utils/i18n";
import { Component } from "./types";

export const FormApps: Component = ({ className, config }): ReactElement => {
  const { id, fields, icon, tabs } = config || {};

  const handleClick = (event: MouseEvent<HTMLDivElement>): void => {
    event.preventDefault();

    if (!(id && fields)) {
      return ToastNotification.error(t("Something went wrong"));
    }

    const data: PromptsProps = {
      prompt: "form",
      mode: "single",
      props: {
        formId: id,
        formFields: fields,
        tabs
      }
    };

    Prompts.open(data);
  };

  const _className = classNames("brz-ed-tooltip__content", className);

  return (
    <Control
      className={_className}
      icon={icon ?? "nc-cog"}
      reverseTheme={true}
      onClick={handleClick}
    />
  );
};
