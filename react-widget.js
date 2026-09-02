/* ==========================================================================
   SJCD INSTITUTIONS — React Analytics Widget (react-widget.js)
   --------------------------------------------------------------------------
   This file is completely isolated from script.js.
   - It ONLY renders inside <div id="react-analytics-root"></div>.
   - It NEVER queries, edits, or removes any other element on the page.
   - It reads the exact same localStorage key ("sjcd_students") that
     script.js already writes to — there is only one source of truth.
   - No JSX, no npm, no build step. React is loaded via CDN <script> tags
     in index.html and used here through React.createElement (aliased "h").
   ========================================================================== */

(function () {
  "use strict";

  const MOUNT_ID = "react-analytics-root";
  const KEY_STUDENTS = "sjcd_students"; // must match script.js exactly

  const mountEl = document.getElementById(MOUNT_ID);
  if (!mountEl) return; // widget's container isn't on this page — do nothing

  const h = React.createElement;

  /* ------------------------------------------------------------------
     Data — reads only, never writes. All writes still happen in
     script.js so there is exactly one place that owns student data.
     ------------------------------------------------------------------ */
  function loadStudents() {
    try {
      const raw = localStorage.getItem(KEY_STUDENTS);
      const list = raw ? JSON.parse(raw) : [];
      return Array.isArray(list) ? list : [];
    } catch (e) {
      console.error("React widget: could not read student data", e);
      return [];
    }
  }

  function computeStats(students) {
    const total = students.length;

    const byDept = {};
    let passCount = 0;
    let paidFull = 0;
    let partial = 0;
    let fullyDue = 0;

    students.forEach((s) => {
      const dept = s.dept || "Unspecified";
      byDept[dept] = (byDept[dept] || 0) + 1;

      if (s.status === "Pass") passCount++;

      const total_ = Number(s.totalFees) || 0;
      const paid = Number(s.feesPaid) || 0;
      if (total_ > 0 && paid >= total_) paidFull++;
      else if (paid <= 0) fullyDue++;
      else partial++;
    });

    const deptRows = Object.keys(byDept)
      .map((name) => ({ name, count: byDept[name] }))
      .sort((a, b) => b.count - a.count);

    return {
      total,
      passCount,
      failCount: total - passCount,
      paidFull,
      partial,
      fullyDue,
      deptRows,
    };
  }

  /* ------------------------------------------------------------------
     Small presentational pieces
     ------------------------------------------------------------------ */
  function Bar(props) {
    // props: { pct, color }
    return h(
      "div",
      {
        style: {
          height: "8px",
          borderRadius: "999px",
          background: "var(--surface-3)",
          overflow: "hidden",
          flex: "1 1 auto",
        },
      },
      h("div", {
        style: {
          height: "100%",
          width: Math.max(0, Math.min(100, props.pct)) + "%",
          background: props.color,
          borderRadius: "999px",
          transition: "width .35s ease",
        },
      })
    );
  }

  function DeptRow(props) {
    const pct = props.max > 0 ? (props.count / props.max) * 100 : 0;
    return h(
      "div",
      {
        style: {
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "10px",
        },
      },
      h(
        "span",
        {
          style: {
            width: "150px",
            flex: "0 0 150px",
            fontSize: "13px",
            color: "var(--text-dim)",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          },
        },
        props.name
      ),
      h(Bar, { pct: pct, color: "var(--accent)" }),
      h(
        "span",
        {
          style: {
            width: "28px",
            flex: "0 0 28px",
            fontSize: "13px",
            color: "var(--text)",
            textAlign: "right",
          },
        },
        props.count
      )
    );
  }

  function StatChip(props) {
    // props: { label, value, color }
    return h(
      "div",
      {
        style: {
          background: "var(--surface-2)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-md)",
          padding: "12px 14px",
          flex: "1 1 120px",
          minWidth: "120px",
        },
      },
      h(
        "div",
        {
          style: {
            fontSize: "20px",
            fontWeight: "600",
            color: props.color || "var(--text)",
            marginBottom: "2px",
          },
        },
        props.value
      ),
      h(
        "div",
        {
          style: { fontSize: "12px", color: "var(--text-faint)" },
        },
        props.label
      )
    );
  }

  /* ------------------------------------------------------------------
     Main panel
     ------------------------------------------------------------------ */
  function AnalyticsPanel() {
    const [students, setStudents] = React.useState(loadStudents());

    React.useEffect(() => {
      function refresh() {
        setStudents(loadStudents());
      }
      // fires when another tab changes localStorage
      function onStorage(e) {
        if (!e.key || e.key === KEY_STUDENTS) refresh();
      }
      // fires in THIS tab right after script.js saves student data
      window.addEventListener("storage", onStorage);
      window.addEventListener("sjcd:students-updated", refresh);
      return function cleanup() {
        window.removeEventListener("storage", onStorage);
        window.removeEventListener("sjcd:students-updated", refresh);
      };
    }, []);

    const stats = computeStats(students);
    const maxDeptCount = stats.deptRows.length
      ? stats.deptRows[0].count
      : 0;
    const passPct = stats.total ? (stats.passCount / stats.total) * 100 : 0;
    const feeMax = Math.max(stats.paidFull, stats.partial, stats.fullyDue, 1);

    if (stats.total === 0) {
      return h(
        "div",
        { style: { color: "var(--text-faint)", fontSize: "13px" } },
        "No student data yet — add a student to see live analytics here."
      );
    }

    return h(
      "div",
      null,

      // top summary chips
      h(
        "div",
        {
          style: {
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
            marginBottom: "22px",
          },
        },
        h(StatChip, {
          label: "Departments",
          value: stats.deptRows.length,
          color: "var(--accent)",
        }),
        h(StatChip, {
          label: "Pass rate",
          value: Math.round(passPct) + "%",
          color: "var(--success)",
        }),
        h(StatChip, {
          label: "Fully paid",
          value: stats.paidFull,
          color: "var(--success)",
        }),
        h(StatChip, {
          label: "Fees fully due",
          value: stats.fullyDue,
          color: "var(--danger)",
        })
      ),

      // department distribution
      h(
        "div",
        { style: { marginBottom: "22px" } },
        h(
          "div",
          {
            style: {
              fontSize: "13px",
              fontWeight: "600",
              color: "var(--text)",
              marginBottom: "12px",
            },
          },
          "Students by department"
        ),
        stats.deptRows.map((row) =>
          h(DeptRow, { key: row.name, name: row.name, count: row.count, max: maxDeptCount })
        )
      ),

      // pass / fail split
      h(
        "div",
        { style: { marginBottom: "22px" } },
        h(
          "div",
          {
            style: {
              fontSize: "13px",
              fontWeight: "600",
              color: "var(--text)",
              marginBottom: "10px",
            },
          },
          "Pass / fail split"
        ),
        h(
          "div",
          { style: { display: "flex", alignItems: "center", gap: "10px" } },
          h(Bar, { pct: passPct, color: "var(--success)" }),
          h(
            "span",
            { style: { fontSize: "12px", color: "var(--text-dim)", whiteSpace: "nowrap" } },
            stats.passCount + " pass · " + stats.failCount + " fail"
          )
        )
      ),

      // fee status breakdown
      h(
        "div",
        null,
        h(
          "div",
          {
            style: {
              fontSize: "13px",
              fontWeight: "600",
              color: "var(--text)",
              marginBottom: "10px",
            },
          },
          "Fee status breakdown"
        ),
        h(DeptRow, { name: "Paid in full", count: stats.paidFull, max: feeMax }),
        h(DeptRow, { name: "Partially paid", count: stats.partial, max: feeMax }),
        h(DeptRow, { name: "Fully due", count: stats.fullyDue, max: feeMax })
      )
    );
  }

  /* ------------------------------------------------------------------
     Mount — this is the ONLY line that touches the real DOM.
     ------------------------------------------------------------------ */
  const root = ReactDOM.createRoot(mountEl);
  root.render(h(AnalyticsPanel));
})();
