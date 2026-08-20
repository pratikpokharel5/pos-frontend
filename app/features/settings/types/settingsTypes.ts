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

export type BusinessSettingsForm = {
  business_name: string;
  logo: string;
  address: string;
  phone: string;
  email: string;
  tax_enabled: "yes" | "no";
  default_tax_rate: string;
  online_payment_enabled: "yes" | "no";
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
