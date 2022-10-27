import classnames from "classnames";
import React, { ReactElement, ReactNode } from "react";
import EditorIcon from "visual/component/EditorIcon";
import Prompts from "visual/component/Prompts";
import { ThemeIcon } from "visual/component/ThemeIcon";
import { WithClassName } from "visual/utils/options/attributes";

export interface Value {
  name: string;
  type: string;
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
        type: value?.type
      }
    });
  };

  handleRemove = (): void => {
    this.props.onChange({
      name: "",
      type: ""
    });
  };

  renderSelectIcon = (): ReactElement => {
    return (
      <div
        className="brz-ed-control__icon-setter__box"
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

  renderIcon = ({ name, type }: Value): ReactNode => {
    return [
      <div
        key="first"
        className="brz-ed-control__icon-setter__box"
        onClick={this.handleClick}
      >
        <div className="brz-ed-control__icon-setter--active">
          <ThemeIcon className="grid-16 stroke-2" name={name} type={type} />
        </div>
      </div>,
      this.renderRemoveIcon()
    ];
  };

  render(): ReactElement {
    const value = this.props.value;
    const className = classnames(
      "brz-ed-control__icon-setter",
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
