# LaptopApp CRM

LaptopApp CRM is a business management system for a grain mill and superstore. It brings the daily work of the business into one application:

- Recording trucks on the weighbridge scale (gross and tare weight)
- Creating bills and GST invoices for customers
- Tracking rice stock in the warehouse
- Recording payments (cash, UPI, bank transfer)
- Sending WhatsApp price lists and payment reminders

This guide explains how the project is organised and how to make changes with confidence, even if you are new to the codebase.

---

## Table of Contents

1. [Where You Need to Code](#1-where-you-need-to-code)
2. [Project Structure](#2-project-structure)
3. [Feature Modules](#3-feature-modules)
4. [Reusable Components](#4-reusable-components)
5. [Making Your First Change](#5-making-your-first-change)
6. [Adding a New Screen](#6-adding-a-new-screen)
7. [Useful Commands](#7-useful-commands)
8. [Good Habits](#8-good-habits)

---

## 1. Where You Need to Code

**You only need to write code inside `src/`.**
You do not need to open or edit the `windows/`, `android/`, or `ios/` folders for normal development work.

### Why is that?

This app is built with React Native. That means the app is split into two layers:

| Layer | Folders | What it is | Who edits it |
|-------|---------|------------|--------------|
| App layer | `src/` and `App.tsx` | All the screens, buttons, tables, forms, and business logic. | You, every day. |
| Native shell | `windows/`, `android/`, `ios/` | A thin wrapper that lets the app run on each operating system. | Almost never. |

An easy way to picture it is a television and the channels you watch.

- The **native shell** is the television set. It is built once, and it knows how to show a picture on that specific device. Windows, Android, and iOS each need their own set.
- The **`src/` folder** is the channel. It is the actual content. You can change the programme as often as you like without rebuilding the television.

When you save a file in `src/`, Metro (the development server) sends the updated code to the running app, and the screen refreshes. The native shell stays the same.

### What is inside the native folders?

- `windows/` holds the Windows desktop host project, its build settings, and its app manifest.
- `android/` holds the Android host project, Gradle build files, and the Android manifest.
- `ios/` holds the iOS host project, Xcode settings, and the Podfile.

These contain platform settings, signing details, and build configuration. They do not contain any of your business screens.

### When would you ever touch them?

Only for platform-level tasks, such as:

- Adding a library that includes native code (for example, a printer or Bluetooth scale library)
- Changing the app icon or splash screen
- Changing app permissions (camera, storage, network)
- Changing the app name, package name, or version for release
- Setting up signing keys for a production build
- Fixing a build error that comes from the native side

If your task is "add a button", "change a table", "build a new page", or "fix a calculation", it belongs in `src/`.

---

## 2. Project Structure

```text
rice/
├── App.tsx             Entry point. The app starts here.
├── docs/               Written guides for developers working together.
├── windows/            Native Windows shell. Rarely edited.
├── android/            Native Android shell. Rarely edited.
├── ios/                Native iOS shell. Rarely edited.
└── src/
    ├── app/            Decides which screen is shown.
    ├── navigation/     Handles movement between screens.
    ├── layout/         The fixed frame: sidebar on the left, top bar above.
    ├── shared/         Reusable building blocks (buttons, cards, inputs, badges).
    └── modules/        All business features. Each feature has its own folder.
```

### What each folder does

- **App.tsx** is the starting point. When the app launches, this file runs first.
- **docs/** holds guides so that several developers can work on the project without confusion.
- **src/app/** contains the logic that decides which screen to display at any moment.
- **src/navigation/** manages screen changes. When a user clicks a menu item, this code moves them to the right place.
- **src/layout/** is the permanent frame around every screen, including the sidebar menu and the top bar.
- **src/shared/** is the toolbox of reusable parts. If you need a button or a card, look here before building your own.
- **src/modules/** is where the real business features live. This is the folder you will work in most often.

---

## 3. Feature Modules

Every feature has its own folder inside `src/modules/`. Features stay separate from each other, so a change to one is much less likely to break another.

| # | Module | What it does |
|---|--------|--------------|
| 1 | `dashboard/` | Shows a summary of today's sales and live activity. |
| 2 | `global-search/` | Searches across the whole app from one search box. |
| 3 | `customers/` | Stores customer names, phone numbers, and details. |
| 4 | `sales-orders/` | Tracks orders that are waiting to be packed and dispatched. |
| 5 | `manual-billing/` | Lets staff enter items and quantities at the counter and print a receipt. |
| 6 | `invoices-billing/` | Creates official GST invoices and e-way bills. |
| 7 | `payments/` | Records money received by cash, UPI, or bank transfer. |
| 8 | `follow-ups/` | Reminds staff which customers to call today. |
| 9 | `whatsapp-scheduler/` | Sends price lists and payment reminders automatically on WhatsApp. |
| 10 | `returns/` | Handles damaged or torn bags returned to the mill. |
| 11 | `goods-inward/` | Records truck weights on the weighbridge (gross weight and tare weight). |
| 12 | `products/` | Lists all rice varieties and stock, such as Basmati, Kolam, and Sonam. |
| 13 | `notifications/` | Alerts users when something needs attention. |
| 14 | `activity-log/` | Keeps a record of who did what, and when. |

---

## 4. Reusable Components

The `src/shared/components/` folder contains ready-made parts that give the whole app a consistent look. Please use them instead of building new versions. This saves time and keeps the design uniform.

| Component | Purpose | Example |
|-----------|---------|---------|
| `AppButton` | A styled button with hover effects and optional icons. | `<AppButton title="Save" />` |
| `AppCard` | A dark card that groups related content together. | `<AppCard title="Summary">...</AppCard>` |
| `AppBadge` | A small coloured label for statuses. Variants include green, red, blue, and orange. | `<AppBadge label="PAID" variant="success" />` |
| `AppInput` | A text field for typing. | `<AppInput placeholder="Enter name" />` |
| `AppTable` | A table with columns and alternating row shading, built for desktop screens. | `<AppTable columns={...} data={...} />` |
| `AppIcon` | A set of icons such as scales, carts, users, and bells. | `<AppIcon name="scale" />` |
| `PageHeader` | A title bar at the top of a page, with breadcrumbs. | `<PageHeader title="Customers" />` |

---

## 5. Making Your First Change

Most changes follow the same three steps.

### Step 1: Find the right screen

Each module has a main screen file. To change the Customers page, open:

```text
src/modules/customers/CustomersScreen.tsx
```

### Step 2: Use a shared component

Import the components you need from the shared folder:

```tsx
import { AppCard, AppButton, AppBadge } from '../../shared';
```

Then place them inside your screen:

```tsx
<AppCard title="Special Offer">
  <Text style={{ color: '#FFFFFF' }}>Get 10% off Basmati rice today.</Text>
  <AppButton title="Claim Offer" variant="primary" onPress={() => alert('Claimed!')} />
</AppCard>
```

### Step 3: Save and check

Save the file. Metro refreshes the app automatically, and your change appears on screen. If nothing changes, check the terminal for error messages.

---

## 6. Adding a New Screen

Suppose you want to add a new feature, such as "Staff" or "Analytics". Here is the full process, using "Staff" as the example.

**1. Create a folder for the feature.**
Make a new folder at `src/modules/staff/`.

**2. Create the screen file and export it.**
Add `StaffScreen.tsx` inside that folder. Then create `src/modules/staff/index.ts` and add this line so other files can import your screen:

```tsx
export { default as StaffScreen } from './StaffScreen';
```

**3. Connect the screen to the app.**
The app needs to know your screen exists. Make three small updates:

- Add the screen name in `src/navigation/navigationTypes.ts`
- Add the screen component in `src/app/routeConfig.ts`
- Add a menu entry in `src/layout/Sidebar.tsx`

Once these are done, the new item appears in the sidebar, and clicking it opens your screen. Notice that every step above happens inside `src/`.

---

## 7. Useful Commands

Run these in a terminal, inside the `rice/` folder.

| Command | What it does | When to use it |
|---------|--------------|----------------|
| `npm start` | Starts Metro, the development server that runs the app. | At the start of every working session. |
| `npx tsc --noEmit` | Checks the code for type errors without producing any output files. | Before you commit. Zero errors is the goal. |
| `npm test` | Runs automated tests to confirm the app loads and works properly. | After making changes. |
| `npm run lint` | Finds and fixes style problems such as bad indentation. | Before you commit. |

---

## 8. Good Habits

- **Reuse before you build.** Check `src/shared/` first. Most common needs are already covered.
- **Keep features separate.** Work inside the module you are changing, and avoid editing other modules unless you have to.
- **Stay inside `src/`.** If you find yourself editing `windows/`, `android/`, or `ios/` for a normal feature, stop and double-check. It is usually not needed.
- **Check types often.** Running `npx tsc --noEmit` regularly catches mistakes early, when they are easy to fix.
- **Make small changes.** Small, focused changes are easier to test, review, and undo.

If you get stuck, look at an existing module that does something similar to what you need. Copying its structure is a perfectly good way to begin.

Happy building.
