// Project detail page: reads ?slug= from the URL, finds the matching
// record in content/projects.json, and renders its full case study.

function getSlugFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("slug");
}

function toYouTubeEmbed(url) {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    let videoId = null;

    if (parsed.hostname.includes("youtu.be")) {
      videoId = parsed.pathname.replace("/", "");
    } else if (parsed.hostname.includes("youtube.com")) {
      if (parsed.pathname === "/watch") {
        videoId = parsed.searchParams.get("v");
      } else if (parsed.pathname.startsWith("/embed/")) {
        return url; // already an embed URL
      }
    }

    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  } catch {
    return null;
  }
}

function renderNotFound(root) {
  root.innerHTML = `
    <div class="not-found">
      <h1>Project not found</h1>
      <p>The project you're looking for doesn't exist or may have been moved.</p>
      <a class="btn btn-primary" href="index.html#projects">Back to projects</a>
    </div>
  `;
}

function renderProject(root, project) {
  document.title = `${project.title} — Portfolio`;

  const tags = (project.tags || "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  const embedUrl = toYouTubeEmbed(project.video);

  const mediaHTML = embedUrl
    ? `<div class="project-media"><div class="video-frame"><iframe src="${embedUrl}" title="${escapeHTML(project.title)} demo" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div></div>`
    : project.image
    ? `<div class="project-media"><img src="${escapeHTML(project.image)}" alt="${escapeHTML(project.title)}" /></div>`
    : "";

  const descriptionParagraphs = (project.description || project.summary || "")
    .split(/\n+/)
    .filter(Boolean)
    .map((p) => `<p>${escapeHTML(p)}</p>`)
    .join("");

  root.innerHTML = `
    <a class="back-link" href="index.html#projects">&larr; Back to projects</a>
    <div class="project-detail-head">
      <h1>${escapeHTML(project.title)}</h1>
      <p class="summary">${escapeHTML(project.summary)}</p>
      ${tags.length ? `<div class="tag-row">${tags.map((t) => `<span class="tag">${escapeHTML(t)}</span>`).join("")}</div>` : ""}
    </div>

    ${mediaHTML}

    <div class="project-body">
      <div class="description">
        ${descriptionParagraphs}
      </div>
      <aside class="project-meta">
        <div>
          <h4>Stack</h4>
          <div class="tag-row">${tags.map((t) => `<span class="tag">${escapeHTML(t)}</span>`).join("") || "<span>—</span>"}</div>
        </div>
        ${
          project.link
            ? `<div><h4>Links</h4><a class="btn btn-ghost btn-small" href="${escapeHTML(project.link)}" target="_blank" rel="noopener noreferrer">View project &rarr;</a></div>`
            : ""
        }
      </aside>
    </div>
  `;
}

async function init() {
  const yearEl = document.querySelector("[data-year]");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  await initSiteChrome();

  const root = document.querySelector("[data-project-root]");
  const slug = getSlugFromURL();

  try {
    const projects = await loadJSON("content/projects.json");
    const project = projects.find((p) => p.slug === slug);
    if (project) {
      renderProject(root, project);
    } else {
      renderNotFound(root);
    }
  } catch (err) {
    console.error(err);
    renderNotFound(root);
  }
}

init();
