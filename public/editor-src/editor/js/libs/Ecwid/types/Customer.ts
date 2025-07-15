interface CommonData {
  successCb?: VoidFunction;
  errorCb?: VoidFunction;
}

export interface Address {
  name?: string;
  companyName?: string;
  street?: string;
  city?: string;
  countryName?: string;
  postalCode?: string;
  stateOrProvinceCode?: string;
  phone?: string;
}

export interface AddressData extends CommonData {
  address?: Address;
}

export interface EmailData extends CommonData {
  email: string;
}
