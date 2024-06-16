import Checkbox from "./Checkbox";
import Date from "./Date";
import Email from "./Email";
import FileUpload from "./FileUpload";
import Hidden from "./Hidden";
import Number from "./Number";
import Paragraph from "./Paragraph";
import Password from "./Password";
import Radio from "./Radio";
import Select from "./Select";
import Tel from "./Tel";
import Text from "./Text";
import Time from "./Time";
import Url from "./Url";

const types = {
  Text,
  Email,
  Number,
  Paragraph,
  Select,
  Radio,
  Checkbox,
  Date,
  Url,
  Time,
  FileUpload,
  Hidden,
  Tel,
  Password
};

export default types;

type FormInputTypes = typeof types;
export type FormInputTypesName = keyof FormInputTypes;
