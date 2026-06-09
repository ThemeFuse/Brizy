import { isFunction } from "es-toolkit";
import React, { ReactNode, forwardRef } from "react";
import { useConfig } from "../../providers/ConfigProvider";
import { currentUserRole } from "./utils";

interface RolesHOCOptions<P extends object> {
  component?: React.ComponentType<P>;
  fallbackComponent?: React.ComponentType<P>;
  allow?: string[];
  render?: (props: P) => React.ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fallbackRender?: (props: any) => ReactNode;
}

export const rolesHOC = <P extends object, R = unknown>({
  component: Component,
  fallbackComponent: FallbackComponent = undefined,
  allow = [],
  render = undefined,
  fallbackRender
}: RolesHOCOptions<P>) => {
  function RolesHOCFn(props: React.PropsWithoutRef<P>, ref: React.Ref<R>) {
    const config = useConfig();
    const currentRole = currentUserRole(config);

    const roleTestPassed = allow.includes(currentRole);

    if (roleTestPassed) {
      if (Component) {
        return <Component {...(props as P)} ref={ref} />;
      }

      if (render) {
        return render(props as P);
      }
    } else {
      if (FallbackComponent) {
        const { children } = props as React.PropsWithChildren<P>;

        return (
          <FallbackComponent {...(props as P)} ref={ref}>
            {isFunction(children) ? children(props, ref) : children}
          </FallbackComponent>
        );
      }

      if (fallbackRender) {
        return fallbackRender(props);
      }
    }

    return null;
  }

  RolesHOCFn.displayName = `RolesHOC(${Component?.displayName ?? Component?.name ?? "Component"})`;

  return forwardRef(RolesHOCFn);
};
