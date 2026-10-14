# MODULE OWNERSHIP & TASK REGISTRY

This registry defines the explicit file and folder ownership boundaries for all 14 CRM modules.
Any worker (AI Agent or Human Developer) modifying files outside their exclusive assignment will trigger an architectural violation.

---

## 1. Central Reserved Files (Owner: Integration Lead)

| Path Pattern | Description | Assigned Owner | Status |
|---|---|---|---|
| `App.tsx`, `index.js` | Root Application Entry | Lead Integrator | Active |
| `src/app/**` | AppShell & Root Route Config | Lead Integrator | Active |
| `src/navigation/**` | Navigator, Navigation Context & Hooks | Lead Integrator | Active |
| `src/layout/**` | Desktop Layout, Sidebar, Header | Lead Integrator | Active |
| `src/shared/**` | Design Tokens, UI Kit, Common Types | Lead Integrator | Active |
| `package.json`, `package-lock.json` | Dependencies & Scripts | Lead Integrator | Locked |
| `windows/**` | Native Windows Project Files | Lead Integrator | Locked |
| `docs/**` | Architecture & Ownership Registry | Lead Integrator | Active |

---

## 2. Feature Modules Ownership Matrix

| # | Navigation Label | Section | Exclusive Path | Required Screen Export | Assigned Worker | Status |
|---|---|---|---|---|---|---|
| 1 | **Dashboard** | OVERVIEW | `src/modules/dashboard/**` | `DashboardScreen` | Worker 1 | Complete |
| 2 | **Global Search** | OVERVIEW | `src/modules/global-search/**` | `GlobalSearchScreen` | Worker 2 | Complete |
| 3 | **Customers** | SALES & CRM | `src/modules/customers/**` | `CustomersScreen` | Worker 3 | Complete |
| 4 | **Sales Orders** | SALES & CRM | `src/modules/sales-orders/**` | `SalesOrdersScreen` | Worker 4 | Complete |
| 5 | **Manual Billing** | SALES & CRM | `src/modules/manual-billing/**` | `ManualBillingScreen` | Worker 5 | Complete |
| 6 | **Invoices & Billing** | SALES & CRM | `src/modules/invoices-billing/**` | `InvoicesBillingScreen` | Worker 6 | Complete |
| 7 | **Payments** | SALES & CRM | `src/modules/payments/**` | `PaymentsScreen` | Worker 7 | Complete |
| 8 | **Follow-ups** | SALES & CRM | `src/modules/follow-ups/**` | `FollowUpsScreen` | Worker 8 | Complete |
| 9 | **WhatsApp Scheduler** | SALES & CRM | `src/modules/whatsapp-scheduler/**` | `WhatsAppSchedulerScreen` | Worker 9 | Complete |
| 10 | **Returns** | SALES & CRM | `src/modules/returns/**` | `ReturnsScreen` | Worker 10 | Complete |
| 11 | **POS — Goods Inward Scale** | WAREHOUSE & SUPPLY CHAIN | `src/modules/goods-inward/**` | `GoodsInwardScreen` | Worker 11 | Complete |
| 12 | **Products** | WAREHOUSE & SUPPLY CHAIN | `src/modules/products/**` | `ProductsScreen` | Worker 12 | Complete |
| 13 | **Notifications** | SYSTEM | `src/modules/notifications/**` | `NotificationsScreen` | Worker 13 | Complete |
| 14 | **Activity Log** | SYSTEM | `src/modules/activity-log/**` | `ActivityLogScreen` | Worker 14 | Complete |

---

## 3. Public Export Contract for Modules

Every module must contain an `index.ts` file that provides the required export:

```typescript
// src/modules/<module-folder>/index.ts
export { default as <ModuleName>Screen } from './<ModuleName>Screen';
export * from './types';
```

The Central Navigator dynamically registers these screens through `src/app/routeConfig.ts`.
Module workers **must not** modify `src/app/routeConfig.ts` directly; the Lead Integrator registers new routes upon module PR review.

---

## 4. Scaling Team Size

To scale development:
1. **1 Worker**: Follows the sequential phase execution.
2. **2 - 4 Workers**: Group modules by section (e.g. Overview & System, Sales & Billing, Supply Chain).
3. **Up to 14 Workers**: Each worker receives exclusive write access to a single module directory in a dedicated Git branch.
4. **Sub-module division**: If a module expands (e.g. Sales Orders grows to have line-item editing and fulfillment), assign sub-directories (e.g., `src/modules/sales-orders/fulfillment/**`) to sub-workers.
