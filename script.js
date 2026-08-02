const GITHUB_USERNAME = "octocat";

const root = document.documentElement;
const themeToggle = document.getElementById("themeToggle");
const navbarMenu = document.getElementById("navbarMenu");
const projectModal = document.getElementById("projectModal");
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

function applyTheme(theme) {
    root.setAttribute("data-bs-theme", theme);
    localStorage.setItem("portfolio-theme", theme);

    const nextTheme = theme === "dark" ? "light" : "dark";
    themeToggle.textContent =
        nextTheme.charAt(0).toUpperCase() + nextTheme.slice(1) + " mode";
    themeToggle.setAttribute("aria-label", `Switch to ${nextTheme} theme`);
}

const savedTheme = localStorage.getItem("portfolio-theme");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
applyTheme(savedTheme || (prefersDark ? "dark" : "light"));

themeToggle.addEventListener("click", () => {
    const current = root.getAttribute("data-bs-theme");
    applyTheme(current === "dark" ? "light" : "dark");
});

document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
        const selector = link.getAttribute("href");
        const target = document.querySelector(selector);

        if (!target) return;

        event.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });

        bootstrap.Collapse.getInstance(navbarMenu)?.hide();
    });
});

projectModal.addEventListener("show.bs.modal", (event) => {
    const button = event.relatedTarget;

    document.getElementById("projectModalTitle").textContent =
        button.dataset.title;
    document.getElementById("projectModalDescription").textContent =
        button.dataset.description;
    document.getElementById("projectModalTech").textContent =
        button.dataset.tech;
});

function escapeHtml(value) {
    const element = document.createElement("div");
    element.textContent = value;
    return element.innerHTML;
}

async function loadRepositories() {
    const container = document.getElementById("githubProjects");

    try {
        const response = await fetch(
            `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=4`
        );

        if (!response.ok) throw new Error(`GitHub API: ${response.status}`);

        const repositories = await response.json();

        container.innerHTML = repositories.map((repo) => `
      <div class="col-md-6">
        <article class="card h-100 bg-body-tertiary">
          <div class="card-body d-flex flex-column">
            <h4 class="h5">
              <a class="stretched-link" href="${repo.html_url}"
                 target="_blank" rel="noreferrer">
                ${escapeHtml(repo.name)}
              </a>
            </h4>
            <p class="small text-body-secondary flex-grow-1">
              ${escapeHtml(repo.description || "No description provided.")}
            </p>
            <div class="d-flex justify-content-between small">
              <span>${escapeHtml(repo.language || "Various")}</span>
              <span>★ ${repo.stargazers_count}</span>
            </div>
          </div>
        </article>
      </div>
    `).join("");
    } catch (error) {
        console.error(error);
        container.innerHTML = `
      <div class="col-12">
        <div class="alert alert-danger mb-0">
          Repositories could not be loaded. Check the username or internet connection.
        </div>
      </div>
    `;
    }
}

loadRepositories();

contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!contactForm.checkValidity()) {
        contactForm.classList.add("was-validated");
        formStatus.textContent = "Please correct the highlighted fields.";
        formStatus.className = "mt-3 mb-0 fw-semibold text-danger";
        return;
    }

    formStatus.textContent =
        "Demo submitted. Connect this form to a backend to receive messages.";
    formStatus.className = "mt-3 mb-0 fw-semibold text-success";
    contactForm.reset();
    contactForm.classList.remove("was-validated");
});

document.getElementById("currentYear").textContent =
    new Date().getFullYear();