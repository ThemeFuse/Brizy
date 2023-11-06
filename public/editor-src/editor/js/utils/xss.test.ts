import { discardXSS, xss } from "./xss";

jest.mock("visual/global/Config", () => ({
  getAll: () => ({ user: { allowScripts: false } })
}));

describe("Testing XSS Protection", () => {
  test("xss function should sanitize HTML with discard escaping", () => {
    const html = `<script>alert("XSS Attack");</script>`;
    const sanitizedHtml = xss(html, "discard");

    expect(sanitizedHtml).toBe("");
  });

  test("xss function should allow specified tags and attributes", () => {
    const html = `<a href="#" onclick="alert(\`XSS Attack\`)">Click me</a>`;
    const sanitizedHtml = xss(html, "discard");

    expect(sanitizedHtml).toBe(`<a href="#">Click me</a>`);
  });

  test("discardXSS should use discard escaping when allowScripts is false", () => {
    const html = `<img src=x onerror=alert(origin)/>`;
    const sanitizedHtml = discardXSS(html);

    expect(sanitizedHtml).toBe(`<img src=\"x\" />`);
  });

  test("discardXSS should sanitize when allowScripts is true", () => {
    const spy = jest
      .spyOn(require("visual/global/Config"), "getAll")
      .mockReturnValue({
        user: { allowScripts: true }
      });

    const html = `<img src=x onerror=alert(origin)/>`;
    const sanitizedHtml = discardXSS(html);

    expect(spy).toHaveBeenCalled();
    expect(sanitizedHtml).toBe("<img src=x onerror=alert(origin)/>");
  });
});
