import classnames from "classnames";
import React, { ReactElement, ReactNode } from "react";
import EditorIcon from "visual/component/EditorIcon";
import Prompts from "visual/component/Prompts";
import { ThemeIcon } from "visual/component/ThemeIcon";
import { WithClassName } from "visual/types/attributes";

export interface Value {
  name: string;
  type: string;
  filename?: string;
}

export interface Props extends WithClassName {
  canDelete: boolean;
  value?: Value;
  onChange: (v?: Value) => void;
}

export class IconSetter extends React.Component<Props> {
  handleClick = (): void => {
    const { value, onChange } = this.props;

    Prompts.open({
      prompt: "icon",
      mode: "single",
      props: {
        onChange,
        name: value?.name,
        type: value?.type,
        filename: value?.filename
      }
    });
  };

  handleRemove = (): void => {
    this.props.onChange({
      name: "",
      type: "",
      filename: ""
    });
  };

  renderSelectIcon = (): ReactElement => {
    return (
      <div
        className="brz-ed-control__icon-setter__box w-[48px] h-[48px] border-mako border-dashed border-[1px] bg-gunmetal text-[16px] text-shuttle-grey flex justify-center items-center cursor-pointer transition-[all] duration-200 ease-linear delay-[0s] hover:border-shuttle-grey-2 hover:text-shuttle-grey-3"
        onClick={this.handleClick}
      >
        <EditorIcon icon="nc-add" />
      </div>
    );
  };

  renderRemoveIcon = (): ReactNode => {
    return this.props.canDelete ? (
      <div
        key="second"
        className="brz-ed-control__focal-point__delete"
        onClick={this.handleRemove}
      >
        <EditorIcon icon="nc-circle-remove" />
      </div>
    ) : null;
  };

  renderIcon = ({ name, type, filename }: Value): ReactNode => {
    return [
      <div
        key="first"
        className="brz-ed-control__icon-setter__box w-[48px] h-[48px] border-mako border-dashed border-[1px] bg-gunmetal text-[16px] text-shuttle-grey flex justify-center items-center cursor-pointer transition-all-1 duration-200 ease-linear delay-[0s] hover:border-shuttle-grey-2 hover:text-shuttle-grey-3"
        onClick={this.handleClick}
      >
        <div className="brz-ed-control__icon-setter--active text-white inline-block text-[0]">
          <ThemeIcon
            className="grid-16 stroke-2"
            name={name}
            type={type}
            filename={filename}
          />
        </div>
      </div>,
      this.renderRemoveIcon()
    ];
  };

  render(): ReactElement {
    const value = this.props.value;
    const className = classnames(
      "brz-ed-control__icon-setter relative",
      this.props.className
    );

    const iconExists = value?.name && value?.type;

    return (
      <div className={className}>
        {value && iconExists ? this.renderIcon(value) : this.renderSelectIcon()}
      </div>
    );
  }
}

export default IconSetter;
