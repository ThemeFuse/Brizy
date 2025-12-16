import { makeAttr } from "visual/utils/i18n/attribute";

export const attachMailtoLinkHandler = (element: HTMLElement) => {
  const attributeName = makeAttr("email");
  element
    .querySelectorAll<HTMLAnchorElement>(`a[${attributeName}]`)
    .forEach((emailLinkElement) => {
      const encodedEmail = emailLinkElement.getAttribute(attributeName) ?? "";

      const decodedEmail = atob(encodedEmail);

      const handleClick = (event: MouseEvent) => {
        event.preventDefault();
        window.location.href = `mailto:${decodedEmail}`;
      };

      emailLinkElement.addEventListener("click", handleClick);
      emailLinkElement.removeAttribute(attributeName);
    });
};
