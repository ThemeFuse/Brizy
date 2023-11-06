import React from "react";

interface Props {
  className?: string;
  href: string;
  children: string;
}

export const Link: React.FC<Props> = ({ className, href, children }) => (
  <a className={className} href={href} target="_blank" rel="noreferrer">
    {children}
  </a>
);
