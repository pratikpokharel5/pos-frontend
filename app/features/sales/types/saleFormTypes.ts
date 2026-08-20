export type ProductLineForm = {
  id: string;
  product_id: string;
  item_name: string;
  quantity: string;
  unit_price: string;
  discount_amount: string;
  notes: string;
};

export type NewCustomerForm = {
  name: string;
  phone: string;
};

export type PaymentLineForm = {
  id: string;
  method: "cash" | "online";
  amount: string;
  provider: string;
  reference: string;
};

export type HeldFormDetails = {
  held_form?: {
    customerMode?: "walk-in" | "existing" | "new";
    customerId?: string | null;
    newCustomer?: {
      name?: string | null;
      phone?: string | null;
    };
    discount?: string | null;
    taxRate?: string | null;
    paymentLines?: Array<{
      id?: string | null;
      method?: "cash" | "online" | null;
      amount?: string | null;
      provider?: string | null;
      reference?: string | null;
    }>;
  };
};
