import React, { ComponentType, ReactElement } from "react";
import classNames from "classnames";
import { types } from "./types";
import { inDevelopment } from "visual/editorComponents/utils";
import { OptionWrapper } from "visual/component/OptionWrapper";
import { WithClassName } from "visual/utils/options/attributes";
import { OptionDefinition } from "visual/component/Options/Type";

export interface Props extends WithClassName {
  data: OptionDefinition;
  toolbar?: object;
  location?: string;
}

export interface LegacyProps extends WithClassName {
  toolbar: object | null;
  location?: string;
}

class Option extends React.Component<Props> {
  renderLegacy(Component: ComponentType<LegacyProps>): ReactElement {
    const {
      data = {
        className: ""
      },
      className,
      location = "",
      toolbar = null
    } = this.props;

    return (
      <Component
        {...data}
        className={classNames("brz-ed-option", data.className, className)}
        location={location}
        toolbar={toolbar}
      />
    );
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  renderNew(Component): ReactElement {
    const {
      data: {
        label,
        icon,
        display,
        helper,
        className: __className,
        type,
        ...optionProps
      },
      className: _className = ""
    } = this.props;

    const className = classNames(
      "brz-ed-option",
      `brz-ed-option-type__${type}`,
      _className,
      __className
    );

    return (
      <OptionWrapper
        className={className}
        label={label}
        icon={icon}
        helper={helper?.content}
        helperPlacement={helper?.position}
        display={display}
      >
        <Component toolbar={this.props.toolbar} {...optionProps} />
      </OptionWrapper>
    );
  }

  render(): ReactElement | null {
    const type = this.props.data.type;
    const Component = types[type];

    if (!Component) {
      if (process.env.NODE_ENV === "development") {
        // eslint-disable-next-line no-console
        console.error(`Option type "${type}" is not defined`);
      }

      return null;
    }

    return inDevelopment(this.props.data.type)
      ? this.renderNew(Component)
      : // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        this.renderLegacy(Component);
  }
}

export default Option;
