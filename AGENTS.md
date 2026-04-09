

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.



📌 Project Overview
This is a specialized ERP (Enterprise Resource Planning) system built for the Italian Community in Brazil. The system manages memberships, monthly fees (mensalidades), and event-based revenue (party tickets, food, and drinks).

Core Business Logic
Members: The primary entity. All financial actions should link to a member.

Fees: Recurring monthly membership charges

Events: One-off parties. Revenue comes from Tickets (fixed) and Drinks/Food (extra).

Corkage (Rolha): A specific fee for members bringing their own bottles.

Fiscal: Every payment must trigger an NFe (Nota Fiscal Eletrônica) eventually.

🛠 Tech Stack (The "Bleeding Edge" 2026)
Runtime: Bun (Fastest execution, native TS support).

Framework: Next.js 16.2+ (App Router + Turbopack).

UI Library: Mantine 9.0 (Used for all complex components).

Styling: Tailwind CSS 4.2 (Used for layout and structural utility).

Database: Supabase (PostgreSQL) with Row Level Security (RLS).

ORM: Drizzle ORM 1.0 Beta (Type-safe SQL).

🎨 Design Principles (The "Sassy Elder" Protocol)
The target audience includes community elders. The UI must follow these strict rules:

High Contrast: Use the Italian Flag palette:

Verde (#008C45) for Success/Active/Buttons.

Rosso (#CD212A) for Debt/Alerts/Errors.

Bianco (#F4F5F0) for backgrounds.

Accessibility:  Base font size is 20px (md).

Minimum touch target for buttons/links is 48px.

Use MantineProvider default props to enforce chunky inputs and buttons globally.

Clean Code:

Theme First: If a style can be set in theme.ts, do it there.

Tailwind Second: Use for Flex/Grid layout only.

Inline Styles Last: Avoid unless mechanically necessary.

🗄 Database Schema Structure
The schema is defined in src/lib/db/schema.ts using Drizzle.

members: Stores CPF (unique, digits only), Name, Phone (WhatsApp format), and Status.

transactions: Unified table for all money movement.

Types: membership, event_ticket, corkage, drink, food.

Status: pending, paid, cancelled, nfe_issued.

🚀 Key Workflows for Agents
Adding a Feature
Schema: Update schema.ts if data structure changes.

Migration: Run bunx drizzle-kit push to sync Supabase.

Action: Create a Server Action in src/app/actions/ for DB mutations.

UI: Use Mantine components wrapped in the custom theme.

Communication & Fiscal (Roadmap)
WhatsApp: Use a service layer to trigger messages via phone field.

NFe: Ensure cpf is validated and cleaned (11 digits) before submission to fiscal APIs.

⚠️ Known Implementation Details
PostCSS: Uses postcss.config.ts with postcss-preset-mantine.

Turbopack: Requires cacheComponents: true in next.config.ts.

Bun Cache: If modules like postcss-preset-mantine are not found, run bun pm cache rm && bun install.

Fonts: Uses local Geist fonts via next/font/google to avoid network latency/errors.