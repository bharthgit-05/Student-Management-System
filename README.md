# SJCD Institutions — Student Management System

A simple, functional student management website: a public landing page plus a
password-protected admin dashboard for managing student records (add / edit /
delete), fees, attendance and academics — built with plain **HTML, CSS and
JavaScript** only (no frameworks, no build step, no server required).

---

## 1. Files in this folder

| File          | Purpose                                                              |
|---------------|-----------------------------------------------------------------------|
| `index.html`  | All page markup — public site, login modal, admin dashboard, forms   |
| `style.css`   | All styling — golden-green theme, dark/light/system mode, layout     |
| `script.js`   | All logic — authentication, CRUD, stats, theming, import/export      |
| `data.json`   | Sample dataset you can **import** from the admin panel               |
| `README.md`   | This file                                                            |

Keep all four files **in the same folder** — `index.html` links to `style.css`
and `script.js` by relative path.

---

## 2. How to run it

No installation needed.

1. Download all four files into one folder.
2. Double-click `index.html` (or right-click → Open with → your browser).
3. That's it — it runs entirely in the browser.

Optional: if you want to serve it locally instead of opening the file
directly (useful for testing on a phone on the same Wi-Fi), you can run any
static server from that folder, e.g.:

```bash
python3 -m http.server 8000
```

then open `http://localhost:8000` (or `http://<your-computer-ip>:8000` from
your phone).

---

## 3. Admin login

| Field     | Value              |
|-----------|--------------------|
| Admin ID  | `admin@sjcd210`    |
| Password  | `admin@sjcdaxsc`   |

Click **Admin Login** on the landing page (top-right or hero button) and
sign in. You can change the ID and password at any time from
**Settings** inside the dashboard — you'll need your current password to
confirm the change.

---

## 4. What you can do

**Public landing page**
- Institution intro, address, phone, email
- Live counters (total students, pass %, fees due %) pulled from real data

**Admin dashboard**
- **Dashboard** — total students, pass %, fees due %, average attendance,
  average academic score, total fees collected / pending, recently added
  students
- **Students** — add, edit, delete records; search by name/roll/department;
  filter by department, pass/fail status, or fee status; export all data to
  a `.json` file; import data from a `.json` file (try importing the
  included `data.json` to load sample students)
- **Settings** — change admin ID/password; delete all student records

Each student record stores: roll number, name, department, year/class,
email, phone, total fees, fees paid, attendance %, academic score %, and
pass/fail status. Fees due and pass/fail percentages are calculated
automatically across all students.

---

## 5. Theme

Use the sun/moon/gear icons in the navbar (or admin sidebar) to switch
between:
- **Light** — cream background, deep green/gold accents
- **Dark** — black textured background, gold/green accents
- **System** — follows your device's OS setting automatically

Your choice is remembered on your next visit.

---

## 6. Where the data lives (important)

This is a front-end-only project — there is no database or server. All
student records and admin credentials are stored in your **browser's local
storage**, which means:

- ✅ Data survives closing the tab or restarting your browser
- ✅ Adding/editing/deleting updates the dashboard instantly, and syncs
  live across multiple tabs open in the *same* browser
- ❌ Data does **not** sync across different browsers or different devices
  (e.g., what you add on a laptop won't appear on a phone) — each browser
  keeps its own local copy
- ❌ Clearing your browser's site data/cache will erase the records

**To back up or move data:** use the **Export JSON** button in the Students
panel to download a snapshot, and **Import JSON** to load it back in (on
the same or a different browser).

If you eventually want everyone to see the same live data from any device,
that requires a small backend (a server + database) — happy to help build
that as a next step if needed.

---

## 7. Customizing

- **Institution details** (name, address, phone, email) — edit the text
  directly in `index.html` (hero and contact sections) and update the
  `institution` block in `data.json` for reference.
- **Colors** — all colors are CSS variables at the top of `style.css`
  (`--gold`, `--green`, etc.) under the `:root`, `[data-theme="dark"]` and
  `[data-theme="light"]` sections.
- **Default admin credentials** — set in `script.js` under
  `DEFAULT_ADMIN` (only used the very first time the site loads, before any
  password change is saved).
- **Sample students** — edit `SEED_STUDENTS` in `script.js`, or edit and
  import `data.json`.

---

## 8. Optional React analytics widget

The Dashboard includes one extra panel, **"Live Analytics"**, powered by
React — added on top of the site without changing any existing HTML, CSS,
or JavaScript behavior.

- `react-widget.js` is a separate, self-contained file. It only renders
  inside `<div id="react-analytics-root">` and never reads or modifies any
  other element on the page.
- React and ReactDOM are loaded from a CDN in `index.html` (no npm, no
  build step, no `node_modules`) — just two extra `<script>` tags.
- It reads the exact same `sjcd_students` data in local storage that
  `script.js` already manages, so there's only one source of truth. It
  never writes data itself.
- It shows: student count by department, pass/fail split, and a fee-status
  breakdown (fully paid / partially paid / fully due) — all recalculated
  live the moment a student is added, edited, or deleted.
- **Fully optional**: delete the `<div id="react-analytics-root">` panel
  and the three `<script>` tags for React/ReactDOM/`react-widget.js` in
  `index.html`, and remove `react-widget.js` — the rest of the app is
  completely unaffected.

---

## 9. Device & browser compatibility

The site is tuned to feel right on every device class, not just resized:

- **Phones** (iPhone SE up to large Android phones) — larger tap targets
  (44px minimum), no accidental zoom when tapping form fields, safe-area
  padding so content never sits under an iPhone notch or home indicator,
  and a dedicated small-phone tier (≤360px) for compact screens.
- **Tablets** (iPad, Android tablets, Surface in tablet mode) — a middle
  layout tier (721–1024px) with its own column counts and spacing, not
  just a stretched phone or squeezed desktop view.
- **Laptops & desktops** — a denser, more precise layout on large monitors
  (1440px+): more columns, tighter row spacing, since a mouse points
  exactly where you click.
- **Touch vs. mouse, automatically detected** — touchscreens (including
  touch-enabled Windows laptops) get bigger buttons and no "stuck hover"
  glow after tapping; mouse/trackpad users keep the compact desktop sizing
  with hover feedback. This uses the CSS `pointer`/`hover` media features,
  not device guessing.
- **Cross-browser**: tested styling approaches for Chrome, Edge, Brave,
  Opera, Firefox, and Safari — includes `-webkit-` prefixes for blur
  effects (Safari-only requirement), consistent form-control styling
  across engines, and a Firefox-specific thin-scrollbar fallback (Firefox
  doesn't support the `::-webkit-scrollbar` styling Chromium browsers use).
- **Cross-OS**: Android, iOS/iPadOS, Windows, macOS, and Linux all use the
  same standard web APIs here — no OS-specific code branches were needed,
  just standards-based CSS that each OS's browsers render consistently.

---

## 10. Browser support

Works in all modern browsers (Chrome, Edge, Firefox, Safari) on desktop,
laptop, tablet and mobile. Layout is responsive down to small phone screens.