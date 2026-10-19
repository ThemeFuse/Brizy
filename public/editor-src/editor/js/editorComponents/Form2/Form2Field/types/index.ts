import Calculated from "./Calculated";
import Checkbox from "./Checkbox";
import DateField from "./Date";
import Email from "./Email";
import FileUpload from "./FileUpload";
import Hidden from "./Hidden";
import NumberField from "./Number";
import Paragraph from "./Paragraph";
import Password from "./Password";
import Phone from "./Phone";
import Radio from "./Radio";
import Select from "./Select";
import Tel from "./Tel";
import Text from "./Text";
import Time from "./Time";
import Url from "./Url";
import UserAgreementCheckbox from "./UserAgreementCheckbox";

const types = {
  Text,
  Email,
  Number: NumberField,
  Paragraph,
  Select,
  Radio,
  Checkbox,
  UserAgreementCheckbox,
  Date: DateField,
  Url,
  Time,
  FileUpload,
  Hidden,
  Tel,
  Password,
  Calculated,
  Phone
};

export default types;

type FormInputTypes = typeof types;
export type FormInputTypesName = keyof FormInputTypes;
