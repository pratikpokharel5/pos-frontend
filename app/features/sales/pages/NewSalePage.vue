<script setup lang="ts">
import * as v from "valibot";
import { Plus, Printer, RotateCcw, Save, Trash2 } from "@lucide/vue";

import { productsApi } from "~/features/products/api/productsApi";
import type { Product } from "~/features/products/types/productTypes";
import { customersApi } from "~/features/customers/api/customersApi";
import type { Customer } from "~/features/customers/types/customerTypes";
import { settingsApi } from "~/features/settings/api/settingsApi";
import type { BusinessSettings } from "~/features/settings/types/settingsTypes";
import { salesApi } from "../api/salesApi";
import type { CustomerMode, PaymentMethod, Sale } from "../types/saleTypes";
import type { NewCustomerForm, ProductLineForm } from "../types/saleFormTypes";
import {
  calculateSaleTotals,
  defaultTaxRate,
  lineGrandTotal,
  lineTotal,
  maxPercentValue,
  newProductLine,
} from "../utils/saleUtils";
import { saleFormSchema } from "../validations/saleValidation";

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
const paymentMethod = ref<PaymentMethod>("cash");
const provider = ref("");
const reference = ref("");
const notes = ref("");
const loading = ref(true);
const saving = ref(false);
const error = ref("");
const createdSale = ref<Sale | null>(null);

const taxEnabled = computed(() => Boolean(settings.value?.tax_enabled));
const totals = computed(() =>
  calculateSaleTotals(productLines.value, discount.value, taxRate.value),
);

onMounted(() => {
  loadSaleData();
});

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
  productLines.value = productLines.value.filter((line) => line.id !== id);
}

function resetForm() {
  customerMode.value = "walk-in";
  customerId.value = "";
  newCustomer.value = { name: "", phone: "" };
  productLines.value = [newProductLine()];
  discount.value = "0";
  taxRate.value = defaultTaxRate(settings.value);
  paymentMethod.value = "cash";
  provider.value = "";
  reference.value = "";
  notes.value = "";
  error.value = "";
  createdSale.value = null;
}

async function submit() {
  error.value = "";

  const result = v.safeParse(saleFormSchema, {
    customerMode: customerMode.value,
    customerId: customerId.value,
    newCustomer: newCustomer.value,
    productLines: productLines.value,
    discount: discount.value,
    taxRate: taxRate.value,
    taxEnabled: taxEnabled.value,
    paymentMethod: paymentMethod.value,
    provider: provider.value,
    reference: reference.value,
    notes: notes.value,
  });

  if (!result.success) {
    error.value = getFormValidationErrors(result.issues);
    return;
  }

  saving.value = true;

  try {
    const response = await salesApi.create(result.output);
    createdSale.value = response.data;
  } catch (err) {
    error.value = err instanceof Error ? err.message : "Unable to save sale.";
  } finally {
    saving.value = false;
  }
}
</script>

<template>
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

          <Button type="button" @click="resetForm">New Sale</Button>
        </div>
      </template>
    </PageHeader>

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
          <Button type="button" :disabled="saving" @click="resetForm">
            <RotateCcw :size="17" />
            Reset
          </Button>

          <Button type="submit" variant="primary" :disabled="saving">
            <Save :size="18" />
            Save Sale
          </Button>
        </div>
      </template>
    </PageHeader>

    <ErrorState class="mb-4" :message="error" v-if="error" />

    <FormFieldset :submitting="saving">
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
                class="md:col-span-1 md:justify-self-end"
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
              <p class="text-muted mt-1 mb-0 text-sm">Single payment for MVP.</p>
            </div>

            <div class="grid gap-3 p-4">
              <SelectField label="Method" v-model="paymentMethod">
                <option value="cash">Cash</option>
                <option value="online">Online</option>
              </SelectField>

              <InputField label="Provider" v-model="provider" />

              <InputField label="Reference" v-model="reference" />

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

              <TextareaField label="Notes" :rows="4" v-model="notes" />
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
            </div>
          </div>
        </aside>
      </section>
    </FormFieldset>
  </form>
</template>
