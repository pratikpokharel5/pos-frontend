<script setup lang="ts">
import {
  Store,
  Users,
  Clock3,
  Coffee,
  FileText,
  Sparkles,
  LineChart,
  BarChart3,
  CreditCard,
  ArrowRight,
  ReceiptText,
  ShieldCheck,
  ShoppingCart,
  PackageCheck,
} from "@lucide/vue";

import ProductPreview from "../components/ProductPreview.vue";

const auth = useAuthStore();

const appLink = computed(() => (auth.token ? "/dashboard" : "/login"));

const featureCards = [
  {
    icon: ShoppingCart,
    title: "Fast Counter Sales",
    detail:
      "Build invoices from catalog products or custom line items without slowing down the queue.",
  },
  {
    icon: CreditCard,
    title: "Cash And Online Payments",
    detail:
      "Track payment method, provider, reference, tax, discount, and invoice totals in one flow.",
  },
  {
    icon: BarChart3,
    title: "Daily Sales Clarity",
    detail:
      "See revenue, average sale value, payment breakdowns, and top products from the dashboard.",
  },
];

const audienceCards = [
  {
    icon: Store,
    title: "Retail Shops",
    detail:
      "Sell catalog items quickly, keep inactive products out of checkout, and find invoices later.",
  },
  {
    icon: Coffee,
    title: "Cafes And Counters",
    detail: "Handle walk-in orders, custom items, daily revenue, and mixed payment references.",
  },
  {
    icon: Sparkles,
    title: "Studios And Services",
    detail:
      "Create clean invoices for products, services, notes, customer details, and staff activity.",
  },
];

const capabilityRows = [
  {
    icon: PackageCheck,
    title: "Catalog Management",
    detail: "Products, SKUs, categories, status, descriptions, and protected admin editing.",
  },
  {
    icon: Users,
    title: "Customer Records",
    detail: "Names, phone numbers, email, address, notes, and walk-in customer support.",
  },
  {
    icon: FileText,
    title: "Invoice History",
    detail: "Search by invoice, customer, phone, product, status, or payment method.",
  },
  {
    icon: LineChart,
    title: "Owner Reports",
    detail: "Sales summaries, payment totals, tax, discount totals, and top products.",
  },
];

const workflowSteps = [
  "Add products, categories, and regular customers.",
  "Start a sale, select items, apply discounts, and collect payment.",
  "Collect cash or online payment with provider and reference details.",
  "Print a clean customer invoice as soon as the sale is saved.",
  "Review sales history, reports, and top products whenever you need them.",
];
</script>

<template>
  <main class="landing-page">
    <nav class="landing-nav" aria-label="Landing navigation">
      <div class="landing-nav-inner">
        <NuxtLink to="/" class="landing-brand">
          <span class="brand-mark">
            <ReceiptText :size="22" />
          </span>
          <strong>SalePoint</strong>
        </NuxtLink>

        <div class="landing-nav-links">
          <a href="#features">Features</a>
          <a href="#operators">Operators</a>
          <a href="#workflow">Workflow</a>
          <a href="#reports">Reports</a>
          <a href="#security">Security</a>
        </div>

        <NuxtLink :to="appLink" class="button landing-nav-action">
          {{ auth.token ? "Open Dashboard" : "Sign In" }}
        </NuxtLink>
      </div>
    </nav>

    <section class="landing-hero">
      <div class="landing-hero-copy">
        <p class="eyebrow">Cloud POS for small teams</p>
        <h1>SalePoint</h1>
        <p>
          A polished point of sale workspace for retailers, cafes, studios, and service counters
          that need fast invoices, controlled catalog management, and clear owner visibility at the
          end of every day.
        </p>

        <div class="landing-actions">
          <NuxtLink :to="appLink" class="primary-action landing-primary-action">
            {{ auth.token ? "Open Dashboard" : "Get Started" }}
            <ArrowRight :size="18" />
          </NuxtLink>
          <a href="#features" class="button">Explore Features</a>
        </div>
      </div>

      <ProductPreview />
    </section>

    <section class="landing-strip" aria-label="SalePoint highlights">
      <div>
        <strong>1-minute checkout</strong>
        <span>Optimized sale entry for counter staff.</span>
      </div>
      <div>
        <strong>Live catalog</strong>
        <span>Products, categories, customers, and status controls.</span>
      </div>
      <div>
        <strong>Built-in reporting</strong>
        <span>Revenue, payments, tax, discounts, and best sellers.</span>
      </div>
    </section>

    <section class="landing-section" id="features">
      <div class="landing-section-head">
        <p class="eyebrow">Everything at the counter</p>
        <h2>Run sales without stitching tools together.</h2>
        <p>
          SalePoint focuses on the boring-but-critical work that has to feel effortless during a
          rush: finding products, building invoices, collecting payment, and keeping records tidy.
        </p>
      </div>

      <div class="landing-feature-grid">
        <article
          v-for="{ icon: Icon, title, detail } in featureCards"
          :key="title"
          class="landing-feature-card"
        >
          <span>
            <component :is="Icon" :size="20" />
          </span>
          <h3>{{ title }}</h3>
          <p>{{ detail }}</p>
        </article>
      </div>
    </section>

    <section class="landing-section landing-operators" id="operators">
      <div class="landing-section-head">
        <p class="eyebrow">Built for real counters</p>
        <h2>Flexible enough for products, services, and walk-ins.</h2>
      </div>

      <div class="landing-audience-grid">
        <article v-for="{ icon: Icon, title, detail } in audienceCards" :key="title">
          <span>
            <component :is="Icon" :size="21" />
          </span>
          <h3>{{ title }}</h3>
          <p>{{ detail }}</p>
        </article>
      </div>
    </section>

    <section class="landing-section landing-workflow" id="workflow">
      <div>
        <p class="eyebrow">Workflow</p>
        <h2>From catalog setup to invoice history.</h2>
        <p>
          SalePoint keeps the everyday POS loop deliberately compact, while still giving owners
          enough control to audit, manage, and report.
        </p>
      </div>

      <div class="landing-workflow-list">
        <div v-for="(step, index) in workflowSteps" :key="step">
          <strong>{{ index + 1 }}</strong>
          <span>{{ step }}</span>
        </div>
      </div>
    </section>

    <section class="landing-section landing-command" id="reports">
      <div class="landing-command-panel">
        <div class="landing-command-copy">
          <p class="eyebrow">Operations view</p>
          <h2>Know what happened today before closing the register.</h2>
          <p>
            The dashboard and reports give owners a quick read on revenue, payment mix, discounts,
            tax, recent invoices, and best-selling items without exporting spreadsheets first.
          </p>
        </div>

        <div class="landing-command-grid">
          <div class="landing-command-stat is-large">
            <span>Revenue Today</span>
            <strong>Rs. 94,920</strong>
            <small>12 invoices completed</small>
          </div>
          <div class="landing-command-stat">
            <span>Cash</span>
            <strong>Rs. 51,320</strong>
          </div>
          <div class="landing-command-stat">
            <span>Online</span>
            <strong>Rs. 43,600</strong>
          </div>
          <div class="landing-command-list">
            <span>Top products</span>
            <div>
              <strong>Dell Inspiron 15</strong>
              <small>Rs. 85,000</small>
            </div>
            <div>
              <strong>Milk Coffee</strong>
              <small>18 sold</small>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="landing-section landing-capabilities">
      <div class="landing-section-head">
        <p class="eyebrow">Back office without bloat</p>
        <h2>The management tools a small POS actually needs.</h2>
      </div>

      <div class="landing-capability-list">
        <article v-for="{ icon: Icon, title, detail } in capabilityRows" :key="title">
          <component :is="Icon" :size="20" />
          <div>
            <h3>{{ title }}</h3>
            <p>{{ detail }}</p>
          </div>
        </article>
      </div>
    </section>

    <section class="landing-section landing-security" id="security">
      <div class="landing-security-copy">
        <p class="eyebrow">Control</p>
        <h2>Keep staff focused and owner controls protected.</h2>
        <p>
          Role-aware navigation keeps reporting, settings, user management, and write access in
          admin hands while staff can focus on checkout.
        </p>
      </div>

      <div class="landing-security-grid">
        <div>
          <ShieldCheck :size="22" />
          <strong>Secure Sign-In</strong>
          <span>Only signed-in team members can access your sales workspace.</span>
        </div>
        <div>
          <Users :size="22" />
          <strong>Admin And Staff Roles</strong>
          <span>Separate daily counter workflows from owner tools.</span>
        </div>
        <div>
          <Clock3 :size="22" />
          <strong>Auditable Sales History</strong>
          <span>Search invoices, review payments, and void sales.</span>
        </div>
      </div>
    </section>

    <section class="landing-final-cta">
      <div>
        <p class="eyebrow">Ready for the counter</p>
        <h2>Open SalePoint and start with the workflows your team already uses.</h2>
      </div>
      <NuxtLink :to="appLink" class="primary-action landing-primary-action">
        {{ auth.token ? "Go To Dashboard" : "Sign In To SalePoint" }}
        <ArrowRight :size="18" />
      </NuxtLink>
    </section>

    <footer class="landing-footer">
      <NuxtLink to="/" class="landing-brand">
        <span class="brand-mark">
          <ReceiptText :size="20" />
        </span>
        <strong>SalePoint</strong>
      </NuxtLink>

      <span>Built for small business counters.</span>

      <a href="https://precene.com" rel="noreferrer" target="_blank"> Precene Technologies </a>
    </footer>
  </main>
</template>

<style>
.landing-page {
  min-height: 100vh;
  background:
    linear-gradient(145deg, rgba(96, 165, 250, 0.16), transparent 38%),
    linear-gradient(225deg, rgba(20, 184, 166, 0.14), transparent 34%), var(--color-bg);
}

.landing-page .button,
.landing-page .primary-action {
  border: 1px solid var(--color-line-strong);
  border-radius: var(--radius-app);
  background: var(--color-surface);
  color: var(--color-text);
  min-height: 40px;
  padding: 8px 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  text-decoration: none;
  font-weight: 800;
}

.landing-page .button:hover,
.landing-page .primary-action:hover {
  border-color: var(--color-primary);
}

.landing-page .primary-action {
  border-color: var(--color-primary);
  background: var(--color-primary);
  color: #ffffff;
}

.landing-page .primary-action:hover {
  background: var(--color-primary-strong);
  color: #ffffff;
}

.brand-mark {
  width: 38px;
  height: 38px;
  border-radius: var(--radius-app);
  display: grid;
  color: white;
  place-items: center;
  background: linear-gradient(135deg, #3b82f6, #14b8a6);
}

.eyebrow {
  margin: 0 0 3px;
  color: var(--color-primary);
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.landing-nav {
  min-height: 76px;
  width: 100%;
  position: sticky;
  top: 0;
  z-index: 10;
  backdrop-filter: blur(14px);
}

.landing-nav-inner {
  width: min(1180px, calc(100% - 32px));
  min-height: 76px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 20px;
}

.landing-brand {
  color: var(--color-text);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.landing-brand strong {
  font-size: 1.02rem;
}

.landing-nav-links {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 18px;
}

.landing-nav-links a {
  color: var(--color-muted);
  text-decoration: none;
  font-size: 0.88rem;
  font-weight: 800;
}

.landing-nav-links a:hover {
  color: var(--color-text);
}

.landing-nav-action {
  box-shadow: none;
}

.landing-hero {
  width: min(1180px, calc(100% - 32px));
  min-height: calc(100vh - 76px);
  margin: 0 auto;
  padding: 42px 0 56px;
  display: grid;
  grid-template-columns: minmax(0, 0.95fr) minmax(380px, 1.05fr);
  align-items: center;
  gap: 42px;
}

.landing-hero-copy h1 {
  margin: 0;
  font-size: clamp(3.8rem, 8vw, 7.2rem);
  line-height: 0.92;
  letter-spacing: 0;
}

.landing-hero-copy > p:not(.eyebrow) {
  max-width: 650px;
  margin: 22px 0 0;
  color: var(--color-muted);
  font-size: 1.08rem;
  line-height: 1.7;
}

.landing-actions {
  margin-top: 28px;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.landing-primary-action {
  min-height: 46px;
  padding-inline: 16px;
}

.landing-product-preview {
  border: 1px solid var(--color-line-strong);
  border-radius: var(--radius-app);
  overflow: hidden;
  background: var(--color-surface);
  box-shadow: 0 28px 80px rgba(0, 0, 0, 0.38);
}

.landing-preview-topbar {
  min-height: 48px;
  border-bottom: 1px solid var(--color-line);
  padding: 12px 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.landing-preview-topbar div {
  display: flex;
  gap: 6px;
}

.landing-preview-topbar span {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: var(--color-line-strong);
}

.landing-preview-topbar strong {
  font-size: 0.82rem;
  color: var(--color-muted);
}

.landing-preview-body {
  display: grid;
  grid-template-columns: 154px minmax(0, 1fr);
}

.landing-preview-body aside {
  border-right: 1px solid var(--color-line);
  padding: 14px;
  background: var(--color-sidebar);
  display: grid;
  align-content: start;
  gap: 8px;
}

.landing-preview-logo,
.landing-preview-body aside span {
  min-height: 34px;
  display: flex;
  align-items: center;
  gap: 9px;
}

.landing-preview-logo {
  margin-bottom: 12px;
  color: var(--color-text);
  font-weight: 900;
}

.landing-preview-body aside span {
  border-radius: var(--radius-app);
  padding: 8px;
  color: #cbd5e1;
  font-size: 0.78rem;
  font-weight: 800;
}

.landing-preview-body aside span.is-active {
  background: var(--color-sidebar-soft);
  color: #ffffff;
}

.landing-preview-body section {
  padding: 18px;
  display: grid;
  gap: 14px;
}

.landing-preview-search {
  min-height: 40px;
  border: 1px solid var(--color-line);
  border-radius: var(--radius-app);
  padding: 9px 11px;
  color: var(--color-muted);
  background: var(--color-surface-soft);
  display: flex;
  align-items: center;
  gap: 9px;
  font-size: 0.82rem;
  font-weight: 800;
}

.landing-preview-summary {
  border: 1px solid var(--color-line);
  border-radius: var(--radius-app);
  padding: 16px;
  background: var(--color-surface-soft);
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
}

.landing-preview-summary small {
  display: block;
  color: var(--color-muted);
  font-weight: 800;
}

.landing-preview-summary strong {
  display: block;
  margin-top: 6px;
  font-size: 1.8rem;
}

.landing-preview-summary svg {
  color: var(--color-success);
}

.landing-preview-table {
  display: grid;
  gap: 10px;
}

.landing-preview-table div {
  border: 1px solid var(--color-line);
  border-radius: var(--radius-app);
  padding: 12px;
  display: flex;
  justify-content: space-between;
  gap: 12px;
  background: color-mix(in srgb, var(--color-surface-soft) 74%, transparent);
}

.landing-preview-table span {
  color: var(--color-muted);
}

.landing-preview-table strong {
  text-align: right;
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  gap: 6px;
}

.landing-preview-body button {
  min-height: 42px;
  border: 0;
  border-radius: var(--radius-app);
  padding: 10px 14px;
  background: var(--color-primary);
  color: #ffffff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-weight: 900;
}

.landing-strip,
.landing-section {
  width: min(1180px, calc(100% - 32px));
  margin: 0 auto;
}

.landing-strip {
  border-block: 1px solid var(--color-line);
  padding: 42px 0;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
}

.landing-strip div {
  display: grid;
  gap: 5px;
}

.landing-strip strong {
  font-size: 1rem;
}

.landing-strip span {
  color: var(--color-muted);
  line-height: 1.5;
}

.landing-section {
  padding: 118px 0;
}

.landing-section-head {
  max-width: 700px;
}

.landing-section h2 {
  margin: 0;
  font-size: clamp(2rem, 4vw, 3.2rem);
  line-height: 1.05;
  letter-spacing: 0;
}

.landing-section p:not(.eyebrow) {
  color: var(--color-muted);
  line-height: 1.7;
}

.landing-feature-grid {
  margin-top: 28px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

.landing-feature-card {
  border: 1px solid var(--color-line);
  border-radius: var(--radius-app);
  padding: 18px;
  background: var(--color-surface);
  box-shadow: var(--shadow-app);
  transition:
    transform 160ms ease,
    border-color 160ms ease;
}

.landing-feature-card:hover,
.landing-audience-grid article:hover,
.landing-capability-list article:hover {
  border-color: var(--color-primary);
  transform: translateY(-2px);
}

.landing-feature-card > span {
  width: 42px;
  height: 42px;
  border-radius: var(--radius-app);
  display: grid;
  place-items: center;
  background: var(--color-primary-soft);
  color: var(--color-primary-strong);
}

.landing-feature-card h3 {
  margin: 18px 0 8px;
  font-size: 1.06rem;
}

.landing-feature-card p {
  margin: 0;
}

.landing-operators {
  border-top: 1px solid var(--color-line);
}

.landing-audience-grid {
  margin-top: 28px;
  display: grid;
  grid-template-columns: 1.2fr 1fr 1fr;
  gap: 14px;
}

.landing-audience-grid article {
  min-height: 210px;
  border: 1px solid var(--color-line);
  border-radius: var(--radius-app);
  padding: 20px;
  background:
    linear-gradient(
      180deg,
      color-mix(in srgb, var(--color-primary-soft) 34%, transparent),
      transparent
    ),
    var(--color-surface);
  box-shadow: var(--shadow-app);
  display: grid;
  align-content: end;
  transition:
    transform 160ms ease,
    border-color 160ms ease;
}

.landing-audience-grid article > span {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-app);
  margin-bottom: 18px;
  background: var(--color-primary-soft);
  color: var(--color-primary-strong);
  display: grid;
  place-items: center;
}

.landing-audience-grid h3 {
  margin: 0 0 8px;
  font-size: 1.25rem;
}

.landing-audience-grid p {
  margin: 0;
}

.landing-workflow,
.landing-security {
  display: grid;
  grid-template-columns: minmax(0, 0.88fr) minmax(360px, 1.12fr);
  gap: 32px;
  align-items: start;
}

.landing-workflow-list {
  display: grid;
  gap: 12px;
}

.landing-workflow-list div,
.landing-security-grid div {
  border: 1px solid var(--color-line);
  border-radius: var(--radius-app);
  background: var(--color-surface);
  box-shadow: var(--shadow-app);
}

.landing-workflow-list div {
  padding: 16px;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 14px;
  align-items: start;
}

.landing-workflow-list strong {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-app);
  background: var(--color-success-soft);
  color: var(--color-success);
  display: grid;
  place-items: center;
}

.landing-workflow-list span,
.landing-security-grid span {
  color: var(--color-muted);
  line-height: 1.55;
}

.landing-command {
  padding-top: 72px;
}

.landing-command-panel {
  border: 1px solid var(--color-line);
  border-radius: var(--radius-app);
  padding: 22px;
  background:
    linear-gradient(
      135deg,
      color-mix(in srgb, var(--color-primary-soft) 45%, transparent),
      transparent 46%
    ),
    var(--color-surface);
  box-shadow: var(--shadow-app);
  display: grid;
  grid-template-columns: minmax(0, 0.8fr) minmax(360px, 1.2fr);
  gap: 24px;
  align-items: center;
}

.landing-command-copy h2 {
  margin: 0;
  font-size: clamp(1.9rem, 4vw, 3rem);
  line-height: 1.05;
}

.landing-command-copy p:not(.eyebrow) {
  margin-bottom: 0;
}

.landing-command-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.landing-command-stat,
.landing-command-list {
  border: 1px solid var(--color-line);
  border-radius: var(--radius-app);
  padding: 15px;
  background: color-mix(in srgb, var(--color-surface-soft) 76%, transparent);
}

.landing-command-stat.is-large {
  grid-column: 1 / -1;
}

.landing-command-stat span,
.landing-command-stat small,
.landing-command-list > span,
.landing-command-list small {
  color: var(--color-muted);
}

.landing-command-stat span,
.landing-command-list > span {
  display: block;
  font-size: 0.82rem;
  font-weight: 900;
}

.landing-command-stat strong {
  display: block;
  margin: 8px 0 4px;
  font-size: 1.45rem;
}

.landing-command-stat.is-large strong {
  font-size: 2.15rem;
}

.landing-command-list {
  grid-column: 1 / -1;
  display: grid;
  gap: 10px;
}

.landing-command-list div {
  border-top: 1px solid var(--color-line);
  padding-top: 10px;
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.landing-capabilities {
  padding-top: 72px;
}

.landing-capability-list {
  margin-top: 28px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.landing-capability-list article {
  border: 1px solid var(--color-line);
  border-radius: var(--radius-app);
  padding: 16px;
  background: var(--color-surface);
  box-shadow: var(--shadow-app);
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 12px;
  transition:
    transform 160ms ease,
    border-color 160ms ease;
}

.landing-capability-list svg {
  color: var(--color-primary-strong);
}

.landing-capability-list h3 {
  margin: 0 0 5px;
  font-size: 1rem;
}

.landing-capability-list p {
  margin: 0;
}

.landing-security {
  border-top: 1px solid var(--color-line);
}

.landing-security-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.landing-security-grid div {
  min-height: 190px;
  padding: 16px;
  display: grid;
  align-content: start;
  gap: 10px;
}

.landing-security-grid svg {
  color: var(--color-primary-strong);
}

.landing-security-grid strong {
  font-size: 1rem;
}

.landing-final-cta {
  width: min(1180px, calc(100% - 32px));
  margin: 0 auto;
  border-top: 1px solid var(--color-line);
  padding: 92px 0 104px;
  display: flex;
  justify-content: space-between;
  gap: 24px;
  align-items: center;
}

.landing-final-cta h2 {
  max-width: 760px;
  margin: 0;
  font-size: clamp(1.9rem, 4vw, 3.2rem);
  line-height: 1.05;
}

.landing-footer {
  width: min(1180px, calc(100% - 32px));
  margin: 0 auto;
  border-top: 1px solid var(--color-line);
  padding: 22px 0 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  color: var(--color-muted);
}

.landing-footer a {
  color: var(--color-muted);
  text-decoration: none;
  font-size: 0.86rem;
  font-weight: 800;
}

.landing-footer a:hover {
  color: var(--color-text);
}

.landing-footer > span {
  font-size: 0.86rem;
  font-weight: 800;
}

@media (max-width: 1080px) {
  .landing-hero,
  .landing-feature-grid,
  .landing-audience-grid,
  .landing-workflow,
  .landing-security,
  .landing-security-grid,
  .landing-command-panel,
  .landing-capability-list {
    grid-template-columns: 1fr 1fr;
  }

  .landing-hero {
    min-height: auto;
    padding-top: 32px;
  }

  .landing-workflow,
  .landing-security {
    align-items: stretch;
  }

  .landing-final-cta {
    align-items: flex-start;
    display: grid;
  }
}

@media (max-width: 760px) {
  .landing-hero,
  .landing-strip,
  .landing-feature-grid,
  .landing-audience-grid,
  .landing-workflow,
  .landing-security,
  .landing-security-grid,
  .landing-command-panel,
  .landing-command-grid,
  .landing-capability-list {
    grid-template-columns: 1fr;
  }

  .landing-nav {
    min-height: 68px;
  }

  .landing-nav-inner {
    min-height: 68px;
  }

  .landing-nav-links {
    display: none;
  }

  .landing-nav-action {
    margin-left: auto;
  }

  .landing-hero {
    padding: 24px 0 42px;
  }

  .landing-hero-copy h1 {
    font-size: clamp(3.25rem, 19vw, 5rem);
  }

  .landing-product-preview {
    max-width: 100%;
  }

  .landing-preview-body {
    grid-template-columns: 1fr;
  }

  .landing-preview-body aside {
    border-right: 0;
    border-bottom: 1px solid var(--color-line);
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .landing-preview-logo {
    grid-column: 1 / -1;
  }

  .landing-section {
    padding: 72px 0;
  }

  .landing-command-panel {
    padding: 16px;
  }

  .landing-command-stat.is-large,
  .landing-command-list {
    grid-column: auto;
  }

  .landing-audience-grid article {
    min-height: 170px;
  }

  .landing-final-cta {
    padding: 68px 0 78px;
  }

  .landing-footer {
    display: grid;
    justify-items: start;
  }
}
</style>
