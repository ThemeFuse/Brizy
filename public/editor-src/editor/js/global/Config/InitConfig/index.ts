import { Component } from "react";
import OldConfig from "visual/global/Config";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { ReduxState } from "visual/redux/types";
import { MValue } from "visual/utils/value";
import { editorConfigs } from "./editorConfigs";
import { Props } from "./types";

class Config extends Component<Props> {
  id: MValue<string>;

  constructor(props: Props) {
    super(props);

    const { id, config } = props;

    // TODO: Initialize config here.
    //  Once all configurations are moved to the new format, this can be removed.
    // @ts-expect-error: Remove when it's done
    OldConfig.init(config);

    this.set(id, config);
  }

  static get(id: string): MValue<ConfigCommon> {
    return editorConfigs.get(id);
  }

  componentDidMount() {
    const { id, config } = this.props;
    if (typeof config.onLoad === "function") {
      config.onLoad();
    }

    this.set(id, config);
  }

  componentDidUpdate(prevProps: Readonly<Props>) {
    const { id: prevId } = prevProps;
    const { id, config } = this.props;

    if (prevId !== id) {
      if (this.id) {
        this.delete(this.id);
      }

      this.set(id, config);
    }
  }

  componentWillUnmount() {
    this.delete(this.props.id);
  }

  set(id: string, config: ConfigCommon): void {
    editorConfigs.set(id, config);
    this.id = id;
  }

  delete(id: string): void {
    editorConfigs.delete(id);
  }

  render() {
    return this.props.children;
  }
}

export const getConfigById = (
  configId: ReduxState["configId"]
): ConfigCommon => {
  const config = Config.get(configId);

  if (!config) {
    throw new Error(`Missing config ${configId}`);
  }

  return config;
};

export { Config };
