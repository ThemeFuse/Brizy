import { toSamePage } from "./utils";

describe("Testing 'toSamePage' constant", () => {
  test("Return 'true' if link goes to same page", () => {
    [
      {
        targetPath: "http://mysite.com/category/",
        location: {
          hash: "",
          href: "http://mysite.com/category/"
        }
      },
      {
        targetPath: "http://mysite.com/",
        location: {
          hash: "#myanchor",
          href: "http://mysite.com/#myanchor"
        }
      },
      {
        targetPath: "http://mysite.com/category/",
        location: {
          hash: "#myanchor",
          href: "http://mysite.com/category/#myanchor"
        }
      },
      {
        targetPath: "http://mysite.com/category/",
        location: {
          hash: "####myanchor",
          href: "http://mysite.com/category/####myanchor"
        }
      },
      {
        targetPath: "http://mysite.com/category/?1234ytr@",
        location: {
          hash: "#$%^a56y*&^%$#$%^&ikas/sdf",
          href: "http://mysite.com/category/?1234ytr@#$%^a56y*&^%$#$%^&ikas/sdf"
        }
      },
      {
        targetPath: "http://brizy.local/asdfgh/?var=123",
        location: {
          hash: "#myanchor",
          href: "http://brizy.local/asdfgh/?var=123#myanchor"
        }
      },
      {
        targetPath: "http://mysite.com/?asd=123",
        location: {
          hash: "#myanchor",
          href: "http://mysite.com/?asd=123/#myanchor"
        }
      }
    ].map(({ targetPath, location }) =>
      expect(toSamePage(targetPath, location as Location)).toBe(true)
    );
  });

  test("Return 'false' if link goes to another page", () => {
    [
      {
        targetPath: "http://mysite.com/",
        location: {
          hash: "",
          href: "http://mysite.com/category/"
        }
      },
      {
        targetPath: "https://mysite.com/category/",
        location: {
          hash: "",
          href: "http://mysite.com/category/"
        }
      },
      {
        targetPath: "http://mysite.com/category/",
        location: {
          hash: "",
          href: "https://mysite.com/category/"
        }
      },
      {
        targetPath: "http://mysite.com/category/",
        location: {
          hash: "#myanchor",
          href: "http://mysite.com/category/product/#myanchor"
        }
      },
      {
        targetPath: "http://mysite.com/category/product",
        location: {
          hash: "#myanchor",
          href: "http://mysite.com/category/#myanchor"
        }
      },
      {
        targetPath: "http://othersite.com/category/",
        location: {
          hash: "#myanchor",
          href: "http://mysite.com/category/product/#myanchor"
        }
      }
    ].map(({ targetPath, location }) =>
      expect(toSamePage(targetPath, location as Location)).toBe(false)
    );
  });
});
