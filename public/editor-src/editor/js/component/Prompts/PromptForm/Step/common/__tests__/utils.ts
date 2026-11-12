import { readApiKey } from "../utils";

const encryptionChoices = [
  { title: "SSL", name: "ssl" },
  { title: "TLS", name: "tls" }
];

const metaDataChoices = [
  { title: "Time", value: "time" },
  { title: "Page URL", value: "pageUrl" }
];

describe("readApiKey", () => {
  it.each([
    {
      case: "an input saved as a number, like the SMTP port",
      field: { name: "port", title: "Port", required: true, value: 233 },
      out: {
        type: "input",
        name: "port",
        title: "Port",
        required: true,
        value: "233"
      }
    },
    {
      case: "an input saved as text",
      field: { name: "host", title: "Host", required: true, value: "ddd" },
      out: {
        type: "input",
        name: "host",
        title: "Host",
        required: true,
        value: "ddd"
      }
    },
    {
      case: "an empty input",
      field: { name: "cc", title: "Cc", value: "" },
      out: { type: "input", name: "cc", title: "Cc", value: "" }
    },
    {
      case: "an input whose value is not text or a number",
      field: { name: "cc", title: "Cc", value: { to: "me@email.com" } },
      out: undefined
    },
    {
      case: "a select saved as text",
      field: {
        name: "encryption",
        title: "Encryption",
        type: "select",
        choices: encryptionChoices,
        value: "ssl"
      },
      out: {
        type: "select",
        name: "encryption",
        title: "Encryption",
        choices: encryptionChoices,
        value: "ssl"
      }
    },
    {
      case: "a multiple search saved as comma-separated text",
      field: {
        name: "metaData",
        title: "Meta Data",
        type: "search",
        multiple: true,
        choices: metaDataChoices,
        value: "time,pageUrl"
      },
      out: {
        type: "search",
        name: "metaData",
        title: "Meta Data",
        multiple: true,
        choices: metaDataChoices,
        value: "time,pageUrl"
      }
    },
    {
      case: "a multiple search saved as a list",
      field: {
        name: "metaData",
        title: "Meta Data",
        type: "search",
        multiple: true,
        choices: metaDataChoices,
        value: ["time", "pageUrl"]
      },
      out: {
        type: "search",
        name: "metaData",
        title: "Meta Data",
        multiple: true,
        choices: metaDataChoices,
        value: "time,pageUrl"
      }
    }
  ])("reads $case", ({ field, out }) => {
    expect(readApiKey(field)).toEqual(out);
  });
});
