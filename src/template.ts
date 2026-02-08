export function renderAppShellHtml(): string {
  return `<!doctype html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>File-System Blog</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Noto+Sans+KR:wght@400;500;700&display=swap" rel="stylesheet" />
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="/assets/app.css" />
  </head>
  <body>
    <div class="app-root">
      <div id="sidebar-overlay" class="sidebar-overlay" hidden></div>
      <aside id="sidebar-panel" class="sidebar" aria-label="문서 탐색기 패널">
        <div class="sidebar-header">
          <h1 class="sidebar-title">
            <span class="material-symbols-outlined icon-terminal">terminal</span>
            ~/dev-blog
          </h1>
          <button id="sidebar-close" class="sidebar-close" type="button" aria-label="탐색기 닫기">
            <span class="material-symbols-outlined">close</span>
          </button>
          <div class="sidebar-branch">
            <span class="branch-badge" aria-hidden="true">
              <span class="material-symbols-outlined icon-branch">call_split</span>branch
            </span>
            <div id="sidebar-branch-pills" class="branch-pills" role="group" aria-label="브랜치 선택"></div>
            <span id="sidebar-branch-info" class="branch-info">publish: true</span>
          </div>
        </div>
        <nav id="tree-root" class="tree-root" aria-label="문서 탐색기" tabindex="0"></nav>
        <div class="sidebar-footer">
          <div class="status-online">
            <span class="status-dot"></span>
            <span>Online</span>
          </div>
          <div class="sidebar-footer-actions">
            <div class="status-encoding">UTF-8</div>
            <button
              id="settings-toggle"
              class="settings-toggle"
              type="button"
              aria-controls="sidebar-settings"
              aria-expanded="false"
              aria-label="탐색기 설정 열기"
            >
              <span class="material-symbols-outlined">tune</span>
            </button>
          </div>
          <section id="sidebar-settings" class="sidebar-settings" hidden aria-label="탐색기 설정">
            <p class="sidebar-settings-title">탐색기 설정</p>
            <fieldset class="settings-group">
              <legend>메뉴 버튼 위치</legend>
              <label class="settings-option">
                <input type="radio" name="menu-toggle-position" value="right" checked />
                <span>오른쪽 하단</span>
              </label>
              <label class="settings-option">
                <input type="radio" name="menu-toggle-position" value="left" />
                <span>왼쪽 하단</span>
              </label>
            </fieldset>
            <button id="settings-close" class="settings-close" type="button">닫기</button>
          </section>
        </div>
      </aside>
      <div
        id="app-splitter"
        class="app-splitter"
        role="separator"
        aria-orientation="vertical"
        aria-controls="sidebar-panel viewer-panel"
        aria-label="탐색기 너비 조절"
        tabindex="0"
      ></div>
      <main id="viewer-panel" class="viewer">
        <button
          id="sidebar-toggle"
          class="mobile-menu-toggle"
          type="button"
          aria-controls="sidebar-panel"
          aria-expanded="false"
          aria-label="탐색기 열기"
        >
          <span class="material-symbols-outlined">menu</span>
          <span>Files</span>
        </button>
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
    <div id="tree-label-tooltip" class="tree-label-tooltip" role="tooltip" hidden></div>
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
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Noto+Sans+KR:wght@400;500;700&display=swap" rel="stylesheet" />
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
