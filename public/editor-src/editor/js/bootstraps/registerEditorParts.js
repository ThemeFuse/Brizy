import Editor from "visual/global/Editor";
import editorComponents, { NotFoundComponent } from "visual/editorComponents";
import shortcodeComponents from "visual/shortcodeComponents";
import templateBlocks from "visual-template/blocks";

for (const component of Object.values(editorComponents)) {
  Editor.registerComponent(component);
}
Editor.registerNotFoundComponent(NotFoundComponent);

Editor.registerBlocks(templateBlocks);
Editor.registerShortcode(shortcodeComponents);
