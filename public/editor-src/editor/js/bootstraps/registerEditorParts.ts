import getEditorComponents, {
  NotFoundComponent
} from "visual/editorComponents";
import Config from "visual/global/Config";
import Editor from "visual/global/Editor";

const config = Config.getAll();

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
    Editor.registerThirdPartyElement(data, config);
  });
}
