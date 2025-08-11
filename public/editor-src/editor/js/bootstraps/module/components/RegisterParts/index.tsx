import { Component } from "react";
import getEditorComponents, {
  NotFoundComponent
} from "visual/editorComponents";
import { Container } from "visual/editorComponents/ThirdParty/Container";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import Editor from "visual/global/Editor";
import { addFilter } from "visual/utils/filters";
import { Props } from "./types";

class RegisterParts extends Component<Props> {
  constructor(props: Props) {
    super(props);
    this.register(props.config);

    addFilter("getEditorElements", this.getEditorElements);
  }

  getEditorElements = () => {
    return { Container };
  };

  register(config: ConfigCommon) {
    // components
    const editorComponents = getEditorComponents(config);
    for (const component of Object.values(editorComponents)) {
      // @ts-expect-error: Argument of type 'typeof EditorComponent'
      Editor.registerComponent(component);
    }

    // @ts-expect-error: Argument of type 'typeof EditorComponent'
    Editor.registerNotFoundComponent(NotFoundComponent);

    const thirdPartyComponents = config.thirdPartyComponents;

    if (thirdPartyComponents) {
      Object.values(thirdPartyComponents).forEach((data) => {
        Editor.registerThirdPartyElement(data);
      });
    }
  }

  render() {
    return this.props.children;
  }
}

export { RegisterParts };
