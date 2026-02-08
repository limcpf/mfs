export function renderAppShellHtml(): string {
  return `<!doctype html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>File-System Blog</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="/assets/app.css" />
  </head>
  <body>
    <div class="app-root">
      <aside class="sidebar">
        <div class="sidebar-header">
          <h1 class="sidebar-title">
            <span class="material-symbols-outlined icon-terminal">terminal</span>
            ~/dev-blog
          </h1>
          <div class="sidebar-branch">
            <span class="branch-badge">
              <span class="material-symbols-outlined icon-branch">call_split</span>main
            </span>
            <span class="branch-info">publish: true</span>
          </div>
        </div>
        <nav id="tree-root" class="tree-root" aria-label="문서 탐색기"></nav>
        <div class="sidebar-footer">
          <div class="status-online">
            <span class="status-dot"></span>
            <span>Online</span>
          </div>
          <div class="status-encoding">UTF-8</div>
        </div>
      </aside>
      <main class="viewer">
        <div class="viewer-container">
          <nav id="viewer-breadcrumb" class="viewer-breadcrumb" aria-label="경로"></nav>
          <header id="viewer-header" class="viewer-header">
            <h1 id="viewer-title" class="viewer-title">문서를 선택하세요</h1>
            <div id="viewer-meta" class="viewer-meta"></div>
          </header>
          <article id="viewer-content" class="viewer-content">
            <p class="placeholder">좌측 탐색기에서 문서를 선택하세요.</p>
          </article>
          <nav id="viewer-nav" class="viewer-nav"></nav>
        </div>
      </main>
    </div>
    <script type="module" src="/assets/app.js"></script>
  </body>
</html>
`;
}

export function render404Html(): string {
  return `<!doctype html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>404 - File-System Blog</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="/assets/app.css" />
  </head>
  <body>
    <main class="not-found">
      <div class="not-found-icon">
        <span class="material-symbols-outlined">folder_off</span>
      </div>
      <h1>404</h1>
      <p>요청한 문서를 찾을 수 없습니다.</p>
      <a href="/" class="not-found-link">
        <span class="material-symbols-outlined">home</span>
        홈으로 이동
      </a>
    </main>
  </body>
</html>
`;
}
