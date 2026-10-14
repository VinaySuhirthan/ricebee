# 🌾 LaptopApp CRM — The Fun & Simple Guide

Hey! Welcome to **LaptopApp CRM**. 

Think of this app like a **giant digital command center** for a grain mill and superstore. It handles trucks coming in on the weighbridge scale, billing customers, tracking rice bags in the warehouse, and sending WhatsApp reminders!

---

## 🧸 The Toy Box: How the Folders Work (Explained Like Legos)

Imagine this whole app is a big Lego castle. Here is where all the pieces live:

```text
rice/
├── App.tsx             🚪 The Front Door (Turn on the app here)
├── docs/               📜 The Rulebook (Guides for multiple builders)
└── src/
    ├── app/            🧠 The Brain (Decides which room to show)
    ├── navigation/     🧭 The Map (Handles clicks and moves you between rooms)
    ├── layout/         🏰 The Castle Frame (Sidebar menu on the left, Top bar on the top)
    ├── shared/         🧱 The Lego Brick Box (Reusable buttons, cards, inputs, badges)
    └── modules/        🎪 The 14 Playrooms (Each feature has its own private room!)
```

---

## 🎪 The 14 Playrooms (`src/modules/`)

Each feature lives in its **own private room**. They don't touch each other's toys:

1. **`dashboard/`** 📊 = The big TV screen showing today's sales and live action.
2. **`global-search/`** 🔍 = The magnifying glass that searches everything in one click.
3. **`customers/`** 👥 = The address book of all buyers and their phone numbers.
4. **`sales-orders/`** 📋 = Orders waiting to be packed and put on trucks.
5. **`manual-billing/`** 🧾 = The cash register counter where you punch in bags and print receipts.
6. **`invoices-billing/`** 📄 = Official GST tax bills and government e-way passes.
7. **`payments/`** 💳 = Money coming in (Cash, UPI, Bank transfers).
8. **`follow-ups/`** 📅 = Sticky notes reminding you who to call today.
9. **`whatsapp-scheduler/`** 💬 = Robot that sends WhatsApp price lists and payment reminders.
10. **`returns/`** ↩️ = Broken or torn bags that got returned to the mill.
11. **`goods-inward/`** ⚖️ = The giant truck weighbridge scale (Gross weight vs Tare weight).
12. **`products/`** 📦 = All the rice varieties in the warehouse (Basmati, Kolam, Sonam).
13. **`notifications/`** 🔔 = Little alarm bells when something needs attention.
14. **`activity-log/`** ⏱️ = The security camera recording who did what.

---

## 🧱 The Lego Bricks (`src/shared/components/`)

Whenever you want to build something, **don't build from scratch**. Just grab these ready-made bricks:

* **`<AppButton title="Click Me!" />`** — A shiny button with hover effects and icons.
* **`<AppCard title="My Box">...</AppCard>`** — A sleek dark card to put stuff inside.
* **`<AppBadge label="PAID" variant="success" />`** — A colorful little pill badge (green, red, blue, orange).
* **`<AppInput placeholder="Type here..." />`** — A clean text box for typing.
* **`<AppTable columns={...} data={...} />`** — A desktop grid table with zebra stripes.
* **`<AppIcon name="scale" />`** — Instant crisp icons (scales, carts, users, bells).
* **`<PageHeader title="Hello" />`** — Top title banner with breadcrumbs.

---

## ✨ How to "Vibe Code" (Add a Feature in 3 Minutes)

"Vibe coding" means coding with zero stress! Here is the secret:

### 1. Pick the Room
Want to change the Customers page? Go straight to:
👉 `src/modules/customers/CustomersScreen.tsx`

### 2. Drop in a Lego Brick
Import whatever block you need:
```tsx
import { AppCard, AppButton, AppBadge } from '../../shared';
```

Then drop it in like magic:
```tsx
<AppCard title="Special Offer">
  <Text style={{ color: '#FFFFFF' }}>Get 10% off Basmati rice today!</Text>
  <AppButton title="Claim Offer" variant="primary" onPress={() => alert('Claimed!')} />
</AppCard>
```

### 3. Save & Look!
Hit **Save**. Metro will instantly show your new button on the screen. That's it!

---

## 🚀 How to Add a Brand New Screen (New Room)

Want to add a brand new room like **"Analytics"** or **"Staff"**? Follow these 3 baby steps:

1. **Make a new folder**: Create `src/modules/staff/`
2. **Create the screen**: Add `StaffScreen.tsx` and export it in `src/modules/staff/index.ts`:
   ```tsx
   export { default as StaffScreen } from './StaffScreen';
   ```
3. **Plug it into the Brain**:
   * Add the name in `src/navigation/navigationTypes.ts`
   * Add the component in `src/app/routeConfig.ts`
   * Add it to the sidebar list in `src/layout/Sidebar.tsx`

Boom! It automatically shows up on the sidebar and clicks right into your new room!

---

## ⚡ The Magic Commands (Terminal Spells)

Open your terminal inside the `rice/` folder:

* **`npm start`** 🟢 = Wakes up Metro (the app engine).
* **`npx tsc --noEmit`** 🔍 = Checks your spelling and types (0 errors = you're a genius).
* **`npm test`** 🧪 = Runs tests to prove the app loads properly.
* **`npm run lint`** 🧹 = Cleans up messy code and fixes indentation.

Enjoy building your dream CRM! 🚀
