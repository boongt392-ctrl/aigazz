
"use strict";

const $ = selector => document.querySelector(selector);
const content = $("#content");
const sidebar = $("#sidebar");
const toastEl = $("#toast");

const STORAGE_KEY = "aigaz.history.v2";

let page = "home";
let chats = loadChats();
let currentChatId = null;

const currentChatIds = {
  chat: null,
  coding: null,
  creative: null
};

let busy = false;
let selectedCategory = "Semua";
let searchQuery = "";
let historyQuery = "";
let toastTimer;

const pages = {
  home: "Beranda",
  chat: "Chat AI",
  coding: "AI Coding",
  creative: "AI Kreatif",
  islamic: "Pusat Islami",
  history: "Riwayat Chat",
  api: "API Connection",
  settings: "Pengaturan",
  riddles: "Tebak-Tebakan",
};

const tools = [
  {
    icon: "✧",
    title: "Chat AI",
    desc: "Tanya apa saja dan diskusikan ide bersama AI.",
    tag: "AI ASSISTANT",
    page: "chat",
    category: "AI"
  },
  {
    icon: "⌘",
    title: "AI Coding",
    desc: "Buat kode, pahami program, dan cari solusi error.",
    tag: "PROGRAMMING",
    page: "coding",
    category: "DEVELOPER"
  },
  {
    icon: "✎",
    title: "AI Kreatif",
    desc: "Kembangkan ide, tulisan, konsep, dan cerita.",
    tag: "CREATIVE",
    page: "creative",
    category: "AI"
  },
  {
    icon: "◷",
    title: "Riwayat Chat",
    desc: "Buka kembali percakapan yang tersimpan.",
    tag: "PERSONAL",
    page: "history",
    category: "PERSONAL"
  },
  {
    icon: "⚿",
    title: "API Connection",
    desc: "Periksa status dan konfigurasi koneksi AI.",
    tag: "DEVELOPER",
    page: "api",
    category: "DEVELOPER"
  },
  {
    icon: "⚙",
    title: "Pengaturan",
    desc: "Informasi aplikasi dan preferensi workspace.",
    tag: "SYSTEM",
    page: "settings",
    category: "PERSONAL"
  },
  {
    icon: "☪",
    title: "Pusat Islami",
    desc: "Baca Al-Qur’an, pelajari doa harian, gunakan tasbih digital, cek jadwal salat, dan kenali Asmaul Husna.",
    tag: "ISLAMIC CENTER",
    page: "islamic",
    category: "ISLAMI"
  },
  {
    icon: "🎲",
    title: "Tebak-Tebakan",
    desc: "Mainkan teka-teki acak, tebak jawaban, gunakan petunjuk, dan kumpulkan skor.",
    tag: "BRAIN GAME",
    page: "riddles",
    category: "FUN"
  },
];

function loadChats() {
  try {
    const value = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || "[]"
    );

    if (!Array.isArray(value)) return [];

    return value.filter(chat =>
      chat &&
      typeof chat.id === "string" &&
      Array.isArray(chat.messages)
    ).slice(0, 40);
  } catch {
    return [];
  }
}

function saveChats() {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(chats.slice(0, 40))
    );
  } catch {
    toast("Penyimpanan browser penuh.");
  }
}

function getCurrentChat() {
  return chats.find(chat => chat.id === currentChatId) || null;
}

function makeId() {
  if (crypto.randomUUID) return crypto.randomUUID();

  return Date.now().toString(36) +
    Math.random().toString(36).slice(2);
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

function toast(message) {
  if (!toastEl) return;

  toastEl.textContent = message;
  toastEl.classList.add("show");

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toastEl.classList.remove("show");
  }, 3000);
}

function getChatMode(targetPage = page) {
  if (targetPage === "coding") return "coding";
  if (targetPage === "creative") return "creative";
  return "chat";
}

/* =========================
   MARKDOWN DAN TAMPILAN KODE
========================= */

function installMarkdownStyles() {
  if ($("#aigazMarkdownStyles")) return;

  const style = document.createElement("style");
  style.id = "aigazMarkdownStyles";

  style.textContent = `
    .message-text {
      overflow-wrap: anywhere;
      line-height: 1.7;
    }

    .message-text p {
      margin: 0 0 10px;
    }

    .message-text p:last-child {
      margin-bottom: 0;
    }

    .message-text h2,
    .message-text h3,
    .message-text h4 {
      margin: 16px 0 8px;
      line-height: 1.35;
    }

    .message-text ul,
    .message-text ol {
      padding-left: 24px;
      margin: 8px 0 12px;
    }

    .message-text li {
      margin: 4px 0;
    }

    .message-text blockquote {
      margin: 10px 0;
      padding: 8px 12px;
      border-left: 3px solid #b83250;
      background: rgba(255,255,255,.04);
    }

    .message-text hr {
      border: 0;
      border-top: 1px solid rgba(255,255,255,.15);
      margin: 14px 0;
    }

    .aigaz-inline-code {
      padding: 2px 5px;
      border-radius: 5px;
      background: rgba(255,255,255,.1);
      font-family: Consolas, Monaco, monospace;
      font-size: .92em;
    }

    .aigaz-code-block {
      margin: 12px 0;
      border: 1px solid rgba(255,255,255,.15);
      border-radius: 10px;
      overflow: hidden;
      background: #101014;
    }

    .aigaz-code-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 8px 12px;
      background: rgba(255,255,255,.06);
      color: #c7c7d1;
      font-size: 12px;
    }

    .aigaz-copy-code,
    .aigaz-copy-answer {
      cursor: pointer;
      border: 1px solid rgba(255,255,255,.18);
      border-radius: 6px;
      padding: 5px 9px;
      background: rgba(255,255,255,.07);
      color: inherit;
      font: inherit;
    }

    .aigaz-copy-code:hover,
    .aigaz-copy-answer:hover {
      background: rgba(184,50,80,.25);
    }

    .aigaz-code-block pre {
      margin: 0;
      padding: 14px;
      overflow-x: auto;
      white-space: pre;
    }

    .aigaz-code-block pre code {
      color: #f2f2f5;
      font-family: Consolas, Monaco, monospace;
      font-size: 13px;
      line-height: 1.6;
    }

    .message-name {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;
    }
  `;

  document.head.appendChild(style);
}

function renderMarkdown(rawText) {
  let html = escapeHTML(String(rawText ?? ""));
  const codeBlocks = [];

  html = html.replace(
    /```([a-zA-Z0-9_+#.-]*)\n([\s\S]*?)```/g,
    (_, language, code) => {
      const index = codeBlocks.length;

      codeBlocks.push(`
        <div class="aigaz-code-block">
          <div class="aigaz-code-header">
            <span>${escapeHTML(language || "code")}</span>
            <button
              type="button"
              class="aigaz-copy-code"
              data-code-index="${index}"
            >Salin Kode</button>
          </div>
          <pre><code>${code}</code></pre>
        </div>
      `);

      return `AIGAZCODETOKEN${index}END`;
    }
  );

  html = html.replace(
    /`([^`\n]+)`/g,
    '<code class="aigaz-inline-code">$1</code>'
  );

  html = html.replace(
    /^#### (.+)$/gm,
    "<h4>$1</h4>"
  );

  html = html.replace(
    /^### (.+)$/gm,
    "<h3>$1</h3>"
  );

  html = html.replace(
    /^## (.+)$/gm,
    "<h2>$1</h2>"
  );

  html = html.replace(
    /\*\*(.*?)\*\*/g,
    "<strong>$1</strong>"
  );

  html = html.replace(
    /(^|[^*])\*([^*\n]+)\*(?!\*)/g,
    "$1<em>$2</em>"
  );

  html = html.replace(
    /(^|[^_])_([^_\n]+)_(?!_)/g,
    "$1<em>$2</em>"
  );

  const lines = html.split("\n");
  const output = [];

  let inUl = false;
  let inOl = false;

  const closeLists = () => {
    if (inUl) output.push("</ul>");
    if (inOl) output.push("</ol>");

    inUl = false;
    inOl = false;
  };

  for (const line of lines) {
    const unordered = line.match(/^\s*[-*+]\s+(.+)$/);
    const ordered = line.match(/^\s*\d+[.)]\s+(.+)$/);

    if (unordered) {
      if (inOl) {
        output.push("</ol>");
        inOl = false;
      }

      if (!inUl) {
        output.push("<ul>");
        inUl = true;
      }

      output.push(`<li>${unordered[1]}</li>`);
      continue;
    }

    if (ordered) {
      if (inUl) {
        output.push("</ul>");
        inUl = false;
      }

      if (!inOl) {
        output.push("<ol>");
        inOl = true;
      }

      output.push(`<li>${ordered[1]}</li>`);
      continue;
    }

    closeLists();

    const trimmed = line.trim();

    if (!trimmed) {
      output.push("");
    } else if (/^&gt;\s?/.test(trimmed)) {
      output.push(
        `<blockquote>${trimmed.replace(/^&gt;\s?/, "")}</blockquote>`
      );
    } else if (/^AIGAZCODETOKEN\d+END$/.test(trimmed)) {
      output.push(trimmed);
    } else if (/^<h[234]>/.test(trimmed)) {
      output.push(trimmed);
    } else if (/^---+$/.test(trimmed)) {
      output.push("<hr>");
    } else {
      output.push(`<p>${trimmed}</p>`);
    }
  }

  closeLists();

  html = output.join("\n");

  html = html.replace(
    /AIGAZCODETOKEN(\d+)END/g,
    (_, index) => codeBlocks[Number(index)] || ""
  );

  return html;
}

  const codeBlocks = [];

  // Simpan blok kode agar Markdown di dalam kode tidak diproses.
  const withCodeTokens = String(rawText ?? "").replace(
    /```([^\n`]*)\n?([\s\S]*?)```/g,
    (_, language, code) => {
      const index = codeBlocks.length;
      const lang =
        String(language || "").trim().split(/\s+/)[0] || "code";

      codeBlocks.push(`
        <div class="aigaz-code-block">
          <div class="aigaz-code-header">
            <span>${escapeHTML(lang)}</span>
            <button
              type="button"
              class="aigaz-copy-code"
              aria-label="Salin kode"
            >⧉ Salin Kode</button>
          </div>
          <pre><code>${escapeHTML(code.replace(/\n$/, ""))}</code></pre>
        </div>
      `);

      return `\nAIGAZCODETOKEN${index}END\n`;
    }
  );

  let html = escapeHTML(withCodeTokens);

  // Inline code.
  html = html.replace(
    /`([^`\n]+)`/g,
    '<code class="aigaz-inline-code">$1</code>'
  );

  // Judul Markdown.
  html = html.replace(/^###\s+(.+)$/gm, "<h4>$1</h4>");
  html = html.replace(/^##\s+(.+)$/gm, "<h3>$1</h3>");
  html = html.replace(/^#\s+(.+)$/gm, "<h2>$1</h2>");

  // Teks tebal.
  html = html.replace(/\*\*(.+?)\*\*/gs, "<strong>$1</strong>");
  html = html.replace(/__(.+?)__/gs, "<strong>$1</strong>");

  // Teks miring.
  html = html.replace(
    /(^|[^*])\*([^*\n]+)\*(?!\*)/g,
    "$1<em>$2</em>"
  );

  html = html.replace(
    /(^|[^_])_([^_\n]+)_(?!_)/g,
    "$1<em>$2</em>"
  );

  const lines = html.split("\n");
  const output = [];

  let inUl = false;
  let inOl = false;

  const closeLists = () => {
    if (inUl) output.push("</ul>");
    if (inOl) output.push("</ol>");

    inUl = false;
    inOl = false;
  };

  for (const line of lines) {
    const unordered = line.match(/^\s*[-*+]\s+(.+)$/);
    const ordered = line.match(/^\s*\d+[.)]\s+(.+)$/);

    if (unordered) {
      if (inOl) {
        output.push("</ol>");
        inOl = false;
      }

      if (!inUl) {
        output.push("<ul>");
        inUl = true;
      }

      output.push(`<li>${unordered[1]}</li>`);
      continue;
    }

    if (ordered) {
      if (inUl) {
        output.push("</ul>");
        inUl = false;
      }

      if (!inOl) {
        output.push("<ol>");
        inOl = true;
      }

      output.push(`<li>${ordered[1]}</li>`);
      continue;
    }

    closeLists();

    const trimmed = line.trim();

    if (!trimmed) {
      output.push("");
    } else if (/^&gt;\s?/.test(trimmed)) {
      output.push(
        `<blockquote>${trimmed.replace(/^&gt;\s?/, "")}</blockquote>`
      );
    } else if (/^AIGAZCODETOKEN\d+END$/.test(trimmed)) {
      output.push(trimmed);
    } else if (/^<h[234]>/.test(trimmed)) {
      output.push(trimmed);
    } else if (/^---+$/.test(trimmed)) {
      output.push("<hr>");
    } else {
      output.push(`<p>${trimmed}</p>`);
    }
  }

  closeLists();

  html = output.join("\n");

  // Masukkan kembali blok kode yang sudah di-escape.
  html = html.replace(
    /AIGAZCODETOKEN(\d+)END/g,
    (_, index) => codeBlocks[Number(index)] || ""
  );

  return html;
}

/* =========================
   NAVIGASI DAN BERANDA
========================= */

function setPage(nextPage) {
  if (busy) return;

  const destination = pages[nextPage] ? nextPage : "home";
  const chatPages = ["chat", "coding", "creative"];
  const oldMode = getChatMode(page);

  if (chatPages.includes(page)) {
    currentChatIds[oldMode] = currentChatId;
  }

  page = destination;

  if (chatPages.includes(destination)) {
    const newMode = getChatMode(destination);
    currentChatId = currentChatIds[newMode];

    if (currentChatId && !chats.some(chat => chat.id === currentChatId)) {
      currentChatId = null;
      currentChatIds[newMode] = null;
    }
  }

  sidebar.classList.remove("open");

  document.querySelectorAll(".nav[data-page]").forEach(button => {
    button.classList.toggle("active", button.dataset.page === page);
  });

  $("#pageCrumb").textContent = pages[page];
  renderPage();
}

function newChat() {
  if (busy) return;

  const targetMode = ["chat", "coding", "creative"].includes(page)
    ? page
    : "chat";

  setPage(targetMode);
  currentChatId = null;
  currentChatIds[targetMode] = null;
  renderPage();
  $("#messageInput")?.focus();
}

function openChat(id) {
  if (busy) return;

  const chat = chats.find(item => item.id === id);
  if (!chat) return;

  const targetMode = ["chat", "coding", "creative"].includes(chat.mode)
    ? chat.mode
    : "chat";

  setPage(targetMode);
  currentChatId = id;
  currentChatIds[targetMode] = id;
  renderPage();
}

function renderCards() {
  const categories = [
    "Semua",
    "AI",
    "DEVELOPER",
    "PERSONAL"
  ];

  const filtered = tools.filter(tool => {
    const matchesCategory =
      selectedCategory === "Semua" ||
      tool.category === selectedCategory;

    const haystack =
      `${tool.title} ${tool.desc} ${tool.tag}`.toLowerCase();

    return matchesCategory &&
      haystack.includes(searchQuery.toLowerCase());
  });

  return `
    <div class="categories">
      ${categories.map(category => `
        <button class="category ${
          selectedCategory === category ? "active" : ""
        }" data-category="${category}">
          ${category}
        </button>
      `).join("")}
    </div>

    <div class="grid">
      ${filtered.map(tool => `
        <article
          class="tool-card"
          tabindex="0"
          role="button"
          data-open="${tool.page}"
          aria-label="Buka ${tool.title}"
        >
          <div class="tool-icon">${tool.icon}</div>
          <h3>${tool.title}</h3>
          <p>${tool.desc}</p>
          <span class="tag">${tool.tag}</span>
        </article>
      `).join("")}

      ${filtered.length
        ? ""
        : '<div class="empty">Tidak ada fitur yang cocok.</div>'}
    </div>
  `;
}

    const text = chat.messages
      .map(message => message.content || "")
      .join(" ")
      .toLowerCase();

    return title.includes(q) || text.includes(q);
  });

  if (!filtered.length) {
    return '<div class="empty">Tidak ada percakapan yang ditemukan.</div>';
  }

  return filtered.map(chat => `
    <div class="history-item">
      <div class="history-title">
        <strong>${escapeHTML(chat.title || "Percakapan baru")}</strong>
        <small>${chat.messages.length} pesan · ${
          chat.mode === "coding" ? "AI Coding" :
          chat.mode === "creative" ? "AI Kreatif" : "Chat AI"
        }</small>
      </div>

      <div class="history-actions">
        <button
          class="secondary"
          data-open-chat="${escapeHTML(chat.id)}"
        >Buka</button>

        <button
          class="secondary"
          data-delete-chat="${escapeHTML(chat.id)}"
          aria-label="Hapus percakapan"
        >Hapus</button>
      </div>
    </div>
  `).join("");
}

function historyPage() {
  return `
    <div class="eyebrow">PERSONAL WORKSPACE</div>

    <div class="heading-row">
      <div>
        <h1>Riwayat <span>Chat.</span></h1>
        <p class="subtitle">
          Percakapan disimpan secara lokal di browser ini.
        </p>
      </div>

      <button class="primary" data-action="new-chat">
        ＋ Chat Baru
      </button>
    </div>

    <div class="panel">
      <div class="heading-row">
        <h2>Semua percakapan (${chats.length})</h2>

        <button
          class="secondary"
          id="exportHistory"
          ${chats.length ? "" : "disabled"}
        >↓ Ekspor JSON</button>
      </div>

      <div class="field">
        <input
          id="historySearch"
          placeholder="Cari percakapan..."
          value="${escapeHTML(historyQuery)}"
        >
      </div>

      <div id="historyResults">${historyItems(historyQuery)}</div>

      ${chats.length ? `
        <div style="margin-top:20px">
          <button class="secondary" id="clearHistory">
            Hapus semua riwayat
          </button>
        </div>
      ` : ""}
    </div>
  `;
}

/* =========================
   API DAN PENGATURAN
========================= */

function apiPage() {
  return `
    <div class="eyebrow">DEVELOPER SETTINGS</div>
    <h1>API <span>Connection.</span></h1>
    <p class="subtitle">
      Periksa konfigurasi backend AI GAZ.
    </p>

    <div class="panel">
      <h2>Status koneksi</h2>
      <div class="notice" id="apiStatus">Memeriksa backend...</div>

      <div class="field">
        <label>Provider</label>
        <input value="Custom API provider" readonly>
      </div>

      <p class="subtitle">
        API key disimpan di file .env pada backend. Nilai rahasia
        tidak ditampilkan di halaman ini.
      </p>

      <button class="secondary" id="refreshStatus">
        ↻ Periksa lagi
      </button>
    </div>
  `;
}

function settingsPage() {
  return `
    <div class="eyebrow">WORKSPACE</div>
    <h1>Pengaturan <span>AI GAZ.</span></h1>

    <div class="panel">
      <h2>Tentang aplikasi</h2>
      <p class="subtitle">
        AI GAZ Developer Workspace · Versi 1.0
      </p>

      <div class="notice">
        Riwayat disimpan di browser ini. Versi ini belum menggunakan
        login, database cloud, atau sistem langganan premium.
      </div>
    </div>

    <div class="panel">
      <h2>Pengelolaan data</h2>
      <p class="subtitle">
        Kamu dapat mengekspor atau menghapus riwayat dari menu Riwayat Chat.
      </p>

      <button class="secondary" data-page="history">
        Buka Riwayat Chat
      </button>
    </div>
  `;
}

function renderPage() {
  if (page === "home") {
    content.innerHTML = homePage();
  } else if (["chat", "coding", "creative"].includes(page)) {
    content.innerHTML = chatPage();
  } else if (page === "islamic") {
    content.innerHTML = window.AIGAZIslamic
      ? window.AIGAZIslamic.renderPage()
      : "<p>Halaman Pusat Islami sedang disiapkan.</p>";
  } else if (page === "riddles") {
    content.innerHTML = window.AIGAZRiddles
      ? window.AIGAZRiddles.renderPage()
      : "<p>Game Tebak-Tebakan sedang disiapkan.</p>";
  } else if (page === "history") {
    content.innerHTML = historyPage();
  } else if (page === "api") {
    content.innerHTML = apiPage();
  } else {
    content.innerHTML = settingsPage();
  }

  if (page === "api") refreshStatus();

  const box = $("#chatMessages");
  if (box) box.scrollTop = box.scrollHeight;
}

async function refreshStatus() {
  const statusBox = $("#apiStatus");
  if (!statusBox) return;

  statusBox.textContent = "Memeriksa backend...";

  try {
    const response = await fetch("/api/status");
    const data = await response.json();

    statusBox.textContent = data.configured
      ? `Backend aktif. Provider terkonfigurasi; model: ${data.model}.`
      : "Backend aktif, tetapi API belum dikonfigurasi. Periksa file .env.";
  } catch {
    statusBox.textContent = "Backend tidak dapat dihubungi.";
  }
}

/* =========================
   MENGIRIM PESAN KE AI
========================= */

async function sendMessage(rawText) {
  const message = rawText.trim();

  if (!message || busy) return;

  if (!currentChatId || !getCurrentChat()) {
    const chat = {
      id: makeId(),
      title: message.slice(0, 55),
      mode: getChatMode(),
      messages: [],
      updatedAt: Date.now()
    };

    chats.unshift(chat);
    currentChatId = chat.id;
  }

async function sendMessage(rawText) {
  const message = rawText.trim();

  if (!message || busy) return;

  if (!currentChatId || !getCurrentChat()) {
    const chat = {
      id: makeId(),
      title: message.slice(0, 55),
      mode: getChatMode(),
      messages: [],
      updatedAt: Date.now()
    };

    chats.unshift(chat);
    currentChatId = chat.id;
  }

  const chat = getCurrentChat();
  if (!chat) return;

  const history = chat.messages
    .filter(m => ["user", "assistant"].includes(m.role))
    .map(m => ({ role: m.role, content: m.content }));

  chat.messages.push({
    role: "user",
    content: message
  });

  chat.updatedAt = Date.now();
  saveChats();

  busy = true;
  renderPage();

  const input = $("#messageInput");
  const sendBtn = $("#sendBtn");

  if (input) input.disabled = true;
  if (sendBtn) sendBtn.disabled = true;

  const box = $("#chatMessages");
  const typing = document.createElement("div");

  typing.className = "notice";
  typing.textContent = "AI GAZ sedang berpikir...";

  box?.appendChild(typing);

  if (box) box.scrollTop = box.scrollHeight;

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message,
        messages: history.concat([
          { role: "user", content: message }
        ]),
        mode: page === "coding"
          ? "coding"
          : page === "creative"
            ? "creative"
            : "chat"
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Permintaan AI gagal.");
    }

    if (typeof data.answer !== "string") {
      throw new Error("Format jawaban tidak valid.");
    }

    chat.messages.push({
      role: "assistant",
      content: data.answer
    });
  } catch (error) {
    chat.messages.push({
      role: "assistant",
      content: "Belum dapat menjawab: " + error.message
    });
  } finally {
    chat.updatedAt = Date.now();
    chats.sort((a, b) => b.updatedAt - a.updatedAt);
    chats = chats.slice(0, 40);

    saveChats();
    currentChatIds[getChatMode()] = currentChatId;

    busy = false;
    renderPage();
    $("#messageInput")?.focus();
  }
}

/* =========================
   EKSPOR DAN SALIN TEKS
========================= */

function exportHistory() {
  const blob = new Blob(
    [JSON.stringify(chats, null, 2)],
    { type: "application/json" }
  );

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "aigaz-history.json";
  link.click();

  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

async function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const temporary = document.createElement("textarea");

  temporary.value = text;
  temporary.setAttribute("readonly", "");
  temporary.style.position = "fixed";
  temporary.style.opacity = "0";

  document.body.appendChild(temporary);
  temporary.select();

  const success = document.execCommand("copy");
  temporary.remove();

  if (!success) {
    throw new Error("Clipboard tidak tersedia");
  }
}

/* =========================
   EVENT TOMBOL
========================= */

document.addEventListener("click", async event => {
  const copyCodeButton = event.target.closest(".aigaz-copy-code");

  if (copyCodeButton) {
    const code = copyCodeButton
      .closest(".aigaz-code-block")
      ?.querySelector("pre code")
      ?.textContent || "";

    try {
      await copyText(code);

      copyCodeButton.textContent = "✓ Tersalin";
      toast("Kode berhasil disalin.");

      setTimeout(() => {
        if (copyCodeButton.isConnected) {
          copyCodeButton.textContent = "⧉ Salin Kode";
        }
      }, 1800);
    } catch {
      toast("Gagal menyalin. Silakan salin kode secara manual.");
    }

    return;
  }

  const copyAnswerButton = event.target.closest(".aigaz-copy-answer");

  if (copyAnswerButton) {
    const messageBody = copyAnswerButton
      .closest(".message")
      ?.querySelector(".message-text");

    const text = messageBody?.innerText || "";

    try {
      await copyText(text);

      copyAnswerButton.textContent = "✓ Tersalin";
      toast("Jawaban berhasil disalin.");

      setTimeout(() => {
        if (copyAnswerButton.isConnected) {
          copyAnswerButton.textContent = "Salin Jawaban";
        }
      }, 1800);
    } catch {
      toast("Gagal menyalin jawaban.");
    }

    return;
  }

  const pageButton = event.target.closest("[data-page]");

  if (pageButton) {
    event.preventDefault();
    setPage(pageButton.dataset.page);
    return;
  }

  const openButton = event.target.closest("[data-open]");

  if (openButton) {
    setPage(openButton.dataset.open);
    return;
  }

  const action = event.target.closest("[data-action]");

  if (action?.dataset.action === "new-chat") {
    newChat();
    return;
  }

  const category = event.target.closest("[data-category]");

  if (category) {
    selectedCategory = category.dataset.category;

    document.querySelectorAll("[data-category]").forEach(button => {
      button.classList.toggle(
        "active",
        button.dataset.category === selectedCategory
      );
    });

    const results = $("#toolResults");
    if (results) results.innerHTML = renderCards();

    return;
  }

  const prompt = event.target.closest("[data-prompt]");

  if (prompt) {
    sendMessage(prompt.dataset.prompt);
    return;
  }

  const openHistory = event.target.closest("[data-open-chat]");

  if (openHistory) {
    openChat(openHistory.dataset.openChat);
    return;
  }

  const deleteHistory = event.target.closest("[data-delete-chat]");

  if (deleteHistory) {
    if (busy) return;

    const id = deleteHistory.dataset.deleteChat;
    const chat = chats.find(item => item.id === id);

    if (!chat) return;

    if (!confirm(`Hapus percakapan "${chat.title}"?`)) return;

    chats = chats.filter(item => item.id !== id);

    if (currentChatId === id) currentChatId = null;

    for (const mode of Object.keys(currentChatIds)) {
      if (currentChatIds[mode] === id) {
        currentChatIds[mode] = null;
      }
    }

    saveChats();
    renderPage();
    toast("Percakapan dihapus.");

    return;
  }

  if (event.target.closest("#exportHistory")) {
    exportHistory();
    toast("Ekspor riwayat dimulai.");
    return;
  }

  if (event.target.closest("#clearHistory")) {
    if (busy) return;

    if (!confirm("Hapus semua riwayat percakapan?")) return;

    chats = [];
    currentChatId = null;
    currentChatIds.chat = null;
    currentChatIds.coding = null;
    currentChatIds.creative = null;

    saveChats();
    renderPage();
    toast("Semua riwayat dihapus.");

    return;
  }

  if (event.target.closest("#refreshStatus")) {
    refreshStatus();
  }
});

/* =========================
   PENCARIAN DAN INPUT
========================= */

document.addEventListener("input", event => {
  if (event.target.id === "searchTools") {
    searchQuery = event.target.value;

    const results = $("#toolResults");
    if (results) results.innerHTML = renderCards();
  }

  if (event.target.id === "historySearch") {
    historyQuery = event.target.value;

    const results = $("#historyResults");
    if (results) results.innerHTML = historyItems(historyQuery);
  }

  if (event.target.id === "messageInput") {
    event.target.style.height = "auto";

    event.target.style.height =
      `${Math.min(event.target.scrollHeight, 170)}px`;
  }
});

document.addEventListener("keydown", event => {
  if (
    event.target.matches(".tool-card") &&
    (event.key === "Enter" || event.key === " ")
  ) {
    event.preventDefault();
    setPage(event.target.dataset.open);
  }

  if (
    event.target.id === "messageInput" &&
    event.key === "Enter" &&
    !event.shiftKey
  ) {
    event.preventDefault();
    $("#chatForm")?.requestSubmit();
  }
});

document.addEventListener("submit", event => {
  if (event.target.id !== "chatForm") return;

  event.preventDefault();

  const input = $("#messageInput");
  const message = input?.value || "";

  if (!message.trim() || busy) return;

  input.value = "";
  input.style.height = "auto";

  sendMessage(message);
});

/* =========================
   MENU DAN CEK BACKEND
========================= */

$("#menuBtn").addEventListener("click", () => {
  sidebar.classList.toggle("open");
});

async function checkBackend() {
  const label = $("#connectionLabel");

  try {
    const response = await fetch("/api/health");

    if (!response.ok) {
      throw new Error("Backend error");
    }

    label.textContent = "Backend aktif";
  } catch {
    label.textContent = "Backend tidak tersedia";
  }
}

installMarkdownStyles();
renderPage();
checkBackend();
