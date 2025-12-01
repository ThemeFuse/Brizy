import cn from "classnames";
import React from "react";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("brz-skeleton", className)} {...props} />;
}

export { Skeleton };
