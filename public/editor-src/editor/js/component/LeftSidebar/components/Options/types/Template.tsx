import classnames from "classnames";
import React, { ReactElement } from "react";
import Select from "visual/component/Controls/Select";
import SelectItem from "visual/component/Controls/Select/SelectItem";
import { TemplateProps } from "visual/component/LeftSidebar/components/Options/utils";

export interface Props extends TemplateProps {
  label?: string;
  className?: string;
}

export default class Template extends React.Component<Props> {
  handleTemplateChange = (template: string): void => {
    const { isWP, changeTemplateUrl } = this.props;
    const win = window.parent || window;

    if (isWP) {
      win.location.href = `${changeTemplateUrl}&template=${template}`;
    }
  };

  renderOptions(
    isWP: boolean,
    templates: { id: string; title: string }[]
  ): JSX.Element[] {
    if (isWP) {
      return templates.map((template, index) => (
        <SelectItem key={index} value={template.id}>
          {template.title}
        </SelectItem>
      ));
    }

    return [];
  }

  render(): ReactElement {
    const {
      label,
      className: _className,
      currentTemplate,
      isWP,
      templates
    } = this.props;

    const className = classnames(
      "brz-ed-sidebar-bottom__option brz-ed-sidebar__wp-template",
      _className
    );

    return (
      <div className={className}>
        {label && <div className="brz-ed-option__label">{label}</div>}
        <Select
          defaultValue={currentTemplate}
          className="brz-control__select--dark"
          maxItems="6"
          itemHeight="30"
          onChange={this.handleTemplateChange}
        >
          {this.renderOptions(isWP, templates)}
        </Select>
      </div>
    );
  }
}
