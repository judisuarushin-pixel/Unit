const STORE = 'uldms_prototype_v1';

const seed = {
  tenants: [
    { id: 1, name: 'Maria Santos', type: 'Individual', contact: '0917-555-0101', email: 'maria.santos@example.test', address: 'Tanza, Cavite', status: 'Active' },
    { id: 2, name: 'Juan Dela Cruz', type: 'Individual', contact: '0917-555-0102', email: 'juan.dc@example.test', address: 'Trece Martires, Cavite', status: 'Active' },
    { id: 3, name: 'Ana Reyes Trading', type: 'Business', contact: '046-555-0103', email: 'ana.reyes@example.test', address: 'Tanza, Cavite', status: 'Active' },
    { id: 4, name: 'Pedro Lim', type: 'Individual', contact: '0917-555-0104', email: 'pedro.lim@example.test', address: 'Naic, Cavite', status: 'Active' },
    { id: 5, name: 'Carla Mendoza', type: 'Individual', contact: '0917-555-0105', email: 'carla.m@example.test', address: 'Tanza, Cavite', status: 'Active' },
  ],
  units: [
    { id: 1, code: 'UC-101', location: 'Market Block A', area: 18, rent: 18000, status: 'Occupied' },
    { id: 2, code: 'UC-102', location: 'Market Block A', area: 18, rent: 18000, status: 'Occupied' },
    { id: 3, code: 'UC-103', location: 'Market Block A', area: 20, rent: 18000, status: 'Occupied' },
    { id: 4, code: 'UC-104', location: 'Market Block B', area: 22, rent: 18000, status: 'Occupied' },
    { id: 5, code: 'UC-105', location: 'Market Block B', area: 22, rent: 18000, status: 'Occupied' },
    { id: 6, code: 'UC-106', location: 'Market Block B', area: 20, rent: 16500, status: 'Vacant' },
    { id: 7, code: 'UC-107', location: 'Market Block C', area: 24, rent: 20000, status: 'Vacant' },
    { id: 8, code: 'UC-108', location: 'Market Block C', area: 19, rent: 17500, status: 'Vacant' },
  ],
  leases: [
    { id: 1, tenantId: 1, unitId: 1, start: '2025-01-01', end: '2025-12-31', rent: 18000, dueDay: 5, status: 'Active' },
    { id: 2, tenantId: 2, unitId: 2, start: '2025-02-01', end: '2026-01-31', rent: 18000, dueDay: 5, status: 'Active' },
    { id: 3, tenantId: 3, unitId: 3, start: '2025-01-15', end: '2025-12-31', rent: 18000, dueDay: 10, status: 'Active' },
    { id: 4, tenantId: 4, unitId: 4, start: '2025-03-01', end: '2026-02-28', rent: 18000, dueDay: 10, status: 'Active' },
    { id: 5, tenantId: 5, unitId: 5, start: '2025-01-01', end: '2025-12-31', rent: 18000, dueDay: 15, status: 'Active' },
  ],
  billings: [
    { id: 1, leaseId: 1, period: '2025-04', issued: '2025-04-01', due: '2025-04-05', rent: 18000, adjustment: 0, total: 18000, balance: 0, status: 'Paid' },
    { id: 2, leaseId: 2, period: '2025-04', issued: '2025-04-01', due: '2025-04-05', rent: 18000, adjustment: 0, total: 18000, balance: 0, status: 'Paid' },
    { id: 3, leaseId: 3, period: '2025-04', issued: '2025-04-01', due: '2025-04-10', rent: 18000, adjustment: 0, total: 18000, balance: 18000, status: 'Pending' },
    { id: 4, leaseId: 4, period: '2025-04', issued: '2025-04-01', due: '2025-04-10', rent: 18000, adjustment: 0, total: 18000, balance: 0, status: 'Paid' },
    { id: 5, leaseId: 5, period: '2025-04', issued: '2025-04-01', due: '2025-04-15', rent: 18000, adjustment: 0, total: 18000, balance: 0, status: 'Paid' },
  ],
  payments: [
    { id: 1, billingId: 1, date: '2025-04-03', amount: 18000, method: 'Cash', reference: 'SAMPLE-001', recordedBy: 'admin' },
    { id: 2, billingId: 2, date: '2025-04-04', amount: 18000, method: 'Bank deposit (sample)', reference: 'SAMPLE-002', recordedBy: 'admin' },
    { id: 3, billingId: 4, date: '2025-04-08', amount: 18000, method: 'Cash', reference: 'SAMPLE-003', recordedBy: 'admin' },
    { id: 4, billingId: 5, date: '2025-04-12', amount: 18000, method: 'Cash', reference: 'SAMPLE-004', recordedBy: 'admin' },
  ],
  users: [
    { id: 1, username: 'admin', name: 'Admin Staff', role: 'Administrator', status: 'Active' },
    { id: 2, username: 'staff01', name: 'Demo Office Staff', role: 'Office Staff', status: 'Active' },
  ],
  logs: [],
};

let db = load();
let page = 'dashboard';
let currentUser = 'Admin Staff';
let toastTimer = null;

function cloneSeed() {
  return JSON.parse(JSON.stringify(seed));
}

function load() {
  try {
    const raw = localStorage.getItem(STORE);
    return raw ? JSON.parse(raw) : cloneSeed();
  } catch {
    return cloneSeed();
  }
}

function save() {
  localStorage.setItem(STORE, JSON.stringify(db));
}

const esc = (s) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }[c]));

const money = (n) =>
  '₱' +
  Number(n || 0).toLocaleString('en-PH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const tenant = (id) => db.tenants.find((x) => x.id == id)?.name || 'Unknown tenant';
const unit = (id) => db.units.find((x) => x.id == id)?.code || 'Unknown unit';
const lease = (id) => db.leases.find((x) => x.id == id);
const leaseName = (id) => {
  const l = lease(id);
  return l ? tenant(l.tenantId) + ' · ' + unit(l.unitId) : 'Unknown lease';
};
const nextId = (arr) => Math.max(0, ...arr.map((x) => Number(x.id) || 0)) + 1;

function log(action, what) {
  db.logs.unshift({
    id: nextId(db.logs),
    user: currentUser,
    action,
    what,
    when: new Date().toLocaleString(),
  });
  save();
}

function toast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2400);
}

function badge(s) {
  const cl = ['Paid', 'Active', 'Occupied'].includes(s)
    ? 'green'
    : ['Pending', 'Vacant', 'Draft'].includes(s)
      ? 'orange'
      : ['Inactive', 'Expired', 'Overdue'].includes(s)
        ? 'red'
        : 'blue';
  return `<span class="badge ${cl}">${esc(s)}</span>`;
}

function table(headers, rows) {
  return `<div class="table-wrap"><table><thead><tr>${headers
    .map((h) => `<th>${h}</th>`)
    .join('')}</tr></thead><tbody>${
    rows.length
      ? rows.join('')
      : `<tr><td colspan="${headers.length}" class="empty">No records found.</td></tr>`
  }</tbody></table></div>`;
}

function title(h, p, btn = '') {
  return `<div class="page-head"><div><h1>${h}</h1><p>${p}</p></div>${btn}</div>`;
}

function actionBtn(label, fn, cls = 'btn-primary') {
  return `<button type="button" class="btn ${cls}" onclick="${fn}">${label}</button>`;
}

function openModal(titleText, body, foot = '') {
  const root = document.getElementById('modalRoot');
  if (!root) return;
  root.innerHTML = `<div class="modal-backdrop" id="backdrop"><div class="modal"><div class="modal-head"><h2>${titleText}</h2><button type="button" class="close" onclick="closeModal()">×</button></div><div class="modal-content">${body}</div><div class="modal-foot">${foot}<button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button></div></div></div>`;
  const backdrop = document.getElementById('backdrop');
  if (backdrop) {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) closeModal();
    });
  }
}

function closeModal() {
  const root = document.getElementById('modalRoot');
  if (root) root.innerHTML = '';
}

function openConfirmModal(titleText, message, confirmLabel, confirmClass, onConfirm) {
  openModal(
    titleText,
    `<p class="muted">${esc(message)}</p>`,
    `<button type="button" class="btn ${confirmClass}" id="confirmActionBtn">${esc(confirmLabel)}</button>`
  );
  const btn = document.getElementById('confirmActionBtn');
  if (btn) {
    btn.addEventListener('click', () => {
      closeModal();
      onConfirm();
    });
  }
}

function field(label, name, value = '', type = 'text', required = true, extra = '') {
  return `<div class="form-group"><label>${label}${required ? ' *' : ''}</label><input name="${name}" type="${type}" value="${esc(value)}" ${required ? 'required' : ''} ${extra}></div>`;
}

function selectField(label, name, options, val = '', required = true) {
  return `<div class="form-group"><label>${label}${required ? ' *' : ''}</label><select name="${name}" ${required ? 'required' : ''}>${options
    .map(
      (o) =>
        `<option value="${esc(o.value)}" ${String(o.value) === String(val) ? 'selected' : ''}>${esc(o.label)}</option>`
    )
    .join('')}</select></div>`;
}

function nav(p) {
  page = p;
  document.querySelectorAll('#nav button[data-page]').forEach((b) => {
    const el = /** @type {HTMLElement} */ (b);
    el.classList.toggle('active', el.dataset.page === p);
  });
  render();
}

function render() {
  const root = document.getElementById('view');
  if (!root) return;
  const views = {
    dashboard,
    tenants: tenantsPage,
    units: unitsPage,
    leases: leasesPage,
    billing: billingPage,
    reports: reportsPage,
    users: usersPage,
  };
  (views[page] || dashboard)(root);
}

function dashboard(root) {
  const occupied = db.units.filter((x) => x.status === 'Occupied').length;
  const vacant = db.units.length - occupied;
  const active = db.leases.filter((x) => x.status === 'Active').length;
  const outstanding = db.billings.reduce((a, b) => a + Number(b.balance), 0);
  const pct = db.units.length ? Math.round((occupied / db.units.length) * 100) : 0;
  const pctExact = db.units.length ? (occupied / db.units.length) * 100 : 0;

  const recent = [...db.payments]
    .sort((a, b) => b.id - a.id)
    .slice(0, 5)
    .map((p) => {
      const b = db.billings.find((x) => x.id === p.billingId);
      const l = b && lease(b.leaseId);
      return `<tr><td>${esc(p.date)}</td><td>${esc(l ? tenant(l.tenantId) : '—')}</td><td>${esc(l ? unit(l.unitId) : '—')}</td><td>${money(p.amount)}</td><td>${badge('Paid')}</td></tr>`;
    });

  root.innerHTML =
    title('Dashboard', 'Welcome back, ' + esc(currentUser) + '!') +
    `<div class="grid stats">
      <div class="stat"><div class="label">Total Units</div><div class="value">${db.units.length}</div><div class="hint">Commercial unit records</div></div>
      <div class="stat teal"><div class="label">Active Tenants</div><div class="value">${db.tenants.filter((t) => t.status === 'Active').length}</div><div class="hint">Tenant profiles</div></div>
      <div class="stat orange"><div class="label">Active Leases</div><div class="value">${active}</div><div class="hint">Current lease records</div></div>
      <div class="stat green"><div class="label">Total Outstanding</div><div class="value money-val">${money(outstanding)}</div><div class="hint">Sample billing balances</div></div>
    </div>
    <div class="grid two-col">
      <div class="panel">
        <div class="panel-head"><h3>Unit Availability</h3><span class="muted small">Sample inventory</span></div>
        <div class="panel-body">
          <div class="availability-wrap">
            <div class="donut-ring" id="availabilityDonut">
              <div class="donut-inner">${pct}%</div>
            </div>
            <div>
              <p>🔵 Occupied: <b>${occupied}</b></p>
              <p>⚪ Vacant: <b>${vacant}</b></p>
              <p class="muted small">Availability is calculated from unit status.</p>
            </div>
          </div>
        </div>
      </div>
      <div class="panel">
        <div class="panel-head"><h3>Quick Actions</h3></div>
        <div class="panel-body quick-actions">
          <button type="button" onclick="showTenantForm()">＋ Add New Tenant<span>Create tenant profile</span></button>
          <button type="button" onclick="showUnitForm()">＋ Add New Unit<span>Register a unit</span></button>
          <button type="button" onclick="showLeaseForm()">▤ Create Lease<span>Link tenant and unit</span></button>
          <button type="button" onclick="showBillingForm()">₱ Create Billing<span>Prepare a sample bill</span></button>
        </div>
      </div>
    </div>
    <div class="panel panel-spaced">
      <div class="panel-head">
        <h3>Recent Payment Entries</h3>
        <button type="button" class="btn btn-plain" onclick="nav('billing')">View Billing →</button>
      </div>
      ${table(['Date', 'Tenant', 'Unit', 'Amount', 'Status'], recent)}
    </div>
    <p class="muted small demo-footnote">Demonstration only: values use prepared sample records stored in this browser.</p>`;

  const donut = document.getElementById('availabilityDonut');
  if (donut) {
    donut.style.background = `conic-gradient(#1769c2 ${pctExact}%, #e4eaf1 0)`;
  }
}

function searchToolbar(placeholder, filter = '') {
  return `<div class="toolbar"><div class="search"><input id="tableSearch" placeholder="${placeholder}" oninput="filterTable()"></div>${filter}</div>`;
}

function tenantsPage(root) {
  const rows = db.tenants.map(
    (t) =>
      `<tr data-search="${esc((t.name + ' ' + t.contact + ' ' + t.email + ' ' + t.address).toLowerCase())}"><td><b>${esc(t.name)}</b></td><td>${esc(t.type)}</td><td>${esc(t.contact)}</td><td>${esc(t.email)}</td><td>${badge(t.status)}</td><td><div class="actions"><button type="button" onclick="editTenant(${t.id})">Edit</button><button type="button" onclick="deleteRecord('tenants',${t.id})">Delete</button></div></td></tr>`
  );
  root.innerHTML =
    title('Tenant Management', 'Register, update, search, and retrieve tenant or business profiles.', actionBtn('＋ Add Tenant', 'showTenantForm()')) +
    searchToolbar('Search tenant name, contact, email, or address') +
    `<div class="panel">${table(['Tenant / Business', 'Type', 'Contact', 'Email', 'Status', 'Actions'], rows)}</div>`;
}

function unitsPage(root) {
  const rows = db.units.map(
    (u) =>
      `<tr data-search="${esc((u.code + ' ' + u.location + ' ' + u.status).toLowerCase())}"><td><b>${esc(u.code)}</b></td><td>${esc(u.location)}</td><td>${u.area} m²</td><td>${money(u.rent)}</td><td>${badge(u.status)}</td><td><div class="actions"><button type="button" onclick="editUnit(${u.id})">Edit</button><button type="button" onclick="deleteRecord('units',${u.id})">Delete</button></div></td></tr>`
  );
  root.innerHTML =
    title('Unit Management', 'Maintain commercial unit details, rental rates, and availability.', actionBtn('＋ Add Unit', 'showUnitForm()')) +
    searchToolbar('Search unit code, location, or status') +
    `<div class="panel">${table(['Unit Code', 'Location / Section', 'Area', 'Rental Rate', 'Status', 'Actions'], rows)}</div>`;
}

function leasesPage(root) {
  const rows = db.leases.map(
    (l) =>
      `<tr data-search="${esc((tenant(l.tenantId) + ' ' + unit(l.unitId) + ' ' + l.status).toLowerCase())}"><td>#${l.id}</td><td>${esc(tenant(l.tenantId))}</td><td>${esc(unit(l.unitId))}</td><td>${esc(l.start)}</td><td>${esc(l.end)}</td><td>${money(l.rent)}</td><td>${badge(l.status)}</td><td><div class="actions"><button type="button" onclick="editLease(${l.id})">Edit</button><button type="button" onclick="deleteRecord('leases',${l.id})">Delete</button></div></td></tr>`
  );
  root.innerHTML =
    title('Lease Management', 'Create and update lease agreements and link tenants with units.', actionBtn('＋ Create Lease', 'showLeaseForm()')) +
    searchToolbar('Search tenant, unit, or lease status') +
    `<div class="panel">${table(['Lease ID', 'Tenant', 'Unit', 'Start Date', 'End Date', 'Monthly Rent', 'Status', 'Actions'], rows)}</div>`;
}

function billingPage(root) {
  const rows = db.billings.map((b) => {
    const l = lease(b.leaseId);
    return `<tr data-search="${esc(((l ? tenant(l.tenantId) : '') + ' ' + (l ? unit(l.unitId) : '') + ' ' + b.period + ' ' + b.status).toLowerCase())}"><td>#${b.id}</td><td>${esc(l ? tenant(l.tenantId) : '—')}</td><td>${esc(l ? unit(l.unitId) : '—')}</td><td>${esc(b.period)}</td><td>${esc(b.due)}</td><td>${money(b.total)}</td><td>${money(b.balance)}</td><td>${badge(b.status)}</td><td><div class="actions"><button type="button" onclick="showPaymentForm(${b.id})" ${b.balance <= 0 ? 'disabled' : ''}>Record Payment</button><button type="button" onclick="deleteRecord('billings',${b.id})">Delete</button></div></td></tr>`;
  });
  const paid = db.payments.reduce((a, p) => a + p.amount, 0);
  const outstanding = db.billings.reduce((a, b) => a + b.balance, 0);
  root.innerHTML =
    title(
      'Billing & Payment Logging',
      'Prepare sample monthly billing records and record sample payments.',
      `<div class="btn-group">${actionBtn('＋ Create Billing', 'showBillingForm()')}${actionBtn('₱ Record Payment', 'showPaymentForm()', 'btn-success')}</div>`
    ) +
    `<div class="grid stats">
      <div class="stat"><div class="label">Billing Records</div><div class="value">${db.billings.length}</div></div>
      <div class="stat green"><div class="label">Sample Payments Logged</div><div class="value money-val">${money(paid)}</div></div>
      <div class="stat orange"><div class="label">Outstanding Balance</div><div class="value money-val">${money(outstanding)}</div></div>
      <div class="stat teal"><div class="label">Pending Bills</div><div class="value">${db.billings.filter((b) => b.balance > 0).length}</div></div>
    </div>
    <div class="toolbar"><div class="search"><input id="tableSearch" placeholder="Search tenant, unit, billing period, or status" oninput="filterTable()"></div></div>
    <div class="panel">${table(['Bill ID', 'Tenant', 'Unit', 'Period', 'Due Date', 'Total Due', 'Balance', 'Status', 'Actions'], rows)}</div>
    <div class="panel panel-spaced">
      <div class="panel-head"><h3>Payment History</h3><span class="muted small">Sample entries only</span></div>
      ${table(
        ['Payment ID', 'Billing ID', 'Date', 'Amount', 'Method', 'Reference'],
        db.payments.map(
          (p) =>
            `<tr><td>#${p.id}</td><td>#${p.billingId}</td><td>${esc(p.date)}</td><td>${money(p.amount)}</td><td>${esc(p.method)}</td><td>${esc(p.reference)}</td></tr>`
        )
      )}
    </div>`;
}

function reportsPage(root) {
  root.innerHTML =
    title(
      'Reports & Record Search',
      'Search and generate summaries from the prototype’s sample records.',
      `<button type="button" class="btn btn-secondary" onclick="resetDemo()">↻ Reset Sample Data</button>`
    ) +
    `<div class="grid report-cards">
      <div class="report-card"><h4>Tenant Master List</h4><p>Tenant and business profiles with contact details and status.</p><button type="button" class="btn btn-secondary" onclick="exportCSV('tenants')">Export CSV</button></div>
      <div class="report-card"><h4>Unit Availability</h4><p>Unit inventory, rental rates, and current occupancy status.</p><button type="button" class="btn btn-secondary" onclick="exportCSV('units')">Export CSV</button></div>
      <div class="report-card"><h4>Active Lease Summary</h4><p>Active tenant-unit associations and approved lease terms.</p><button type="button" class="btn btn-secondary" onclick="exportCSV('leases')">Export CSV</button></div>
      <div class="report-card"><h4>Billing Report</h4><p>Billing periods, amounts due, and outstanding balances.</p><button type="button" class="btn btn-secondary" onclick="exportCSV('billings')">Export CSV</button></div>
      <div class="report-card"><h4>Payment History</h4><p>Sample payments entered for demonstration and testing.</p><button type="button" class="btn btn-secondary" onclick="exportCSV('payments')">Export CSV</button></div>
      <div class="report-card"><h4>Collection Summary</h4><p>Paid amounts and remaining sample billing balances.</p><button type="button" class="btn btn-secondary" onclick="exportCSV('collection')">Export CSV</button></div>
    </div>
    <div class="panel panel-spaced">
      <div class="panel-head"><h3>Record Search</h3></div>
      <div class="panel-body">
        <div class="toolbar"><div class="search"><input id="globalSearch" placeholder="Search across tenant, unit, lease, billing, and payment data" oninput="globalSearch()"></div></div>
        <div id="searchResults" class="muted small">Enter a search term to find matching sample records.</div>
      </div>
    </div>`;
}

function usersPage(root) {
  const rows = db.users.map(
    (u) =>
      `<tr data-search="${esc((u.name + ' ' + u.username + ' ' + u.role).toLowerCase())}"><td>${esc(u.name)}</td><td>${esc(u.username)}</td><td>${esc(u.role)}</td><td>${badge(u.status)}</td><td><div class="actions"><button type="button" onclick="editUser(${u.id})">Edit</button>${u.username !== 'admin' ? `<button type="button" onclick="deleteRecord('users',${u.id})">Delete</button>` : ''}</div></td></tr>`
  );
  root.innerHTML =
    title('User Account Administration', 'Manage demonstration accounts, roles, and access status.', actionBtn('＋ Add User', 'showUserForm()')) +
    searchToolbar('Search user name, username, or role') +
    `<div class="panel">${table(['Name', 'Username', 'Role', 'Status', 'Actions'], rows)}</div>
    <div class="panel panel-spaced-sm">
      <div class="panel-head"><h3>Recent Activity</h3></div>
      ${table(
        ['User', 'Activity', 'Record', 'Time'],
        db.logs
          .slice(0, 10)
          .map((l) => `<tr><td>${esc(l.user)}</td><td>${esc(l.action)}</td><td>${esc(l.what)}</td><td>${esc(l.when)}</td></tr>`)
      )}
    </div>
    <p class="muted small">This demo uses a simple local sign-in. It is not production authentication and does not protect sensitive company information.</p>`;
}

function filterTable() {
  const input = /** @type {HTMLInputElement | null} */ (document.getElementById('tableSearch'));
  const q = (input?.value || '').toLowerCase();
  document.querySelectorAll('#view tbody tr[data-search]').forEach((r) => {
    const row = /** @type {HTMLElement} */ (r);
    row.style.display = (row.dataset.search || '').includes(q) ? '' : 'none';
  });
}

function globalSearch() {
  const input = /** @type {HTMLInputElement | null} */ (document.getElementById('globalSearch'));
  const results = document.getElementById('searchResults');
  if (!input || !results) return;
  const q = input.value.toLowerCase();
  const out = [];
  if (!q) {
    results.textContent = 'Enter a search term to find matching sample records.';
    return;
  }
  for (const t of db.tenants) {
    if (JSON.stringify(t).toLowerCase().includes(q)) out.push(`Tenant: ${t.name} (${t.contact})`);
  }
  for (const u of db.units) {
    if (JSON.stringify(u).toLowerCase().includes(q)) out.push(`Unit: ${u.code} — ${u.location} — ${u.status}`);
  }
  for (const l of db.leases) {
    if ((tenant(l.tenantId) + ' ' + unit(l.unitId) + ' ' + JSON.stringify(l)).toLowerCase().includes(q)) {
      out.push(`Lease #${l.id}: ${tenant(l.tenantId)} — ${unit(l.unitId)} — ${l.status}`);
    }
  }
  for (const b of db.billings) {
    if ((leaseName(b.leaseId) + ' ' + JSON.stringify(b)).toLowerCase().includes(q)) {
      out.push(`Billing #${b.id}: ${leaseName(b.leaseId)} — ${b.period} — Balance ${money(b.balance)}`);
    }
  }
  results.innerHTML = out.length
    ? '<ul class="search-list">' + out.map((x) => `<li>${esc(x)}</li>`).join('') + '</ul>'
    : 'No matching sample records.';
}

function showTenantForm(id) {
  const t = db.tenants.find((x) => x.id === id) || {};
  openModal(
    id ? 'Edit Tenant' : 'Add Tenant',
    `<form id="recordForm" class="form-grid">
      ${field('Tenant / Business Name', 'name', t.name || '')}
      ${selectField(
        'Type',
        'type',
        [
          { value: 'Individual', label: 'Individual' },
          { value: 'Business', label: 'Business' },
        ],
        t.type || 'Individual'
      )}
      ${field('Contact Number', 'contact', t.contact || '')}
      ${field('Email', 'email', t.email || '', 'email', false)}
      <div class="form-group full"><label>Address *</label><input name="address" value="${esc(t.address || '')}" required></div>
      ${selectField(
        'Status',
        'status',
        [
          { value: 'Active', label: 'Active' },
          { value: 'Inactive', label: 'Inactive' },
        ],
        t.status || 'Active'
      )}
    </form>`,
    `${id ? `<button type="button" class="btn btn-danger" onclick="deleteRecord('tenants',${id})">Delete</button>` : ''}<button type="button" class="btn btn-primary" onclick="saveTenant(${id || 0})">Save Tenant</button>`
  );
}

function editTenant(id) {
  showTenantForm(id);
}

function saveTenant(id) {
  const f = /** @type {HTMLFormElement | null} */ (document.getElementById('recordForm'));
  if (!f || !f.reportValidity()) return;
  const d = Object.fromEntries(new FormData(f));
  const name = String(d.name || '').trim();
  if (db.tenants.some((x) => x.id !== id && x.name.toLowerCase() === name.toLowerCase())) {
    toast('A tenant with this name already exists.');
    return;
  }
  if (id) {
    Object.assign(db.tenants.find((x) => x.id === id), d);
  } else {
    db.tenants.push({ id: nextId(db.tenants), ...d });
  }
  log(id ? 'Updated tenant' : 'Added tenant', name);
  closeModal();
  render();
  toast('Tenant record saved.');
}

function showUnitForm(id) {
  const u = db.units.find((x) => x.id === id) || {};
  openModal(
    id ? 'Edit Unit' : 'Add Unit',
    `<form id="recordForm" class="form-grid">
      ${field('Unit Code', 'code', u.code || '')}
      ${field('Location / Section', 'location', u.location || '')}
      ${field('Area (m²)', 'area', u.area || '', 'number', true, 'min="1" step="0.01"')}
      ${field('Monthly Rental Rate (₱)', 'rent', u.rent || '', 'number', true, 'min="0" step="0.01"')}
      ${selectField(
        'Availability Status',
        'status',
        [
          { value: 'Vacant', label: 'Vacant' },
          { value: 'Occupied', label: 'Occupied' },
        ],
        u.status || 'Vacant'
      )}
    </form>`,
    `${id ? `<button type="button" class="btn btn-danger" onclick="deleteRecord('units',${id})">Delete</button>` : ''}<button type="button" class="btn btn-primary" onclick="saveUnit(${id || 0})">Save Unit</button>`
  );
}

function editUnit(id) {
  showUnitForm(id);
}

function saveUnit(id) {
  const f = /** @type {HTMLFormElement | null} */ (document.getElementById('recordForm'));
  if (!f || !f.reportValidity()) return;
  const raw = Object.fromEntries(new FormData(f));
  const code = String(raw.code || '').trim();
  const d = {
    code,
    location: String(raw.location || '').trim(),
    area: +raw.area,
    rent: +raw.rent,
    status: String(raw.status || 'Vacant'),
  };
  if (db.units.some((x) => x.id !== id && x.code.toLowerCase() === code.toLowerCase())) {
    toast('Unit code already exists.');
    return;
  }
  if (id) {
    Object.assign(db.units.find((x) => x.id === id), d);
  } else {
    db.units.push({ id: nextId(db.units), ...d });
  }
  log(id ? 'Updated unit' : 'Added unit', code);
  closeModal();
  render();
  toast('Unit record saved.');
}

function showLeaseForm(id) {
  const l = db.leases.find((x) => x.id === id) || {};
  const tenants = db.tenants.map((t) => ({ value: t.id, label: t.name }));
  const units = db.units
    .filter((u) => u.status === 'Vacant' || u.id === l.unitId)
    .map((u) => ({ value: u.id, label: u.code + ' · ' + u.location }));
  if (!tenants.length || !units.length) {
    toast('Add an active tenant and a vacant unit first.');
    return;
  }
  openModal(
    id ? 'Edit Lease' : 'Create Lease',
    `<form id="recordForm" class="form-grid">
      ${selectField('Tenant', 'tenantId', tenants, l.tenantId || '')}
      ${selectField('Unit', 'unitId', units, l.unitId || '')}
      ${field('Lease Start', 'start', l.start || '', 'date')}
      ${field('Lease End', 'end', l.end || '', 'date')}
      ${field('Monthly Rent (₱)', 'rent', l.rent || '', 'number', true, 'min="0" step="0.01"')}
      ${field('Due Day of Month', 'dueDay', l.dueDay || 5, 'number', true, 'min="1" max="28"')}
      ${selectField(
        'Lease Status',
        'status',
        [
          { value: 'Active', label: 'Active' },
          { value: 'Expired', label: 'Expired' },
          { value: 'Draft', label: 'Draft' },
        ],
        l.status || 'Active'
      )}
    </form><p class="muted small">Saving an active lease will mark its unit as occupied.</p>`,
    `${id ? `<button type="button" class="btn btn-danger" onclick="deleteRecord('leases',${id})">Delete</button>` : ''}<button type="button" class="btn btn-primary" onclick="saveLease(${id || 0})">Save Lease</button>`
  );
}

function editLease(id) {
  showLeaseForm(id);
}

function saveLease(id) {
  const f = /** @type {HTMLFormElement | null} */ (document.getElementById('recordForm'));
  if (!f || !f.reportValidity()) return;
  const raw = Object.fromEntries(new FormData(f));
  const d = {
    tenantId: +raw.tenantId,
    unitId: +raw.unitId,
    start: String(raw.start || ''),
    end: String(raw.end || ''),
    rent: +raw.rent,
    dueDay: +raw.dueDay,
    status: String(raw.status || 'Active'),
  };
  if (d.end < d.start) {
    toast('Lease end date must be after start date.');
    return;
  }
  const existing = id ? db.leases.find((x) => x.id === id) : null;
  if (existing) {
    const oldUnit = db.units.find((u) => u.id === existing.unitId);
    if (oldUnit && oldUnit.id !== d.unitId) oldUnit.status = 'Vacant';
    Object.assign(existing, d);
  } else {
    db.leases.push({ id: nextId(db.leases), ...d });
  }
  const u = db.units.find((x) => x.id === d.unitId);
  if (u) u.status = d.status === 'Active' ? 'Occupied' : 'Vacant';
  log(id ? 'Updated lease' : 'Created lease', tenant(d.tenantId) + ' / ' + unit(d.unitId));
  save();
  closeModal();
  render();
  toast('Lease record saved.');
}

function showBillingForm() {
  const leases = db.leases.filter((l) => l.status === 'Active');
  if (!leases.length) {
    toast('Create an active lease first.');
    return;
  }
  const now = new Date();
  const period = now.toISOString().slice(0, 7);
  const leaseOptions = leases.map((l) => ({ value: l.id, label: leaseName(l.id) + ' · ' + money(l.rent) }));
  openModal(
    'Create Monthly Billing',
    `<form id="recordForm" class="form-grid">
      ${selectField('Active Lease', 'leaseId', leaseOptions)}
      ${field('Billing Period', 'period', period, 'month')}
      ${field('Date Issued', 'issued', now.toISOString().slice(0, 10), 'date')}
      ${field('Due Date', 'due', now.toISOString().slice(0, 10), 'date')}
      ${field('Monthly Rent (₱)', 'rent', leases[0].rent, 'number', true, 'min="0" step="0.01"')}
      ${field('Approved Additional Charges (₱)', 'adjustment', 0, 'number', true, 'min="0" step="0.01"')}
    </form><p class="muted small">Creates a sample billing record. It does not send a bill to a tenant.</p>`,
    `<button type="button" class="btn btn-primary" onclick="saveBilling()">Create Billing</button>`
  );
  const leaseSelect = /** @type {HTMLSelectElement | null} */ (
    document.querySelector('#recordForm select[name="leaseId"]')
  );
  if (leaseSelect) {
    leaseSelect.addEventListener('change', () => {
      const selected = leases.find((x) => x.id === Number(leaseSelect.value));
      const rentInput = /** @type {HTMLInputElement | null} */ (
        document.querySelector('#recordForm input[name="rent"]')
      );
      if (selected && rentInput) rentInput.value = String(selected.rent);
    });
  }
}

function saveBilling() {
  const f = /** @type {HTMLFormElement | null} */ (document.getElementById('recordForm'));
  if (!f || !f.reportValidity()) return;
  const raw = Object.fromEntries(new FormData(f));
  const rent = +raw.rent;
  const adjustment = +raw.adjustment;
  const total = rent + adjustment;
  const d = {
    leaseId: +raw.leaseId,
    period: String(raw.period || ''),
    issued: String(raw.issued || ''),
    due: String(raw.due || ''),
    rent,
    adjustment,
    total,
    balance: total,
    status: 'Pending',
  };
  if (db.billings.some((b) => b.leaseId === d.leaseId && b.period === d.period)) {
    toast('A bill already exists for this lease and period.');
    return;
  }
  db.billings.push({ id: nextId(db.billings), ...d });
  log('Created billing', leaseName(d.leaseId) + ' / ' + d.period);
  save();
  closeModal();
  render();
  toast('Sample billing record created.');
}

function showPaymentForm(billingId) {
  const open = db.billings.filter((b) => b.balance > 0);
  if (!open.length) {
    toast('There are no outstanding sample bills.');
    return;
  }
  const options = open.map((b) => ({
    value: b.id,
    label: '#' + b.id + ' · ' + leaseName(b.leaseId) + ' · balance ' + money(b.balance),
  }));
  openModal(
    'Record Sample Payment',
    `<form id="recordForm" class="form-grid">
      ${selectField('Billing Record', 'billingId', options, billingId || '')}
      ${field('Payment Date', 'date', new Date().toISOString().slice(0, 10), 'date')}
      ${field('Amount Received (₱)', 'amount', '', 'number', true, 'min="0.01" step="0.01"')}
      ${selectField('Payment Method', 'method', [
        { value: 'Cash', label: 'Cash (sample)' },
        { value: 'Bank deposit (sample)', label: 'Bank deposit (sample)' },
        { value: 'Other recorded method', label: 'Other recorded method' },
      ])}
      ${field('Reference Number', 'reference', 'SAMPLE-' + String(nextId(db.payments)).padStart(3, '0'), 'text', false)}
      <div class="form-group full"><label>Note</label><input name="remarks" placeholder="Optional sample note"></div>
    </form><p class="muted small">This only logs sample payment information; no actual payment is collected or verified.</p>`,
    `<button type="button" class="btn btn-success" onclick="savePayment()">Save Payment Entry</button>`
  );
}

function savePayment() {
  const f = /** @type {HTMLFormElement | null} */ (document.getElementById('recordForm'));
  if (!f || !f.reportValidity()) return;
  const raw = Object.fromEntries(new FormData(f));
  const billingId = +raw.billingId;
  const amount = +raw.amount;
  const b = db.billings.find((x) => x.id === billingId);
  if (!b || amount > b.balance + 0.001) {
    toast('Payment amount cannot exceed the outstanding balance.');
    return;
  }
  db.payments.push({
    id: nextId(db.payments),
    billingId,
    date: String(raw.date || ''),
    amount,
    method: String(raw.method || 'Cash'),
    reference: String(raw.reference || ''),
    remarks: String(raw.remarks || ''),
    recordedBy: currentUser,
  });
  b.balance = Math.max(0, +(b.balance - amount).toFixed(2));
  b.status = b.balance === 0 ? 'Paid' : 'Partially Paid';
  log('Recorded sample payment', money(amount) + ' for billing #' + b.id);
  save();
  closeModal();
  render();
  toast('Sample payment recorded.');
}

function showUserForm(id) {
  const u = db.users.find((x) => x.id === id) || {};
  openModal(
    id ? 'Edit User' : 'Add User',
    `<form id="recordForm" class="form-grid">
      ${field('Full Name', 'name', u.name || '')}
      ${field('Username', 'username', u.username || '')}
      ${selectField(
        'Role',
        'role',
        [
          { value: 'Administrator', label: 'Administrator' },
          { value: 'Office Staff', label: 'Office Staff' },
        ],
        u.role || 'Office Staff'
      )}
      ${selectField(
        'Account Status',
        'status',
        [
          { value: 'Active', label: 'Active' },
          { value: 'Inactive', label: 'Inactive' },
        ],
        u.status || 'Active'
      )}
    </form><p class="muted small">Demo access only; all accounts use the shared demo password strawberry.</p>`,
    `<button type="button" class="btn btn-primary" onclick="saveUser(${id || 0})">Save User</button>`
  );
}

function editUser(id) {
  showUserForm(id);
}

function saveUser(id) {
  const f = /** @type {HTMLFormElement | null} */ (document.getElementById('recordForm'));
  if (!f || !f.reportValidity()) return;
  const d = Object.fromEntries(new FormData(f));
  const username = String(d.username || '').trim();
  if (db.users.some((x) => x.id !== id && x.username.toLowerCase() === username.toLowerCase())) {
    toast('Username already exists.');
    return;
  }
  if (id) {
    Object.assign(db.users.find((x) => x.id === id), d);
  } else {
    db.users.push({ id: nextId(db.users), ...d });
  }
  log(id ? 'Updated user' : 'Added user', username);
  save();
  closeModal();
  render();
  toast('Demo user saved.');
}

function deleteRecord(type, id) {
  openConfirmModal(
    'Confirm Deletion',
    'Delete this sample record? Related records may be affected.',
    'Delete',
    'btn-danger',
    () => {
      const x = db[type].find((r) => r.id === id);
      if (type === 'tenants' && db.leases.some((l) => l.tenantId === id)) {
        toast('Cannot delete tenant linked to a lease.');
        return;
      }
      if (type === 'units' && db.leases.some((l) => l.unitId === id)) {
        toast('Cannot delete unit linked to a lease.');
        return;
      }
      if (type === 'leases' && db.billings.some((b) => b.leaseId === id)) {
        toast('Cannot delete lease linked to billing records.');
        return;
      }
      if (type === 'billings' && db.payments.some((p) => p.billingId === id)) {
        toast('Cannot delete billing with payment entries.');
        return;
      }
      db[type] = db[type].filter((r) => r.id !== id);
      log('Deleted ' + type.slice(0, -1), x?.name || x?.code || '#' + id);
      save();
      closeModal();
      render();
      toast('Sample record deleted.');
    }
  );
}

function exportCSV(type) {
  let rows = [];
  const filename = type + '.csv';
  if (type === 'tenants') {
    rows = [
      ['ID', 'Name', 'Type', 'Contact', 'Email', 'Address', 'Status'],
      ...db.tenants.map((x) => [x.id, x.name, x.type, x.contact, x.email, x.address, x.status]),
    ];
  }
  if (type === 'units') {
    rows = [
      ['ID', 'Unit', 'Location', 'Area', 'Rent', 'Status'],
      ...db.units.map((x) => [x.id, x.code, x.location, x.area, x.rent, x.status]),
    ];
  }
  if (type === 'leases') {
    rows = [
      ['ID', 'Tenant', 'Unit', 'Start', 'End', 'Rent', 'Status'],
      ...db.leases
        .filter((x) => x.status === 'Active')
        .map((x) => [x.id, tenant(x.tenantId), unit(x.unitId), x.start, x.end, x.rent, x.status]),
    ];
  }
  if (type === 'billings') {
    rows = [
      ['ID', 'Tenant', 'Unit', 'Period', 'Due', 'Total', 'Balance', 'Status'],
      ...db.billings.map((x) => [
        x.id,
        tenant(lease(x.leaseId)?.tenantId),
        unit(lease(x.leaseId)?.unitId),
        x.period,
        x.due,
        x.total,
        x.balance,
        x.status,
      ]),
    ];
  }
  if (type === 'payments') {
    rows = [
      ['ID', 'Billing', 'Date', 'Amount', 'Method', 'Reference'],
      ...db.payments.map((x) => [x.id, x.billingId, x.date, x.amount, x.method, x.reference]),
    ];
  }
  if (type === 'collection') {
    rows = [
      ['Metric', 'Value'],
      ['Total billed', db.billings.reduce((a, x) => a + x.total, 0)],
      ['Total payment entries', db.payments.reduce((a, x) => a + x.amount, 0)],
      ['Outstanding balance', db.billings.reduce((a, x) => a + x.balance, 0)],
    ];
  }
  const csv = rows
    .map((r) => r.map((v) => '"' + String(v ?? '').replace(/"/g, '""') + '"').join(','))
    .join('\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
  toast('CSV report exported.');
}

function resetDemo() {
  openConfirmModal(
    'Reset Sample Data',
    'Reset all prototype data to the original sample records?',
    'Reset Data',
    'btn-danger',
    () => {
      db = cloneSeed();
      save();
      render();
      toast('Sample data reset.');
    }
  );
}

// Wire navigation, authentication, and global handlers
document.querySelectorAll('#nav button[data-page]').forEach((b) => {
  b.addEventListener('click', () => {
    const el = /** @type {HTMLElement} */ (b);
    if (el.dataset.page) nav(el.dataset.page);
  });
});

document.getElementById('logoutBtn')?.addEventListener('click', () => {
  document.getElementById('app')?.classList.add('hidden');
  document.getElementById('loginView')?.classList.remove('hidden');
});

document.getElementById('loginForm')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const userInput = /** @type {HTMLInputElement | null} */ (document.getElementById('loginUser'));
  const passInput = /** @type {HTMLInputElement | null} */ (document.getElementById('loginPass'));
  const u = (userInput?.value || '').trim();
  const p = passInput?.value || '';

  if (!db.users.some((x) => x.username === u && x.status === 'Active') || p !== 'strawberry') {
    toast('Demo login failed. Use admin / strawberry.');
    return;
  }

  const matchedUser = db.users.find((x) => x.username === u);
  currentUser = matchedUser ? matchedUser.name : 'Admin Staff';

  const displayEl = document.getElementById('userDisplay');
  const avatarEl = document.getElementById('userAvatar');
  if (displayEl) displayEl.textContent = currentUser;
  if (avatarEl) avatarEl.textContent = currentUser.charAt(0).toUpperCase() || 'A';

  document.getElementById('loginView')?.classList.add('hidden');
  document.getElementById('app')?.classList.remove('hidden');

  const todayEl = document.getElementById('today');
  if (todayEl) {
    todayEl.textContent = new Date().toLocaleDateString('en-PH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }
  nav('dashboard');
});

const todayInitEl = document.getElementById('today');
if (todayInitEl) {
  todayInitEl.textContent = new Date().toLocaleDateString('en-PH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

Object.assign(window, {
  nav,
  filterTable,
  globalSearch,
  showTenantForm,
  editTenant,
  saveTenant,
  showUnitForm,
  editUnit,
  saveUnit,
  showLeaseForm,
  editLease,
  saveLease,
  showBillingForm,
  saveBilling,
  showPaymentForm,
  savePayment,
  showUserForm,
  editUser,
  saveUser,
  deleteRecord,
  closeModal,
  exportCSV,
  resetDemo,
});
