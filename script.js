// Giltech E-Learning System - Sample course data
const courses = [
  {
    id: 1,
    title: "HTML Basics",
    description: "Learn the structure of web pages using HTML.",
    lessons: ["Introduction to HTML", "Tags and Elements", "Forms and Inputs"],
    completed: false,
  },
  {
    id: 2,
    title: "CSS Fundamentals",
    description: "Style web pages with CSS.",
    lessons: ["Selectors & Properties", "Box Model", "Flexbox Basics"],
    completed: false,
  },
  {
    id: 3,
    title: "JavaScript Essentials",
    description: "Make your web pages interactive with JavaScript.",
    lessons: ["Variables & Data Types", "Functions", "DOM Manipulation"],
    completed: false,
  }
];

const app = document.getElementById("app");
const logoutBtn = document.getElementById("logoutBtn");

// ---------- AUTH ----------
function renderLogin() {
  app.innerHTML = `
    <div class="auth-form">
      <h2>Login</h2>
      <input type="email" id="loginEmail" placeholder="Email" required />
      <input type="password" id="loginPassword" placeholder="Password" required />
      <button onclick="login()">Login</button>
      <p>Don't have an account? <a href="#" onclick="renderSignup()">Sign Up</a></p>
    </div>
  `;
}

function renderSignup() {
  app.innerHTML = `
    <div class="auth-form">
      <h2>Sign Up</h2>
      <input type="text" id="signupName" placeholder="Full Name" required />
      <input type="email" id="signupEmail" placeholder="Email" required />
      <input type="password" id="signupPassword" placeholder="Password" required />
      <button onclick="signup()">Sign Up</button>
      <p>Already have an account? <a href="#" onclick="renderLogin()">Login</a></p>
    </div>
  `;
}

function signup() {
  const name = document.getElementById("signupName").value;
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;

  if (!name || !email || !password) {
    alert("Please fill in all fields");
    return;
  }

  localStorage.setItem("user", JSON.stringify({ name, email, password }));
  localStorage.setItem("loggedIn", "true");
  renderHome();
  logoutBtn.style.display = "inline-block";
}

function login() {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;
  const user = JSON.parse(localStorage.getItem("user"));

  if (user && user.email === email && user.password === password) {
    localStorage.setItem("loggedIn", "true");
    renderHome();
    logoutBtn.style.display = "inline-block";
  } else {
    alert("Invalid credentials!");
  }
}

function logout() {
  localStorage.setItem("loggedIn", "false");
  logoutBtn.style.display = "none";
  renderLogin();
}

// ---------- COURSES ----------
// Check if all courses are completed
function allCoursesCompleted() {
  return courses.every(c => c.completed === true);
}

// Render home page (list of courses)
function renderHome() {
  if (localStorage.getItem("loggedIn") !== "true") {
    renderLogin();
    return;
  }

  app.innerHTML = "<h2>Available Courses</h2>";

  courses.forEach(course => {
    const card = document.createElement("div");
    card.className = "course-card";
    card.innerHTML = `
      <h3>${course.title}</h3>
      <p>${course.description}</p>
      <p><strong>Status:</strong> ${course.completed ? "✅ Completed" : "⏳ In Progress"}</p>
    `;
    card.onclick = () => renderCourseDetail(course.id);
    app.appendChild(card);
  });

  // Certificate button if all courses are done
  if (allCoursesCompleted()) {
    const certBtn = document.createElement("button");
    certBtn.textContent = "🎓 Generate Certificate";
    certBtn.onclick = renderCertificate;
    app.appendChild(certBtn);
  }
}

// Render course detail page (with toggle complete/incomplete)
function renderCourseDetail(courseId) {
  const course = courses.find(c => c.id === courseId);
  app.innerHTML = `
    <button onclick="renderHome()">⬅ Back to Courses</button>
    <h2>${course.title}</h2>
    <p>${course.description}</p>
    <h3>Lessons:</h3>
    <div id="lesson-list"></div>
    <button id="toggle-btn">
      ${course.completed ? "Mark as Incomplete" : "Mark as Completed"}
    </button>
  `;

  const lessonList = document.getElementById("lesson-list");
  course.lessons.forEach(lesson => {
    const div = document.createElement("div");
    div.className = "lesson";
    div.textContent = lesson;
    lessonList.appendChild(div);
  });

  const toggleBtn = document.getElementById("toggle-btn");
  toggleBtn.onclick = () => {
    course.completed = !course.completed;
    renderCourseDetail(courseId);
  };
}

// ---------- CERTIFICATE ----------
function renderCertificate() {
  const user = JSON.parse(localStorage.getItem("user"));
  app.innerHTML = `
    <div style="background:white; padding:30px; border:5px solid #4a90e2; text-align:center; border-radius:10px;">
      <h1>Certificate of Completion</h1>
      <p>This is to certify that</p>
      <h2 style="color:#4a90e2;">${user ? user.name : "Student"}</h2>
      <p>has successfully completed all courses in the</p>
      <h3>Giltech E-Learning System</h3>
      <p><em>Issued on: ${new Date().toLocaleDateString()}</em></p>
      <button onclick="renderHome()">⬅ Back to Dashboard</button>
    </div>
  `;
}

// ---------- INITIALIZE ----------
if (localStorage.getItem("loggedIn") === "true") {
  logoutBtn.style.display = "inline-block";
  renderHome();
} else {
  renderLogin();
}
