/* ==========================================================================
   SJCD INSTITUTIONS — Student Management System
   script.js
   ========================================================================== */

(function () {
  "use strict";

  /* ------------------------------------------------------------------
     0. STORAGE KEYS + DEFAULTS
     ------------------------------------------------------------------ */
  const KEY_STUDENTS = "sjcd_students";
  const KEY_ADMIN    = "sjcd_admin";
  const KEY_THEME    = "sjcd_theme";
  const SESSION_KEY  = "sjcd_session";

  const DEFAULT_ADMIN = { id: "admin@sjcd210", password: "admin@sjcdaxsc" };

  const SEED_STUDENTS = [
    { id: "s1", roll: "SJCD24001", name: "Arun Kumar", dept: "Computer Science", year: "3rd Year", email: "arun.kumar@example.com", phone: "9840012345", totalFees: 60000, feesPaid: 60000, academics: 88, attendance: 94, status: "Pass", addedOn: "2024-06-12" },
    { id: "s2", roll: "SJCD24002", name: "Divya Shree", dept: "Electronics", year: "2nd Year", email: "divya.shree@example.com", phone: "9840012346", totalFees: 55000, feesPaid: 30000, academics: 74, attendance: 88, status: "Pass", addedOn: "2024-06-14" },
    { id: "s3", roll: "SJCD24003", name: "Mohammed Faizal", dept: "Mechanical", year: "4th Year", email: "faizal.m@example.com", phone: "9840012347", totalFees: 58000, feesPaid: 58000, academics: 39, attendance: 61, status: "Fail", addedOn: "2024-06-15" },
    { id: "s4", roll: "SJCD24004", name: "Priya Ramesh", dept: "Commerce", year: "1st Year", email: "priya.ramesh@example.com", phone: "9840012348", totalFees: 42000, feesPaid: 15000, academics: 82, attendance: 90, status: "Pass", addedOn: "2024-07-01" },
    { id: "s5", roll: "SJCD24005", name: "Karthik Raja", dept: "Computer Science", year: "2nd Year", email: "karthik.raja@example.com", phone: "9840012349", totalFees: 60000, feesPaid: 60000, academics: 91, attendance: 96, status: "Pass", addedOn: "2024-07-03" },
    { id: "s6", roll: "SJCD24006", name: "Sneha Lakshmi", dept: "Biotechnology", year: "3rd Year", email: "sneha.l@example.com", phone: "9840012350", totalFees: 65000, feesPaid: 20000, academics: 45, attendance: 55, status: "Fail", addedOn: "2024-07-05" },
    { id: "s7", roll: "SJCD24007", name: "Vignesh Pillai", dept: "Electronics", year: "4th Year", email: "vignesh.p@example.com", phone: "9840012351", totalFees: 55000, feesPaid: 55000, academics: 68, attendance: 79, status: "Pass", addedOn: "2024-07-10" },
    { id: "s8", roll: "SJCD24008", name: "Anitha Selvam", dept: "Commerce", year: "1st Year", email: "anitha.s@example.com", phone: "9840012352", totalFees: 42000, feesPaid: 42000, academics: 77, attendance: 85, status: "Pass", addedOn: "2024-07-18" }
  ];

  /* ------------------------------------------------------------------
     1. STORAGE HELPERS
     ------------------------------------------------------------------ */
  function readJSON(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) return fallback;
      return JSON.parse(raw);
    } catch (e) {
      console.error("Storage read error for", key, e);
      return fallback;
    }
  }
  function writeJSON(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error("Storage write error for", key, e);
      showToast("Could not save — storage may be full.", true);
      return false;
    }
  }

  function getStudents() { return readJSON(KEY_STUDENTS, null) || []; }
  function setStudents(list) { writeJSON(KEY_STUDENTS, list); }
  function getAdmin() { return readJSON(KEY_ADMIN, null) || { ...DEFAULT_ADMIN }; }
  function setAdmin(obj) { writeJSON(KEY_ADMIN, obj); }

  function initStorage() {
    if (localStorage.getItem(KEY_STUDENTS) === null) setStudents(SEED_STUDENTS);
    if (localStorage.getItem(KEY_ADMIN) === null) setAdmin(DEFAULT_ADMIN);
  }
  initStorage();

  /* ------------------------------------------------------------------
     2. THEME (light / dark / system)
     ------------------------------------------------------------------ */
  const htmlEl = document.documentElement;
  const bodyEl = document.body;
  const mq = window.matchMedia("(prefers-color-scheme: dark)");

  function resolveTheme(pref) {
    if (pref === "system") return mq.matches ? "dark" : "light";
    return pref;
  }
  function applyTheme(pref) {
    const resolved = resolveTheme(pref);
    htmlEl.setAttribute("data-theme", resolved);
    bodyEl.setAttribute("data-theme", resolved);
    document.querySelectorAll(".theme-switch").forEach(function (group) {
      group.querySelectorAll("button").forEach(function (btn) {
        btn.classList.toggle("active", btn.dataset.themeChoice === pref);
      });
    });
  }
  function setThemePref(pref) {
    writeJSON(KEY_THEME, pref);
    applyTheme(pref);
  }
  function currentThemePref() { return readJSON(KEY_THEME, "dark"); }

  applyTheme(currentThemePref());
  mq.addEventListener("change", function () {
    if (currentThemePref() === "system") applyTheme("system");
  });

  document.querySelectorAll(".theme-switch button").forEach(function (btn) {
    btn.addEventListener("click", function () { setThemePref(btn.dataset.themeChoice); });
  });

  /* ------------------------------------------------------------------
     3. TOAST
     ------------------------------------------------------------------ */
  let toastTimer = null;
  function showToast(msg, isError) {
    const toast = document.getElementById("toast");
    toast.textContent = (isError ? "⚠ " : "✓ ") + msg;
    toast.style.borderColor = isError ? "var(--danger)" : "var(--accent)";
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove("show"); }, 2800);
  }

  /* ------------------------------------------------------------------
     4. MODAL HELPERS
     ------------------------------------------------------------------ */
  function openModal(id) { document.getElementById(id).classList.remove("hidden"); }
  function closeModal(id) { document.getElementById(id).classList.add("hidden"); }

  document.querySelectorAll(".modal-overlay").forEach(function (ov) {
    ov.addEventListener("click", function (e) { if (e.target === ov) ov.classList.add("hidden"); });
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") document.querySelectorAll(".modal-overlay:not(.hidden)").forEach(function (ov) { ov.classList.add("hidden"); });
  });

  document.querySelectorAll("[data-toggle-pw]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const input = document.getElementById(btn.dataset.togglePw);
      const isPw = input.type === "password";
      input.type = isPw ? "text" : "password";
      btn.textContent = isPw ? "hide" : "show";
    });
  });

  /* ------------------------------------------------------------------
     5. LOGIN FLOW
     ------------------------------------------------------------------ */
  const openLoginBtn = document.getElementById("openLoginBtn");
  const heroLoginBtn = document.getElementById("heroLoginBtn");
  const closeLoginBtn = document.getElementById("closeLoginBtn");
  const loginForm = document.getElementById("loginForm");
  const loginMsg = document.getElementById("loginMsg");

  [openLoginBtn, heroLoginBtn].forEach(function (btn) {
    btn.addEventListener("click", function () {
      loginMsg.className = "form-msg";
      loginForm.reset();
      openModal("loginOverlay");
      document.getElementById("loginId").focus();
    });
  });
  closeLoginBtn.addEventListener("click", function () { closeModal("loginOverlay"); });

  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const id = document.getElementById("loginId").value.trim();
    const pw = document.getElementById("loginPw").value;
    const admin = getAdmin();

    if (id === admin.id && pw === admin.password) {
      sessionStorage.setItem(SESSION_KEY, "1");
      closeModal("loginOverlay");
      enterAdmin();
      showToast("Welcome back, admin.");
    } else {
      loginMsg.textContent = "Incorrect admin ID or password. Please try again.";
      loginMsg.className = "form-msg error";
    }
  });

  document.getElementById("logoutBtn").addEventListener("click", function () {
    sessionStorage.removeItem(SESSION_KEY);
    exitAdmin();
    showToast("Logged out.");
  });

  function enterAdmin() {
    document.getElementById("publicSite").classList.add("hidden");
    document.getElementById("adminShell").classList.add("active");
    document.getElementById("sidebarAdminId").textContent = getAdmin().id;
    switchView("dashboard");
    renderAll();
  }
  function exitAdmin() {
    document.getElementById("adminShell").classList.remove("active");
    document.getElementById("publicSite").classList.remove("hidden");
    renderPublicStats();
  }

  /* ------------------------------------------------------------------
     6. ADMIN NAVIGATION (views + mobile sidebar)
     ------------------------------------------------------------------ */
  const viewTitles = { dashboard: "Dashboard", students: "Students", settings: "Settings" };

  function switchView(view) {
    if (view === "site") { exitAdmin(); return; }
    document.querySelectorAll(".side-nav .nav-item").forEach(function (b) {
      b.classList.toggle("active", b.dataset.view === view);
    });
    ["dashboard", "students", "settings"].forEach(function (v) {
      const sec = document.getElementById("view-" + v);
      if (sec) sec.classList.toggle("hidden", v !== view);
    });
    document.getElementById("viewTitle").textContent = viewTitles[view] || "Dashboard";
    closeSidebarMobile();
  }
  document.querySelectorAll(".side-nav .nav-item").forEach(function (btn) {
    btn.addEventListener("click", function () { switchView(btn.dataset.view); });
  });

  const sidebar = document.getElementById("adminSidebar");
  const sidebarBackdrop = document.getElementById("sidebarBackdrop");
  function openSidebarMobile() { sidebar.classList.add("open"); sidebarBackdrop.classList.add("show"); }
  function closeSidebarMobile() { sidebar.classList.remove("open"); sidebarBackdrop.classList.remove("show"); }
  document.getElementById("sidebarToggle").addEventListener("click", openSidebarMobile);
  sidebarBackdrop.addEventListener("click", closeSidebarMobile);

  document.getElementById("navToggle").addEventListener("click", function () {
    const links = document.querySelector(".nav-links");
    links.style.display = links.style.display === "flex" ? "none" : "flex";
    links.style.flexDirection = "column";
    links.style.position = "absolute";
    links.style.top = "74px";
    links.style.left = "0";
    links.style.right = "0";
    links.style.background = "var(--surface)";
    links.style.padding = "12px 24px";
    links.style.borderBottom = "1px solid var(--border)";
  });

  /* ------------------------------------------------------------------
     7. STATS CALCULATION
     ------------------------------------------------------------------ */
  function computeStats(students) {
    const total = students.length;
    if (total === 0) {
      return { total: 0, passPct: 0, feesDuePct: 0, attendanceAvg: 0, academicsAvg: 0, feesCollected: 0, feesPending: 0 };
    }
    let passCount = 0, totalFees = 0, totalPaid = 0, attendanceSum = 0, academicsSum = 0;
    students.forEach(function (s) {
      if (s.status === "Pass") passCount++;
      totalFees += Number(s.totalFees) || 0;
      totalPaid += Number(s.feesPaid) || 0;
      attendanceSum += Number(s.attendance) || 0;
      academicsSum += Number(s.academics) || 0;
    });
    const feesDue = Math.max(totalFees - totalPaid, 0);
    return {
      total: total,
      passPct: round1((passCount / total) * 100),
      feesDuePct: totalFees > 0 ? round1((feesDue / totalFees) * 100) : 0,
      attendanceAvg: round1(attendanceSum / total),
      academicsAvg: round1(academicsSum / total),
      feesCollected: totalPaid,
      feesPending: feesDue
    };
  }
  function round1(n) { return Math.round(n * 10) / 10; }
  function formatMoney(n) { return "₹" + Number(n || 0).toLocaleString("en-IN"); }

  /* ------------------------------------------------------------------
     8. RENDERING
     ------------------------------------------------------------------ */
  function renderPublicStats() {
    const stats = computeStats(getStudents());
    document.getElementById("heroTotalStudents").textContent = stats.total;
    document.getElementById("heroPassPct").textContent = stats.passPct + "%";
    document.getElementById("heroFeesDuePct").textContent = stats.feesDuePct + "%";
    document.getElementById("heroAttendance").textContent = stats.attendanceAvg + "%";
    document.getElementById("pubTotal").textContent = stats.total;
    document.getElementById("pubPass").textContent = stats.passPct + "%";
    document.getElementById("pubFees").textContent = stats.feesDuePct + "%";
  }

  function renderDashboard() {
    const students = getStudents();
    const stats = computeStats(students);
    document.getElementById("statTotal").textContent = stats.total;
    document.getElementById("statPass").textContent = stats.passPct + "%";
    document.getElementById("statFeesDue").textContent = stats.feesDuePct + "%";
    document.getElementById("statAttendance").textContent = stats.attendanceAvg + "%";
    document.getElementById("statAvgMarks").textContent = stats.academicsAvg + "%";
    document.getElementById("statFeesCollected").textContent = formatMoney(stats.feesCollected);
    document.getElementById("statFeesPending").textContent = formatMoney(stats.feesPending);
    document.getElementById("barPass").style.width = stats.passPct + "%";
    document.getElementById("barFeesDue").style.width = stats.feesDuePct + "%";
    document.getElementById("barAttendance").style.width = stats.attendanceAvg + "%";

    const recent = [...students].sort(function (a, b) { return (b.addedOn || "").localeCompare(a.addedOn || ""); }).slice(0, 6);
    const body = document.getElementById("recentTableBody");
    body.innerHTML = recent.length ? recent.map(function (s) {
      return "<tr>" +
        "<td>" + escapeHtml(s.roll) + "</td>" +
        "<td>" + escapeHtml(s.name) + "</td>" +
        "<td>" + escapeHtml(s.dept) + "</td>" +
        "<td>" + s.academics + "%</td>" +
        "<td>" + statusPill(s.status) + "</td>" +
        "</tr>";
    }).join("") : "<tr><td colspan='5' style='text-align:center; color:var(--text-faint);'>No students yet.</td></tr>";
  }

  function statusPill(status) {
    return "<span class='pill " + (status === "Pass" ? "pill-pass" : "pill-fail") + "'>" + status + "</span>";
  }
  function feesPill(s) {
    const due = (Number(s.totalFees) || 0) - (Number(s.feesPaid) || 0);
    if (due <= 0) return "<span class='pill pill-paid'>Fully Paid</span>";
    const pct = s.totalFees > 0 ? Math.round((due / s.totalFees) * 100) : 0;
    const cls = pct > 50 ? "pill-overdue" : "pill-due";
    return "<span class='pill " + cls + "'>Due " + formatMoney(due) + "</span>";
  }
  function miniBar(pct) {
    const p = Math.max(0, Math.min(100, Number(pct) || 0));
    return "<span class='progress-mini'><span style='width:" + p + "%'></span></span>" + p + "%";
  }
  function escapeHtml(str) {
    return String(str == null ? "" : str).replace(/[&<>"']/g, function (c) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c];
    });
  }

  function populateDeptFilter(students) {
    const depts = Array.from(new Set(students.map(function (s) { return s.dept; }).filter(Boolean))).sort();
    const select = document.getElementById("filterDept");
    const current = select.value;
    select.innerHTML = '<option value="">All Departments</option>' +
      depts.map(function (d) { return "<option value='" + escapeHtml(d) + "'>" + escapeHtml(d) + "</option>"; }).join("");
    select.value = depts.includes(current) ? current : "";

    const datalist = document.getElementById("deptList");
    datalist.innerHTML = depts.map(function (d) { return "<option value='" + escapeHtml(d) + "'>"; }).join("");
  }

  function renderStudentsTable() {
    const students = getStudents();
    populateDeptFilter(students);

    const search = document.getElementById("searchInput").value.trim().toLowerCase();
    const deptFilter = document.getElementById("filterDept").value;
    const statusFilter = document.getElementById("filterStatus").value;
    const feesFilter = document.getElementById("filterFees").value;

    let filtered = students.filter(function (s) {
      const matchesSearch = !search ||
        s.name.toLowerCase().includes(search) ||
        s.roll.toLowerCase().includes(search) ||
        (s.dept || "").toLowerCase().includes(search);
      const matchesDept = !deptFilter || s.dept === deptFilter;
      const matchesStatus = !statusFilter || s.status === statusFilter;
      const due = (Number(s.totalFees) || 0) - (Number(s.feesPaid) || 0);
      const matchesFees = !feesFilter || (feesFilter === "paid" ? due <= 0 : due > 0);
      return matchesSearch && matchesDept && matchesStatus && matchesFees;
    });

    filtered.sort(function (a, b) { return a.name.localeCompare(b.name); });

    const body = document.getElementById("studentsTableBody");
    const emptyState = document.getElementById("emptyState");

    if (filtered.length === 0) {
      body.innerHTML = "";
      emptyState.classList.remove("hidden");
    } else {
      emptyState.classList.add("hidden");
      body.innerHTML = filtered.map(function (s) {
        return "<tr>" +
          "<td>" + escapeHtml(s.roll) + "</td>" +
          "<td>" + escapeHtml(s.name) + "</td>" +
          "<td>" + escapeHtml(s.dept) + "</td>" +
          "<td>" + escapeHtml(s.year) + "</td>" +
          "<td>" + miniBar(s.attendance) + "</td>" +
          "<td>" + miniBar(s.academics) + "</td>" +
          "<td>" + statusPill(s.status) + "</td>" +
          "<td>" + feesPill(s) + "</td>" +
          "<td><div class='row-actions'>" +
            "<button class='edit' data-edit='" + s.id + "' title='Edit'>✎</button>" +
            "<button class='del' data-del='" + s.id + "' title='Delete'>🗑</button>" +
          "</div></td>" +
          "</tr>";
      }).join("");
    }
  }

  function renderAll() {
    renderDashboard();
    renderStudentsTable();
    renderPublicStats();
  }

  ["searchInput"].forEach(function (id) {
    document.getElementById(id).addEventListener("input", renderStudentsTable);
  });
  ["filterDept", "filterStatus", "filterFees"].forEach(function (id) {
    document.getElementById(id).addEventListener("change", renderStudentsTable);
  });

  /* ------------------------------------------------------------------
     9. ADD / EDIT STUDENT
     ------------------------------------------------------------------ */
  const studentForm = document.getElementById("studentForm");
  const studentMsg = document.getElementById("studentMsg");

  function openStudentModal(editId) {
    studentForm.reset();
    studentMsg.className = "form-msg";
    document.getElementById("studentEditId").value = editId || "";

    if (editId) {
      const s = getStudents().find(function (x) { return x.id === editId; });
      if (s) {
        document.getElementById("studentModalTitle").textContent = "Edit Student";
        document.getElementById("studentSubmitBtn").textContent = "Save Changes";
        document.getElementById("sRoll").value = s.roll;
        document.getElementById("sName").value = s.name;
        document.getElementById("sDept").value = s.dept;
        document.getElementById("sYear").value = s.year;
        document.getElementById("sEmail").value = s.email || "";
        document.getElementById("sPhone").value = s.phone || "";
        document.getElementById("sTotalFees").value = s.totalFees;
        document.getElementById("sFeesPaid").value = s.feesPaid;
        document.getElementById("sAcademics").value = s.academics;
        document.getElementById("sAttendance").value = s.attendance;
        document.getElementById("sStatus").value = s.status;
      }
    } else {
      document.getElementById("studentModalTitle").textContent = "Add Student";
      document.getElementById("studentSubmitBtn").textContent = "Save Student";
    }
    openModal("studentOverlay");
  }

  document.getElementById("addStudentBtn").addEventListener("click", function () { openStudentModal(null); });
  document.getElementById("addStudentTopBtn").addEventListener("click", function () { openStudentModal(null); });
  document.getElementById("closeStudentBtn").addEventListener("click", function () { closeModal("studentOverlay"); });

  document.getElementById("sAcademics").addEventListener("input", function () {
    const val = Number(this.value);
    if (!isNaN(val) && this.value !== "") {
      document.getElementById("sStatus").value = val >= 35 ? "Pass" : "Fail";
    }
  });

  studentForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const editId = document.getElementById("studentEditId").value;

    const roll = document.getElementById("sRoll").value.trim();
    const totalFees = Number(document.getElementById("sTotalFees").value);
    const feesPaid = Number(document.getElementById("sFeesPaid").value);
    const academics = Number(document.getElementById("sAcademics").value);
    const attendance = Number(document.getElementById("sAttendance").value);

    if (feesPaid > totalFees) {
      studentMsg.textContent = "Fees paid cannot exceed total fees.";
      studentMsg.className = "form-msg error";
      return;
    }
    if (academics < 0 || academics > 100 || attendance < 0 || attendance > 100) {
      studentMsg.textContent = "Academic score and attendance must be between 0 and 100.";
      studentMsg.className = "form-msg error";
      return;
    }

    const students = getStudents();
    const dupRoll = students.find(function (s) { return s.roll.toLowerCase() === roll.toLowerCase() && s.id !== editId; });
    if (dupRoll) {
      studentMsg.textContent = "That roll number is already in use.";
      studentMsg.className = "form-msg error";
      return;
    }

    const data = {
      roll: roll,
      name: document.getElementById("sName").value.trim(),
      dept: document.getElementById("sDept").value.trim(),
      year: document.getElementById("sYear").value,
      email: document.getElementById("sEmail").value.trim(),
      phone: document.getElementById("sPhone").value.trim(),
      totalFees: totalFees,
      feesPaid: feesPaid,
      academics: academics,
      attendance: attendance,
      status: document.getElementById("sStatus").value
    };

    if (editId) {
      const idx = students.findIndex(function (s) { return s.id === editId; });
      if (idx > -1) students[idx] = { ...students[idx], ...data };
      showToast("Student record updated.");
    } else {
      data.id = "s" + Date.now();
      data.addedOn = new Date().toISOString().slice(0, 10);
      students.push(data);
      showToast("Student added successfully.");
    }

    setStudents(students);
    closeModal("studentOverlay");
    renderAll();
  });

  /* ------------------------------------------------------------------
     10. EDIT / DELETE (event delegation on students table)
     ------------------------------------------------------------------ */
  let pendingDeleteId = null;

  document.getElementById("studentsTableBody").addEventListener("click", function (e) {
    const editBtn = e.target.closest("[data-edit]");
    const delBtn = e.target.closest("[data-del]");
    if (editBtn) openStudentModal(editBtn.dataset.edit);
    if (delBtn) {
      pendingDeleteId = delBtn.dataset.del;
      const s = getStudents().find(function (x) { return x.id === pendingDeleteId; });
      document.getElementById("confirmTitle").textContent = "Delete " + (s ? s.name : "student") + "?";
      document.getElementById("confirmText").textContent = "This will permanently remove this student's record.";
      openModal("confirmOverlay");
    }
  });

  document.getElementById("confirmCancelBtn").addEventListener("click", function () {
    pendingDeleteId = null;
    closeModal("confirmOverlay");
  });

  document.getElementById("confirmOkBtn").addEventListener("click", function () {
    if (pendingDeleteId) {
      const students = getStudents().filter(function (s) { return s.id !== pendingDeleteId; });
      setStudents(students);
      renderAll();
      showToast("Student record deleted.");
      pendingDeleteId = null;
    }
    closeModal("confirmOverlay");
  });

  /* ------------------------------------------------------------------
     11. SETTINGS — CHANGE ADMIN CREDENTIALS
     ------------------------------------------------------------------ */
  const settingsForm = document.getElementById("settingsForm");
  const settingsMsg = document.getElementById("settingsMsg");

  document.querySelector('[data-view="settings"]').addEventListener("click", function () {
    document.getElementById("newId").value = getAdmin().id;
    settingsForm.reset();
    document.getElementById("newId").value = getAdmin().id;
    settingsMsg.className = "form-msg";
  });

  settingsForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const admin = getAdmin();
    const curPw = document.getElementById("curPw").value;
    const newId = document.getElementById("newId").value.trim();
    const newPw = document.getElementById("newPw").value;
    const confirmPw = document.getElementById("confirmPw").value;

    if (curPw !== admin.password) {
      settingsMsg.textContent = "Current password is incorrect.";
      settingsMsg.className = "form-msg error";
      return;
    }
    if (!newId) {
      settingsMsg.textContent = "Admin ID cannot be empty.";
      settingsMsg.className = "form-msg error";
      return;
    }
    if (newPw !== confirmPw) {
      settingsMsg.textContent = "New password and confirmation do not match.";
      settingsMsg.className = "form-msg error";
      return;
    }
    if (newPw.length < 4) {
      settingsMsg.textContent = "Password must be at least 4 characters.";
      settingsMsg.className = "form-msg error";
      return;
    }

    setAdmin({ id: newId, password: newPw });
    document.getElementById("sidebarAdminId").textContent = newId;
    settingsMsg.textContent = "Credentials updated successfully.";
    settingsMsg.className = "form-msg success";
    document.getElementById("curPw").value = "";
    document.getElementById("newPw").value = "";
    document.getElementById("confirmPw").value = "";
    showToast("Admin credentials updated.");
  });

  /* ------------------------------------------------------------------
     12. DANGER ZONE — CLEAR ALL
     ------------------------------------------------------------------ */
  document.getElementById("clearAllBtn").addEventListener("click", function () {
    document.getElementById("confirmTitle").textContent = "Delete ALL student records?";
    document.getElementById("confirmText").textContent = "This will permanently remove every student record from the system. This cannot be undone.";
    pendingDeleteId = "__ALL__";
    openModal("confirmOverlay");
  });

  const originalConfirmHandler = document.getElementById("confirmOkBtn");
  originalConfirmHandler.addEventListener("click", function () {
    if (pendingDeleteId === "__ALL__") {
      setStudents([]);
      renderAll();
      showToast("All student records deleted.");
      pendingDeleteId = null;
    }
  });

  /* ------------------------------------------------------------------
     13. EXPORT / IMPORT JSON
     ------------------------------------------------------------------ */
  document.getElementById("exportBtn").addEventListener("click", function () {
    const data = { exportedAt: new Date().toISOString(), students: getStudents() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sjcd-students-" + new Date().toISOString().slice(0, 10) + ".json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    showToast("Student data exported.");
  });

  document.getElementById("importBtn").addEventListener("click", function () {
    document.getElementById("importFile").click();
  });

  document.getElementById("importFile").addEventListener("change", function (e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function () {
      try {
        const parsed = JSON.parse(reader.result);
        const incoming = Array.isArray(parsed) ? parsed : parsed.students;
        if (!Array.isArray(incoming)) throw new Error("Invalid format");
        const cleaned = incoming.filter(function (s) { return s && s.roll && s.name; }).map(function (s, i) {
          return {
            id: s.id || ("s" + Date.now() + i),
            roll: String(s.roll),
            name: String(s.name),
            dept: String(s.dept || "General"),
            year: String(s.year || "1st Year"),
            email: String(s.email || ""),
            phone: String(s.phone || ""),
            totalFees: Number(s.totalFees) || 0,
            feesPaid: Number(s.feesPaid) || 0,
            academics: Number(s.academics) || 0,
            attendance: Number(s.attendance) || 0,
            status: s.status === "Fail" ? "Fail" : "Pass",
            addedOn: s.addedOn || new Date().toISOString().slice(0, 10)
          };
        });
        setStudents(cleaned);
        renderAll();
        showToast("Imported " + cleaned.length + " student record(s).");
      } catch (err) {
        showToast("Import failed — file is not valid JSON.", true);
      }
      e.target.value = "";
    };
    reader.readAsText(file);
  });

  /* ------------------------------------------------------------------
     14. REAL-TIME SYNC ACROSS TABS
     ------------------------------------------------------------------ */
  window.addEventListener("storage", function (e) {
    if (e.key === KEY_STUDENTS || e.key === KEY_ADMIN) {
      renderAll();
      if (e.key === KEY_ADMIN) document.getElementById("sidebarAdminId").textContent = getAdmin().id;
    }
    if (e.key === KEY_THEME) applyTheme(currentThemePref());
  });

  /* ------------------------------------------------------------------
     15. INIT
     ------------------------------------------------------------------ */
  document.getElementById("year").textContent = new Date().getFullYear();
  renderPublicStats();

  if (sessionStorage.getItem(SESSION_KEY) === "1") {
    enterAdmin();
  }

})();
