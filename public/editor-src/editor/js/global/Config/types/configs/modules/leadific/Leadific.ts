export interface LeadificResponse {
  data: Array<LeadificFields>;
}

export interface LeadificFields {
  key: string;
  name: string;
  value: string;
}
