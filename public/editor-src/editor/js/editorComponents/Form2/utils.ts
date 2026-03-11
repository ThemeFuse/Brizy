import { Str } from "@brizy/readers";
import { memoize } from "es-toolkit";
import { Option } from "slim-select";
import { checkValue } from "visual/utils/checkValue";
import { t } from "visual/utils/i18n";
import { makeAttr } from "visual/utils/i18n/attribute";
import { PhoneOption } from "./Form2Field/types/type";
import { ViewType } from "./Form2Steps/types";
import { BoxResizerParams, MessageStatus, ResponseMessages } from "./types";

export const isViewType = (v: string): v is ViewType =>
  !!checkValue<ViewType>([
    ViewType.None,
    ViewType.Text,
    ViewType.Icon,
    ViewType.Number,
    ViewType.Progress,
    ViewType.NumberText,
    ViewType.IconText
  ])(v);

export const isViewTypeWithIcon = (v: ViewType): boolean =>
  v === ViewType.Icon || v === ViewType.IconText;

export const isViewTypeWithNumber = (v: ViewType): boolean =>
  v === ViewType.Number || v === ViewType.NumberText;

export const getBoxResizerParams: BoxResizerParams = memoize(() => ({
  points: ["centerLeft", "centerRight"],
  restrictions: {
    width: {
      "%": { min: 5, max: 100 }
    }
  }
}));

export const getTranslatedResponseMessages = (
  form: HTMLFormElement
): ResponseMessages =>
  Object.keys(MessageStatus).reduce((acc, _status) => {
    const status = _status.toLowerCase();

    const translatedMessage = Str.read(
      form.getAttribute(makeAttr("default-" + status, true))
    );

    return {
      ...acc,
      [status]: translatedMessage
    };
  }, {} as ResponseMessages);

export const isUserAgreementCheckbox = (type: string | undefined): boolean =>
  type === "UserAgreementCheckbox";

export const isPhoneType = (type: string | undefined): boolean =>
  type === "Phone";

export const getFlagsForEditor = (): PhoneOption[] => [
  {
    code: "AF",
    flag: "🇦🇫",
    dialCode: "+93",
    name: t("Afghanistan")
  },
  {
    code: "AL",
    flag: "🇦🇱",
    dialCode: "+355",
    name: t("Albania")
  },
  {
    code: "DZ",
    flag: "🇩🇿",
    dialCode: "+213",
    name: t("Algeria")
  },
  {
    code: "AS",
    flag: "🇦🇸",
    dialCode: "+1684",
    name: t("American Samoa")
  },
  {
    code: "AD",
    flag: "🇦🇩",
    dialCode: "+376",
    name: t("Andorra")
  },
  {
    code: "AO",
    flag: "🇦🇴",
    dialCode: "+244",
    name: t("Angola")
  },
  {
    code: "AI",
    flag: "🇦🇮",
    dialCode: "+1264",
    name: t("Anguilla")
  },
  {
    code: "AQ",
    flag: "🇦🇶",
    dialCode: "+672",
    name: t("Antarctica")
  },
  {
    code: "AG",
    flag: "🇦🇬",
    dialCode: "+1268",
    name: t("Antigua and Barbuda")
  },
  {
    code: "AR",
    flag: "🇦🇷",
    dialCode: "+54",
    name: t("Argentina")
  },
  {
    code: "AM",
    flag: "🇦🇲",
    dialCode: "+374",
    name: t("Armenia")
  },
  {
    code: "US",
    flag: "🇺🇸",
    dialCode: "+1",
    name: t("United States")
  }
];

export const getFlags = (): PhoneOption[] => [
  {
    code: "AF",
    flag: "🇦🇫",
    dialCode: "+93",
    name: "Afghanistan"
  },
  {
    code: "AL",
    flag: "🇦🇱",
    dialCode: "+355",
    name: "Albania"
  },
  {
    code: "DZ",
    flag: "🇩🇿",
    dialCode: "+213",
    name: "Algeria"
  },
  {
    code: "AS",
    flag: "🇦🇸",
    dialCode: "+1684",
    name: "American Samoa"
  },
  {
    code: "AD",
    flag: "🇦🇩",
    dialCode: "+376",
    name: "Andorra"
  },
  {
    code: "AO",
    flag: "🇦🇴",
    dialCode: "+244",
    name: "Angola"
  },
  {
    code: "AI",
    flag: "🇦🇮",
    dialCode: "+1264",
    name: "Anguilla"
  },
  {
    code: "AQ",
    flag: "🇦🇶",
    dialCode: "+672",
    name: "Antarctica"
  },
  {
    code: "AG",
    flag: "🇦🇬",
    dialCode: "+1268",
    name: "Antigua and Barbuda"
  },
  {
    code: "AR",
    flag: "🇦🇷",
    dialCode: "+54",
    name: "Argentina"
  },
  {
    code: "AM",
    flag: "🇦🇲",
    dialCode: "+374",
    name: "Armenia"
  },
  {
    code: "AW",
    flag: "🇦🇼",
    dialCode: "+297",
    name: "Aruba"
  },
  {
    code: "AU",
    flag: "🇦🇺",
    dialCode: "+61",
    name: "Australia"
  },
  {
    code: "AT",
    flag: "🇦🇹",
    dialCode: "+43",
    name: "Austria"
  },
  {
    code: "AZ",
    flag: "🇦🇿",
    dialCode: "+994",
    name: "Azerbaijan"
  },
  {
    code: "BS",
    flag: "🇧🇸",
    dialCode: "+1242",
    name: "Bahamas"
  },
  {
    code: "BH",
    flag: "🇧🇭",
    dialCode: "+973",
    name: "Bahrain"
  },
  {
    code: "BD",
    flag: "🇧🇩",
    dialCode: "+880",
    name: "Bangladesh"
  },
  {
    code: "BB",
    flag: "🇧🇧",
    dialCode: "+1246",
    name: "Barbados"
  },
  {
    code: "BY",
    flag: "🇧🇾",
    dialCode: "+375",
    name: "Belarus"
  },
  {
    code: "BE",
    flag: "🇧🇪",
    dialCode: "+32",
    name: "Belgium"
  },
  {
    code: "BZ",
    flag: "🇧🇿",
    dialCode: "+501",
    name: "Belize"
  },
  {
    code: "BJ",
    flag: "🇧🇯",
    dialCode: "+229",
    name: "Benin"
  },
  {
    code: "BM",
    flag: "🇧🇲",
    dialCode: "+1441",
    name: "Bermuda"
  },
  {
    code: "BT",
    flag: "🇧🇹",
    dialCode: "+975",
    name: "Bhutan"
  },
  {
    code: "BO",
    flag: "🇧🇴",
    dialCode: "+591",
    name: "Bolivia, Plurinational State of"
  },
  {
    code: "BQ",
    flag: "🇧🇶",
    dialCode: "+599",
    name: "Bonaire, Sint Eustatius and Saba"
  },
  {
    code: "BA",
    flag: "🇧🇦",
    dialCode: "+387",
    name: "Bosnia and Herzegovina"
  },
  {
    code: "BW",
    flag: "🇧🇼",
    dialCode: "+267",
    name: "Botswana"
  },
  {
    code: "BV",
    flag: "🇧🇻",
    dialCode: "+47",
    name: "Bouvet Island"
  },
  {
    code: "BR",
    flag: "🇧🇷",
    dialCode: "+55",
    name: "Brazil"
  },
  {
    code: "IO",
    flag: "🇮🇴",
    dialCode: "+246",
    name: "British Indian Ocean Territory"
  },
  {
    code: "BN",
    flag: "🇧🇳",
    dialCode: "+673",
    name: "Brunei Darussalam"
  },
  {
    code: "BG",
    flag: "🇧🇬",
    dialCode: "+359",
    name: "Bulgaria"
  },
  {
    code: "BF",
    flag: "🇧🇫",
    dialCode: "+226",
    name: "Burkina Faso"
  },
  {
    code: "BI",
    flag: "🇧🇮",
    dialCode: "+257",
    name: "Burundi"
  },
  {
    code: "KH",
    flag: "🇰🇭",
    dialCode: "+855",
    name: "Cambodia"
  },
  {
    code: "CM",
    flag: "🇨🇲",
    dialCode: "+237",
    name: "Cameroon"
  },
  {
    code: "CA",
    flag: "🇨🇦",
    dialCode: "+1",
    name: "Canada"
  },
  {
    code: "CV",
    flag: "🇨🇻",
    dialCode: "+238",
    name: "Cape Verde"
  },
  {
    code: "KY",
    flag: "🇰🇾",
    dialCode: "+1345",
    name: "Cayman Islands"
  },
  {
    code: "CF",
    flag: "🇨🇫",
    dialCode: "+236",
    name: "Central African Republic"
  },
  {
    code: "TD",
    flag: "🇹🇩",
    dialCode: "+235",
    name: "Chad"
  },
  {
    code: "CL",
    flag: "🇨🇱",
    dialCode: "+56",
    name: "Chile"
  },
  {
    code: "CN",
    flag: "🇨🇳",
    dialCode: "+86",
    name: "China"
  },
  {
    code: "CX",
    flag: "🇨🇽",
    dialCode: "+61",
    name: "Christmas Island"
  },
  {
    code: "CC",
    flag: "🇨🇨",
    dialCode: "+61",
    name: "Cocos (Keeling) Islands"
  },
  {
    code: "CO",
    flag: "🇨🇴",
    dialCode: "+57",
    name: "Colombia"
  },
  {
    code: "KM",
    flag: "🇰🇲",
    dialCode: "+269",
    name: "Comoros"
  },
  {
    code: "CG",
    flag: "🇨🇬",
    dialCode: "+242",
    name: "Congo"
  },
  {
    code: "CD",
    flag: "🇨🇩",
    dialCode: "+243",
    name: "Congo, the Democratic Republic of the"
  },
  {
    code: "CK",
    flag: "🇨🇰",
    dialCode: "+682",
    name: "Cook Islands"
  },
  {
    code: "CR",
    flag: "🇨🇷",
    dialCode: "+506",
    name: "Costa Rica"
  },
  {
    code: "HR",
    flag: "🇭🇷",
    dialCode: "+385",
    name: "Croatia"
  },
  {
    code: "CU",
    flag: "🇨🇺",
    dialCode: "+53",
    name: "Cuba"
  },
  {
    code: "CW",
    flag: "🇨🇼",
    dialCode: "+599",
    name: "Curaçao"
  },
  {
    code: "CY",
    flag: "🇨🇾",
    dialCode: "+357",
    name: "Cyprus"
  },
  {
    code: "CZ",
    flag: "🇨🇿",
    dialCode: "+420",
    name: "Czech Republic"
  },
  {
    code: "CI",
    flag: "🇨🇮",
    dialCode: "+225",
    name: "Côte d’Ivoire"
  },
  {
    code: "DK",
    flag: "🇩🇰",
    dialCode: "+45",
    name: "Denmark"
  },
  {
    code: "DJ",
    flag: "🇩🇯",
    dialCode: "+253",
    name: "Djibouti"
  },
  {
    code: "DM",
    flag: "🇩🇲",
    dialCode: "+1767",
    name: "Dominica"
  },
  {
    code: "DO",
    flag: "🇩🇴",
    dialCode: "+1",
    name: "Dominican Republic"
  },
  {
    code: "EC",
    flag: "🇪🇨",
    dialCode: "+593",
    name: "Ecuador"
  },
  {
    code: "EG",
    flag: "🇪🇬",
    dialCode: "+20",
    name: "Egypt"
  },
  {
    code: "SV",
    flag: "🇸🇻",
    dialCode: "+503",
    name: "El Salvador"
  },
  {
    code: "GQ",
    flag: "🇬🇶",
    dialCode: "+240",
    name: "Equatorial Guinea"
  },
  {
    code: "ER",
    flag: "🇪🇷",
    dialCode: "+291",
    name: "Eritrea"
  },
  {
    code: "EE",
    flag: "🇪🇪",
    dialCode: "+372",
    name: "Estonia"
  },
  {
    code: "SZ",
    flag: "🇸🇿",
    dialCode: "+268",
    name: "Eswatini"
  },
  {
    code: "ET",
    flag: "🇪🇹",
    dialCode: "+251",
    name: "Ethiopia"
  },
  {
    code: "FK",
    flag: "🇫🇰",
    dialCode: "+500",
    name: "Falkland Islands (Malvinas)"
  },
  {
    code: "FO",
    flag: "🇫🇴",
    dialCode: "+298",
    name: "Faroe Islands"
  },
  {
    code: "FJ",
    flag: "🇫🇯",
    dialCode: "+679",
    name: "Fiji"
  },
  {
    code: "FI",
    flag: "🇫🇮",
    dialCode: "+358",
    name: "Finland"
  },
  {
    code: "FR",
    flag: "🇫🇷",
    dialCode: "+33",
    name: "France"
  },
  {
    code: "GF",
    flag: "🇬🇫",
    dialCode: "+594",
    name: "French Guiana"
  },
  {
    code: "PF",
    flag: "🇵🇫",
    dialCode: "+689",
    name: "French Polynesia"
  },
  {
    code: "TF",
    flag: "🇹🇫",
    dialCode: "+262",
    name: "French Southern Territories"
  },
  {
    code: "GA",
    flag: "🇬🇦",
    dialCode: "+241",
    name: "Gabon"
  },
  {
    code: "GM",
    flag: "🇬🇲",
    dialCode: "+220",
    name: "Gambia"
  },
  {
    code: "GE",
    flag: "🇬🇪",
    dialCode: "+995",
    name: "Georgia"
  },
  {
    code: "DE",
    flag: "🇩🇪",
    dialCode: "+49",
    name: "Germany"
  },
  {
    code: "GH",
    flag: "🇬🇭",
    dialCode: "+233",
    name: "Ghana"
  },
  {
    code: "GI",
    flag: "🇬🇮",
    dialCode: "+350",
    name: "Gibraltar"
  },
  {
    code: "GR",
    flag: "🇬🇷",
    dialCode: "+30",
    name: "Greece"
  },
  {
    code: "GL",
    flag: "🇬🇱",
    dialCode: "+299",
    name: "Greenland"
  },
  {
    code: "GD",
    flag: "🇬🇩",
    dialCode: "+1473",
    name: "Grenada"
  },
  {
    code: "GP",
    flag: "🇬🇵",
    dialCode: "+590",
    name: "Guadeloupe"
  },
  {
    code: "GU",
    flag: "🇬🇺",
    dialCode: "+1671",
    name: "Guam"
  },
  {
    code: "GT",
    flag: "🇬🇹",
    dialCode: "+502",
    name: "Guatemala"
  },
  {
    code: "GG",
    flag: "🇬🇬",
    dialCode: "+44",
    name: "Guernsey"
  },
  {
    code: "GN",
    flag: "🇬🇳",
    dialCode: "+224",
    name: "Guinea"
  },
  {
    code: "GW",
    flag: "🇬🇼",
    dialCode: "+245",
    name: "Guinea-Bissau"
  },
  {
    code: "GY",
    flag: "🇬🇾",
    dialCode: "+592",
    name: "Guyana"
  },
  {
    code: "HT",
    flag: "🇭🇹",
    dialCode: "+509",
    name: "Haiti"
  },
  {
    code: "HM",
    flag: "🇭🇲",
    dialCode: "+672",
    name: "Heard Island and McDonald Islands"
  },
  {
    code: "VA",
    flag: "🇻🇦",
    dialCode: "+39",
    name: "Holy See (Vatican City State)"
  },
  {
    code: "HN",
    flag: "🇭🇳",
    dialCode: "+504",
    name: "Honduras"
  },
  {
    code: "HK",
    flag: "🇭🇰",
    dialCode: "+852",
    name: "Hong Kong"
  },
  {
    code: "HU",
    flag: "🇭🇺",
    dialCode: "+36",
    name: "Hungary"
  },
  {
    code: "IS",
    flag: "🇮🇸",
    dialCode: "+354",
    name: "Iceland"
  },
  {
    code: "IN",
    flag: "🇮🇳",
    dialCode: "+91",
    name: "India"
  },
  {
    code: "ID",
    flag: "🇮🇩",
    dialCode: "+62",
    name: "Indonesia"
  },
  {
    code: "IR",
    flag: "🇮🇷",
    dialCode: "+98",
    name: "Iran"
  },
  {
    code: "IQ",
    flag: "🇮🇶",
    dialCode: "+964",
    name: "Iraq"
  },
  {
    code: "IE",
    flag: "🇮🇪",
    dialCode: "+353",
    name: "Ireland"
  },
  {
    code: "IM",
    flag: "🇮🇲",
    dialCode: "+44",
    name: "Isle of Man"
  },
  {
    code: "IL",
    flag: "🇮🇱",
    dialCode: "+972",
    name: "Israel"
  },
  {
    code: "IT",
    flag: "🇮🇹",
    dialCode: "+39",
    name: "Italy"
  },
  {
    code: "JM",
    flag: "🇯🇲",
    dialCode: "+1876",
    name: "Jamaica"
  },
  {
    code: "JP",
    flag: "🇯🇵",
    dialCode: "+81",
    name: "Japan"
  },
  {
    code: "JE",
    flag: "🇯🇪",
    dialCode: "+44",
    name: "Jersey"
  },
  {
    code: "JO",
    flag: "🇯🇴",
    dialCode: "+962",
    name: "Jordan"
  },
  {
    code: "KZ",
    flag: "🇰🇿",
    dialCode: "+7",
    name: "Kazakhstan"
  },
  {
    code: "KE",
    flag: "🇰🇪",
    dialCode: "+254",
    name: "Kenya"
  },
  {
    code: "KI",
    flag: "🇰🇮",
    dialCode: "+686",
    name: "Kiribati"
  },
  {
    code: "KW",
    flag: "🇰🇼",
    dialCode: "+965",
    name: "Kuwait"
  },
  {
    code: "KG",
    flag: "🇰🇬",
    dialCode: "+996",
    name: "Kyrgyzstan"
  },
  {
    code: "LA",
    flag: "🇱🇦",
    dialCode: "+856",
    name: "Laos"
  },
  {
    code: "LV",
    flag: "🇱🇻",
    dialCode: "+371",
    name: "Latvia"
  },
  {
    code: "LB",
    flag: "🇱🇧",
    dialCode: "+961",
    name: "Lebanon"
  },
  {
    code: "LS",
    flag: "🇱🇸",
    dialCode: "+266",
    name: "Lesotho"
  },
  {
    code: "LR",
    flag: "🇱🇷",
    dialCode: "+231",
    name: "Liberia"
  },
  {
    code: "LY",
    flag: "🇱🇾",
    dialCode: "+218",
    name: "Libya"
  },
  {
    code: "LI",
    flag: "🇱🇮",
    dialCode: "+423",
    name: "Liechtenstein"
  },
  {
    code: "LT",
    flag: "🇱🇹",
    dialCode: "+370",
    name: "Lithuania"
  },
  {
    code: "LU",
    flag: "🇱🇺",
    dialCode: "+352",
    name: "Luxembourg"
  },
  {
    code: "MO",
    flag: "🇲🇴",
    dialCode: "+853",
    name: "Macao"
  },
  {
    code: "MG",
    flag: "🇲🇬",
    dialCode: "+261",
    name: "Madagascar"
  },
  {
    code: "MW",
    flag: "🇲🇼",
    dialCode: "+265",
    name: "Malawi"
  },
  {
    code: "MY",
    flag: "🇲🇾",
    dialCode: "+60",
    name: "Malaysia"
  },
  {
    code: "MV",
    flag: "🇲🇻",
    dialCode: "+960",
    name: "Maldives"
  },
  {
    code: "ML",
    flag: "🇲🇱",
    dialCode: "+223",
    name: "Mali"
  },
  {
    code: "MT",
    flag: "🇲🇹",
    dialCode: "+356",
    name: "Malta"
  },
  {
    code: "MH",
    flag: "🇲🇭",
    dialCode: "+692",
    name: "Marshall Islands"
  },
  {
    code: "MQ",
    flag: "🇲🇶",
    dialCode: "+596",
    name: "Martinique"
  },
  {
    code: "MR",
    flag: "🇲🇷",
    dialCode: "+222",
    name: "Mauritania"
  },
  {
    code: "MU",
    flag: "🇲🇺",
    dialCode: "+230",
    name: "Mauritius"
  },
  {
    code: "YT",
    flag: "🇾🇹",
    dialCode: "+262",
    name: "Mayotte"
  },
  {
    code: "MX",
    flag: "🇲🇽",
    dialCode: "+52",
    name: "Mexico"
  },
  {
    code: "FM",
    flag: "🇫🇲",
    dialCode: "+691",
    name: "Micronesia, Federated States of"
  },
  {
    code: "MD",
    flag: "🇲🇩",
    dialCode: "+373",
    name: "Moldova, Republic of"
  },
  {
    code: "MC",
    flag: "🇲🇨",
    dialCode: "+377",
    name: "Monaco"
  },
  {
    code: "MN",
    flag: "🇲🇳",
    dialCode: "+976",
    name: "Mongolia"
  },
  {
    code: "ME",
    flag: "🇲🇪",
    dialCode: "+382",
    name: "Montenegro"
  },
  {
    code: "MS",
    flag: "🇲🇸",
    dialCode: "+1664",
    name: "Montserrat"
  },
  {
    code: "MA",
    flag: "🇲🇦",
    dialCode: "+212",
    name: "Morocco"
  },
  {
    code: "MZ",
    flag: "🇲🇿",
    dialCode: "+258",
    name: "Mozambique"
  },
  {
    code: "MM",
    flag: "🇲🇲",
    dialCode: "+95",
    name: "Myanmar"
  },
  {
    code: "NA",
    flag: "🇳🇦",
    dialCode: "+264",
    name: "Namibia"
  },
  {
    code: "NR",
    flag: "🇳🇷",
    dialCode: "+674",
    name: "Nauru"
  },
  {
    code: "NP",
    flag: "🇳🇵",
    dialCode: "+977",
    name: "Nepal"
  },
  {
    code: "NL",
    flag: "🇳🇱",
    dialCode: "+31",
    name: "Netherlands"
  },
  {
    code: "NC",
    flag: "🇳🇨",
    dialCode: "+687",
    name: "New Caledonia"
  },
  {
    code: "NZ",
    flag: "🇳🇿",
    dialCode: "+64",
    name: "New Zealand"
  },
  {
    code: "NI",
    flag: "🇳🇮",
    dialCode: "+505",
    name: "Nicaragua"
  },
  {
    code: "NE",
    flag: "🇳🇪",
    dialCode: "+227",
    name: "Niger"
  },
  {
    code: "NG",
    flag: "🇳🇬",
    dialCode: "+234",
    name: "Nigeria"
  },
  {
    code: "NU",
    flag: "🇳🇺",
    dialCode: "+683",
    name: "Niue"
  },
  {
    code: "NF",
    flag: "🇳🇫",
    dialCode: "+672",
    name: "Norfolk Island"
  },
  {
    code: "KP",
    flag: "🇰🇵",
    dialCode: "+850",
    name: "North Korea"
  },
  {
    code: "MK",
    flag: "🇲🇰",
    dialCode: "+389",
    name: "North Macedonia"
  },
  {
    code: "MP",
    flag: "🇲🇵",
    dialCode: "+1670",
    name: "Northern Mariana Islands"
  },
  {
    code: "NO",
    flag: "🇳🇴",
    dialCode: "+47",
    name: "Norway"
  },
  {
    code: "OM",
    flag: "🇴🇲",
    dialCode: "+968",
    name: "Oman"
  },
  {
    code: "PK",
    flag: "🇵🇰",
    dialCode: "+92",
    name: "Pakistan"
  },
  {
    code: "PW",
    flag: "🇵🇼",
    dialCode: "+680",
    name: "Palau"
  },
  {
    code: "PS",
    flag: "🇵🇸",
    dialCode: "+970",
    name: "Palestinian Territory"
  },
  {
    code: "PA",
    flag: "🇵🇦",
    dialCode: "+507",
    name: "Panama"
  },
  {
    code: "PG",
    flag: "🇵🇬",
    dialCode: "+675",
    name: "Papua New Guinea"
  },
  {
    code: "PY",
    flag: "🇵🇾",
    dialCode: "+595",
    name: "Paraguay"
  },
  {
    code: "PE",
    flag: "🇵🇪",
    dialCode: "+51",
    name: "Peru"
  },
  {
    code: "PH",
    flag: "🇵🇭",
    dialCode: "+63",
    name: "Philippines"
  },
  {
    code: "PN",
    flag: "🇵🇳",
    dialCode: "+64",
    name: "Pitcairn"
  },
  {
    code: "PL",
    flag: "🇵🇱",
    dialCode: "+48",
    name: "Poland"
  },
  {
    code: "PT",
    flag: "🇵🇹",
    dialCode: "+351",
    name: "Portugal"
  },
  {
    code: "PR",
    flag: "🇵🇷",
    dialCode: "+1",
    name: "Puerto Rico"
  },
  {
    code: "QA",
    flag: "🇶🇦",
    dialCode: "+974",
    name: "Qatar"
  },
  {
    code: "RO",
    flag: "🇷🇴",
    dialCode: "+40",
    name: "Romania"
  },
  {
    code: "RU",
    flag: "🇷🇺",
    dialCode: "+7",
    name: "Russia"
  },
  {
    code: "RW",
    flag: "🇷🇼",
    dialCode: "+250",
    name: "Rwanda"
  },
  {
    code: "RE",
    flag: "🇷🇪",
    dialCode: "+262",
    name: "Réunion"
  },
  {
    code: "BL",
    flag: "🇧🇱",
    dialCode: "+590",
    name: "Saint Barthélemy"
  },
  {
    code: "SH",
    flag: "🇸🇭",
    dialCode: "+290",
    name: "Saint Helena, Ascension and Tristan da Cunha"
  },
  {
    code: "KN",
    flag: "🇰🇳",
    dialCode: "+1869",
    name: "Saint Kitts and Nevis"
  },
  {
    code: "LC",
    flag: "🇱🇨",
    dialCode: "+1758",
    name: "Saint Lucia"
  },
  {
    code: "MF",
    flag: "🇲🇫",
    dialCode: "+590",
    name: "Saint Martin (French part)"
  },
  {
    code: "PM",
    flag: "🇵🇲",
    dialCode: "+508",
    name: "Saint Pierre and Miquelon"
  },
  {
    code: "VC",
    flag: "🇻🇨",
    dialCode: "+1784",
    name: "Saint Vincent and the Grenadines"
  },
  {
    code: "WS",
    flag: "🇼🇸",
    dialCode: "+685",
    name: "Samoa"
  },
  {
    code: "SM",
    flag: "🇸🇲",
    dialCode: "+378",
    name: "San Marino"
  },
  {
    code: "ST",
    flag: "🇸🇹",
    dialCode: "+239",
    name: "Sao Tome and Principe"
  },
  {
    code: "SA",
    flag: "🇸🇦",
    dialCode: "+966",
    name: "Saudi Arabia"
  },
  {
    code: "SN",
    flag: "🇸🇳",
    dialCode: "+221",
    name: "Senegal"
  },
  {
    code: "RS",
    flag: "🇷🇸",
    dialCode: "+381",
    name: "Serbia"
  },
  {
    code: "SC",
    flag: "🇸🇨",
    dialCode: "+248",
    name: "Seychelles"
  },
  {
    code: "SL",
    flag: "🇸🇱",
    dialCode: "+232",
    name: "Sierra Leone"
  },
  {
    code: "SG",
    flag: "🇸🇬",
    dialCode: "+65",
    name: "Singapore"
  },
  {
    code: "SX",
    flag: "🇸🇽",
    dialCode: "+1721",
    name: "Sint Maarten (Dutch part)"
  },
  {
    code: "SK",
    flag: "🇸🇰",
    dialCode: "+421",
    name: "Slovakia"
  },
  {
    code: "SI",
    flag: "🇸🇮",
    dialCode: "+386",
    name: "Slovenia"
  },
  {
    code: "SB",
    flag: "🇸🇧",
    dialCode: "+677",
    name: "Solomon Islands"
  },
  {
    code: "SO",
    flag: "🇸🇴",
    dialCode: "+252",
    name: "Somalia"
  },
  {
    code: "ZA",
    flag: "🇿🇦",
    dialCode: "+27",
    name: "South Africa"
  },
  {
    code: "GS",
    flag: "🇬🇸",
    dialCode: "+500",
    name: "South Georgia and the South Sandwich Islands"
  },
  {
    code: "KR",
    flag: "🇰🇷",
    dialCode: "+82",
    name: "South Korea"
  },
  {
    code: "SS",
    flag: "🇸🇸",
    dialCode: "+211",
    name: "South Sudan"
  },
  {
    code: "ES",
    flag: "🇪🇸",
    dialCode: "+34",
    name: "Spain"
  },
  {
    code: "LK",
    flag: "🇱🇰",
    dialCode: "+94",
    name: "Sri Lanka"
  },
  {
    code: "SD",
    flag: "🇸🇩",
    dialCode: "+249",
    name: "Sudan"
  },
  {
    code: "SR",
    flag: "🇸🇷",
    dialCode: "+597",
    name: "Suriname"
  },
  {
    code: "SJ",
    flag: "🇸🇯",
    dialCode: "+47",
    name: "Svalbard and Jan Mayen"
  },
  {
    code: "SE",
    flag: "🇸🇪",
    dialCode: "+46",
    name: "Sweden"
  },
  {
    code: "CH",
    flag: "🇨🇭",
    dialCode: "+41",
    name: "Switzerland"
  },
  {
    code: "SY",
    flag: "🇸🇾",
    dialCode: "+963",
    name: "Syria"
  },
  {
    code: "TW",
    flag: "🇹🇼",
    dialCode: "+886",
    name: "Taiwan"
  },
  {
    code: "TJ",
    flag: "🇹🇯",
    dialCode: "+992",
    name: "Tajikistan"
  },
  {
    code: "TZ",
    flag: "🇹🇿",
    dialCode: "+255",
    name: "Tanzania, United Republic of"
  },
  {
    code: "TH",
    flag: "🇹🇭",
    dialCode: "+66",
    name: "Thailand"
  },
  {
    code: "TL",
    flag: "🇹🇱",
    dialCode: "+670",
    name: "Timor-Leste"
  },
  {
    code: "TG",
    flag: "🇹🇬",
    dialCode: "+228",
    name: "Togo"
  },
  {
    code: "TK",
    flag: "🇹🇰",
    dialCode: "+690",
    name: "Tokelau"
  },
  {
    code: "TO",
    flag: "🇹🇴",
    dialCode: "+676",
    name: "Tonga"
  },
  {
    code: "TT",
    flag: "🇹🇹",
    dialCode: "+1868",
    name: "Trinidad and Tobago"
  },
  {
    code: "TN",
    flag: "🇹🇳",
    dialCode: "+216",
    name: "Tunisia"
  },
  {
    code: "TM",
    flag: "🇹🇲",
    dialCode: "+993",
    name: "Turkmenistan"
  },
  {
    code: "TC",
    flag: "🇹🇨",
    dialCode: "+1649",
    name: "Turks and Caicos Islands"
  },
  {
    code: "TV",
    flag: "🇹🇻",
    dialCode: "+688",
    name: "Tuvalu"
  },
  {
    code: "TR",
    flag: "🇹🇷",
    dialCode: "+90",
    name: "Türkiye"
  },
  {
    code: "UG",
    flag: "🇺🇬",
    dialCode: "+256",
    name: "Uganda"
  },
  {
    code: "UA",
    flag: "🇺🇦",
    dialCode: "+380",
    name: "Ukraine"
  },
  {
    code: "AE",
    flag: "🇦🇪",
    dialCode: "+971",
    name: "United Arab Emirates"
  },
  {
    code: "GB",
    flag: "🇬🇧",
    dialCode: "+44",
    name: "United Kingdom"
  },
  {
    code: "US",
    flag: "🇺🇸",
    dialCode: "+1",
    name: "United States"
  },
  {
    code: "UM",
    flag: "🇺🇲",
    dialCode: "+1",
    name: "United States Minor Outlying Islands"
  },
  {
    code: "UY",
    flag: "🇺🇾",
    dialCode: "+598",
    name: "Uruguay"
  },
  {
    code: "UZ",
    flag: "🇺🇿",
    dialCode: "+998",
    name: "Uzbekistan"
  },
  {
    code: "VU",
    flag: "🇻🇺",
    dialCode: "+678",
    name: "Vanuatu"
  },
  {
    code: "VE",
    flag: "🇻🇪",
    dialCode: "+58",
    name: "Venezuela, Bolivarian Republic of"
  },
  {
    code: "VN",
    flag: "🇻🇳",
    dialCode: "+84",
    name: "Vietnam"
  },
  {
    code: "VG",
    flag: "🇻🇬",
    dialCode: "+1284",
    name: "Virgin Islands, British"
  },
  {
    code: "VI",
    flag: "🇻🇮",
    dialCode: "+1340",
    name: "Virgin Islands, U.S."
  },
  {
    code: "WF",
    flag: "🇼🇫",
    dialCode: "+681",
    name: "Wallis and Futuna"
  },
  {
    code: "EH",
    flag: "🇪🇭",
    dialCode: "+212",
    name: "Western Sahara"
  },
  {
    code: "YE",
    flag: "🇾🇪",
    dialCode: "+967",
    name: "Yemen"
  },
  {
    code: "ZM",
    flag: "🇿🇲",
    dialCode: "+260",
    name: "Zambia"
  },
  {
    code: "ZW",
    flag: "🇿🇼",
    dialCode: "+263",
    name: "Zimbabwe"
  },
  {
    code: "AX",
    flag: "🇦🇽",
    dialCode: "+358",
    name: "Åland Islands"
  }
];

export const flagsToSelectPhoneOptions = (
  flags: PhoneOption[]
): Array<Option["data"]> =>
  // @ts-expect-error slim-select expects `selected` to be a string, but if we send it as a string it doesn't work
  flags.map(({ name, code, dialCode, flag }) => ({
    text: name,
    value: code,
    selected: code === "US",
    html: `<span>${flag}</span><span>${name}</span><span class="brz-forms2__field-phone--option-code">${dialCode}</span>`
  }));
