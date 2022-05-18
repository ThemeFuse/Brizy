import React, { ComponentType, ReactElement } from "react";
import classNames from "classnames";
import { types } from "./types";
import { inDevelopment } from "visual/editorComponents/EditorComponent/utils";
import { OptionWrapper } from "visual/component/OptionWrapper";
import { WithClassName } from "visual/utils/options/attributes";
import { OptionLabel } from "visual/component/OptionLabel";
import { ToolbarItemsInstance } from "visual/component/Toolbar/ToolbarItems";
import { OptionDefinition } from "visual/editorComponents/ToolbarItemType";

export interface Props extends WithClassName {
  data: OptionDefinition;
  toolbar?: ToolbarItemsInstance;
  location?: string;
}

export interface LegacyProps extends WithClassName {
  toolbar: ToolbarItemsInstance | null;
  location?: string;
}

type ComponentOptionProps = Omit<Props["data"], "label"> & {
  toolbar?: ToolbarItemsInstance;
  label: ReactElement;
};

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

  renderNew(
    Component: ComponentType<Partial<ComponentOptionProps>>
  ): ReactElement {
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

    const Label = (
      <OptionLabel
        label={label}
        icon={icon}
        helper={helper?.content}
        helperPlacement={helper?.position}
      />
    );

    return (
      <OptionWrapper className={className} display={display}>
        <Component
          toolbar={this.props.toolbar}
          {...optionProps}
          label={Label}
        />
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
      ? // @ts-expect-error: need migrate all option to new option type
        this.renderNew(Component)
      : // @ts-expect-error: need migrate all option to new option type
        this.renderLegacy(Component);
  }
}

export default Option;
