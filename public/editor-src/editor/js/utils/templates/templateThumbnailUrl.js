import Editor from "visual/global/Editor";
import { assetUrl } from "visual/utils/asset";

const defaultTemplateThumbnailUrl = template =>
  assetUrl(`template/img-template-thumbs/${template.id}.jpg`);

export function templateThumbnailUrl(template) {
  const registeredUrlHandlers = Editor.getTemplateThumbnailUrlHandlers();

  if (registeredUrlHandlers.length === 0) {
    return defaultTemplateThumbnailUrl(template);
  }

  return registeredUrlHandlers.reduce(
    (acc, f) => template => f(template, acc),
    defaultTemplateThumbnailUrl
  )(template);
}
