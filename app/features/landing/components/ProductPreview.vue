<template>
  <div class="landing-product-preview" aria-label="SalePoint product preview">
    <div class="landing-preview-topbar">
      <div>
        <span />
        <span />
        <span />
      </div>
      <strong>New Sale</strong>
    </div>

    <div class="landing-preview-body">
      <aside>
        <div class="landing-preview-logo">
          <ReceiptText :size="18" />
          <span>SalePoint</span>
        </div>
        <span class="is-active">
          <ShoppingCart :size="16" />
          New Sale
        </span>
        <span>
          <Layers3 :size="16" />
          Products
        </span>
        <span>
          <Tags :size="16" />
          Customers
        </span>
        <span>
          <Store :size="16" />
          Reports
        </span>
      </aside>

      <section>
        <div class="landing-preview-search">
          <Search :size="16" />
          <span>Search product, SKU, or customer</span>
        </div>

        <div class="landing-preview-summary">
          <div>
            <small>Grand total</small>
            <strong>Rs. 18,000</strong>
          </div>
          <Sparkles :size="20" />
        </div>

        <div class="landing-preview-table">
          <div>
            <span>Acoustic Guitar</span>
            <strong>Rs. 18,500</strong>
          </div>
          <div>
            <span>Sale Discount</span>
            <strong>- Rs. 500</strong>
          </div>
          <div>
            <span>Online Payment</span>
            <strong>
              <WalletCards :size="15" />
              Khalti
            </strong>
          </div>
        </div>

        <button type="button">
          Save Sale
          <ArrowRight :size="16" />
        </button>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ArrowRight,
  Layers3,
  ReceiptText,
  Search,
  ShoppingCart,
  Sparkles,
  Store,
  Tags,
  WalletCards,
} from "@lucide/vue";
</script>
