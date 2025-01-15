import { buildQueries } from "@testing-library/react";

// The queryAllByAttribute is a shortcut for attribute-based matchers
// You can also use document.querySelector or a combination of existing
// testing library utilities to find matching nodes for your query

const queryAllByClassName = (
  container: HTMLElement,
  id: string
): HTMLElement[] => {
  return Array.from(container.querySelectorAll<HTMLElement>(`.${id}`));
};

const getMultipleError = (_: unknown, className: string) =>
  `Found multiple elements with the className attribute of: ${className}`;
const getMissingError = (_: unknown, className: string) =>
  `Unable to find an element with the className attribute of: ${className}`;

const [
  queryByClassName,
  getAllByClassName,
  getByClassName,
  findAllByClassName,
  findByClassName
] = buildQueries(queryAllByClassName, getMultipleError, getMissingError);

export {
  queryByClassName,
  queryAllByClassName,
  getByClassName,
  getAllByClassName,
  findAllByClassName,
  findByClassName
};
