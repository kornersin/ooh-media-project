# OOH Media Project

# App Language Requirement (CRITICAL)

- The entire user interface (UI) must be rendered in SPANISH (labels, table headers, buttons, badge texts, empty states, side drawer forms, and mock data text).

- Examples: Use "Disponible", "Mantenimiento", "Guardar cambios", "Estatus", "Categoría", "Vigencia", "Buscar por ID o Nombre", etc.

---

# Context and Objective

Build a B2B enterprise web application dashboard for Managing Out of Home (OOH / Billboards) Advertising Media with Role-Based Access Control (RBAC). The application must be fully interactive with dynamic state management, smooth transitions, a physical Side Drawer surface with a Neutral 100 background and backdrop blur overlay, empty states, fluid interaction with a realistic 1,000-record paginated dataset, and full Mobile Responsive Adaptability.

---

# Mobile Responsive Architecture (CRITICAL)

The UI must adapt fluidly to screen sizes (`sm`, `md`, `lg` Tailwind breakpoints):

1. **Navigation (Mobile vs Desktop):**

   - **Desktop (`>=768px`):** Floating Bento Sidebar on the left (expandable/collapsible).

   - **Mobile (`<768px`):** Sidebar is hidden and replaced by a top Hamburger Menu or a sleek Bottom Navigation Bar with quick access to 'Dashboard', 'Campañas', and Role Switcher.

2. **Table Layout Adaptation:**

   - **Desktop (`>=768px`):** Full multi-column interactive data table.

   - **Mobile (`<768px`):** Table automatically transforms into a vertical stack of responsive **Data Cards**. Each card displays: Site/Campaign ID, Status Badge, City, and the Action Textlink ('Editar' / 'Ver más') at the bottom right.

3. **Side Drawer / Sheet:**

   - **Desktop (`>=768px`):** Slides in from the right (Right Drawer panel).

   - **Mobile (`<768px`):** Slides up from the bottom as a full-width **Bottom Sheet Modal** with rounded top corners.

---

# Design Tokens & Color Palette (Tailwind CSS Config)

Strictly apply the following HEX codes to maintain absolute fidelity to Figma:

### 1. Primary (Brand Indigo)

- Primary 900: `#1D143D` (Very dark brand text / Active sidebar)

- Primary 700: `#43327B` (Base Color / Primary buttons & Textlinks)

- Primary 600: `#5A459E` (Primary button hover & Textlinks hover)

- Primary 200: `#CCBEF0` (Focused borders)

- Primary 100: `#EAE3FA` (Selection background / Row hover)

### 2. Clean Neutrals (App Body, Cards, Inputs & Typography)

- Neutral 900: `#0F172A` (Main text / Headings - High legibility)

- Neutral 800: `#1F2937` (Body text)

- Neutral 700: `#374151` (Form labels & Secondary buttons)

- Neutral 600: `#4B5563` (Subtitles & Secondary text)

- Neutral 500: `#6B7280` (Placeholders & Secondary icons)

- Neutral 400: `#9CA3AF` (Disabled borders)

- Neutral 300: `#D1D5DB` (Table divider lines & Input borders)

- Neutral 200: `#E5E7EB` (Disabled input background & Hover)

- Neutral 100: `#F3F4F6` (Side Drawer container background, Modals & Cards)

- Neutral 50: `#F9FAFB` (General App Body background)

### 3. Secondary & Accent

- Secondary 600 (Digital Teal): `#1FA0A8`

- Tertiary 500 (Warm Coral): `#DE5D6A`

### 4. Semantics (Badges & UI Status)

- Success (Disponible / Activo): Text `#1B8755`, Background `#EEFBF4`, Border `#96E2BA`

- Warning (Mantenimiento / En Revisión / En Instalación): Text `#D97706`, Background `#FFFBEB`, Border `#FDE047`

- Error / Danger (Ocupado / Reservado / Cancelado): Text `#DC2626`, Background `#FEF2F2`, Border `#FCA5A5`

---

# Top Navigation Bar Component

1. **Global Search Input:** Centered search input at the top.

2. **Dynamic Role Switcher Dropdown:**

   - Positioned at top-right next to User Profile.

   - Interactive dropdown for testing/demo with 3 options:

     - 🟣 `Rol: Dueño de Medio`

     - 🔵 `Rol: Agencia`

     - 🟢 `Rol: Marca (Grupo Alsea / Anunciante)`

   - **Behavior:** Changing the role in this switcher immediately updates the entire platform (data permissions, drawer capabilities, visible table columns, and actions).

   - **Behavior when switching to Marca:** Automatically activates the account view for holding **Grupo Alsea**, enabling unified viewing of campaigns across all its sub-brands (*Starbucks, Burger King, Domino's Pizza, Vips, Chili's, P.F. Chang's*).

---

# Form Controls & Input Specifications

Apply the following control types strictly for maximum interactive quality:

1. **Table Filters (Multiselect Dropdowns with Checkboxes):**

   - Top table filters (Ubicación, Categoría, Estatus, Dueño de Medio, Marca) must be **Multiselect Dropdowns**. On mobile, filters collapse into an expandable filter bar or modal.

   - Opening the dropdown presents options with interactive **checkboxes** on the left (e.g., `[X] CDMX`, `[X] Guadalajara`).

   - Filter buttons display a dynamic summary or item count (e.g., *"Ubicación (2)"* or *"CDMX, GDL"*).

   - **Filter Options (in Spanish):**

     - **Categorías (Formatos OOH):** *Espectacular, Pantalla Digital LED, Muro Publicitario, Valla Fija, Valla Digital, Unipolar, Parabus / MUP, Puente Peatonal, Totem Digital, Medallón de Autobús, Caja de Luz (Backlight)*.

     - **Ubicaciones (Ciudades):** *CDMX, Guadalajara, Monterrey, Cancún, Tijuana, La Paz, Mérida, Querétaro, Puebla, Toluca*.

     - **Estatus de Sitio:** *Disponible, Mantenimiento, Ocupado, Reservado, En Instalación*.

     - **Estatus de Campaña:** *Activa, Concluida, Programada, En Revisión*.

2. **Date / Validity Filter (`DateRange Picker`):**

   - In 'Campañas' view, the validity filter is an interactive dual-calendar dropdown for picking Start Date and End Date.

3. **Side Drawer Form Controls (Single Select & Inputs):**

   - *Categoría, Dueño de Medio, Marca, Campaña* inside the drawer function as Single Select dropdowns.

   - *Dirección, Ancho (m), Alto (m), Renta Mensual ($ MXN), URL de repositorio* are free text/number inputs.

   - *Arte aprobado por el cliente* is a Checkbox control (state updated per RBAC rules).

---

# Dynamic Tables & Action Buttons

Tables dynamically adapt columns and headers based on active view and current Role.

**Action Button Style:** The action button in the last column ('Editar' / 'Ver más') renders as a **Textlink / Ghost Button** (no border, no solid background) using text color `Primary 700 (#43327B)` with `hover:underline` or `hover:text-primary-600`.

**Action Column Header Rule:** Do NOT print the word "Acción" explicitly in the table header. Keep the top header cell empty while preserving width and alignment.

### 1. View: Dashboard (Inventario de Sitios)

- **Top Filters:** ID/Name Search (free input), Ubicación (Multiselect Checkbox), Categoría (Multiselect Checkbox), Estatus (Multiselect Checkbox), Dueño de Medio (Multiselect Checkbox).

- **Columns (Headers in Spanish):**

  1. `Sitio / ID` (Site name + grey ID code below)

  2. `Ciudad / Estado`

  3. `Categoría`

  4. `Estatus` (Color semantic badge)

  5. `Dueño de Medios`

  6. ` ` (Reserved empty cell for alignment) $\rightarrow$ Textlink 'Editar' (Dueño/Agencia) or 'Ver más' (Marca).

### 2. View: Campañas

- **Top Filters:** Campaign ID/Name, Ubicación (Multiselect Checkbox), Marca (Multiselect Checkbox), Vigencia (DateRange Picker with calendar), Estatus de Campaña (Multiselect Checkbox).

- **Columns (Headers in Spanish):**

  1. `Campaña / ID` (Campaign name + ID)

  2. `Ubicación` or `Marca` (Adapts per active role)

  3. `Vigencia` (Date range, e.g., 09/07/26 - 09/10/26)

  4. `Estatus` (Badges: *Concluida, Activa, Programada*)

  5. `Dueño de Medios`

  6. ` ` (Reserved empty cell for alignment) $\rightarrow$ Textlink 'Editar' or 'Ver más'.

---

# Roles & Business Logic (RBAC)

### 1. Role: Dueño de Medio

- **View Access:** Full access to all sites and campaigns in inventory.

- **Table Action:** Textlink **'Editar'**.

- **Side Drawer Permissions:**

  - Editable Fields: Categoría (Select), Dirección (Text), Ancho, Alto, Dueño de Medios, Renta Mensual, URL de repositorio.

  - Read-Only Fields: Marca asignada, Campaña asignada.

  - Checkbox ("Arte aprobado por el cliente"): READ-ONLY mode. Shows visual checked/unchecked state without user toggle capability.

  - Drag & Drop Zone: Displays attachment preview (uploaded state).

  - Footer Action Buttons: **'Guardar cambios'** (Solid primary) + **'Cancelar'** (Outlined secondary).

### 2. Role: Agencia

- **View Access:** Dashboard & Campañas views. Manages non-competing brand portfolio.

- **Brands Managed by Agencia:** *Adidas* (Retail/Sports), *Steren* (Electronics), *Burger King* (QSR / Restaurant), and *Nike*.

- **Table Action:** Textlink **'Editar'** for campaigns belonging to managed brands.

- **Side Drawer Permissions:**

  - Editable Fields: Marca asignada (Select), Campaña asignada (Select), Drag & Drop area (interactive upload/replace artwork), URL de repositorio, and **Checkbox ("Arte aprobado por el cliente")** (Agencia is the ONLY role with permission to toggle approval).

  - Read-Only Fields: Technical site specs (Categoría, Dirección, Ancho, Alto, Renta).

  - Footer Action Buttons: **'Guardar cambios'** + **'Cancelar'**.

### 3. Role: Marca (Grupo Alsea / Advertiser)

- **Corporate Multi-Tenant Isolation:** Active Marca role logs in as **Grupo Alsea**. Unified view of campaigns for all its sub-brands (*Starbucks, Burger King, Domino's Pizza, Vips, Chili's, P.F. Chang's*). All non-group brands (*Adidas, Steren, Nike, Telcel*) are strictly blocked and hidden.

- **Table Action:** Textlink **'Ver más'**.

- **Side Drawer Permissions:**

  - Full Read-Only Mode: All form inputs and controls are disabled.

  - Campaign Privacy: If a site belongs to a Grupo Alsea brand, displays full campaign details. If viewing unassigned or available sites, hides brand name, campaign name, and repository URLs.

  - Footer Action Button: Displays ONLY the **'Cerrar'** button (hides 'Cancelar' and 'Guardar cambios').

---

# Mock Dataset (1,000 Records) & Search Behavior

1. **Data Generation (1,000 Mock Array Items):**

   - Fully dynamic, stateful 1,000-record array powering tables, Mobile Cards, and Side Drawers.

   - **Required Brands in Dataset:**

     - **Grupo Alsea Sub-brands:** *Starbucks, Burger King, Domino's Pizza, Vips, Chili's, P.F. Chang's*.

     - **Other Brands:** *Steren, Adidas, Nike, Telcel, Samsung, Pepsi, Coca Cola*.

   - **Cities Distribution:** CDMX, Guadalajara, Monterrey, Cancún, Tijuana, La Paz, Mérida, Querétaro, Puebla, Toluca.

   - **OOH Categories:** Distributed across the 11 defined formats.

   - **Status Values (in Spanish):** *Disponible, Mantenimiento, Ocupado, Reservado, En Instalación, Activa, Concluida, Programada*.

   - Operational pagination footer (in Spanish): `Anterior  1  2  3 ... 100  Siguiente`.

2. **Empty States:**

   - Render an **Empty State** when search terms or filter combinations yield 0 results:

   - Display a central icon/illustration, heading *"No se encontraron resultados para esta búsqueda"*, subtitle *"Prueba ajustando los filtros o el término de búsqueda"*, and an interactive button **"Limpiar filtros"** to reset table filters.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/5cfe645d-8ac8-4daf-8057-48ee15b88de4).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
