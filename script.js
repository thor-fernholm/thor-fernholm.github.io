// Home page: renders hero copy, the projects grid, and the about/education
// section from the JSON content files.

function renderHero(site) {
  const headline = document.querySelector("[data-hero-headline]");
  const subtitle = document.querySelector("[data-hero-subtitle]");
  const primaryLabel = document.querySelector("[data-hero-primary-label]");
  const secondaryLabel = document.querySelector("[data-hero-secondary-label]");
  if (headline && site.heroHeadline) headline.textContent = site.heroHeadline;
  if (subtitle && site.heroSubtitle) subtitle.textContent = site.heroSubtitle;
  if (primaryLabel && site.heroPrimaryLabel) primaryLabel.textContent = site.heroPrimaryLabel;
  if (secondaryLabel && site.heroSecondaryLabel) secondaryLabel.textContent = site.heroSecondaryLabel;
}

function renderAbout(site) {
  const aboutHeading = document.querySelector("[data-about-heading]");
  const aboutText = document.querySelector("[data-about-text]");
  const aboutImage = document.querySelector("[data-about-image]");
  if (aboutHeading && site.aboutHeading) aboutHeading.textContent = site.aboutHeading;
  if (aboutText && site.aboutText) aboutText.textContent = site.aboutText;
  if (aboutImage && site.profileImage) {
    aboutImage.src = site.profileImage;
    aboutImage.alt = site.name ? `Photo of ${site.name}` : "Profile photo";
  }
}

function renderProjectsSection(site) {
  const heading = document.querySelector("[data-projects-heading]");
  const intro = document.querySelector("[data-projects-intro]");
  if (heading && site.projectsHeading) heading.textContent = site.projectsHeading;
  if (intro && site.projectsIntro) intro.textContent = site.projectsIntro;
}

function renderOpenlove(site) {
  const heading = document.querySelector("[data-openlove-heading]");
  const text = document.querySelector("[data-openlove-text]");
  if (heading && site.openloveHeading) heading.textContent = site.openloveHeading;
  if (text && site.openloveText) text.innerHTML = marked.parse(site.openloveText);
}

function renderCta(site) {
  const heading = document.querySelector("[data-cta-heading]");
  const buttonLabel = document.querySelector("[data-cta-button-label]");
  if (heading && site.ctaHeading) heading.textContent = site.ctaHeading;
  if (buttonLabel && site.ctaButtonLabel) buttonLabel.textContent = site.ctaButtonLabel;
}

function renderProjects(projects) {
  const grid = document.querySelector("[data-projects-grid]");
  if (!grid) return;

  grid.innerHTML = projects
    .map((project) => {
      const tags = (project.tags || "")
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
        .slice(0, 3);

      return `
        <a class="project-card" href="project.html?slug=${encodeURIComponent(project.slug)}">
          <div class="project-card-image">
            <img src="${escapeHTML(project.image)}" alt="${escapeHTML(project.title)}" loading="lazy" />
          </div>
          <div class="project-card-body">
            <h3>${escapeHTML(project.title)}</h3>
            <p>${escapeHTML(project.summary)}</p>
            ${tags.length ? `<div class="tag-row">${tags.map((t) => `<span class="tag">${escapeHTML(t)}</span>`).join("")}</div>` : ""}
            <div class="card-link-row">View case study <span class="arrow" aria-hidden="true">&rarr;</span></div>
          </div>
        </a>
      `;
    })
    .join("");
}

function renderEducation(education) {
  const list = document.querySelector("[data-education-list]");
  if (!list) return;

  list.innerHTML = education
    .map(
      (item) => `
        <div class="education-item">
          <div class="education-item-head">
            <h4>${escapeHTML(item.degree)}</h4>
            <span class="education-year">${escapeHTML(item.year)}</span>
          </div>
          <p class="education-institution">${escapeHTML(item.institution)}</p>
          ${item.description ? `<p class="education-desc">${escapeHTML(item.description)}</p>` : ""}
        </div>
      `
    )
    .join("");
}

async function init() {
  const yearEl = document.querySelector("[data-year]");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const site = await initSiteChrome();
  if (site) {
    renderHero(site);
    renderAbout(site);
    renderProjectsSection(site);
    renderOpenlove(site);
    renderCta(site);
  }

  try {
    const projects = await loadJSON("content/projects.json");
    renderProjects(projects);
  } catch (err) {
    console.error(err);
  }

  try {
    const education = await loadJSON("content/education.json");
    renderEducation(education);
  } catch (err) {
    console.error(err);
  }
}

init();
