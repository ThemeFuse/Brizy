import React, { ReactElement } from "react";
import { connect, ConnectedProps } from "react-redux";
import classnames from "classnames";
import Config from "visual/global/Config";
import Select from "visual/component/Controls/Select";
import SelectItem from "visual/component/Controls/Select/SelectItem";
import { ReduxState } from "visual/redux/types";
import { isWPPage } from "visual/types";
import { isWp } from "visual/global/Config/types/configs/WP";

const getTemplate = (state: ReduxState): string => {
  if (isWPPage(state.page)) {
    return state.page.template;
  }

  return "";
};

export interface BaseProps {
  label?: string;
  className?: string;
}

const mapState = (state: ReduxState): { currentTemplate: string } => ({
  currentTemplate: getTemplate(state)
});

const connector = connect(mapState, null);

export type Props = ConnectedProps<typeof connector> & BaseProps;

class Template extends React.Component<Props> {
  handleTemplateChange = (template: string): void => {
    const win = window.parent || window;
    const config = Config.getAll();

    if (isWp(config)) {
      const changeTemplate = config.urls.changeTemplate ?? "";

      win.location.href = `${changeTemplate}&template=${template}`;
    }
  };

  renderOptions(): JSX.Element[] {
    const config = Config.getAll();

    if (isWp(config)) {
      const templates = config.wp.templates;

      return templates.map((template, index) => (
        <SelectItem key={index} value={template.id}>
          {template.title}
        </SelectItem>
      ));
    }

    return [];
  }

  render(): ReactElement {
    const { label, className: _className, currentTemplate } = this.props;
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
          {this.renderOptions()}
        </Select>
      </div>
    );
  }
}
export default connector(Template);
