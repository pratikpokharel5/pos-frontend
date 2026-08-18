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
    customerId?: string;
    newCustomer?: NewCustomerForm;
    discount?: string;
    taxRate?: string;
    paymentLines?: PaymentLineForm[];
  };
};
