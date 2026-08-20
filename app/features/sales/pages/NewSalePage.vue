<script setup lang="ts">
import * as v from "valibot";
import { Plus, Printer, RotateCcw, Save, Trash2 } from "@lucide/vue";

import { productsApi } from "~/features/products/api/productsApi";
import { customersApi } from "~/features/customers/api/customersApi";
import { settingsApi } from "~/features/settings/api/settingsApi";
import type { Product } from "~/features/products/types/productTypes";
import type { Customer } from "~/features/customers/types/customerTypes";
import type { BusinessSettings } from "~/features/settings/types/settingsTypes";
import { salesApi } from "../api/salesApi";
import type { CustomerMode, Sale } from "../types/saleTypes";
import type {
  HeldFormDetails,
  NewCustomerForm,
  PaymentLineForm,
  ProductLineForm,
} from "../types/saleFormTypes";
import {
  calculateSaleTotals,
  defaultTaxRate,
  lineGrandTotal,
  lineTotal,
  maxPercentValue,
  newPaymentLine,
  newProductLine,
  roundCurrency,
} from "../utils/saleUtils";
import { saleFormSchema } from "../validations/saleValidation";

import HeldSaleButtonGroup from "../components/HeldSaleButtonGroup.vue";
import HeldSaleDialog from "../components/HeldSaleDialog.vue";
import SaleInvoice from "../components/SaleInvoice.vue";

const products = ref<Product[]>([]);
const customers = ref<Customer[]>([]);
const settings = ref<BusinessSettings | null>(null);
const customerMode = ref<CustomerMode>("walk-in");
const customerId = ref("");
const newCustomer = ref<NewCustomerForm>({ name: "", phone: "" });
const productLines = ref<ProductLineForm[]>([newProductLine()]);
const discount = ref("0");
const taxRate = ref("0");
const paymentLines = ref<PaymentLineForm[]>([newPaymentLine()]);
const notes = ref("");
const loading = ref(true);
const saving = ref(false);
const holding = ref(false);
const error = ref("");
const success = ref("");
const createdSale = ref<Sale | null>(null);
const holdDialogOpen = ref(false);

const taxEnabled = computed(() => Boolean(settings.value?.tax_enabled));

const totals = computed(() =>
  calculateSaleTotals(productLines.value, discount.value, taxRate.value),
);

const paymentTotal = computed(() =>
  roundCurrency(paymentLines.value.reduce((sum, payment) => sum + numberValue(payment.amount), 0)),
);

const paymentBalance = computed(() => roundCurrency(totals.value.grandTotal - paymentTotal.value));

onMounted(() => {
  loadSaleData();
});

watch(
  () => totals.value.grandTotal,
  (grandTotal) => {
    const paymentLine = paymentLines.value[0];

    if (paymentLines.value.length === 1 && paymentLine) {
      paymentLine.amount = String(grandTotal);
    }
  },
);

async function loadSaleData() {
  try {
    const [productResponse, customerResponse, settingsResponse] = await Promise.all([
      productsApi.list({ status: "active", per_page: 200 }),
      customersApi.list({ status: "active", per_page: 200 }),
      settingsApi.get(),
    ]);

    products.value = productResponse.data;
    customers.value = customerResponse.data;
    settings.value = settingsResponse.data;

    taxRate.value = defaultTaxRate(settingsResponse.data);
  } catch (err) {
    error.value = err instanceof Error ? err.message : "Unable to load sale data.";
  } finally {
    loading.value = false;
  }
}

function updateProductLine(id: string, patch: Partial<ProductLineForm>) {
  productLines.value = productLines.value.map((line) =>
    line.id === id ? { ...line, ...patch } : line,
  );
}

function selectProduct(line: ProductLineForm, productId: string) {
  const product = products.value.find((item) => item.id === Number(productId));

  updateProductLine(line.id, {
    product_id: productId,
    item_name: product?.name ?? "",
    quantity: "1",
    unit_price: product?.price ?? "",
    discount_amount: "0",
    notes: "",
  });
}

function removeProductLine(id: string) {
  if (productLines.value.length === 1) {
    return;
  }

  productLines.value = productLines.value.filter((line) => line.id !== id);
}

function updatePaymentLine(id: string, patch: Partial<PaymentLineForm>) {
  paymentLines.value = paymentLines.value.map((line) =>
    line.id === id ? { ...line, ...patch } : line,
  );
}

function updatePaymentMethod(id: string, method: string) {
  if (method === "cash" || method === "online") {
    updatePaymentLine(id, { method });
  }
}

function addPaymentLine() {
  paymentLines.value.push(newPaymentLine());
}

function removePaymentLine(id: string) {
  paymentLines.value = paymentLines.value.filter((line) => line.id !== id);
}

function resetForm(message = "") {
  customerMode.value = "walk-in";
  customerId.value = "";
  newCustomer.value = { name: "", phone: "" };
  productLines.value = [newProductLine()];
  discount.value = "0";
  taxRate.value = defaultTaxRate(settings.value);
  paymentLines.value = [newPaymentLine()];
  notes.value = "";
  error.value = "";
  success.value = message;
  createdSale.value = null;
}

async function saveSale(status: "completed" | "held") {
  error.value = "";
  success.value = "";

  const result = v.safeParse(saleFormSchema, {
    customerMode: customerMode.value,
    customerId: customerId.value,
    newCustomer: newCustomer.value,
    productLines: productLines.value,
    discount: discount.value,
    taxRate: taxRate.value,
    taxEnabled: taxEnabled.value,
    saleStatus: status,
    paymentLines: paymentLines.value,
    notes: notes.value,
  });

  if (!result.success) {
    error.value = getFormValidationErrors(result.issues);
    return;
  }

  saving.value = status === "completed";
  holding.value = status === "held";

  try {
    const response = await salesApi.create(result.output);

    if (status === "completed") {
      createdSale.value = response.data;
      success.value = `Sale ${response.data.invoice_number} has been recorded.`;
      return;
    }

    resetForm(`Sale ${response.data.invoice_number} has been held.`);
  } catch (err) {
    error.value = err instanceof Error ? err.message : "Unable to save sale.";
  } finally {
    saving.value = false;
    holding.value = false;
  }
}

function submit() {
  saveSale("completed");
}

function holdSale() {
  saveSale("held");
}

function saleDiscountPercent(sale: Sale) {
  const subtotal = numberValue(sale.subtotal);

  if (subtotal <= 0) {
    return "0";
  }

  return String(roundCurrency((numberValue(sale.discount_amount) / subtotal) * 100));
}

function lineDiscountPercent(line: Sale["items"][number]) {
  const subtotal = numberValue(line.quantity) * numberValue(line.unit_price);

  if (subtotal <= 0) {
    return "0";
  }

  return String(roundCurrency((numberValue(line.discount_amount) / subtotal) * 100));
}

function textValue(value: string | null | undefined) {
  return value ?? "";
}

function restoreHeldSale(sale: Sale) {
  const formDetails = sale.additional_details as HeldFormDetails | null;
  const heldForm = formDetails?.held_form;

  if (sale.customer && !customers.value.some((customer) => customer.id === sale.customer?.id)) {
    customers.value.push(sale.customer);
  }

  customerMode.value = heldForm?.customerMode ?? (sale.customer_id ? "existing" : "walk-in");
  customerId.value =
    textValue(heldForm?.customerId) || (sale.customer_id ? String(sale.customer_id) : "");
  newCustomer.value = {
    name: textValue(heldForm?.newCustomer?.name),
    phone: textValue(heldForm?.newCustomer?.phone),
  };

  productLines.value = (sale.items ?? []).map((line) => ({
    id: randomReadableId("line-"),
    product_id: line.product_id ? String(line.product_id) : "",
    item_name: line.product_id ? "" : line.item_name,
    quantity: line.quantity,
    unit_price: line.unit_price,
    discount_amount: lineDiscountPercent(line),
    notes: line.notes ?? "",
  }));

  discount.value = textValue(heldForm?.discount) || saleDiscountPercent(sale);
  taxRate.value = textValue(heldForm?.taxRate) || sale.tax_rate;
  paymentLines.value = heldForm?.paymentLines?.length
    ? heldForm.paymentLines.map((payment) => ({
        id: payment.id ?? randomReadableId("payment-"),
        method: payment.method ?? "cash",
        amount: textValue(payment.amount),
        provider: textValue(payment.provider),
        reference: textValue(payment.reference),
      }))
    : (sale.payments ?? []).map((payment) => ({
        id: randomReadableId("payment-"),
        method: payment.method,
        amount: payment.amount,
        provider: payment.provider ?? "",
        reference: payment.transaction_reference ?? "",
      }));

  if (!productLines.value.length) {
    productLines.value = [newProductLine()];
  }

  if (!paymentLines.value.length) {
    paymentLines.value = [newPaymentLine(String(numberValue(sale.grand_total)))];
  }

  notes.value = sale.notes ?? "";
  error.value = "";
  success.value = `Sale ${sale.invoice_number} has been unheld.`;
  createdSale.value = null;
}
</script>

<template>
  <HeldSaleDialog v-model="holdDialogOpen" @resume="restoreHeldSale" />

  <LoadingState label="Loading Sale Screen..." v-if="loading" />

  <section v-else-if="createdSale">
    <PageHeader
      eyebrow="Invoice ready"
      :title="createdSale.invoice_number"
      description="The sale has been saved. Print this invoice for the customer."
    >
      <template #actions>
        <div class="flex flex-wrap gap-2.5">
          <Button :to="`/sales/${createdSale.id}/print`" variant="primary">
            <Printer :size="17" />
            Print
          </Button>

          <Button type="button" @click="resetForm()">New Sale</Button>
        </div>
      </template>
    </PageHeader>

    <Alert class="mb-4" variant="success" :message="success" auto-dismiss v-if="success" />

    <SaleInvoice :sale="createdSale" :settings="settings" />
  </section>

  <form @submit.prevent="submit" v-else>
    <PageHeader
      eyebrow="New Sale"
      title="Create Invoice"
      description="Select products or add custom items, choose payment, and save the sale."
    >
      <template #actions>
        <div class="flex flex-wrap gap-2.5">
          <Button type="button" :disabled="saving || holding" @click="resetForm()">
            <RotateCcw :size="17" />
            Reset
          </Button>

          <HeldSaleButtonGroup
            :disabled="saving || holding"
            @hold="holdSale"
            @view="holdDialogOpen = true"
          />

          <Button type="submit" variant="primary" :disabled="saving || holding">
            <Save :size="18" />
            {{ saving ? "Saving..." : "Save Sale" }}
          </Button>
        </div>
      </template>
    </PageHeader>

    <ErrorState class="mb-4" :message="error" v-if="error" />

    <Alert class="mb-4" variant="success" :message="success" auto-dismiss v-if="success" />

    <FormFieldset :submitting="saving || holding">
      <section class="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div class="rounded-app border-line bg-surface shadow-app border">
          <div class="border-line flex justify-between gap-3 border-b p-4 max-md:grid">
            <div>
              <h3 class="m-0 text-base font-black">Sale Items</h3>
              <p class="text-muted mt-1 mb-0 text-sm">
                Use catalog products or type a custom item name.
              </p>
            </div>

            <Button type="button" @click="productLines.push(newProductLine())">
              <Plus :size="17" />
              Add Item
            </Button>
          </div>

          <div class="grid gap-2.5 p-4">
            <div
              class="rounded-app border-line bg-surface-soft grid items-end gap-2.5 border p-3 md:grid-cols-12"
              v-for="line in productLines"
              :key="line.id"
            >
              <SelectField
                label="Item"
                class="md:col-span-5"
                :model-value="line.product_id"
                @update:model-value="selectProduct(line, $event)"
              >
                <option value="">Custom Item</option>
                <option v-for="product in products" :key="product.id" :value="String(product.id)">
                  {{ product.name }} - {{ money(product.price) }}
                </option>
              </SelectField>

              <InputField
                class="md:col-span-6"
                label="Custom Item Name"
                :disabled="Boolean(line.product_id)"
                :model-value="line.item_name"
                @update:model-value="updateProductLine(line.id, { item_name: $event })"
              />

              <Button
                type="button"
                size="icon"
                title="Remove item"
                class="md:col-span-1 md:justify-self-end"
                :disabled="productLines.length === 1"
                @click="removeProductLine(line.id)"
              >
                <span class="sr-only">Remove item</span>
                <Trash2 :size="16" />
              </Button>

              <InputField
                label="Qty"
                class="md:col-span-2"
                inputmode="decimal"
                :model-value="line.quantity"
                @update:model-value="updateProductLine(line.id, { quantity: $event })"
              />

              <InputField
                label="Unit Price"
                inputmode="decimal"
                class="md:col-span-2"
                :disabled="Boolean(line.product_id)"
                :model-value="line.unit_price"
                @update:model-value="updateProductLine(line.id, { unit_price: $event })"
              />

              <div class="md:col-span-3">
                <span class="text-text mb-1.5 block text-sm font-bold">Total</span>
                <div
                  class="border-line-strong rounded-app bg-surface text-text min-h-10 border px-2.5 py-2"
                >
                  {{ money(lineTotal(line)) }}
                </div>
              </div>

              <InputField
                class="md:col-span-2"
                label="Discount"
                inputmode="decimal"
                :model-value="line.discount_amount"
                @update:model-value="
                  updateProductLine(line.id, { discount_amount: maxPercentValue($event) })
                "
              />

              <div class="md:col-span-3">
                <span class="text-text mb-1.5 block text-sm font-bold">Grand Total</span>
                <div
                  class="border-line-strong rounded-app bg-surface text-text min-h-10 border px-2.5 py-2"
                >
                  {{ money(lineGrandTotal(line)) }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <aside class="grid gap-4">
          <div class="rounded-app border-line bg-surface shadow-app border">
            <div class="border-line border-b p-4">
              <h3 class="m-0 text-base font-black">Customer</h3>
              <p class="text-muted mt-1 mb-0 text-sm">Walk-in sales are supported.</p>
            </div>

            <div class="grid gap-3 p-4">
              <SelectField label="Customer type" v-model="customerMode">
                <option value="walk-in">Walk-In</option>
                <option value="existing">Existing Customer</option>
                <option value="new">New Customer</option>
              </SelectField>

              <SelectField label="Customer" v-model="customerId" v-if="customerMode === 'existing'">
                <option value="">Choose Customer</option>
                <option
                  v-for="customer in customers"
                  :key="customer.id"
                  :value="String(customer.id)"
                >
                  {{ customer.name }} {{ customer.phone ? `(${customer.phone})` : "" }}
                </option>
              </SelectField>

              <div class="grid gap-3 sm:grid-cols-2" v-if="customerMode === 'new'">
                <InputField label="Name" v-model="newCustomer.name" />
                <InputField label="Phone" inputmode="tel" v-model="newCustomer.phone" />
              </div>
            </div>
          </div>

          <div class="rounded-app border-line bg-surface shadow-app border">
            <div class="border-line border-b p-4">
              <h3 class="m-0 text-base font-black">Payment</h3>
              <p class="text-muted mt-1 mb-0 text-sm">Split payment across cash and online.</p>
            </div>

            <div class="grid gap-3 p-4">
              <div class="grid gap-2.5">
                <div
                  class="rounded-app border-line bg-surface-soft grid items-end gap-2.5 border p-3"
                  v-for="payment in paymentLines"
                  :key="payment.id"
                >
                  <div class="grid items-end gap-2.5 sm:grid-cols-[1fr_1fr_auto]">
                    <SelectField
                      label="Method"
                      :model-value="payment.method"
                      @update:model-value="updatePaymentMethod(payment.id, $event)"
                    >
                      <option value="cash">Cash</option>
                      <option value="online">Online</option>
                    </SelectField>

                    <InputField
                      label="Amount"
                      inputmode="decimal"
                      :model-value="payment.amount"
                      @update:model-value="updatePaymentLine(payment.id, { amount: $event })"
                    />

                    <Button
                      type="button"
                      size="icon"
                      title="Remove payment"
                      :disabled="paymentLines.length === 1"
                      @click="removePaymentLine(payment.id)"
                    >
                      <span class="sr-only">Remove payment</span>
                      <Trash2 :size="16" />
                    </Button>
                  </div>

                  <div class="grid gap-2.5 sm:grid-cols-2" v-if="payment.method === 'online'">
                    <InputField
                      label="Provider"
                      :model-value="payment.provider"
                      @update:model-value="updatePaymentLine(payment.id, { provider: $event })"
                    />

                    <InputField
                      label="Reference"
                      :model-value="payment.reference"
                      @update:model-value="updatePaymentLine(payment.id, { reference: $event })"
                    />
                  </div>
                </div>

                <Button type="button" @click="addPaymentLine">
                  <Plus :size="17" />
                  Add Payment
                </Button>
              </div>

              <div class="grid items-start gap-3 sm:grid-cols-2">
                <InputField
                  label="Sale Discount"
                  inputmode="decimal"
                  :model-value="discount"
                  @update:model-value="discount = maxPercentValue($event)"
                />

                <InputField
                  label="Tax Rate"
                  inputmode="decimal"
                  :disabled="!taxEnabled"
                  :model-value="taxRate"
                  @update:model-value="taxRate = maxPercentValue($event)"
                />
              </div>

              <Alert v-if="!taxEnabled">Tax disabled in settings.</Alert>

              <Textarea label="Notes" :rows="4" v-model="notes" />
            </div>
          </div>

          <div class="rounded-app border-line bg-surface shadow-app border">
            <div class="border-line border-b p-4">
              <h3 class="m-0 text-base font-black">Totals</h3>
              <p class="text-muted mt-1 mb-0 text-sm">Backend will recalculate on save.</p>
            </div>

            <div class="grid gap-2.5 p-4">
              <div class="flex justify-between gap-3">
                <span class="text-muted">Subtotal</span>
                <b>{{ money(totals.subtotal) }}</b>
              </div>

              <div class="flex justify-between gap-3">
                <span class="text-muted">Discount</span>
                <b>{{ money(totals.saleDiscount) }}</b>
              </div>

              <div class="flex justify-between gap-3">
                <span class="text-muted">Tax</span>
                <b>{{ money(totals.tax) }}</b>
              </div>

              <div class="border-line flex justify-between gap-3 border-t pt-2 text-lg">
                <span>Grand total</span>
                <strong>{{ money(totals.grandTotal) }}</strong>
              </div>

              <div class="flex justify-between gap-3">
                <span class="text-muted">Paid</span>
                <b>{{ money(paymentTotal) }}</b>
              </div>

              <div class="flex justify-between gap-3">
                <span class="text-muted">Balance</span>
                <b>{{ money(paymentBalance) }}</b>
              </div>
            </div>
          </div>
        </aside>
      </section>
    </FormFieldset>
  </form>
</template>
