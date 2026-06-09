import { Str } from "@brizy/readers";
import { memoize } from "es-toolkit";
import { Option } from "slim-select";
import type { BoxResizerPartialProps } from "visual/component/BoxResizer/types";
import { checkValue } from "visual/utils/checkValue";
import { t } from "visual/utils/i18n";
import { makeAttr } from "visual/utils/i18n/attribute";
import { PhoneOption } from "./Form2Field/types/type";
import { ViewType } from "./Form2Steps/types";
import { MessageStatus, ResponseMessages } from "./types";

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

export const getBoxResizerParams = memoize(
  () =>
    ({
      points: ["centerLeft", "centerRight"],
      restrictions: {
        width: {
          "%": { min: 5, max: 100 }
        }
      }
    }) satisfies BoxResizerPartialProps
);

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
    dialCode: "+93",
    name: t("Afghanistan")
  },
  {
    code: "AL",
    dialCode: "+355",
    name: t("Albania")
  },
  {
    code: "DZ",
    dialCode: "+213",
    name: t("Algeria")
  },
  {
    code: "AS",
    dialCode: "+1684",
    name: t("American Samoa")
  },
  {
    code: "AD",
    dialCode: "+376",
    name: t("Andorra")
  },
  {
    code: "AO",
    dialCode: "+244",
    name: t("Angola")
  },
  {
    code: "AI",
    dialCode: "+1264",
    name: t("Anguilla")
  },
  {
    code: "AQ",
    dialCode: "+672",
    name: t("Antarctica")
  },
  {
    code: "AG",
    dialCode: "+1268",
    name: t("Antigua and Barbuda")
  },
  {
    code: "AR",
    dialCode: "+54",
    name: t("Argentina")
  },
  {
    code: "AM",
    dialCode: "+374",
    name: t("Armenia")
  },
  {
    code: "US",
    dialCode: "+1",
    name: t("United States")
  }
];

export const getFlags = (): PhoneOption[] => [
  {
    code: "AF",
    dialCode: "+93",
    name: "Afghanistan"
  },
  {
    code: "AL",
    dialCode: "+355",
    name: "Albania"
  },
  {
    code: "DZ",
    dialCode: "+213",
    name: "Algeria"
  },
  {
    code: "AS",
    dialCode: "+1684",
    name: "American Samoa"
  },
  {
    code: "AD",
    dialCode: "+376",
    name: "Andorra"
  },
  {
    code: "AO",
    dialCode: "+244",
    name: "Angola"
  },
  {
    code: "AI",
    dialCode: "+1264",
    name: "Anguilla"
  },
  {
    code: "AQ",
    dialCode: "+672",
    name: "Antarctica"
  },
  {
    code: "AG",
    dialCode: "+1268",
    name: "Antigua and Barbuda"
  },
  {
    code: "AR",
    dialCode: "+54",
    name: "Argentina"
  },
  {
    code: "AM",
    dialCode: "+374",
    name: "Armenia"
  },
  {
    code: "AW",
    dialCode: "+297",
    name: "Aruba"
  },
  {
    code: "AU",
    dialCode: "+61",
    name: "Australia"
  },
  {
    code: "AT",
    dialCode: "+43",
    name: "Austria"
  },
  {
    code: "AZ",
    dialCode: "+994",
    name: "Azerbaijan"
  },
  {
    code: "BS",
    dialCode: "+1242",
    name: "Bahamas"
  },
  {
    code: "BH",
    dialCode: "+973",
    name: "Bahrain"
  },
  {
    code: "BD",
    dialCode: "+880",
    name: "Bangladesh"
  },
  {
    code: "BB",
    dialCode: "+1246",
    name: "Barbados"
  },
  {
    code: "BY",
    dialCode: "+375",
    name: "Belarus"
  },
  {
    code: "BE",
    dialCode: "+32",
    name: "Belgium"
  },
  {
    code: "BZ",
    dialCode: "+501",
    name: "Belize"
  },
  {
    code: "BJ",
    dialCode: "+229",
    name: "Benin"
  },
  {
    code: "BM",
    dialCode: "+1441",
    name: "Bermuda"
  },
  {
    code: "BT",
    dialCode: "+975",
    name: "Bhutan"
  },
  {
    code: "BO",
    dialCode: "+591",
    name: "Bolivia, Plurinational State of"
  },
  {
    code: "BQ",
    dialCode: "+599",
    name: "Bonaire, Sint Eustatius and Saba"
  },
  {
    code: "BA",
    dialCode: "+387",
    name: "Bosnia and Herzegovina"
  },
  {
    code: "BW",
    dialCode: "+267",
    name: "Botswana"
  },
  {
    code: "BV",
    dialCode: "+47",
    name: "Bouvet Island"
  },
  {
    code: "BR",
    dialCode: "+55",
    name: "Brazil"
  },
  {
    code: "IO",
    dialCode: "+246",
    name: "British Indian Ocean Territory"
  },
  {
    code: "BN",
    dialCode: "+673",
    name: "Brunei Darussalam"
  },
  {
    code: "BG",
    dialCode: "+359",
    name: "Bulgaria"
  },
  {
    code: "BF",
    dialCode: "+226",
    name: "Burkina Faso"
  },
  {
    code: "BI",
    dialCode: "+257",
    name: "Burundi"
  },
  {
    code: "KH",
    dialCode: "+855",
    name: "Cambodia"
  },
  {
    code: "CM",
    dialCode: "+237",
    name: "Cameroon"
  },
  {
    code: "CA",
    dialCode: "+1",
    name: "Canada"
  },
  {
    code: "CV",
    dialCode: "+238",
    name: "Cape Verde"
  },
  {
    code: "KY",
    dialCode: "+1345",
    name: "Cayman Islands"
  },
  {
    code: "CF",
    dialCode: "+236",
    name: "Central African Republic"
  },
  {
    code: "TD",
    dialCode: "+235",
    name: "Chad"
  },
  {
    code: "CL",
    dialCode: "+56",
    name: "Chile"
  },
  {
    code: "CN",
    dialCode: "+86",
    name: "China"
  },
  {
    code: "CX",
    dialCode: "+61",
    name: "Christmas Island"
  },
  {
    code: "CC",
    dialCode: "+61",
    name: "Cocos (Keeling) Islands"
  },
  {
    code: "CO",
    dialCode: "+57",
    name: "Colombia"
  },
  {
    code: "KM",
    dialCode: "+269",
    name: "Comoros"
  },
  {
    code: "CG",
    dialCode: "+242",
    name: "Congo"
  },
  {
    code: "CD",
    dialCode: "+243",
    name: "Congo, the Democratic Republic of the"
  },
  {
    code: "CK",
    dialCode: "+682",
    name: "Cook Islands"
  },
  {
    code: "CR",
    dialCode: "+506",
    name: "Costa Rica"
  },
  {
    code: "HR",
    dialCode: "+385",
    name: "Croatia"
  },
  {
    code: "CU",
    dialCode: "+53",
    name: "Cuba"
  },
  {
    code: "CW",
    dialCode: "+599",
    name: "Curaçao"
  },
  {
    code: "CY",
    dialCode: "+357",
    name: "Cyprus"
  },
  {
    code: "CZ",
    dialCode: "+420",
    name: "Czech Republic"
  },
  {
    code: "CI",
    dialCode: "+225",
    name: "Côte d’Ivoire"
  },
  {
    code: "DK",
    dialCode: "+45",
    name: "Denmark"
  },
  {
    code: "DJ",
    dialCode: "+253",
    name: "Djibouti"
  },
  {
    code: "DM",
    dialCode: "+1767",
    name: "Dominica"
  },
  {
    code: "DO",
    dialCode: "+1",
    name: "Dominican Republic"
  },
  {
    code: "EC",
    dialCode: "+593",
    name: "Ecuador"
  },
  {
    code: "EG",
    dialCode: "+20",
    name: "Egypt"
  },
  {
    code: "SV",
    dialCode: "+503",
    name: "El Salvador"
  },
  {
    code: "GQ",
    dialCode: "+240",
    name: "Equatorial Guinea"
  },
  {
    code: "ER",
    dialCode: "+291",
    name: "Eritrea"
  },
  {
    code: "EE",
    dialCode: "+372",
    name: "Estonia"
  },
  {
    code: "SZ",
    dialCode: "+268",
    name: "Eswatini"
  },
  {
    code: "ET",
    dialCode: "+251",
    name: "Ethiopia"
  },
  {
    code: "FK",
    dialCode: "+500",
    name: "Falkland Islands (Malvinas)"
  },
  {
    code: "FO",
    dialCode: "+298",
    name: "Faroe Islands"
  },
  {
    code: "FJ",
    dialCode: "+679",
    name: "Fiji"
  },
  {
    code: "FI",
    dialCode: "+358",
    name: "Finland"
  },
  {
    code: "FR",
    dialCode: "+33",
    name: "France"
  },
  {
    code: "GF",
    dialCode: "+594",
    name: "French Guiana"
  },
  {
    code: "PF",
    dialCode: "+689",
    name: "French Polynesia"
  },
  {
    code: "TF",
    dialCode: "+262",
    name: "French Southern Territories"
  },
  {
    code: "GA",
    dialCode: "+241",
    name: "Gabon"
  },
  {
    code: "GM",
    dialCode: "+220",
    name: "Gambia"
  },
  {
    code: "GE",
    dialCode: "+995",
    name: "Georgia"
  },
  {
    code: "DE",
    dialCode: "+49",
    name: "Germany"
  },
  {
    code: "GH",
    dialCode: "+233",
    name: "Ghana"
  },
  {
    code: "GI",
    dialCode: "+350",
    name: "Gibraltar"
  },
  {
    code: "GR",
    dialCode: "+30",
    name: "Greece"
  },
  {
    code: "GL",
    dialCode: "+299",
    name: "Greenland"
  },
  {
    code: "GD",
    dialCode: "+1473",
    name: "Grenada"
  },
  {
    code: "GP",
    dialCode: "+590",
    name: "Guadeloupe"
  },
  {
    code: "GU",
    dialCode: "+1671",
    name: "Guam"
  },
  {
    code: "GT",
    dialCode: "+502",
    name: "Guatemala"
  },
  {
    code: "GG",
    dialCode: "+44",
    name: "Guernsey"
  },
  {
    code: "GN",
    dialCode: "+224",
    name: "Guinea"
  },
  {
    code: "GW",
    dialCode: "+245",
    name: "Guinea-Bissau"
  },
  {
    code: "GY",
    dialCode: "+592",
    name: "Guyana"
  },
  {
    code: "HT",
    dialCode: "+509",
    name: "Haiti"
  },
  {
    code: "HM",
    dialCode: "+672",
    name: "Heard Island and McDonald Islands"
  },
  {
    code: "VA",
    dialCode: "+39",
    name: "Holy See (Vatican City State)"
  },
  {
    code: "HN",
    dialCode: "+504",
    name: "Honduras"
  },
  {
    code: "HK",
    dialCode: "+852",
    name: "Hong Kong"
  },
  {
    code: "HU",
    dialCode: "+36",
    name: "Hungary"
  },
  {
    code: "IS",
    dialCode: "+354",
    name: "Iceland"
  },
  {
    code: "IN",
    dialCode: "+91",
    name: "India"
  },
  {
    code: "ID",
    dialCode: "+62",
    name: "Indonesia"
  },
  {
    code: "IR",
    dialCode: "+98",
    name: "Iran"
  },
  {
    code: "IQ",
    dialCode: "+964",
    name: "Iraq"
  },
  {
    code: "IE",
    dialCode: "+353",
    name: "Ireland"
  },
  {
    code: "IM",
    dialCode: "+44",
    name: "Isle of Man"
  },
  {
    code: "IL",
    dialCode: "+972",
    name: "Israel"
  },
  {
    code: "IT",
    dialCode: "+39",
    name: "Italy"
  },
  {
    code: "JM",
    dialCode: "+1876",
    name: "Jamaica"
  },
  {
    code: "JP",
    dialCode: "+81",
    name: "Japan"
  },
  {
    code: "JE",
    dialCode: "+44",
    name: "Jersey"
  },
  {
    code: "JO",
    dialCode: "+962",
    name: "Jordan"
  },
  {
    code: "KZ",
    dialCode: "+7",
    name: "Kazakhstan"
  },
  {
    code: "KE",
    dialCode: "+254",
    name: "Kenya"
  },
  {
    code: "KI",
    dialCode: "+686",
    name: "Kiribati"
  },
  {
    code: "KW",
    dialCode: "+965",
    name: "Kuwait"
  },
  {
    code: "KG",
    dialCode: "+996",
    name: "Kyrgyzstan"
  },
  {
    code: "LA",
    dialCode: "+856",
    name: "Laos"
  },
  {
    code: "LV",
    dialCode: "+371",
    name: "Latvia"
  },
  {
    code: "LB",
    dialCode: "+961",
    name: "Lebanon"
  },
  {
    code: "LS",
    dialCode: "+266",
    name: "Lesotho"
  },
  {
    code: "LR",
    dialCode: "+231",
    name: "Liberia"
  },
  {
    code: "LY",
    dialCode: "+218",
    name: "Libya"
  },
  {
    code: "LI",
    dialCode: "+423",
    name: "Liechtenstein"
  },
  {
    code: "LT",
    dialCode: "+370",
    name: "Lithuania"
  },
  {
    code: "LU",
    dialCode: "+352",
    name: "Luxembourg"
  },
  {
    code: "MO",
    dialCode: "+853",
    name: "Macao"
  },
  {
    code: "MG",
    dialCode: "+261",
    name: "Madagascar"
  },
  {
    code: "MW",
    dialCode: "+265",
    name: "Malawi"
  },
  {
    code: "MY",
    dialCode: "+60",
    name: "Malaysia"
  },
  {
    code: "MV",
    dialCode: "+960",
    name: "Maldives"
  },
  {
    code: "ML",
    dialCode: "+223",
    name: "Mali"
  },
  {
    code: "MT",
    dialCode: "+356",
    name: "Malta"
  },
  {
    code: "MH",
    dialCode: "+692",
    name: "Marshall Islands"
  },
  {
    code: "MQ",
    dialCode: "+596",
    name: "Martinique"
  },
  {
    code: "MR",
    dialCode: "+222",
    name: "Mauritania"
  },
  {
    code: "MU",
    dialCode: "+230",
    name: "Mauritius"
  },
  {
    code: "YT",
    dialCode: "+262",
    name: "Mayotte"
  },
  {
    code: "MX",
    dialCode: "+52",
    name: "Mexico"
  },
  {
    code: "FM",
    dialCode: "+691",
    name: "Micronesia, Federated States of"
  },
  {
    code: "MD",
    dialCode: "+373",
    name: "Moldova, Republic of"
  },
  {
    code: "MC",
    dialCode: "+377",
    name: "Monaco"
  },
  {
    code: "MN",
    dialCode: "+976",
    name: "Mongolia"
  },
  {
    code: "ME",
    dialCode: "+382",
    name: "Montenegro"
  },
  {
    code: "MS",
    dialCode: "+1664",
    name: "Montserrat"
  },
  {
    code: "MA",
    dialCode: "+212",
    name: "Morocco"
  },
  {
    code: "MZ",
    dialCode: "+258",
    name: "Mozambique"
  },
  {
    code: "MM",
    dialCode: "+95",
    name: "Myanmar"
  },
  {
    code: "NA",
    dialCode: "+264",
    name: "Namibia"
  },
  {
    code: "NR",
    dialCode: "+674",
    name: "Nauru"
  },
  {
    code: "NP",
    dialCode: "+977",
    name: "Nepal"
  },
  {
    code: "NL",
    dialCode: "+31",
    name: "Netherlands"
  },
  {
    code: "NC",
    dialCode: "+687",
    name: "New Caledonia"
  },
  {
    code: "NZ",
    dialCode: "+64",
    name: "New Zealand"
  },
  {
    code: "NI",
    dialCode: "+505",
    name: "Nicaragua"
  },
  {
    code: "NE",
    dialCode: "+227",
    name: "Niger"
  },
  {
    code: "NG",
    dialCode: "+234",
    name: "Nigeria"
  },
  {
    code: "NU",
    dialCode: "+683",
    name: "Niue"
  },
  {
    code: "NF",
    dialCode: "+672",
    name: "Norfolk Island"
  },
  {
    code: "KP",
    dialCode: "+850",
    name: "North Korea"
  },
  {
    code: "MK",
    dialCode: "+389",
    name: "North Macedonia"
  },
  {
    code: "MP",
    dialCode: "+1670",
    name: "Northern Mariana Islands"
  },
  {
    code: "NO",
    dialCode: "+47",
    name: "Norway"
  },
  {
    code: "OM",
    dialCode: "+968",
    name: "Oman"
  },
  {
    code: "PK",
    dialCode: "+92",
    name: "Pakistan"
  },
  {
    code: "PW",
    dialCode: "+680",
    name: "Palau"
  },
  {
    code: "PS",
    dialCode: "+970",
    name: "Palestinian Territory"
  },
  {
    code: "PA",
    dialCode: "+507",
    name: "Panama"
  },
  {
    code: "PG",
    dialCode: "+675",
    name: "Papua New Guinea"
  },
  {
    code: "PY",
    dialCode: "+595",
    name: "Paraguay"
  },
  {
    code: "PE",
    dialCode: "+51",
    name: "Peru"
  },
  {
    code: "PH",
    dialCode: "+63",
    name: "Philippines"
  },
  {
    code: "PN",
    dialCode: "+64",
    name: "Pitcairn"
  },
  {
    code: "PL",
    dialCode: "+48",
    name: "Poland"
  },
  {
    code: "PT",
    dialCode: "+351",
    name: "Portugal"
  },
  {
    code: "PR",
    dialCode: "+1",
    name: "Puerto Rico"
  },
  {
    code: "QA",
    dialCode: "+974",
    name: "Qatar"
  },
  {
    code: "RO",
    dialCode: "+40",
    name: "Romania"
  },
  {
    code: "RU",
    dialCode: "+7",
    name: "Russia"
  },
  {
    code: "RW",
    dialCode: "+250",
    name: "Rwanda"
  },
  {
    code: "RE",
    dialCode: "+262",
    name: "Réunion"
  },
  {
    code: "BL",
    dialCode: "+590",
    name: "Saint Barthélemy"
  },
  {
    code: "SH",
    dialCode: "+290",
    name: "Saint Helena, Ascension and Tristan da Cunha"
  },
  {
    code: "KN",
    dialCode: "+1869",
    name: "Saint Kitts and Nevis"
  },
  {
    code: "LC",
    dialCode: "+1758",
    name: "Saint Lucia"
  },
  {
    code: "MF",
    dialCode: "+590",
    name: "Saint Martin (French part)"
  },
  {
    code: "PM",
    dialCode: "+508",
    name: "Saint Pierre and Miquelon"
  },
  {
    code: "VC",
    dialCode: "+1784",
    name: "Saint Vincent and the Grenadines"
  },
  {
    code: "WS",
    dialCode: "+685",
    name: "Samoa"
  },
  {
    code: "SM",
    dialCode: "+378",
    name: "San Marino"
  },
  {
    code: "ST",
    dialCode: "+239",
    name: "Sao Tome and Principe"
  },
  {
    code: "SA",
    dialCode: "+966",
    name: "Saudi Arabia"
  },
  {
    code: "SN",
    dialCode: "+221",
    name: "Senegal"
  },
  {
    code: "RS",
    dialCode: "+381",
    name: "Serbia"
  },
  {
    code: "SC",
    dialCode: "+248",
    name: "Seychelles"
  },
  {
    code: "SL",
    dialCode: "+232",
    name: "Sierra Leone"
  },
  {
    code: "SG",
    dialCode: "+65",
    name: "Singapore"
  },
  {
    code: "SX",
    dialCode: "+1721",
    name: "Sint Maarten (Dutch part)"
  },
  {
    code: "SK",
    dialCode: "+421",
    name: "Slovakia"
  },
  {
    code: "SI",
    dialCode: "+386",
    name: "Slovenia"
  },
  {
    code: "SB",
    dialCode: "+677",
    name: "Solomon Islands"
  },
  {
    code: "SO",
    dialCode: "+252",
    name: "Somalia"
  },
  {
    code: "ZA",
    dialCode: "+27",
    name: "South Africa"
  },
  {
    code: "GS",
    dialCode: "+500",
    name: "South Georgia and the South Sandwich Islands"
  },
  {
    code: "KR",
    dialCode: "+82",
    name: "South Korea"
  },
  {
    code: "SS",
    dialCode: "+211",
    name: "South Sudan"
  },
  {
    code: "ES",
    dialCode: "+34",
    name: "Spain"
  },
  {
    code: "LK",
    dialCode: "+94",
    name: "Sri Lanka"
  },
  {
    code: "SD",
    dialCode: "+249",
    name: "Sudan"
  },
  {
    code: "SR",
    dialCode: "+597",
    name: "Suriname"
  },
  {
    code: "SJ",
    dialCode: "+47",
    name: "Svalbard and Jan Mayen"
  },
  {
    code: "SE",
    dialCode: "+46",
    name: "Sweden"
  },
  {
    code: "CH",
    dialCode: "+41",
    name: "Switzerland"
  },
  {
    code: "SY",
    dialCode: "+963",
    name: "Syria"
  },
  {
    code: "TW",
    dialCode: "+886",
    name: "Taiwan"
  },
  {
    code: "TJ",
    dialCode: "+992",
    name: "Tajikistan"
  },
  {
    code: "TZ",
    dialCode: "+255",
    name: "Tanzania, United Republic of"
  },
  {
    code: "TH",
    dialCode: "+66",
    name: "Thailand"
  },
  {
    code: "TL",
    dialCode: "+670",
    name: "Timor-Leste"
  },
  {
    code: "TG",
    dialCode: "+228",
    name: "Togo"
  },
  {
    code: "TK",
    dialCode: "+690",
    name: "Tokelau"
  },
  {
    code: "TO",
    dialCode: "+676",
    name: "Tonga"
  },
  {
    code: "TT",
    dialCode: "+1868",
    name: "Trinidad and Tobago"
  },
  {
    code: "TN",
    dialCode: "+216",
    name: "Tunisia"
  },
  {
    code: "TM",
    dialCode: "+993",
    name: "Turkmenistan"
  },
  {
    code: "TC",
    dialCode: "+1649",
    name: "Turks and Caicos Islands"
  },
  {
    code: "TV",
    dialCode: "+688",
    name: "Tuvalu"
  },
  {
    code: "TR",
    dialCode: "+90",
    name: "Türkiye"
  },
  {
    code: "UG",
    dialCode: "+256",
    name: "Uganda"
  },
  {
    code: "UA",
    dialCode: "+380",
    name: "Ukraine"
  },
  {
    code: "AE",
    dialCode: "+971",
    name: "United Arab Emirates"
  },
  {
    code: "GB",
    dialCode: "+44",
    name: "United Kingdom"
  },
  {
    code: "US",
    dialCode: "+1",
    name: "United States"
  },
  {
    code: "UM",
    dialCode: "+1",
    name: "United States Minor Outlying Islands"
  },
  {
    code: "UY",
    dialCode: "+598",
    name: "Uruguay"
  },
  {
    code: "UZ",
    dialCode: "+998",
    name: "Uzbekistan"
  },
  {
    code: "VU",
    dialCode: "+678",
    name: "Vanuatu"
  },
  {
    code: "VE",
    dialCode: "+58",
    name: "Venezuela, Bolivarian Republic of"
  },
  {
    code: "VN",
    dialCode: "+84",
    name: "Vietnam"
  },
  {
    code: "VG",
    dialCode: "+1284",
    name: "Virgin Islands, British"
  },
  {
    code: "VI",
    dialCode: "+1340",
    name: "Virgin Islands, U.S."
  },
  {
    code: "WF",
    dialCode: "+681",
    name: "Wallis and Futuna"
  },
  {
    code: "EH",
    dialCode: "+212",
    name: "Western Sahara"
  },
  {
    code: "YE",
    dialCode: "+967",
    name: "Yemen"
  },
  {
    code: "ZM",
    dialCode: "+260",
    name: "Zambia"
  },
  {
    code: "ZW",
    dialCode: "+263",
    name: "Zimbabwe"
  },
  {
    code: "AX",
    dialCode: "+358",
    name: "Åland Islands"
  }
];

const normalizeFlagIconsCode = (code: string): string =>
  code.trim().toLowerCase();

/**
 * Returns the `flag-icons` CSS class for a given ISO country code.
 * Falls back to `xx` when code is missing/invalid.
 */
export const getFlagIconClass = (code: string): string => {
  const normalized = normalizeFlagIconsCode(code);
  const safe = /^[a-z0-9-]+$/.test(normalized) ? normalized : "";

  return `fi fi-${safe || "xx"}`;
};

export const flagsToSelectPhoneOptions = (
  flags: PhoneOption[]
): Array<Option["data"]> =>
  // @ts-expect-error slim-select expects `selected` to be a string, but if we send it as a string it doesn't work
  flags.map(({ name, code, dialCode }) => ({
    text: name,
    value: code,
    selected: code === "US",
    html: `<span class="${getFlagIconClass(code)}"></span><span>${name}</span><span class="brz-forms2__field-phone--option-code">${dialCode}</span>`
  }));
