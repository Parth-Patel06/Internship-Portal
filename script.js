const defaultInternships = [
 {id:1,title:"Frontend Developer Intern",company:"Triobyte Technology",category:"Web Development",location:"Anand",mode:"Hybrid",duration:"3 Months",stipend:"₹8,000/month",skills:"HTML, CSS, JavaScript",description:"Build responsive interfaces and work with the development team."},
  {id:2,title:"Data Analyst Intern",company:"Triobyte Technology",category:"Data Analytics",location:"Remote",mode:"Remote",duration:"6 Months",stipend:"₹10,000/month",skills:"Excel, SQL, Python",description:"Clean datasets, prepare reports and support business analysis."},
  {id:3,title:"Python Developer Intern",company:"Triobyte Technology",category:"Software Development",location:"Remote",mode:"Remote",duration:"4 Months",stipend:"₹12,000/month",skills:"Python, APIs, Git",description:"Develop Python features and integrate APIs in real projects."},
  {id:4,title:"UI/UX Design Intern",company:"Triobyte Technology",category:"Design",location:"Vadodara",mode:"Hybrid",duration:"3 Months",stipend:"₹7,000/month",skills:"Figma, UI Design",description:"Create user flows, wireframes and polished product interfaces."},
  {id:5,title:"Cybersecurity Intern",company:"Triobyte Technology",category:"Cybersecurity",location:"Gandhinagar",mode:"Remote",duration:"6 Months",stipend:"₹9,000/month",skills:"Networking, Linux, Security",description:"Assist with security testing, documentation and monitoring."}
];

const state = {
  users: JSON.parse(localStorage.getItem("sip_users") || "[]"),
  internships: JSON.parse(localStorage.getItem("sip_internships") || "null") || defaultInternships,
  applications: JSON.parse(localStorage.getItem("sip_applications") || "[]"),
  currentUser: JSON.parse(localStorage.getItem("sip_currentUser") || "null")
};

function save() {
  localStorage.setItem("sip_users", JSON.stringify(state.users));
  localStorage.setItem("sip_internships", JSON.stringify(state.internships));
  localStorage.setItem("sip_applications", JSON.stringify(state.applications));
  localStorage.setItem("sip_currentUser", JSON.stringify(state.currentUser));
}

function uid(prefix="id") { return prefix + Date.now() + Math.random().toString(16).slice(2); }

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

function toast(message) {
  const el = $("#toast");
  el.textContent = message;
  el.classList.add("show");
  setTimeout(() => el.classList.remove("show"), 2400);
}

function showAuth(type="login") {
  $$(".tab").forEach(b => b.classList.toggle("active", b.dataset.auth === type));
  $("#loginForm").classList.toggle("hidden", type !== "login");
  $("#registerForm").classList.toggle("hidden", type !== "register");
}

function openModal(html) {
  $("#modalContent").innerHTML = html;
  $("#modal").classList.remove("hidden");
}
function closeModal() { $("#modal").classList.add("hidden"); }

function login(user) {
  state.currentUser = user;
  save();
  renderApp();
}
function logout() {
  state.currentUser = null;
  save();
  $("#appView").classList.add("hidden");
  $("#authView").classList.remove("hidden");
  showAuth("login");
}

function renderApp() {
  if (!state.currentUser) return;
  $("#authView").classList.add("hidden");
  $("#appView").classList.remove("hidden");
  $("#userName").textContent = state.currentUser.name;
  $("#roleLabel").textContent = state.currentUser.role === "admin" ? "Administrator" : "Student";
  if ($("#topRole")) $("#topRole").textContent = state.currentUser.role === "admin" ? "Administrator" : "Student";
  $$(".student-only").forEach(x => x.classList.toggle("hidden", state.currentUser.role !== "student"));
  $$(".admin-only").forEach(x => x.classList.toggle("hidden", state.currentUser.role !== "admin"));
  $("#welcomeTitle").textContent = `Welcome, ${state.currentUser.name.split(" ")[0]}`;
  renderDashboard();
  renderInternships();
  renderApplications();
  renderProfile();
  renderAdmin();
}

function goPage(page) {
  $$(".page").forEach(p => p.classList.add("hidden"));
  $(`#${page}Page`).classList.remove("hidden");
  $$(".nav-btn").forEach(b => b.classList.toggle("active", b.dataset.page === page));
  if (page === "dashboard") renderDashboard();
  if (page === "internships") renderInternships();
  if (page === "applications") renderApplications();
  if (page === "profile") renderProfile();
  if (page === "manageInternships" || page === "manageApplications" || page === "students") renderAdmin();
}

function renderDashboard() {
  const isAdmin = state.currentUser.role === "admin";
  const myApps = state.applications.filter(a => a.userId === state.currentUser.id);
  const stats = isAdmin ? [
    ["Total Internships", state.internships.length],
    ["Students", state.users.filter(u => u.role === "student").length],
    ["Applications", state.applications.length],
    ["Selected", state.applications.filter(a => a.status === "Selected").length]
  ] : [
    ["Available Internships", state.internships.length],
    ["My Applications", myApps.length],
    ["Shortlisted", myApps.filter(a => a.status === "Shortlisted").length],
    ["Selected", myApps.filter(a => a.status === "Selected").length]
  ];
  $("#statsGrid").innerHTML = stats.map(s => `<div class="stat"><small>${s[0]}</small><strong>${s[1]}</strong></div>`).join("");
  $("#dashboardInternships").innerHTML = state.internships.slice(0,3).map(cardHTML).join("");
}

function cardHTML(i) {
  const applied = state.currentUser.role === "student" && state.applications.some(a => a.userId === state.currentUser.id && a.internshipId === i.id);
  return `<article class="internship-card">
    <span class="company">${escapeHTML(i.company)}</span>
    <h3>${escapeHTML(i.title)}</h3>
    <p>${escapeHTML(i.description)}</p>
    <div class="card-meta">
      <span class="chip">${escapeHTML(i.category)}</span>
      <span class="chip">${escapeHTML(i.location)}</span>
      <span class="chip">${escapeHTML(i.mode)}</span>
      <span class="chip">${escapeHTML(i.duration)}</span>
    </div>
    <div class="card-footer">
      <span class="stipend">${escapeHTML(i.stipend)}</span>
      <button class="small-btn" onclick="viewInternship(${i.id})">${applied ? "View Status" : "View Details"}</button>
    </div>
  </article>`;
}

function populateFilters() {
  const categories = [...new Set(state.internships.map(i => i.category))].sort();
  const locations = [...new Set(state.internships.map(i => i.location))].sort();
  $("#categoryFilter").innerHTML = `<option value="">All categories</option>` + categories.map(x => `<option>${escapeHTML(x)}</option>`).join("");
  $("#locationFilter").innerHTML = `<option value="">All locations</option>` + locations.map(x => `<option>${escapeHTML(x)}</option>`).join("");
}

function renderInternships() {
  populateFilters();
  const search = ($("#searchInput")?.value || "").toLowerCase();
  const cat = $("#categoryFilter")?.value || "";
  const loc = $("#locationFilter")?.value || "";
  const filtered = state.internships.filter(i =>
    `${i.title} ${i.company} ${i.skills}`.toLowerCase().includes(search) &&
    (!cat || i.category === cat) &&
    (!loc || i.location === loc)
  );
  $("#internshipGrid").innerHTML = filtered.length ? filtered.map(cardHTML).join("") : `<div class="empty">No internships match your filters.</div>`;
}

function viewInternship(id) {
  const i = state.internships.find(x => x.id === id);
  if (!i) return;
  const existing = state.applications.find(a => a.userId === state.currentUser.id && a.internshipId === id);
  let action = "";
  if (state.currentUser.role === "student") {
    action = existing
      ? `<span class="status status-${existing.status}">${existing.status}</span>`
      : `<button class="primary-btn" onclick="applyToInternship(${id})">Apply Now</button>`;
  }
  openModal(`<h2>${escapeHTML(i.title)}</h2>
    <div class="detail-list">
      <div><strong>Company:</strong> ${escapeHTML(i.company)}</div>
      <div><strong>Category:</strong> ${escapeHTML(i.category)}</div>
      <div><strong>Location:</strong> ${escapeHTML(i.location)}</div>
      <div><strong>Mode:</strong> ${escapeHTML(i.mode)}</div>
      <div><strong>Duration:</strong> ${escapeHTML(i.duration)}</div>
      <div><strong>Stipend:</strong> ${escapeHTML(i.stipend)}</div>
      <div><strong>Skills:</strong> ${escapeHTML(i.skills)}</div>
      <div><strong>Description:</strong> ${escapeHTML(i.description)}</div>
    </div>
    <div class="modal-actions">${action}<button class="outline-btn" onclick="closeModal()">Close</button></div>`);
}

function applyToInternship(id) {
  if (state.currentUser.role !== "student") return;
  const user = state.users.find(u => u.id === state.currentUser.id);
  const internship = state.internships.find(i => i.id === id);
  if (state.applications.some(a => a.userId === user.id && a.internshipId === id)) {
    toast("You have already applied.");
    return;
  }
  openModal(`<h2>Apply for ${escapeHTML(internship.title)}</h2>
    <form id="applicationForm" class="auth-form">
      <label>Why are you interested?</label>
      <textarea id="coverLetter" rows="5" required placeholder="Write a short application message..."></textarea>
      <label>Resume</label>
      <input id="resumeFile" type="file" accept=".pdf,.doc,.docx" required />
      <div class="modal-actions"><button class="primary-btn" type="submit">Submit Application</button><button type="button" class="outline-btn" onclick="closeModal()">Cancel</button></div>
    </form>`);
  $("#applicationForm").onsubmit = e => {
    e.preventDefault();
    const file = $("#resumeFile").files[0];
    state.applications.push({
      id: uid("app_"), userId: user.id, internshipId: id,
      coverLetter: $("#coverLetter").value, resumeName: file?.name || "Resume",
      status: "Applied", appliedAt: new Date().toLocaleDateString()
    });
    save(); closeModal(); renderApp(); toast("Application submitted successfully.");
  };
}

function renderApplications() {
  if (state.currentUser.role !== "student") return;
  const apps = state.applications.filter(a => a.userId === state.currentUser.id);
  $("#myApplications").innerHTML = apps.length ? `<table>
    <thead><tr><th>Internship</th><th>Company</th><th>Applied</th><th>Status</th><th>Resume</th></tr></thead>
    <tbody>${apps.map(a => {
      const i = state.internships.find(x => x.id === a.internshipId);
      return `<tr><td>${escapeHTML(i?.title || "Deleted")}</td><td>${escapeHTML(i?.company || "-")}</td><td>${a.appliedAt}</td><td><span class="status status-${a.status}">${a.status}</span></td><td>${escapeHTML(a.resumeName)}</td></tr>`;
    }).join("")}</tbody></table>` : `<div class="empty">You have not applied for any internship yet.</div>`;
}

function renderProfile() {
  if (state.currentUser.role !== "student") return;
  const u = state.users.find(x => x.id === state.currentUser.id);
  if (!u) return;
  $("#profileName").value = u.name || "";
  $("#profileEmail").value = u.email || "";
  $("#profileCourse").value = u.course || "";
  $("#profileCollege").value = u.college || "";
  $("#profilePhone").value = u.phone || "";
  $("#profileSkills").value = u.skills || "";
}

function renderAdmin() {
  if (state.currentUser.role !== "admin") return;
  $("#adminInternships").innerHTML = `<table><thead><tr><th>Internship</th><th>Company</th><th>Location</th><th>Actions</th></tr></thead><tbody>
    ${state.internships.map(i => `<tr><td>${escapeHTML(i.title)}</td><td>${escapeHTML(i.company)}</td><td>${escapeHTML(i.location)}</td><td class="actions"><button class="small-btn" onclick="editInternship(${i.id})">Edit</button><button class="danger-btn" onclick="deleteInternship(${i.id})">Delete</button></td></tr>`).join("")}
  </tbody></table>`;

  $("#adminApplications").innerHTML = state.applications.length ? `<table><thead><tr><th>Student</th><th>Internship</th><th>Applied</th><th>Status</th><th>Update</th></tr></thead><tbody>
    ${state.applications.map(a => {
      const u = state.users.find(x => x.id === a.userId);
      const i = state.internships.find(x => x.id === a.internshipId);
      return `<tr><td>${escapeHTML(u?.name || "Unknown")}<br><small>${escapeHTML(u?.email || "")}</small></td><td>${escapeHTML(i?.title || "Deleted")}</td><td>${a.appliedAt}</td><td><span class="status status-${a.status}">${a.status}</span></td>
      <td><select onchange="changeStatus('${a.id}', this.value)">
        ${["Applied","Shortlisted","Selected","Rejected"].map(s => `<option ${s===a.status?"selected":""}>${s}</option>`).join("")}
      </select></td></tr>`;
    }).join("")}</tbody></table>` : `<div class="empty">No applications yet.</div>`;

  const students = state.users.filter(u => u.role === "student");
  $("#studentsTable").innerHTML = students.length ? `<table><thead><tr><th>Name</th><th>Email</th><th>Course</th><th>College</th><th>Applications</th></tr></thead><tbody>
    ${students.map(u => `<tr><td>${escapeHTML(u.name)}</td><td>${escapeHTML(u.email)}</td><td>${escapeHTML(u.course)}</td><td>${escapeHTML(u.college)}</td><td>${state.applications.filter(a=>a.userId===u.id).length}</td></tr>`).join("")}</tbody></table>` : `<div class="empty">No registered students yet.</div>`;
}

function internshipForm(existing) {
  const i = existing || {};
  openModal(`<h2>${existing ? "Edit Internship" : "Add Internship"}</h2>
    <form id="internshipForm" class="form-grid">
      <label>Title<input id="iTitle" required value="${attr(i.title)}"></label>
      <label>Company<input id="iCompany" required value="${attr(i.company)}"></label>
      <label>Category<input id="iCategory" required value="${attr(i.category)}"></label>
      <label>Location<input id="iLocation" required value="${attr(i.location)}"></label>
      <label>Mode<select id="iMode"><option>Remote</option><option>Hybrid</option><option>On-site</option></select></label>
      <label>Duration<input id="iDuration" required value="${attr(i.duration)}"></label>
      <label>Stipend<input id="iStipend" required value="${attr(i.stipend)}"></label>
      <label>Skills<input id="iSkills" required value="${attr(i.skills)}"></label>
      <label class="full">Description<textarea id="iDescription" rows="4" required>${escapeHTML(i.description || "")}</textarea></label>
      <div class="modal-actions full"><button class="primary-btn" type="submit">Save Internship</button><button type="button" class="outline-btn" onclick="closeModal()">Cancel</button></div>
    </form>`);
  $("#iMode").value = i.mode || "Remote";
  $("#internshipForm").onsubmit = e => {
    e.preventDefault();
    const data = {
      title: $("#iTitle").value, company: $("#iCompany").value, category: $("#iCategory").value,
      location: $("#iLocation").value, mode: $("#iMode").value, duration: $("#iDuration").value,
      stipend: $("#iStipend").value, skills: $("#iSkills").value, description: $("#iDescription").value
    };
    if (existing) Object.assign(existing, data);
    else state.internships.push({id: Date.now(), ...data});
    save(); closeModal(); renderApp(); toast(existing ? "Internship updated." : "Internship created.");
  };
}

function editInternship(id) { internshipForm(state.internships.find(i => i.id === id)); }
function deleteInternship(id) {
  if (!confirm("Delete this internship?")) return;
  state.internships = state.internships.filter(i => i.id !== id);
  save(); renderApp(); toast("Internship deleted.");
}
function changeStatus(appId, status) {
  const a = state.applications.find(x => x.id === appId);
  if (a) { a.status = status; save(); renderApp(); toast(`Application marked ${status}.`); }
}

function escapeHTML(v="") {
  return String(v).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
function attr(v="") { return escapeHTML(v); }

$$('.role-tab').forEach(b => b.addEventListener('click', () => {
  $$('.role-tab').forEach(x => x.classList.remove('active'));
  b.classList.add('active');
  $('#loginRole').value = b.dataset.role;
  showAuth('login');
}));
$$('[data-auth="register"]').forEach(b => b.addEventListener('click', () => showAuth('register')));
if ($('#sidebarLogout')) $('#sidebarLogout').addEventListener('click', logout);
if ($('#heroSearchBtn')) $('#heroSearchBtn').addEventListener('click', () => { const q = $('#heroSearch').value.trim(); goPage('internships'); $('#searchInput').value = q; renderInternships(); });
if ($('#heroSearch')) $('#heroSearch').addEventListener('keydown', e => { if (e.key === 'Enter') $('#heroSearchBtn').click(); });
$("#loginForm").addEventListener("submit", e => {
  e.preventDefault();
  const email = $("#loginEmail").value.trim().toLowerCase();
  const password = $("#loginPassword").value;
  const role = $("#loginRole").value;
  if (role === "admin" && email === "admin123@portal.com" && password === "Admin@0987") {
    login({id:"admin", name:"Portal Admin", email, role:"admin"});
    return;
  }
  const user = state.users.find(u => u.email === email && u.password === password && u.role === role);
  if (!user) return toast("Invalid email, password or role.");
  login(user);
});
$("#registerForm").addEventListener("submit", e => {
  e.preventDefault();
  const email = $("#regEmail").value.trim().toLowerCase();
  if (state.users.some(u => u.email === email)) return toast("Email already registered.");
  const user = {
    id: uid("stu_"), name: $("#regName").value.trim(), email,
    password: $("#regPassword").value, course: $("#regCourse").value.trim(),
    college: $("#regCollege").value.trim(), role:"student", phone:"", skills:""
  };
  state.users.push(user); save(); login(user); toast("Account created.");
});
$("#logoutBtn").addEventListener("click", logout);
$("#closeModal").addEventListener("click", closeModal);
$("#modal").addEventListener("click", e => { if (e.target.id === "modal") closeModal(); });

$$(".nav-btn").forEach(b => b.addEventListener("click", () => goPage(b.dataset.page)));
$$("[data-go]").forEach(b => b.addEventListener("click", () => goPage(b.dataset.go)));
$("#searchInput").addEventListener("input", renderInternships);
$("#categoryFilter").addEventListener("change", renderInternships);
$("#locationFilter").addEventListener("change", renderInternships);
$("#addInternshipBtn").addEventListener("click", () => internshipForm());

$("#profileForm").addEventListener("submit", e => {
  e.preventDefault();
  const u = state.users.find(x => x.id === state.currentUser.id);
  Object.assign(u, {
    name: $("#profileName").value, email: $("#profileEmail").value,
    course: $("#profileCourse").value, college: $("#profileCollege").value,
    phone: $("#profilePhone").value, skills: $("#profileSkills").value,
    resumeName: $("#profileResume").files[0]?.name || u.resumeName || ""
  });
  state.currentUser = u; save(); renderApp(); toast("Profile saved.");
});

if (state.currentUser) renderApp();

/* =========================================
   MOBILE MENU
   ========================================= */

const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const sidebar = document.querySelector(".sidebar");

if (mobileMenuBtn && sidebar) {

    mobileMenuBtn.addEventListener("click", function () {
        sidebar.classList.toggle("mobile-open");
    });


    /* Close menu when a navigation button is clicked */
    document.querySelectorAll(".sidebar .nav-btn").forEach(function (button) {

        button.addEventListener("click", function () {

            if (window.innerWidth <= 760) {
                sidebar.classList.remove("mobile-open");
            }

        });

    });


    /* Close menu when screen becomes desktop size */
    window.addEventListener("resize", function () {

        if (window.innerWidth > 760) {
            sidebar.classList.remove("mobile-open");
        }

    });
}
