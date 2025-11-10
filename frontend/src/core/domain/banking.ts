export interface BankEntry {
  id: number;
  ship_id: string;
  year: number;
  amount_gco2eq: number;
  created_at: Date;
}

export interface BankingSummary {
  records: BankEntry[];
  totalAvailable: number;
}