import classnames from "classnames";
import React from "react";
import { ConnectedProps, connect } from "react-redux";
import { currentUserRole } from "visual/component/Roles";
import { isWp } from "visual/global/Config";
import { getConfigById } from "visual/global/Config/InitConfig";
import { setDeviceMode } from "visual/redux/actions2";
import { configIdSelector, deviceModeSelector } from "visual/redux/selectors";
import { ReduxState } from "visual/redux/types";
import { isWPPage } from "visual/types/utils";
import { Option as OptionData } from "../../options";
import Option from "./Option";

const fillerOption = (option: OptionData) => {
  if (!option) {
    return false;
  }

  const { disabled, roles } = option;

  if (disabled === true) {
    return false;
  }

  if (Array.isArray(roles) && !roles.includes(currentUserRole())) {
    return false;
  }

  return true;
};
const mapDevice = (store: ReduxState) => {
  const config = getConfigById(configIdSelector(store));
  const isWP = isWp(config);

  return {
    deviceMode: deviceModeSelector(store),
    configId: configIdSelector(store),
    templates: isWP ? config.wp.templates : [],
    isWP: isWP,
    changeTemplateUrl: config.urls?.changeTemplate,
    currentTemplate: isWPPage(store.page, config) ? store.page.template : "",
    featuredImage: isWP ? config.wp.featuredImage : {},
    page: isWP ? config.wp.page : {}
  };
};
const mapDispatch = { setDeviceMode };

const connector = connect(mapDevice, mapDispatch);

interface OwnProps {
  className?: string;
  optionClassName?: string;
  data: null | Array<OptionData>;
  meta?: Record<string, unknown>;
}

interface Props extends ConnectedProps<typeof connector>, OwnProps {}

class Options extends React.Component<Props> {
  static defaultProps: OwnProps = {
    className: "",
    data: null,
    meta: {}
  };

  render() {
    const {
      className: _className,
      optionClassName,
      data,
      meta,
      deviceMode,
      configId,
      setDeviceMode,
      templates,
      isWP,
      changeTemplateUrl,
      currentTemplate,
      featuredImage,
      page
    } = this.props;

    const globalConfig = getConfigById(configId);

    const className = classnames(
      "brz-ed-sidebar__control__options",
      _className
    );

    if (!data) {
      return;
    }

    const options = data
      .filter(fillerOption)
      .map((option, index) => (
        <Option
          key={index}
          className={optionClassName}
          data={option}
          meta={meta}
          deviceMode={deviceMode}
          setDeviceMode={setDeviceMode}
          globalConfig={globalConfig}
          templates={templates}
          isWP={isWP}
          changeTemplateUrl={changeTemplateUrl}
          currentTemplate={currentTemplate}
          featuredImage={featuredImage}
          page={page}
        />
      ));

    return <div className={className}>{options}</div>;
  }
}

export default connector(Options);
