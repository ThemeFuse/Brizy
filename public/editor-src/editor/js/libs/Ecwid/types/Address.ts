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

export interface AddressData {
  address?: Address;
  successCb?: VoidFunction;
  errorCb?: VoidFunction;
}
