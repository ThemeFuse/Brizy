import classnames from "classnames";
import React, {
  Fragment,
  MouseEventHandler,
  ReactElement,
  ReactNode,
  useMemo
} from "react";
import Tooltip, { TooltipItem } from "visual/component/Controls/Tooltip";
import { EditorIcon } from "visual/component/EditorIcon";
import { Roles, currentUserRole } from "visual/component/Roles";
import { useConfig } from "visual/providers/ConfigProvider";
import { ReduxState } from "visual/redux/types";
import { Label } from "./Label";

type status = ReduxState["page"]["status"];

interface Item {
  disabled?: boolean;
  title: string;
  icon?: string;
  roles?: string[];
  loading?: boolean;
  attr?: Record<string, string>;
  onClick?: VoidFunction;
}

export interface Props {
  loading: boolean;
  children: ReactNode;
  addonAfter?: Item[];
  disabled?: boolean;
  status: status;
  onClick?: MouseEventHandler<HTMLDivElement>;
  attr?: Record<string, string>;
}

const Addons = ({ items }: { items: Item[] }): ReactElement => {
  const config = useConfig();
  const currentRole = currentUserRole(config);

  const overlay = useMemo(() => {
    return items.map((item, index) => {
      const {
        title,
        icon,
        roles = [],
        loading,
        onClick,
        attr,
        disabled
      } = item;

      const content = (
        <TooltipItem
          className="brz-ed-fixed-bottom-panel-popover__item"
          disabled={disabled}
          attr={attr}
          onClick={onClick}
        >
          {loading ? (
            <EditorIcon icon="nc-circle-02" className="brz-ed-animated--spin" />
          ) : icon !== undefined ? (
            <EditorIcon icon={icon} />
          ) : null}
          <span className="brz-span" title={title}>
            {title}
          </span>
        </TooltipItem>
      );

      return roles.length > 0 ? (
        <Roles key={index} currentRole={currentRole} allow={roles}>
          {content}
        </Roles>
      ) : (
        <Fragment key={index}>{content}</Fragment>
      );
    });
  }, [items, currentRole]);

  return (
    <Tooltip
      overlayClassName="brz-ed-tooltip__overlay-publish-button"
      placement="top-end"
      offset={20}
      overlay={overlay}
      inPortal={true}
    >
      <button className="brz-button">
        <EditorIcon icon="nc-arrow-up" />
      </button>
    </Tooltip>
  );
};

export const Controls = (props: Props): JSX.Element => {
  const { loading, children, addonAfter, disabled, status, onClick, attr } =
    props;
  const className = classnames("brz-ed-fixed-bottom-panel__btn", {
    "brz-ed-fixed-bottom-panel__btn-popover": addonAfter?.length,
    "brz-ed-fixed-bottom-panel__btn-disabled": disabled
  });
  const loadingClassName = classnames("brz-ed-animated--spin", {
    "brz-d-none": !loading
  });
  const labelClassName = classnames("brz-span", {
    "brz-invisible": loading
  });

  return (
    <div className={className} {...attr}>
      <div
        className="brz-ed-fixed-bottom-panel__btn-loading brz-d-xs-flex brz-align-items-xs-center brz-text-lg-center"
        onClick={onClick}
      >
        <EditorIcon icon="nc-circle-02" className={loadingClassName} />
        <Label status={status}>
          <span className={labelClassName}>{children}</span>
        </Label>
      </div>
      {!!addonAfter?.length && addonAfter.length > 0 && (
        <Addons items={addonAfter} />
      )}
    </div>
  );
};
