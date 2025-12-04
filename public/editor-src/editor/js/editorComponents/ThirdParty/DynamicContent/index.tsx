import React, { ReactElement, memo, useMemo } from "react";
import { DynamicContentHelper } from "visual/editorComponents/WordPress/common/DynamicContentHelper";
import { useTranslation } from "visual/providers/I18nProvider";
import { makePlaceholder } from "visual/utils/dynamicContent";
import { DynamicContentProps as Props } from "../types";

const DynamicContentComponent = (props: Props): ReactElement => {
  const {
    placeholder: _placeholder,
    tagName = "div",
    placeholderIcon,
    placeholderHeight,
    className,
    blocked,
    onSuccess
  } = props;
  const dcProps = useMemo(() => ({ className }), [className]);
  const { t } = useTranslation();

  if (!_placeholder) {
    return React.createElement(
      tagName,
      dcProps,
      t("Missing placeholder props")
    );
  }

  const placeholder = makePlaceholder({ content: _placeholder });

  return (
    <DynamicContentHelper
      placeholderIcon={placeholderIcon}
      placeholder={placeholder}
      placeholderHeight={placeholderHeight}
      tagName={tagName}
      props={dcProps}
      blocked={blocked}
      onSuccess={onSuccess}
    />
  );
};

const DynamicContent = memo(DynamicContentComponent);
export { DynamicContent };
