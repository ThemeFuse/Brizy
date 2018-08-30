import Editor from "visual/global/Editor";
import editorComponents, { NotFoundComponent } from "visual/editorComponents";
import shortcodeComponents from "visual/shortcodeComponents";
import templateBlocks from "visual-template/blocks";
import templateStyles from "visual-template/styles";

// components
for (const component of Object.values(editorComponents)) {
  Editor.registerComponent(component);
}
Editor.registerNotFoundComponent(NotFoundComponent);

// blocks
Editor.registerBlocks(templateBlocks);

// shortcode
Editor.registerShortcode(shortcodeComponents);

// styles
Editor.registerStyles(templateStyles);
