export default function($node: JQuery): void {
  const node: Element = $node.get(0);

  const displayChange = (node: Element, display: string): void => {
    node.setAttribute("style", `display: ${display};`);
  };

  const findElem = (node: Element, selector: string): Element | undefined => {
    return node.querySelectorAll(selector)[0];
  };

  const logins: NodeListOf<Element> = node.querySelectorAll(".brz-login");

  logins.forEach((node): void => {
    const isLogged: boolean = node.getAttribute("data-islogged") === "true";

    const redirectNode = findElem(node, "input[name=redirect_to]");

    if (redirectNode) {
      const redirectType = redirectNode.getAttribute("data-redirect");

      if (redirectType === "samePage") {
        redirectNode.setAttribute("value", window.location.href);
      }
    }

    const authorisedNode = findElem(node, ".brz-login__autorized");
    const formNode = findElem(node, ".brz-form-login");

    if (isLogged) {
      authorisedNode && displayChange(authorisedNode, "block");
    } else {
      formNode && displayChange(formNode, "flex");
    }
  });
}
