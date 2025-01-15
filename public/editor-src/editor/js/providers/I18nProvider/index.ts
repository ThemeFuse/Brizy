import { Component, createElement, useContext } from "react";
import { I18n } from "visual/utils/i18n";
import { Dictionary } from "visual/utils/i18n/I18n";
import { I18nContext } from "./context";
import { Props } from "./types";

export class I18nextProvider extends Component<Props> {
  private i18n: Dictionary;

  constructor(props: Props) {
    super(props);
    const { i18n } = props;
    this.i18n = i18n ? i18n : I18n.init({ resources: {} });
  }

  componentDidUpdate(props: Props) {
    if (props.i18n && props.i18n !== this.props.i18n) {
      this.i18n = props.i18n;
      this.forceUpdate();
    }
  }

  render() {
    const props = {
      value: { I18n: this.i18n }
    };
    return createElement(I18nContext.Provider, props, this.props.children);
  }
}

export const useTranslation = () => {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error("Used hooks outside of I18nextProvider");
  }

  return {
    t: context.I18n.t
  };
};
