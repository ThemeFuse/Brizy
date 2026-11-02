// Submitting a published Form2: what goes out and what each kind of reply does to the form.

import { mount, query, queryInput } from "visual/libs/select2/__fixtures__/env";
import { useGroup1Env } from "visual/libs/select2/__fixtures__/suite";
import {
  settleTransport,
  stubTransport,
  type TransportReply
} from "../../../../../jest-utils/formTransport";
import {
  ACTION,
  checkboxField,
  form2,
  IDS,
  RECAPTCHA,
  radioField,
  textField,
  uploadField
} from "../__fixtures__/form";

useGroup1Env();

afterEach(() => {
  window.location.hash = "";
});

const json = (body: string): TransportReply => ({
  kind: "response",
  status: 200,
  contentType: "application/json",
  body
});

const SUCCESS = json(`{"success":true}`);

const NAME = textField({
  label: "Name",
  type: "Text",
  inputType: "text",
  required: false,
  attributes: ""
});

interface Page {
  root: HTMLElement;
  wrapper: HTMLElement;
  form: HTMLElement;
  button: HTMLElement;
  submit: VoidFunction;
  alert: () => string | undefined;
  alertText: () => string | undefined;
}

async function page(attributes: string, fields: string): Promise<Page> {
  const { default: init } = await import(
    "visual/editorComponents/Form2/export"
  );
  const root = mount(form2({ attributes, fields }));
  const form = query(root, "form");

  init(root);

  return {
    root,
    wrapper: query(root, ".brz-forms2"),
    form,
    button: query(root, ".brz-btn"),
    submit: () => {
      form.dispatchEvent(
        new Event("submit", { bubbles: true, cancelable: true })
      );
    },
    alert: () => form.querySelector(".brz-forms2__alert")?.className,
    alertText: () =>
      form.querySelector(".brz-forms2__alert")?.textContent ?? undefined
  };
}

describe("the request", () => {
  it("carries the fields, the ids and the page as form data", async () => {
    const transport = stubTransport(SUCCESS);
    const { root, submit } = await page(
      `${ACTION} ${IDS}`,
      NAME +
        radioField({
          label: "Plan",
          values: ["Basic", "Pro"],
          defaultValue: "Pro"
        }) +
        checkboxField({
          label: "Extras",
          values: ["Hosting", "Domain", "Mail"],
          defaultValue: "Hosting, Mail"
        }) +
        textField({
          label: "Source",
          type: "Hidden",
          inputType: "hidden",
          required: false,
          attributes: `data-brz-placeholder="from the placeholder"`
        })
    );

    queryInput(root, `input[name="Name"]`).value = "Ann Lee";
    submit();
    await settleTransport();
    transport.restore();

    expect(transport.requests).toEqual([
      {
        method: "POST",
        url: "/submit",
        headers: { accept: "*/*", "x-requested-with": "XMLHttpRequest" },
        body: {
          kind: "form",
          entries: [
            [
              "data",
              JSON.stringify([
                {
                  name: "Name",
                  value: "Ann Lee",
                  required: false,
                  type: "Text",
                  label: "Name"
                },
                {
                  name: "Plan",
                  required: false,
                  type: "radio",
                  label: "Plan",
                  value: "Pro"
                },
                {
                  name: "Extras",
                  required: false,
                  type: "checkbox",
                  label: "Extras",
                  value: "Hosting,Mail"
                },
                {
                  name: "Source",
                  value: "from the placeholder",
                  required: false,
                  type: "Hidden",
                  label: "Source"
                }
              ])
            ],
            ["project_id", "7"],
            ["form_id", "form-1"],
            ["page_url", window.location.href]
          ]
        }
      }
    ]);
  });

  it("leaves out the ids the form does not have", async () => {
    const transport = stubTransport(SUCCESS);
    const { submit } = await page(ACTION, NAME);

    submit();
    await settleTransport();
    transport.restore();

    const [request] = transport.requests;

    expect(
      request.body.kind === "form"
        ? request.body.entries.map(([name]) => name)
        : []
    ).toEqual(["data", "page_url"]);
  });

  it("carries the chosen files next to the data", async () => {
    const transport = stubTransport(SUCCESS);
    const { root, submit } = await page(
      ACTION,
      uploadField({
        label: "Resume",
        placeholder: "Add a file",
        accept: ".txt,.pdf",
        maxSize: "5"
      })
    );

    Object.defineProperty(queryInput(root, `input[type="file"]`), "files", {
      configurable: true,
      value: [new File(["hello"], "resume.txt", { type: "text/plain" })]
    });
    submit();
    await settleTransport();
    transport.restore();

    const [request] = transport.requests;
    const entries = request.body.kind === "form" ? request.body.entries : [];

    expect(entries.map(([name]) => name)).toEqual([
      "Resume[]",
      "data",
      "page_url"
    ]);
    expect(entries[0][1]).toBe("file:resume.txt");
    expect(JSON.parse(entries[1][1])).toEqual([
      {
        name: "Resume",
        value: "",
        required: false,
        type: "FileUpload",
        label: "Resume",
        maxSize: 5,
        extensions: ".txt,.pdf"
      }
    ]);
  });

  it.each([
    {
      case: "an action on another origin goes out without the ajax header",
      action: `action="https://other.test/submit"`,
      url: "https://other.test/submit",
      headers: { accept: "*/*" }
    },
    {
      case: "an action with a query and a hash goes out as written",
      action: `action="/submit?step=1#done"`,
      url: "/submit?step=1#done",
      headers: { accept: "*/*", "x-requested-with": "XMLHttpRequest" }
    },
    {
      case: "an empty action goes to the page itself",
      action: `action=""`,
      url: undefined,
      headers: { accept: "*/*", "x-requested-with": "XMLHttpRequest" }
    },
    {
      case: "a missing action goes to the page itself",
      action: "",
      url: undefined,
      headers: { accept: "*/*", "x-requested-with": "XMLHttpRequest" }
    }
  ])("$case", async ({ action, url, headers }) => {
    const transport = stubTransport(SUCCESS);
    const { submit } = await page(action, NAME);

    submit();
    await settleTransport();
    transport.restore();

    expect(transport.requests.map((request) => request.url)).toEqual([
      url ?? window.location.href
    ]);
    expect(transport.requests[0].headers).toEqual(headers);
  });
});

interface ReplyCase {
  case: string;
  reply: TransportReply;
  outcome: "success" | "error";
}

const replies: ReplyCase[] = [
  { case: "json that says success", reply: SUCCESS, outcome: "success" },
  {
    case: "json that says failure",
    reply: json(`{"success":false}`),
    outcome: "error"
  },
  { case: "json without a verdict", reply: json("{}"), outcome: "success" },
  { case: "json null", reply: json("null"), outcome: "success" },
  { case: "a json string", reply: json(`"ok"`), outcome: "success" },
  { case: "a json list", reply: json("[1]"), outcome: "success" },
  {
    case: "json with a charset in its content type",
    reply: {
      kind: "response",
      status: 200,
      contentType: "application/json; charset=utf-8",
      body: `{"success":false}`
    },
    outcome: "error"
  },
  {
    case: "a failure verdict served as html",
    reply: {
      kind: "response",
      status: 200,
      contentType: "text/html; charset=UTF-8",
      body: `{"success":false}`
    },
    outcome: "success"
  },
  {
    case: "a failure verdict served without a content type",
    reply: {
      kind: "response",
      status: 200,
      contentType: undefined,
      body: `{"success":false}`
    },
    outcome: "success"
  },
  { case: "json that does not parse", reply: json("<html>"), outcome: "error" },
  { case: "empty json", reply: json(""), outcome: "error" },
  {
    case: "no content",
    reply: {
      kind: "response",
      status: 204,
      contentType: "application/json",
      body: ""
    },
    outcome: "success"
  },
  {
    case: "created",
    reply: {
      kind: "response",
      status: 201,
      contentType: "application/json",
      body: `{"success":true}`
    },
    outcome: "success"
  },
  {
    case: "not modified",
    reply: {
      kind: "response",
      status: 304,
      contentType: "application/json",
      body: ""
    },
    outcome: "success"
  },
  {
    case: "plain text",
    reply: {
      kind: "response",
      status: 200,
      contentType: "text/plain",
      body: "sent"
    },
    outcome: "success"
  },
  {
    case: "xml",
    reply: {
      kind: "response",
      status: 200,
      contentType: "text/xml",
      body: "<ok/>"
    },
    outcome: "success"
  },
  {
    case: "xml that does not parse",
    reply: {
      kind: "response",
      status: 200,
      contentType: "text/xml",
      body: "<ok>"
    },
    outcome: "error"
  },
  {
    case: "a bad request",
    reply: {
      kind: "response",
      status: 400,
      contentType: "application/json",
      body: `{"success":true}`
    },
    outcome: "error"
  },
  {
    case: "a redirect status",
    reply: {
      kind: "response",
      status: 302,
      contentType: "application/json",
      body: `{"success":true}`
    },
    outcome: "error"
  },
  {
    case: "a server error",
    reply: {
      kind: "response",
      status: 500,
      contentType: "text/html",
      body: "boom"
    },
    outcome: "error"
  },
  {
    case: "a network error",
    reply: { kind: "networkError" },
    outcome: "error"
  }
];

describe("the reply", () => {
  it.each(replies)("$case ends in $outcome", async ({ reply, outcome }) => {
    const transport = stubTransport(reply);
    const { root, wrapper, button, submit, alert, alertText } = await page(
      ACTION,
      NAME
    );
    const name = queryInput(root, `input[name="Name"]`);

    name.value = "Ann";
    submit();
    await settleTransport();
    transport.restore();

    const expected =
      outcome === "success"
        ? {
            alert: "brz-forms2__alert brz-forms2__alert--success",
            text: "Your email was sent successfully",
            failed: false,
            value: ""
          }
        : {
            alert: "brz-forms2__alert brz-forms2__alert--error",
            text: "Your email was not sent",
            failed: true,
            value: "Ann"
          };

    expect({
      alert: alert(),
      text: alertText(),
      failed: wrapper.classList.contains("brz-forms2__send--fail"),
      value: name.value
    }).toEqual(expected);
    expect(query(root, ".brz-forms2__messages").children).toHaveLength(1);
    expect(button.classList.contains("brz-blocked")).toBe(false);
    expect(
      [...button.children].map((child) =>
        child.classList.contains("brz-invisible")
      )
    ).toEqual([false, true]);
  });

  it("shows the spinner and blocks the button until it arrives", async () => {
    const transport = stubTransport(SUCCESS);
    const { button, submit } = await page(ACTION, NAME);
    const state = (): unknown => [
      button.classList.contains("brz-blocked"),
      [...button.children].map((child) =>
        child.classList.contains("brz-invisible")
      )
    ];

    submit();

    expect(state()).toEqual([true, [true, false]]);

    await settleTransport();
    transport.restore();

    expect(state()).toEqual([false, [false, true]]);
  });

  it("is waited for before the form can be sent again", async () => {
    const transport = stubTransport(SUCCESS);
    const { submit } = await page(ACTION, NAME);

    submit();
    submit();

    expect(transport.requests).toHaveLength(1);

    await settleTransport();
    submit();
    await settleTransport();
    transport.restore();

    expect(transport.requests).toHaveLength(2);
  });

  it("clears the message of the previous attempt", async () => {
    const failing = stubTransport({ kind: "networkError" });
    const { wrapper, submit, alert } = await page(ACTION, NAME);

    submit();
    await settleTransport();
    failing.restore();

    expect(alert()).toBe("brz-forms2__alert brz-forms2__alert--error");

    const working = stubTransport(SUCCESS);

    submit();
    await settleTransport();
    working.restore();

    expect(alert()).toBe("brz-forms2__alert brz-forms2__alert--success");
    expect(wrapper.querySelectorAll(".brz-forms2__alert")).toHaveLength(1);
  });
});

describe("the messages", () => {
  it.each([
    {
      case: "the text of the form on success",
      attributes: `data-brz-success="Thanks!"`,
      reply: SUCCESS,
      text: "Thanks!"
    },
    {
      case: "the text of the form on failure",
      attributes: `data-brz-error="Try later"`,
      reply: json(`{"success":false}`),
      text: "Try later"
    },
    {
      case: "the translated default on success",
      attributes: `data-brz-success="" data-brz-translatable-default-success="Trimis"`,
      reply: SUCCESS,
      text: "Trimis"
    },
    {
      case: "the translated default on failure",
      attributes: `data-brz-translatable-default-error="Netrimis"`,
      reply: json(`{"success":false}`),
      text: "Netrimis"
    }
  ])("show $case", async ({ attributes, reply, text }) => {
    const transport = stubTransport(reply);
    const { submit, alertText } = await page(`${ACTION} ${attributes}`, NAME);

    submit();
    await settleTransport();
    transport.restore();

    expect(alertText()).toBe(text);
  });

  it("land in the form itself when it has no place for them", async () => {
    const transport = stubTransport(SUCCESS);
    const { root, form, submit } = await page(ACTION, NAME);

    query(root, ".brz-forms2__messages").remove();
    submit();
    await settleTransport();
    transport.restore();

    expect(form.lastElementChild?.className).toBe(
      "brz-forms2__alert brz-forms2__alert--success"
    );
  });
});

describe("after a success", () => {
  it("goes to the redirect of the form", async () => {
    const transport = stubTransport(SUCCESS);
    const { submit } = await page(
      `${ACTION} data-brz-redirect="#thanks"`,
      NAME
    );

    submit();
    await settleTransport();
    transport.restore();

    expect(window.location.hash).toBe("#thanks");
  });

  it("puts every field back to its empty state", async () => {
    const transport = stubTransport(SUCCESS);
    const { root, submit } = await page(
      ACTION,
      NAME +
        radioField({
          label: "Plan",
          values: ["Basic", "Pro"],
          defaultValue: "Pro"
        }) +
        checkboxField({
          label: "Extras",
          values: ["Hosting", "Domain"],
          defaultValue: "Domain"
        })
    );
    const checked = (): string[] =>
      [...root.querySelectorAll<HTMLInputElement>("input:checked")].map(
        (input) => `${input.name}:${input.value}`
      );

    queryInput(root, `input[name="Name"]`).value = "Ann";

    expect(checked()).toEqual(["Plan:Pro", "Extras:Domain"]);

    submit();
    await settleTransport();
    transport.restore();

    expect(queryInput(root, `input[name="Name"]`).value).toBe("");
    expect(checked()).toEqual(["Plan:Basic"]);
  });
});

describe("validation", () => {
  const REQUIRED = textField({
    label: "Name",
    type: "Text",
    inputType: "text",
    required: true,
    attributes: ""
  });
  const EMAIL = textField({
    label: "Email",
    type: "Email",
    inputType: "email",
    required: false,
    attributes: `pattern="${encodeURI("^[^@]+@[^@]+$")}"`
  });
  const errors = (item: Element): string[] =>
    [...item.classList].filter((name) => name.includes("--error")).sort();

  it("keeps an invalid form from being sent and says why", async () => {
    const transport = stubTransport(SUCCESS);
    const { root, submit, alert, alertText } = await page(
      `${ACTION} data-brz-empty="Fill it in"`,
      REQUIRED
    );

    submit();
    await settleTransport();

    expect(transport.requests).toHaveLength(0);
    expect(alert()).toBe("brz-forms2__alert brz-forms2__alert--empty");
    expect(alertText()).toBe("Fill it in");
    expect(errors(query(root, ".brz-forms2__item"))).toEqual([
      "brz-forms2__item--error",
      "brz-forms2__item--error-required"
    ]);

    queryInput(root, `input[name="Name"]`).value = "Ann";
    submit();
    await settleTransport();
    transport.restore();

    expect(transport.requests).toHaveLength(1);
  });

  it.each([
    {
      case: "a required field left empty",
      fields: REQUIRED,
      name: "Name",
      value: "",
      errors: ["brz-forms2__item--error", "brz-forms2__item--error-required"]
    },
    {
      case: "a required field that is filled",
      fields: REQUIRED,
      name: "Name",
      value: "Ann",
      errors: []
    },
    {
      case: "a value that does not match the pattern",
      fields: EMAIL,
      name: "Email",
      value: "not an email",
      errors: ["brz-forms2__item--error", "brz-forms2__item--error-pattern"]
    },
    {
      case: "a value that matches the pattern",
      fields: EMAIL,
      name: "Email",
      value: "ann@example.com",
      errors: []
    }
  ])(
    "marks the field when focus leaves $case",
    async ({ fields, name, value, errors: expected }) => {
      const { root } = await page(ACTION, fields);
      const input = queryInput(root, `input[name="${name}"]`);

      input.focus();
      input.value = value;
      input.blur();

      expect(errors(query(root, ".brz-forms2__item"))).toEqual(expected);
    }
  );

  it("decodes the patterns of the fields", async () => {
    const { root } = await page(ACTION, EMAIL);

    expect(
      queryInput(root, `input[name="Email"]`).getAttribute("pattern")
    ).toBe("^[^@]+@[^@]+$");
  });
});

describe("a form behind reCAPTCHA", () => {
  const stubRecaptcha = (): { execute: jest.Mock; reset: jest.Mock } => {
    const execute = jest.fn();
    const reset = jest.fn();

    Object.defineProperty(window, "grecaptcha", {
      configurable: true,
      writable: true,
      value: { render: () => "widget-1", execute, reset }
    });

    return { execute, reset };
  };

  it("loads the script once and renders the widget when it is ready", async () => {
    stubRecaptcha();

    const { root } = await page(ACTION, NAME + RECAPTCHA);

    global.brzOnloadRecaptchaCallback();

    expect(document.querySelectorAll("#brz-recaptcha__script")).toHaveLength(1);
    expect(
      query(document.body, "#brz-recaptcha__script").getAttribute(
        "data-brz-consent"
      )
    ).toBe("necessary");
    expect(query(root, ".brz-g-recaptcha").getAttribute("recaptchaId")).toBe(
      "widget-1"
    );
  });

  it("asks for a token on submit and sends once the token arrives", async () => {
    const { execute, reset } = stubRecaptcha();
    const transport = stubTransport(SUCCESS);
    const { wrapper, submit, alert } = await page(ACTION, NAME + RECAPTCHA);

    global.brzOnloadRecaptchaCallback();
    submit();

    expect(execute).toHaveBeenCalledWith("widget-1");
    expect(wrapper.classList.contains("brz-forms2--pending")).toBe(true);
    expect(transport.requests).toHaveLength(0);

    global.brzFormV2Captcha?.("the-token");
    await settleTransport();
    transport.restore();

    const [request] = transport.requests;
    const data =
      request.body.kind === "form"
        ? request.body.entries.find(([name]) => name === "data")?.[1]
        : undefined;

    expect(JSON.parse(data ?? "null")).toEqual([
      { name: "Name", value: "", required: false, type: "Text", label: "Name" },
      { name: "g-recaptcha-response", value: "the-token" }
    ]);
    expect(alert()).toBe("brz-forms2__alert brz-forms2__alert--success");
    expect(wrapper.classList.contains("brz-forms2--pending")).toBe(false);
    expect(reset).toHaveBeenCalledWith("widget-1");
  });

  it("does not ask for a token while the form is invalid", async () => {
    const { execute } = stubRecaptcha();
    const { wrapper, submit } = await page(
      ACTION,
      textField({
        label: "Name",
        type: "Text",
        inputType: "text",
        required: true,
        attributes: ""
      }) + RECAPTCHA
    );

    global.brzOnloadRecaptchaCallback();
    submit();

    expect(execute).not.toHaveBeenCalled();
    expect(wrapper.classList.contains("brz-forms2--pending")).toBe(false);
  });
});
