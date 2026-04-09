# 🇮🇹 Círculo Ítalo-Brasileiro ERP

A high-performance, accessible, and "Sassy" ERP system designed for the management of Italian-Brazilian community centers. Optimized for **Next.js 16.2**, **Bun**, and **Mantine 9**.

## 🚀 The Vision

This ERP isn't just about data; it's about people. Specifically, the *Nonnos* and *Nonnas* of our community.

- **Accessibility First:** High-contrast Italian Tricolore theme with large touch targets.
- **Fiscal Ready:** Built-in CPF validation and NFe (Nota Fiscal) readiness.
- **Speed:** Powered by Bun and Turbopack for near-instant interactions.

---

## 🛠 Tech Stack


| Layer          | Technology                                                          |
| -------------- | ------------------------------------------------------------------- |
| **Runtime**    | [Bun](https://bun.sh)                                               |
| **Framework**  | [Next.js 16.2](https://nextjs.org) (App Router + Turbopack)         |
| **UI Library** | [Mantine 9](https://mantine.dev)                                    |
| **Styling**    | [Tailwind CSS 4.2](https://tailwindcss.com) (Utility & Layout)      |
| **Database**   | [Supabase](https://supabase.com) (Postgres)                         |
| **ORM**        | [Drizzle ORM](https://orm.drizzle.team)                             |
| **Fonts**      | [Geist](https://github.com/vercel/geist-font) (Local Static Bundle) |


---

## 🎨 Design System: The "Tricolore" Protocol

We don't use generic colors. We use the identity of Italy:

- **Verde (#008C45):** Primary buttons, success states, paid fees.
- **Rosso (#CD212A):** Alerts, overdue payments, delete actions.
- **Bianco (#F4F5F0):** App background for soft, high-legibility contrast.

**Interaction Rule:** Every clickable element is at least **48px** tall. If a 70-year-old admin can't click it without glasses, the UI is wrong.

---

## 📂 Project Structure

```text
├── public/              # Static assets (Local Geist fonts)
├── src/
│   ├── app/             # Next.js App Router (Layouts & Pages)
│   ├── actions/         # Server Actions (Drizzle Mutations)
│   ├── components/      # Shared Mantine/Tailwind components
│   ├── lib/
│   │   └── db/          # Drizzle Schema & Supabase Client
│   └── theme.ts         # Central Mantine Theme Configuration
├── AGENTS.md            # AI-Agent specific instructions
├── next.config.ts       # Optimized Turbopack & Cache config
└── postcss.config.ts    # Mantine & Tailwind 4.2 bridge
```

---

## ⚙️ Setup & Development

### 1. Prerequisites

Ensure you have **Bun** installed:

```bash
curl -fsSL [https://bun.sh/install](https://bun.sh/install) | bash
```

### 2. Installation

```bash
bun install
```

### 3. Environment Variables

Create a `.env.local` with your Supabase credentials:

```env
DATABASE_URL=postgres://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres
```

### 4. Database Sync

Push the Drizzle schema to Supabase:

```bash
bunx drizzle-kit push
```

### 5. Running Dev

```bash
bun dev --turbo
```

---

## ⚖️ Rules for Contributors (and AI Agents)

- **Theme-First:** All component styling should be defined in `src/theme.ts` defaultProps.
- **Clean Data:** Always strip non-digits from CPFs before saving to the database.
- **Server-First:** Use Server Actions for all database writes. No `useEffect` fetching for mutations.
- **Local Assets:** No external CDNs. All fonts and icons must be local for offline stability.

---

## 🍷 Local Culture Integration

This ERP handles specific community needs:

- **Mensalidades:** Automated tracking of membership dues.
- **Taxa de Rolha:** Specific tracking for members bringing their own wine to parties.
- **Event Tickets:** Integrated ticketing for community dinners and festivals.

**"Perché la comunità è tutto."**

### 🏛 Círculo Ítalo-Brasileiro: In-Depth Permissions Matrix

| Category | Entity Action | Admin (100) | Gerente (200) | Padrão (300) | PDV (400) | Constraints / Logic |
| :--- | :--- | :---: | :---: | :---: | :---: | :--- |
| **USERS** | Create / Invite | ✅ | ✅ | ❌ | ❌ | Gerentes can only invite levels >= 200. |
| | Edit Others | ✅ | ✅ | ❌ | ❌ | Admin only for cross-level edits. |
| | View List | ✅ | ✅ | ❌ | ❌ | Protects staff privacy. |
| | View Logs | ✅ | ❌ | ❌ | ❌ | Security audit trail access. |
| **MEMBERS** | Create | ✅ | ✅ | ✅ | ❌ | Standard staff can register new members. |
| | Edit (Any) | ✅ | ✅ | ❌ | ❌ | Managers handle legacy record fixes. |
| | Edit (Own Created) | ✅ | ✅ | ✅ | ❌ | Allows Padrão to fix their own mistakes. |
| | View Financials | ✅ | ✅ | ❌ | ❌ | Member debt/payment history is sensitive. |
| | Search/View | ✅ | ✅ | ✅ | ✅ | Essential for check-in and bar sales. |
| **FINANCIAL** | View Full Ledger | ✅ | ✅ | ❌ | ❌ | Direct access to the `Transactions` table. |
| | BI / Dashboards | ✅ | ✅ | ❌ | ❌ | Strategic data for management only. |
| | Manual Adjustments| ✅ | ❌ | ❌ | ❌ | Correction of "Verde/Rosso" errors. |
| **SALES (SR)** | Process Sale | ✅ | ✅ | ✅ | ✅ | Core function for all staff. |
| | Void / Refund | ✅ | ✅ | ❌ | ❌ | Prevents till manipulation. |
| | View Own History | ✅ | ✅ | ✅ | ✅ | Used for end-of-shift reconciliation. |
| | View Total Sales | ✅ | ✅ | ❌ | ❌ | Aggregated daily totals are restricted. |
| **PURCHASES (PO)**| Create / Edit | ✅ | ✅ | ❌ | ❌ | Managers control the "Money Out." |
| | Receive Goods | ✅ | ✅ | ✅ | ❌ | Padrão can verify delivery of stock. |
| | Pay Supplier | ✅ | ✅ | ❌ | ❌ | Final financial release of funds. |
| **INVENTORY** | View Stock | ✅ | ✅ | ✅ | ✅ | Essential to know if products are available. |
| | Manual Adj. | ✅ | ✅ | ❌ | ❌ | Used for "Spillage" or "Theft" reporting. |
| | Link Suppliers | ✅ | ✅ | ✅ | ❌ | Padrão handles logistics/vendor relations. |
| **EVENTS** | Create / Setup | ✅ | ✅ | ❌ | ❌ | Only management plans the calendar. |
| | Manage Guests | ✅ | ✅ | ✅ | ✅ | All staff assist with the door. |
| | Tag Costs | ✅ | ✅ | ❌ | ❌ | Linking expenses to Event IDs. |
| **SYSTEM** | RLS / Schema | ✅ | ❌ | ❌ | ❌ | IT and Database integrity. |
| | NFe Submission | ✅ | ✅ | ❌ | ❌ | Government tax liability authorization. |

---

### 🇮🇹 Key Authorization Principles

* **The Downward Flow:** Any user can only manage or create users with a `level_number` equal to or greater than their own.
* **The Ownership Bridge:** To balance productivity with security, **Level 300 (Padrão)** users are granted "Creator Rights." They can edit any record (Member, Product, Form) that they personally created, but lose that power once a Manager (200) takes over the record.
* **The PDV Sandbox:** **Level 400** is strictly transactional. They are the eyes of the club (Search/View) and the hands of the club (Sales/Check-in), but they have no "Memory" access to past financial data or other staff records.
* **Immutable Audit:** No record is ever truly deleted by anyone below Admin. Everything else is a status change (`active` -> `inactive` or `void`) to maintain the JIT HRID history.
| Level   | Integer | Database Role |
| ------- | ------- | ------------- |
| admin   | 100     | `admin`       |
| gerente | 200     | `gerente`     |
| padrão  | 300     | `padrao`      |
| pdv     | 400     | `pdv`         |


```
ADMIN (IT/You)
├── Full database access
├── RLS policy modification
├── Internal logs
└── All gerente permissions

GERENTE (Manager)
├── User management (≤gerente level)
├── Financial dashboards (view)
├── BI dashboards (view)
├── Balance sheet calculations
├── Non-sale-able product assignment
├── Tagged cost assignment to events
├── All padrão permissions (except ownership constraints)

PADRÃO (Standard)
├── Create products (own = creator)
├── Link products ↔ fornecedores
├── Sale-able product → event assignment
├── Member management (own created)
├── Event attendee management
├── Event check-in
├── Monthly fee forms (own created)
└── All pdv permissions

PDV (Point of Sale)
├── Slip creation
├── Slip editing (products)
├── Slip closure & payment charging
└── Event check-in (read-only member view)
```

