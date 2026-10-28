// The first version of the published form: validation, the request and the replies.

import selectExport from "visual/component/Controls/Select/export";
import formExport from "visual/editorComponents/Form/export";
import {
  clearPage,
  click,
  mount,
  query,
  queryAll,
  queryInput
} from "visual/libs/select2/__fixtures__/env";
import {
  settleTransport,
  stubTransport,
  type TransportReply
} from "../../../../../jest-utils/formTransport";
import {
  ACTION,
  form1,
  IDS,
  inputField,
  SELECT_STYLE,
  selectField
} from "../__fixtures__/form";

beforeEach(() => {
  clearPage();
});

afterEach(() => {
  jest.restoreAllMocks();
  clearPage();
  window.location.hash = "";
});

const json = (body: string): TransportReply => ({
  kind: "response",
  status: 200,
  contentType: "application/json",
  body
});

const SUCCESS = json(`{"success":true}`);

const NAME = inputField({
  label: "Name",
  type: "Text",
  required: false,
  attributes: ""
});

const REQUIRED = inputField({
  label: "Name",
  type: "Text",
  required: true,
  attributes: ""
});

interface Page {
  root: HTMLElement;
  wrapper: HTMLElement;
  button: HTMLElement;
  submit: VoidFunction;
  alert: () => string | undefined;
  alertText: () => string | undefined;
}

function page(attributes: string, fields: string): Page {
  const root = mount(SELECT_STYLE + form1({ attributes, fields }));
  const form = query(root, "form");
  const wrapper = query(root, ".brz-forms");

  selectExport(root);
  formExport(root);

  return {
    root,
    wrapper,
    button: query(root, ".brz-btn"),
    submit: () => {
      form.dispatchEvent(
        new Event("submit", { bubbles: true, cancelable: true })
      );
    },
    alert: () => wrapper.querySelector(".brz-forms__alert")?.className,
    alertText: () =>
      wrapper.querySelector(".brz-forms__alert")?.textContent ?? undefined
  };
}

const errors = (item: Element): string[] =>
  [...item.classList].filter((name) => name.includes("--error")).sort();

describe("the request", () => {
  it("carries the fields and the ids, url encoded", async () => {
    const transport = stubTransport(SUCCESS);
    const { root, submit } = page(
      `${ACTION} ${IDS}`,
      NAME +
        inputField({
          label: "Email",
          type: "Email",
          required: true,
          attributes: ""
        })
    );

    queryInput(root, `input[name="Name"]`).value = "Ann Lee & co (ă)!~*'";
    queryInput(root, `input[name="Email"]`).value = "ann@example.com";
    submit();
    await settleTransport();
    transport.restore();

    const data = JSON.stringify([
      {
        name: "Name",
        value: "Ann Lee & co (ă)!~*'",
        required: false,
        type: "Text",
        label: "Name"
      },
      {
        name: "Email",
        value: "ann@example.com",
        required: true,
        type: "Email",
        label: "Email"
      }
    ]);

    expect(transport.requests).toEqual([
      {
        method: "POST",
        url: "/submit",
        headers: {
          "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
          accept: "*/*",
          "x-requested-with": "XMLHttpRequest"
        },
        body: {
          kind: "text",
          value: `data=${encodeURIComponent(data).replace(/%20/g, "+")}&project_id=7&form_id=form-1`
        }
      }
    ]);
  });

  it("leaves out the ids the form does not have", async () => {
    const transport = stubTransport(SUCCESS);
    const { submit } = page(ACTION, NAME);

    submit();
    await settleTransport();
    transport.restore();

    const [request] = transport.requests;

    expect(request.body).toEqual({
      kind: "text",
      value: `data=${encodeURIComponent(
        JSON.stringify([
          {
            name: "Name",
            value: "",
            required: false,
            type: "Text",
            label: "Name"
          }
        ])
      )}`
    });
  });

  it("goes out without the ajax header to another origin", async () => {
    const transport = stubTransport(SUCCESS);
    const { submit } = page(
      `action="https://other.test/submit" data-brz-redirect=""`,
      NAME
    );

    submit();
    await settleTransport();
    transport.restore();

    expect(transport.requests[0].url).toBe("https://other.test/submit");
    expect(transport.requests[0].headers).toEqual({
      "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
      accept: "*/*"
    });
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
  {
    case: "a failure verdict served as html",
    reply: {
      kind: "response",
      status: 200,
      contentType: "text/html",
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
    const { root, wrapper, button, submit, alert, alertText } = page(
      ACTION,
      NAME
    );
    const name = queryInput(root, `input[name="Name"]`);

    name.value = "Ann";
    submit();

    expect(button.classList.contains("brz-blocked")).toBe(true);

    await settleTransport();
    transport.restore();

    const expected =
      outcome === "success"
        ? {
            alert: "brz-forms__alert brz-forms__alert--success",
            text: "Your email was sent successfully",
            failed: false,
            value: ""
          }
        : {
            alert: "brz-forms__alert brz-forms__alert--error",
            text: "Your email was not sent",
            failed: true,
            value: "Ann"
          };

    expect({
      alert: alert(),
      text: alertText(),
      failed: wrapper.classList.contains("brz-form__send--fail"),
      value: name.value
    }).toEqual(expected);
    expect(wrapper.lastElementChild?.className).toBe(expected.alert);
    expect(button.classList.contains("brz-blocked")).toBe(false);
  });

  it("replaces the message of the previous attempt", async () => {
    const failing = stubTransport({ kind: "networkError" });
    const { wrapper, submit } = page(ACTION, NAME);

    submit();
    await settleTransport();
    failing.restore();

    const working = stubTransport(SUCCESS);

    submit();
    await settleTransport();
    working.restore();

    expect(
      queryAll(wrapper, ".brz-forms__alert").map((node) => node.className)
    ).toEqual(["brz-forms__alert brz-forms__alert--success"]);
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
      attributes: `data-brz-translatable-default-success="Trimis"`,
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
    const { submit, alertText } = page(`${ACTION} ${attributes}`, NAME);

    submit();
    await settleTransport();
    transport.restore();

    expect(alertText()).toBe(text);
  });
});

describe("after a success", () => {
  it("goes to the redirect of the form", async () => {
    const transport = stubTransport(SUCCESS);
    const { submit } = page(
      `action="/submit" data-brz-redirect="#thanks"`,
      NAME
    );

    submit();
    await settleTransport();
    transport.restore();

    expect(window.location.hash).toBe("#thanks");
  });

  it("empties the fields and puts the select back to its label", async () => {
    const transport = stubTransport(SUCCESS);
    const { root, submit } = page(
      ACTION,
      NAME +
        selectField({ label: "Size", required: false, options: ["S", "M"] })
    );
    const current = (): string =>
      query(root, ".brz-control__select-current .brz-control__select-option")
        .innerHTML;

    queryInput(root, `input[name="Name"]`).value = "Ann";
    click(query(root, `.brz-control__select-options [data-value="M"]`));

    expect(current()).toBe("<b>M</b>");

    submit();
    await settleTransport();
    transport.restore();

    expect(queryInput(root, `input[name="Name"]`).value).toBe("");
    expect(queryInput(root, `input[name="Size"]`).value).toBe("");
    expect(current()).toBe("<b>S</b>");
  });
});

describe("validation", () => {
  it("keeps an invalid form from being sent", async () => {
    const transport = stubTransport(SUCCESS);
    const { root, submit } = page(ACTION, REQUIRED);

    submit();
    await settleTransport();

    expect(transport.requests).toHaveLength(0);
    expect(errors(query(root, ".brz-forms__item"))).toEqual([
      "brz-forms__item--error",
      "brz-forms__item--error-required"
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
      value: "",
      errors: ["brz-forms__item--error", "brz-forms__item--error-required"]
    },
    { case: "a required field that is filled", value: "Ann", errors: [] }
  ])(
    "marks the field when focus leaves $case",
    ({ value, errors: expected }) => {
      const { root } = page(ACTION, REQUIRED);
      const input = queryInput(root, `input[name="Name"]`);

      input.focus();
      input.value = value;
      input.blur();

      expect(errors(query(root, ".brz-forms__item"))).toEqual(expected);
    }
  );

  it("clears a required select once an option is clicked", async () => {
    const transport = stubTransport(SUCCESS);
    const { root, submit } = page(
      ACTION,
      selectField({ label: "Size", required: true, options: ["S", "M"] })
    );
    const item = query(root, ".brz-forms__item");

    submit();
    await settleTransport();

    expect(transport.requests).toHaveLength(0);
    expect(errors(item)).toEqual([
      "brz-forms__item--error",
      "brz-forms__item--error-required"
    ]);

    click(query(root, `.brz-control__select-options [data-value="M"]`));

    expect(errors(item)).toEqual([]);

    submit();
    await settleTransport();
    transport.restore();

    expect(transport.requests).toHaveLength(1);
  });

  it.each([
    {
      case: "validates the option just chosen",
      stopped: false,
      errors: []
    },
    {
      case: "leaves a click stopped inside the form alone",
      stopped: true,
      errors: ["brz-forms__item--error", "brz-forms__item--error-required"]
    }
  ])(
    "$case when the form is initialised before its select",
    ({ stopped, errors: expected }) => {
      const root = mount(
        SELECT_STYLE +
          form1({
            attributes: ACTION,
            fields: selectField({
              label: "Size",
              required: true,
              options: ["S", "M"]
            })
          })
      );
      const item = query(root, ".brz-forms__item");

      formExport(root);
      selectExport(root);
      query(root, "form").dispatchEvent(
        new Event("submit", { bubbles: true, cancelable: true })
      );

      if (stopped) {
        query(root, ".brz-control__select").addEventListener("click", (event) =>
          event.stopPropagation()
        );
      }

      click(query(root, `.brz-control__select-options [data-value="M"]`));

      expect(queryInput(root, "input[type=hidden]").value).toBe("M");
      expect(errors(item)).toEqual(expected);
    }
  );
});

describe("a form behind reCAPTCHA", () => {
  const RECAPTCHA = `<div class="brz-g-recaptcha" data-sitekey="site-key" data-size="invisible" data-callback="brzFormV1Captcha"></div>`;

  it("asks for a token on submit and sends once the token arrives", async () => {
    const execute = jest.fn();
    const reset = jest.fn();

    Object.defineProperty(window, "grecaptcha", {
      configurable: true,
      writable: true,
      value: { render: () => "widget-1", execute, reset }
    });

    const transport = stubTransport(SUCCESS);
    const { root, wrapper, submit, alert } = page(ACTION, NAME + RECAPTCHA);

    global.brzOnloadRecaptchaCallback();

    expect(query(root, ".brz-g-recaptcha").getAttribute("recaptchaId")).toBe(
      "widget-1"
    );
    expect(document.querySelectorAll("#brz-recaptcha__script")).toHaveLength(1);

    submit();

    expect(execute).toHaveBeenCalledWith("widget-1");
    expect(wrapper.classList.contains("brz-forms--pending")).toBe(true);
    expect(transport.requests).toHaveLength(0);

    Reflect.apply(Reflect.get(window, "brzFormV1Captcha"), window, [
      "the-token"
    ]);
    await settleTransport();
    transport.restore();

    const [request] = transport.requests;
    const body = request.body.kind === "text" ? request.body.value : "";

    expect(decodeURIComponent(body.replace(/\+/g, " "))).toBe(
      `data=${JSON.stringify([
        {
          name: "Name",
          value: "",
          required: false,
          type: "Text",
          label: "Name"
        },
        { name: "g-recaptcha-response", value: "the-token" }
      ])}`
    );
    expect(alert()).toBe("brz-forms__alert brz-forms__alert--success");
    expect(wrapper.classList.contains("brz-forms--pending")).toBe(false);
    expect(reset).toHaveBeenCalledWith("widget-1");
  });
});
