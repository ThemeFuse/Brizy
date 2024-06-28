import React from "react";

interface Props {
  className?: string;
  href: string;
  children: string;
}

export const Link = ({ className, href, children }: Props): JSX.Element => (
  <a className={className} href={href} target="_blank" rel="noreferrer">
    {children}
  </a>
);
