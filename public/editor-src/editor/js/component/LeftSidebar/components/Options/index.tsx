import classnames from "classnames";
import React from "react";
import { ConnectedProps, connect } from "react-redux";
import { currentUserRole } from "visual/component/Roles";
import { isWp } from "visual/global/Config";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { useConfig } from "visual/providers/ConfigProvider";
import { setDeviceMode } from "visual/redux/actions2";
import { deviceModeSelector, pageSelector } from "visual/redux/selectors";
import { ReduxState } from "visual/redux/types";
import { isWPPage } from "visual/types/utils";
import { Option as OptionData } from "../../options";
import Option from "./Option";

const fillerOption = (option: OptionData, currentUserRole: string) => {
  if (!option) {
    return false;
  }

  const { disabled, roles } = option;

  if (disabled === true) {
    return false;
  }

  if (Array.isArray(roles) && !roles.includes(currentUserRole)) {
    return false;
  }

  return true;
};
const mapStateToProps = (store: ReduxState) => ({
  deviceMode: deviceModeSelector(store),
  page: pageSelector(store)
});

const mapDispatchToProps = { setDeviceMode };

const connector = connect(mapStateToProps, mapDispatchToProps);

interface OwnProps {
  className?: string;
  optionClassName?: string;
  data: null | Array<OptionData>;
  meta?: Record<string, unknown>;
  config: ConfigCommon;
}

interface Props extends ConnectedProps<typeof connector>, OwnProps {}

class _Options extends React.Component<Props> {
  static defaultProps: OwnProps = {
    className: "",
    data: null,
    meta: {},
    config: {} as ConfigCommon
  };

  render() {
    const {
      className: _className,
      optionClassName,
      data,
      meta,
      deviceMode,
      config,
      setDeviceMode,
      page: storePage
    } = this.props;

    if (!data) {
      return;
    }

    const className = classnames(
      "brz-ed-sidebar__control__options",
      _className
    );

    const isWP = isWp(config);

    const templates = isWP ? config.wp.templates : [];
    const changeTemplateUrl = config.urls?.changeTemplate;
    const featuredImage = isWP ? config.wp.featuredImage : {};
    const page = isWP ? config.wp.page : {};
    const currentTemplate = isWPPage(storePage, config)
      ? storePage.template
      : "";

    const options = data
      .filter((data) => fillerOption(data, currentUserRole(config)))
      .map((option, index) => (
        <Option
          key={index}
          className={optionClassName}
          data={option}
          meta={meta}
          deviceMode={deviceMode}
          setDeviceMode={setDeviceMode}
          globalConfig={config}
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

export const Options = (props: Omit<Props, "config">): JSX.Element => {
  const config = useConfig();

  return <_Options {...props} config={config} />;
};

export default connector(Options);
