import { validateEmail } from "./Validation";

// validateEmail gates PromptAuthorization SignIn/SignUp, so a silent change to
// the pattern locks users out. These cases pin the accept/reject boundary.
describe("validateEmail", () => {
  it.each([
    { case: "a plain address", email: "a@b.co", valid: true },
    {
      case: "dotted local and subdomain",
      email: "first.last@sub.example.com",
      valid: true
    },
    { case: "a plus-tagged local part", email: "a+tag@ex.io", valid: true },
    { case: "a bracketed IP domain", email: "x@[192.168.0.1]", valid: true },
    { case: "a quoted local part", email: '"quoted"@ex.com', valid: true },
    { case: "a hyphenated domain label", email: "a@my-host.com", valid: true },
    { case: "an uppercase address", email: "A.B@EX.COM", valid: true },
    { case: "a missing @", email: "no-at.example.com", valid: false },
    { case: "a space in the local part", email: "a b@ex.com", valid: false },
    { case: "a domain with no TLD", email: "a@ex", valid: false },
    {
      case: "an opening bracket in the local part",
      email: "a[b@ex.com",
      valid: false
    },
    // pins the \] escape inside the character class: dropping it makes this pass
    {
      case: "a closing bracket in the local part",
      email: "a]b@ex.com",
      valid: false
    },
    { case: "an empty string", email: "", valid: false }
  ])("returns $valid for $case", ({ email, valid }) => {
    expect(validateEmail(email)).toBe(valid);
  });
});
