import { DraggableAttributes } from "@dnd-kit/core";
import classNames from "classnames";
import React, { FC, memo } from "react";
import EditorIcon from "visual/component/EditorIcon";
import { useTranslation } from "visual/providers/I18nProvider";
import { useTreeContext } from "visual/providers/TreeProvider";

interface Props {
  attr: DraggableAttributes;
  onClose: VoidFunction;
  listeners?: Record<string, unknown>;
  isDragging: boolean;
}

const Header: FC<Props> = ({ attr, onClose, listeners, isDragging }) => {
  const { t } = useTranslation();
  const { allExpanded, toggleExpandAll } = useTreeContext();

  const headerClasses = classNames("brz-navigator-header", {
    "brz-navigator-header-dragging": isDragging
  });

  const collapsedIconClassName = classNames({
    "brz-navigator-header__collapsed": !allExpanded,
    "brz-navigator-header__expanded": allExpanded
  });

  return (
    <div className={headerClasses} {...attr}>
      <span title={allExpanded ? t("Collapse All") : t("Expand All")}>
        <EditorIcon
          icon="t2-collapse"
          onClick={toggleExpandAll}
          className={collapsedIconClassName}
        />
      </span>
      <span className="brz-navigator-header-title" {...listeners}>
        {t("Explorer")}
      </span>
      <EditorIcon icon="t2-close" onClick={onClose} />
    </div>
  );
};

export default memo(Header);
