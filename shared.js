// Shared logic used by every page: loads site-wide settings into the
// header/footer and wires up the mobile menu toggle.

async function loadJSON(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Failed to load ${path}`);
  return res.json();
}

function escapeHTML(str) {
  const div = document.createElement("div");
  div.textContent = str ?? "";
  return div.innerHTML;
}

function applySiteChrome(site) {
  // Brand name
  document.querySelectorAll("[data-site-name]").forEach((el) => {
    el.textContent = site.name || "Portfolio";
  });
  document.querySelectorAll("[data-site-role]").forEach((el) => {
    el.textContent = site.role || "";
  });

  // Resume button
  document.querySelectorAll("[data-resume-btn]").forEach((el) => {
    if (site.resumeUrl) {
      el.href = site.resumeUrl;
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener noreferrer");
      el.removeAttribute("aria-disabled");
    } else {
      el.href = "#";
      el.setAttribute("aria-disabled", "true");
      el.title = "Resume coming soon";
    }
  });
  document.querySelectorAll("[data-resume-label]").forEach((el) => {
    if (site.resumeButtonLabel) el.textContent = site.resumeButtonLabel;
  });

  // Footer contact links — text is replaced with the address itself
  document.querySelectorAll("[data-site-email]").forEach((el) => {
    if (site.email) {
      el.textContent = site.email;
      el.href = `mailto:${site.email}`;
    } else {
      el.style.display = "none";
    }
  });
  // CTA buttons — keep their own label, just point the href at mailto:
  document.querySelectorAll("[data-site-email-link]").forEach((el) => {
    if (site.email) {
      el.href = `mailto:${site.email}`;
    } else {
      el.style.display = "none";
    }
  });
  document.querySelectorAll("[data-site-linkedin]").forEach((el) => {
    if (site.linkedin) {
      el.href = site.linkedin;
    } else {
      el.style.display = "none";
    }
  });
  document.querySelectorAll("[data-site-github]").forEach((el) => {
    if (site.github) {
      el.href = site.github;
    } else {
      el.style.display = "none";
    }
  });

  document.title = site.name ? `${site.name} — ${site.role || "Portfolio"}` : document.title;
}

function initMobileMenu() {
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".main-nav");
  if (!toggle || !nav) return;
  toggle.addEventListener("click", () => {
    nav.classList.toggle("open");
  });
}

async function initSiteChrome() {
  initMobileMenu();
  try {
    const site = await loadJSON("content/site.json");
    applySiteChrome(site);
    return site;
  } catch (err) {
    console.error(err);
    return null;
  }
}
