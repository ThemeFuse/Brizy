import Editor from "visual/global/Editor";
import editorComponents, { NotFoundComponent } from "visual/editorComponents";
import shortcodeComponents from "visual/shortcodeComponents";

// components
for (const component of Object.values(editorComponents)) {
  Editor.registerComponent(component);
}
Editor.registerNotFoundComponent(NotFoundComponent);

// shortcode
Editor.registerShortcode(shortcodeComponents);
