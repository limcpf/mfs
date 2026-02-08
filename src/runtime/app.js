const EXPANDED_KEY = "fsblog.expanded";

function normalizeRoute(pathname) {
  let route = decodeURIComponent(pathname || "/");
  if (!route.startsWith("/")) {
    route = `/${route}`;
  }
  if (!route.endsWith("/")) {
    route = `${route}/`;
  }
  return route;
}

function loadExpandedSet() {
  try {
    const raw = localStorage.getItem(EXPANDED_KEY);
    if (!raw) {
      return new Set();
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return new Set();
    }
    return new Set(parsed.filter((x) => typeof x === "string"));
  } catch {
    return new Set();
  }
}

function persistExpandedSet(expanded) {
  localStorage.setItem(EXPANDED_KEY, JSON.stringify(Array.from(expanded)));
}

function createFolderNode(node, state, depth = 0) {
  const wrapper = document.createElement("div");
  wrapper.className = node.virtual ? "tree-folder virtual" : "tree-folder";

  const row = document.createElement("button");
  row.type = "button";
  row.className = "tree-folder-row tree-row";

  const isExpanded = node.virtual ? true : state.expanded.has(node.path);
  const iconName = isExpanded ? "folder_open" : "folder";
  
  row.innerHTML = `<span class="material-symbols-outlined">${iconName}</span><span class="tree-label">${node.name}</span>`;

  const children = document.createElement("div");
  children.className = "tree-children";
  if (!isExpanded) {
    children.hidden = true;
  }

  if (!node.virtual) {
    row.addEventListener("click", () => {
      const currentlyExpanded = !children.hidden;
      children.hidden = currentlyExpanded;
      row.querySelector(".material-symbols-outlined").textContent = currentlyExpanded ? "folder" : "folder_open";
      if (currentlyExpanded) {
        state.expanded.delete(node.path);
      } else {
        state.expanded.add(node.path);
      }
      persistExpandedSet(state.expanded);
    });
  }

  for (const child of node.children) {
    if (child.type === "folder") {
      children.appendChild(createFolderNode(child, state, depth + 1));
    } else {
      children.appendChild(createFileNode(child, state, depth + 1));
    }
  }

  wrapper.appendChild(row);
  wrapper.appendChild(children);
  return wrapper;
}

function createFileNode(node, state, depth = 0) {
  const row = document.createElement("a");
  row.href = node.route;
  row.className = "tree-row tree-file-row";
  row.dataset.fileId = node.id;

  const newBadge = node.isNew ? `<span class="badge-new">NEW</span>` : "";
  row.innerHTML = `<span class="material-symbols-outlined">article</span><span class="tree-label">${node.title || node.name}</span>${newBadge}`;

  row.addEventListener("click", (event) => {
    event.preventDefault();
    state.navigate(node.route, true);
  });

  return row;
}

function markActive(id) {
  document.querySelectorAll("[data-file-id]").forEach((el) => {
    if (!(el instanceof HTMLElement)) {
      return;
    }
    const badge = el.querySelector(".badge-active");
    if (badge) {
      badge.remove();
    }
    
    if (el.dataset.fileId === id) {
      el.classList.add("is-active");
      const activeBadge = document.createElement("span");
      activeBadge.className = "badge-active";
      activeBadge.textContent = "active";
      el.appendChild(activeBadge);
    } else {
      el.classList.remove("is-active");
    }
  });
}

function renderBreadcrumb(route) {
  const parts = route.split("/").filter(Boolean);
  const items = ["~"];
  
  for (let i = 0; i < parts.length; i++) {
    items.push(parts[i]);
  }

  return items.map((part, index) => {
    if (index === items.length - 1 && index > 0) {
      return `<span class="breadcrumb-current">${part}</span>`;
    }
    return `<span>${part}</span>`;
  }).join('<span class="material-symbols-outlined breadcrumb-sep">chevron_right</span>');
}

function renderMeta(doc) {
  const items = [];
  
  if (doc.date) {
    items.push(`<span class="meta-item"><span class="material-symbols-outlined">calendar_today</span>${doc.date}</span>`);
  }

  items.push(`<span class="meta-item"><span class="material-symbols-outlined">schedule</span>updated ${new Date(doc.mtime).toISOString().slice(0, 10)}</span>`);

  if (doc.tags?.length) {
    const tagsStr = doc.tags.map((tag) => `#${tag}`).join(" ");
    items.push(`<span class="meta-item meta-tags"><span class="material-symbols-outlined">tag</span>${tagsStr}</span>`);
  }

  return items.join("");
}

function renderNav(manifest, currentId) {
  const docs = manifest.docs;
  const currentIndex = docs.findIndex(d => d.id === currentId);
  if (currentIndex === -1) return "";

  const prev = currentIndex > 0 ? docs[currentIndex - 1] : null;
  const next = currentIndex < docs.length - 1 ? docs[currentIndex + 1] : null;

  let html = "";

  if (prev) {
    html += `<a href="${prev.route}" class="nav-link nav-link-prev" data-route="${prev.route}">
      <div class="nav-link-label"><span class="material-symbols-outlined">arrow_back</span>Previous</div>
      <div class="nav-link-title">${prev.title}</div>
    </a>`;
  }

  if (next) {
    html += `<a href="${next.route}" class="nav-link nav-link-next" data-route="${next.route}">
      <div class="nav-link-label">Next<span class="material-symbols-outlined">arrow_forward</span></div>
      <div class="nav-link-title">${next.title}</div>
    </a>`;
  }

  return html;
}

async function start() {
  const treeRoot = document.getElementById("tree-root");
  const breadcrumbEl = document.getElementById("viewer-breadcrumb");
  const titleEl = document.getElementById("viewer-title");
  const metaEl = document.getElementById("viewer-meta");
  const contentEl = document.getElementById("viewer-content");
  const navEl = document.getElementById("viewer-nav");

  const manifestRes = await fetch("/manifest.json");
  if (!manifestRes.ok) {
    throw new Error(`Failed to load manifest: ${manifestRes.status}`);
  }

  const manifest = await manifestRes.json();
  const docsById = new Map(manifest.docs.map((doc) => [doc.id, doc]));
  const expanded = loadExpandedSet();

  const state = {
    expanded,
    async navigate(rawRoute, push) {
      const route = normalizeRoute(rawRoute);
      const id = manifest.routeMap[route];
      
      if (!id) {
        breadcrumbEl.innerHTML = renderBreadcrumb(route);
        titleEl.textContent = "문서를 찾을 수 없습니다";
        metaEl.innerHTML = "";
        contentEl.innerHTML = '<p class="placeholder">요청한 경로에 해당하는 문서가 없습니다.</p>';
        navEl.innerHTML = "";
        markActive("");
        if (push) {
          history.pushState(null, "", route);
        }
        return;
      }

      const doc = docsById.get(id);
      if (!doc) {
        return;
      }

      if (push) {
        history.pushState(null, "", route);
      }

      markActive(id);
      breadcrumbEl.innerHTML = renderBreadcrumb(route);
      titleEl.textContent = doc.title;
      metaEl.innerHTML = renderMeta(doc);

      const res = await fetch(doc.contentUrl);
      if (!res.ok) {
        contentEl.innerHTML = '<p class="placeholder">본문을 불러오지 못했습니다.</p>';
        navEl.innerHTML = "";
        return;
      }

      contentEl.innerHTML = await res.text();
      
      contentEl.querySelectorAll(".code-copy").forEach((btn) => {
        btn.addEventListener("click", async () => {
          const code = btn.dataset.code;
          if (!code) return;
          try {
            await navigator.clipboard.writeText(code);
            btn.classList.add("copied");
            btn.querySelector(".material-symbols-outlined").textContent = "check";
            setTimeout(() => {
              btn.classList.remove("copied");
              btn.querySelector(".material-symbols-outlined").textContent = "content_copy";
            }, 2000);
          } catch (err) {
            console.error("Copy failed:", err);
          }
        });
      });

      navEl.innerHTML = renderNav(manifest, id);
      
      navEl.querySelectorAll(".nav-link").forEach((link) => {
        link.addEventListener("click", (e) => {
          e.preventDefault();
          state.navigate(link.dataset.route, true);
          document.querySelector(".viewer").scrollTo(0, 0);
        });
      });

      document.title = `${doc.title} - File-System Blog`;
      document.querySelector(".viewer").scrollTo(0, 0);
    },
  };

  for (const node of manifest.tree) {
    if (node.type === "folder") {
      treeRoot.appendChild(createFolderNode(node, state));
    } else {
      treeRoot.appendChild(createFileNode(node, state));
    }
  }

  const currentRoute = normalizeRoute(location.pathname);
  const initialRoute = manifest.routeMap[currentRoute] ? currentRoute : manifest.docs[0]?.route || "/";
  await state.navigate(initialRoute, !manifest.routeMap[currentRoute] && currentRoute === "/");

  window.addEventListener("popstate", async () => {
    await state.navigate(location.pathname, false);
  });
}

start().catch((error) => {
  const contentEl = document.getElementById("viewer-content");
  if (contentEl) {
    contentEl.innerHTML = `<p class="placeholder">초기화 실패: ${error.message}</p>`;
  }
  console.error(error);
});
