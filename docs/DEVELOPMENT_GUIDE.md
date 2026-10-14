# DEVELOPMENT GUIDE: LAPTOPAPP CRM SKELETON

## 1. Architecture Overview

LaptopApp is a modular desktop CRM skeleton built with **React Native Windows** and **TypeScript**.
The project is engineered for **multi-agent parallel development** and **multi-developer teams**, ensuring zero file conflicts, clear contract boundaries, and clean separation of concerns.

### Tech Stack
- **Framework**: React Native 0.74.5 / React Native Windows 0.74.59
- **Language**: TypeScript 5.0 (strict typings, no `any`)
- **State & Navigation**: Native typed State-Driven Desktop Navigation with History & Parameter Passing
- **Styling**: Centralized Theme System (Tokens for Colors, Spacing, Typography, Radii, Shadows)
- **Component Model**: Atomic Shared UI Kit + Isolated Autonomous Modules

---

## 2. Directory Structure & Boundary Rules

```text
rice/ (Project Root)
├── docs/
│   ├── DEVELOPMENT_GUIDE.md      # This guide
│   └── MODULE_OWNERSHIP.md       # Ownership matrix & contract specifications
├── src/
│   ├── app/                      # Reserved: App bootstrap, providers, routing table
│   │   ├── AppShell.tsx
│   │   └── routeConfig.ts
│   ├── navigation/               # Reserved: Central navigator, context & navigation hooks
│   │   ├── AppNavigator.tsx
│   │   └── navigationTypes.ts
│   ├── layout/                   # Reserved: Desktop layout frame, sidebar, header
│   │   ├── MainLayout.tsx
│   │   ├── Sidebar.tsx
│   │   ├── SidebarSection.tsx
│   │   └── Header.tsx
│   ├── shared/                   # Reserved: Reusable UI component library & theme
│   │   ├── components/
│   │   │   ├── AppButton.tsx
│   │   │   ├── AppCard.tsx
│   │   │   ├── AppInput.tsx
│   │   │   ├── AppBadge.tsx
│   │   │   ├── AppTable.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   ├── PageHeader.tsx
│   │   │   └── AppIcon.tsx
│   │   ├── theme/
│   │   │   ├── colors.ts
│   │   │   ├── spacing.ts
│   │   │   └── typography.ts
│   │   └── types/
│   │       └── common.ts
│   ├── modules/                  # Isolated feature modules (Worker Owned)
│   │   ├── dashboard/
│   │   ├── global-search/
│   │   ├── customers/
│   │   ├── sales-orders/
│   │   ├── manual-billing/
│   │   ├── invoices-billing/
│   │   ├── payments/
│   │   ├── follow-ups/
│   │   ├── whatsapp-scheduler/
│   │   ├── returns/
│   │   ├── goods-inward/
│   │   ├── products/
│   │   ├── notifications/
│   │   └── activity-log/
│   └── index.ts
├── App.tsx                       # Reserved: Lead integration entry point
├── index.js                      # Reserved: AppRegistry entry
└── package.json                  # Reserved: Managed solely by Integration Lead
```

---

## 3. Multi-Agent Development Protocol

### Rule 1: Single Integration Owner
Only the **Integration Lead** may modify:
- `App.tsx` and `index.js`
- `src/app/**`
- `src/navigation/**`
- `src/layout/**`
- `src/shared/**`
- `package.json`, `package-lock.json`, and native project files (`windows/**`, `android/**`, `ios/**`)

### Rule 2: Strict Module Encapsulation
- Each module worker has exclusive ownership of `src/modules/<module-name>/**`.
- Module workers **must never** modify another module's directory or core files.
- Each module must export its primary screen via `src/modules/<module-name>/index.ts` conforming to the contract:
  ```typescript
  export { default as <ModuleName>Screen } from './<ModuleName>Screen';
  ```
- Modules must use the shared component library and global theme tokens from `src/shared/`.
- All demo data must remain local to each module under `src/modules/<module-name>/types.ts` or local data constants.

### Rule 3: Git Isolation & Worktrees
- Parallel workers work on isolated feature branches:
  - `feature/crm-dashboard`
  - `feature/crm-customers`
  - `feature/crm-sales-orders`
  - etc.
- Never run destructive Git commands against shared branches (`main`).
- Integration Lead handles merging and verification.

### Rule 4: Dependency Additions
- Module developers **must not** run `npm install` directly or alter `package.json`.
- If a module developer requires an external library, submit a Dependency Request to the Integration Lead specifying:
  1. Package name and target version.
  2. Justification and why existing React Native core/shared components are insufficient.
  3. React Native Windows 0.74 compatibility verification.

---

## 4. Shared Component APIs

### `AppButton`
```typescript
interface AppButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: IconName;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}
```

### `AppCard`
```typescript
interface AppCardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  variant?: 'default' | 'elevated' | 'glass' | 'accent';
  style?: StyleProp<ViewStyle>;
}
```

### `AppBadge`
```typescript
interface AppBadgeProps {
  label: string | number;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  size?: 'sm' | 'md';
  pill?: boolean;
}
```

### `AppInput`
```typescript
interface AppInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  label?: string;
  icon?: IconName;
  helperText?: string;
  error?: string;
}
```

### `AppTable`
```typescript
interface TableColumn<T> {
  key: string;
  title: string;
  width?: number | string;
  render?: (item: T, index: number) => React.ReactNode;
}
```

### `PageHeader`
```typescript
interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  breadcrumb?: string[];
}
```

---

## 5. Build, Lint & Test Instructions

```bash
# Type check the entire codebase:
npx tsc --noEmit

# Run unit tests:
npm test -- --passWithNoTests

# Run ESLint on project source:
npx eslint src/ App.tsx

# Start Metro Bundler:
npm start

# Run Windows Application (requires Visual Studio with C++ desktop components):
npm run windows
```
