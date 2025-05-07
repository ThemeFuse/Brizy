import classnames from "classnames";
import React, { ReactElement, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "visual/component/Controls/Select";
import SelectItem from "visual/component/Controls/Select/SelectItem";
import { useConfig } from "visual/providers/ConfigProvider";
import { updateUI } from "visual/redux/actions2";
import { currentRoleSelector } from "visual/redux/selectors";
import { t } from "visual/utils/i18n";
import { getMembershipRoles } from "visual/utils/membership";

export interface Props {
  label: string;
  className?: string;
}

export const Roles = (props: Props): ReactElement => {
  const currentRole = useSelector(currentRoleSelector) ?? "default";
  const dispatch = useDispatch();
  const config = useConfig();

  const { label, className: _className } = props;
  const className = classnames(
    "brz-ed-sidebar-bottom__option brz-ed-sidebar__wp-template",
    _className
  );

  const _membershipRoles = useMemo(() => getMembershipRoles(config), [config]);

  const renderOptions = useMemo(() => {
    const membershipRoles = [
      { role: "default", name: t("Default") },
      { role: "not_logged", name: t("Not logged") },
      { role: "logged", name: t("Logged") },
      ..._membershipRoles
    ];

    return membershipRoles.map((item, index) => (
      <SelectItem key={index} value={item.role}>
        {item.name}
      </SelectItem>
    ));
  }, [_membershipRoles]);

  const handleChangeRole = useCallback(
    (role: string) => {
      dispatch(updateUI("currentRole", role));
    },
    [dispatch]
  );

  return (
    <div className={className}>
      <div className="brz-ed-option__label">{label}</div>
      <Select
        defaultValue={currentRole}
        className="brz-control__select--dark"
        maxItems="6"
        itemHeight="30"
        onChange={handleChangeRole}
      >
        {renderOptions}
      </Select>
    </div>
  );
};
