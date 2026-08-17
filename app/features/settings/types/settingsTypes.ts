export type BusinessSettings = {
  id: number;
  business_id: number;
  business_name: string;
  logo: string | null;
  address: string | null;
  phone: string;
  email: string | null;
  tax_enabled: boolean;
  default_tax_rate: number;
  online_payment_enabled: boolean;
};

export type BusinessSettingsPayload = {
  business_name: string;
  logo?: string | null;
  address?: string | null;
  phone: string;
  email?: string | null;
  tax_enabled?: boolean;
  default_tax_rate?: number;
  online_payment_enabled?: boolean;
};
