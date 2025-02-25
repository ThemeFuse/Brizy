import { useContext } from "react";
import { EditorComponentContext } from "visual/editorComponents/EditorComponent/EditorComponentContext";
import { useTranslation } from "visual/providers/I18nProvider";

export function useEditorProvider() {
  const editorContext = useContext(EditorComponentContext);
  const { t } = useTranslation();

  if (!editorContext) {
    throw new Error(
      t("useEditorProvider must be used within useEditorProvider")
    );
  }

  return editorContext;
}
