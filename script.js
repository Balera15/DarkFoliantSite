const UI_STORAGE_KEY = "ferelden-ui-v3";
const PREF_KEYS = {
  theme: "ferelden-pref-theme-v1"
};

const DANGER_LEVELS = {
  safe: { label: "Угроза: безопасный", className: "danger-level--safe" },
  low: { label: "Угроза: низкий", className: "danger-level--low" },
  medium: { label: "Угроза: средний", className: "danger-level--medium" },
  high: { label: "Угроза: высокий", className: "danger-level--high" },
  critical: { label: "Угроза: критический", className: "danger-level--critical" },
  legendary: { label: "Угроза: легендарный", className: "danger-level--legendary" },
  existential: {
    label: "Угроза: экзистенциальный",
    className: "danger-level--existential"
  }
};

const themeDefaults = {
  map: { src: "assets/map.svg", note: "Путеводная карта" },
  journal: ""
};

const themes = [
  {
    id: "ember",
    label: "Тлеющий уголь",
    note: "Тёплый янтарный свет и пепельный фон.",
    vars: {
      "--bg": "#0f0d0d",
      "--panel": "rgba(31, 24, 19, 0.9)",
      "--accent": "#d39a57",
      "--accent-2": "#7f6a53",
      "--text": "#f6e8d8",
      "--muted": "#c0a98e",
      "--line": "rgba(211, 154, 87, 0.18)",
      "--sheet-tint": "rgba(214, 180, 120, 0.12)",
      "--sheet-tint-2": "rgba(94, 77, 54, 0.24)",
      "--sheet-border": "rgba(225, 193, 137, 0.12)",
      "--sheet-inner": "rgba(225, 193, 137, 0.07)",
      "--sheet-fill": "rgba(44, 35, 26, 0.98)",
      "--sheet-fill-2": "rgba(22, 17, 13, 0.98)",
      "--sheet-cell": "rgba(10, 9, 12, 0.3)"
    }
  },
  {
    id: "moon",
    label: "Лунный туман",
    note: "Сталь, туман и холодный свет.",
    vars: {
      "--bg": "#0c1014",
      "--panel": "rgba(18, 25, 31, 0.9)",
      "--accent": "#88a8b7",
      "--accent-2": "#5d7580",
      "--text": "#ecf3f5",
      "--muted": "#9eb0b9",
      "--line": "rgba(136, 168, 183, 0.18)",
      "--sheet-tint": "rgba(136, 168, 183, 0.12)",
      "--sheet-tint-2": "rgba(93, 117, 128, 0.22)",
      "--sheet-border": "rgba(136, 168, 183, 0.12)",
      "--sheet-inner": "rgba(136, 168, 183, 0.08)",
      "--sheet-fill": "rgba(18, 25, 31, 0.98)",
      "--sheet-fill-2": "rgba(10, 16, 20, 0.98)",
      "--sheet-cell": "rgba(8, 12, 16, 0.34)"
    }
  },
  {
    id: "obsidian",
    label: "Обсидиановая ночь",
    note: "Глубокий мрак и золотые руны.",
    vars: {
      "--bg": "#09090d",
      "--panel": "rgba(19, 18, 26, 0.92)",
      "--accent": "#c49b63",
      "--accent-2": "#6e7d83",
      "--text": "#f1e8dc",
      "--muted": "#ab9b87",
      "--line": "rgba(196, 155, 99, 0.16)",
      "--sheet-tint": "rgba(196, 155, 99, 0.12)",
      "--sheet-tint-2": "rgba(110, 125, 131, 0.20)",
      "--sheet-border": "rgba(196, 155, 99, 0.12)",
      "--sheet-inner": "rgba(196, 155, 99, 0.07)",
      "--sheet-fill": "rgba(38, 30, 24, 0.98)",
      "--sheet-fill-2": "rgba(18, 16, 24, 0.98)",
      "--sheet-cell": "rgba(12, 10, 16, 0.32)"
    }
  }
];

const loreToneClasses = [
  "lore-tone--ember",
  "lore-tone--sage",
  "lore-tone--steel",
  "lore-tone--rose",
  "lore-tone--violet"
];

const views = Array.from(document.querySelectorAll(".screen"));
const navItems = Array.from(document.querySelectorAll(".nav-item"));
const authScreen = document.getElementById("authScreen");
const appShell = document.getElementById("appShell");
const authForm = document.getElementById("authForm");
const authError = document.getElementById("authError");
const logoutBtn = document.getElementById("logoutBtn");
const heroUserbar = document.getElementById("heroUserbar");
const roleBadge = document.getElementById("roleBadge");
const currentUserLabel = document.getElementById("currentUserLabel");
const accountSummary = document.getElementById("accountSummary");
const settingsLogoutBtn = document.getElementById("settingsLogoutBtn");
const bestiaryGrid = document.getElementById("bestiaryGrid");
const searchInput = document.getElementById("creatureSearch");
const filterButtons = Array.from(document.querySelectorAll("[data-filter]"));
const themeList = document.getElementById("themeList");
const loreTabs = document.getElementById("loreTabs");
const loreContent = document.getElementById("loreContent");
const loreSearch = document.getElementById("loreSearch");
const journalField = document.getElementById("sessionNotes");
const saveNotesBtn = document.getElementById("saveNotes");
const clearNotesBtn = document.getElementById("clearNotes");
const characterView = document.getElementById("characterView");
const dmScreen = document.querySelector('[data-view="dm"]');
const userCharacterSelect = document.getElementById("userCharacterSelect");
const characterOwnerSelect = document.getElementById("characterOwnerSelect");
const userForm = document.getElementById("userForm");
const characterForm = document.getElementById("characterForm");
const bestiaryForm = document.getElementById("bestiaryForm");
const mapForm = document.getElementById("mapForm");
const userFormReset = document.getElementById("userFormReset");
const characterFormReset = document.getElementById("characterFormReset");
const bestiaryFormReset = document.getElementById("bestiaryFormReset");
const userList = document.getElementById("userList");
const characterList = document.getElementById("characterList");
const bestiaryEditorTitle = document.getElementById("bestiaryEditorTitle");
const bestiaryEditorNew = document.getElementById("bestiaryEditorNew");
const bestiaryEditorDelete = document.getElementById("bestiaryEditorDelete");
const loreQuickForm = document.getElementById("loreQuickForm");
const loreQuickReset = document.getElementById("loreQuickReset");
const loreEditorTitle = document.getElementById("loreEditorTitle");
const loreEditorNew = document.getElementById("loreEditorNew");
const loreEditorDelete = document.getElementById("loreEditorDelete");
const mediaModal = document.getElementById("mediaModal");
const mediaModalFrame = document.getElementById("mediaModalFrame");
const mediaModalTitle = document.getElementById("mediaModalTitle");
const mediaModalEyebrow = document.getElementById("mediaModalEyebrow");
const mediaModalClose = document.getElementById("mediaModalClose");

let db = {
  users: [],
  characters: [],
  bestiary: [],
  lore: [],
  map: { ...themeDefaults.map },
  journal: themeDefaults.journal
};
let currentUser = null;
let currentThemeId = localStorage.getItem(PREF_KEYS.theme) || "ember";
let journalSaveTimer = null;

let state = {
  view: "bestiary",
  filter: "all",
  selectedCharacterId: loadUiState().selectedCharacterId || "",
  selectedLoreId: "",
  loreQuery: ""
};

const desktopDmQuery = window.matchMedia("(min-width: 900px)");

function loadUiState() {
  const raw = localStorage.getItem(UI_STORAGE_KEY);
  if (!raw) return { selectedCharacterId: "" };
  try {
    const parsed = JSON.parse(raw);
    return {
      selectedCharacterId:
        typeof parsed.selectedCharacterId === "string" ? parsed.selectedCharacterId : ""
    };
  } catch {
    return { selectedCharacterId: "" };
  }
}

function saveUiState() {
  localStorage.setItem(
    UI_STORAGE_KEY,
    JSON.stringify({ selectedCharacterId: state.selectedCharacterId })
  );
}

function isDm() {
  return currentUser?.role === "dm";
}

function isDesktopDm() {
  return isDm() && desktopDmQuery.matches;
}

function syncDesktopDmMode() {
  const desktopMode = isDesktopDm();
  document.documentElement.classList.toggle("dm-desktop-mode", desktopMode);
  document.body.classList.toggle("dm-desktop-mode", desktopMode);
  appShell?.classList.toggle("dm-desktop-mode", desktopMode);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function splitLines(value) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function mod(score) {
  return Math.floor((Number(score) - 10) / 2);
}

function typeLabel(type) {
  return type === "undead"
    ? "Нежить"
    : type === "wild"
      ? "Дикие"
      : type === "arcane"
        ? "Магические"
        : type;
}

function typeClass(type) {
  return type === "undead"
    ? "creature-type--undead"
    : type === "wild"
      ? "creature-type--wild"
      : type === "arcane"
        ? "creature-type--arcane"
        : "";
}

function normalizeDangerLevel(value) {
  const normalized = String(value || "").trim().toLowerCase();
  if (DANGER_LEVELS[normalized]) return normalized;
  if (normalized.includes("безопас")) return "safe";
  if (normalized.includes("низ")) return "low";
  if (normalized.includes("сред")) return "medium";
  if (normalized.includes("выс")) return "high";
  if (normalized.includes("крит")) return "critical";
  if (normalized.includes("леген")) return "legendary";
  if (normalized.includes("экзист")) return "existential";
  return "medium";
}

function dangerMeta(value) {
  const level = normalizeDangerLevel(value);
  return {
    level,
    label: DANGER_LEVELS[level].label,
    className: DANGER_LEVELS[level].className
  };
}

function safeMediaUrl(value) {
  const source = String(value || "").trim();
  if (!source) return "";
  if (/^javascript:/i.test(source)) return "";
  return source;
}

function toneFromKey(key) {
  let hash = 0;
  const normalized = String(key || "lore");
  for (let index = 0; index < normalized.length; index += 1) {
    hash = (hash * 31 + normalized.charCodeAt(index)) >>> 0;
  }
  return loreToneClasses[hash % loreToneClasses.length];
}

function loreTone(entry) {
  return entry?.tone || toneFromKey(entry?.id || entry?.category || "lore");
}

function matchesLoreQuery(entry, query) {
  if (!query) return true;
  const haystack = `${entry.category}\n${entry.items.join("\n")}`.toLowerCase();
  return haystack.includes(query);
}

function setView(view) {
  if (view === "dm" && !isDm()) return;
  state.view = view;
  views.forEach((section) =>
    section.classList.toggle("is-active", section.dataset.view === view)
  );
  navItems.forEach((button) =>
    button.classList.toggle("is-active", button.dataset.target === view)
  );
}

function applyTheme(themeId) {
  const theme = themes.find((item) => item.id === themeId) || themes[0];
  currentThemeId = theme.id;
  localStorage.setItem(PREF_KEYS.theme, currentThemeId);
  Object.entries(theme.vars).forEach(([key, value]) =>
    document.documentElement.style.setProperty(key, value)
  );
  updateThemeButtons();
}

function renderThemeControls() {
  themeList.innerHTML = themes
    .map(
      (theme) =>
        `<button class="theme-swatch" data-theme="${theme.id}" type="button">${theme.label}<small>${theme.note}</small></button>`
    )
    .join("");
  themeList.querySelectorAll("[data-theme]").forEach((button) =>
    button.addEventListener("click", () => applyTheme(button.dataset.theme))
  );
  updateThemeButtons();
}

function updateThemeButtons() {
  themeList
    .querySelectorAll(".theme-swatch")
    .forEach((button) =>
      button.classList.toggle("is-active", button.dataset.theme === currentThemeId)
    );
}

async function api(path, options = {}) {
  const response = await fetch(path, {
    method: options.method || "GET",
    credentials: "same-origin",
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(options.headers || {})
    },
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json")
    ? await response.json()
    : null;

  if (!response.ok) {
    const error = new Error(payload?.error || "Ошибка запроса.");
    error.status = response.status;
    throw error;
  }

  return payload;
}

function normalizeIncomingDb(incoming) {
  return {
    users: Array.isArray(incoming?.users) ? incoming.users : [],
    characters: Array.isArray(incoming?.characters) ? incoming.characters : [],
    bestiary: Array.isArray(incoming?.bestiary) ? incoming.bestiary : [],
    lore: Array.isArray(incoming?.lore) ? incoming.lore : [],
    map: incoming?.map && typeof incoming.map === "object" ? incoming.map : { ...themeDefaults.map },
    journal: typeof incoming?.journal === "string" ? incoming.journal : themeDefaults.journal
  };
}

function applyBootstrap(payload) {
  currentUser = payload?.user || null;
  db = normalizeIncomingDb(payload?.db);

  if (!db.map?.src) db.map = { ...themeDefaults.map, ...db.map };
  if (!db.lore.some((entry) => entry.id === state.selectedLoreId)) {
    state.selectedLoreId = db.lore[0]?.id || "";
  }

  if (isDm()) {
    if (!db.characters.some((character) => character.id === state.selectedCharacterId)) {
      state.selectedCharacterId = db.characters[0]?.id || "";
      saveUiState();
    }
  } else {
    state.selectedCharacterId = currentUser?.characterId || "";
    saveUiState();
  }
}

async function loadBootstrap() {
  const payload = await api("/api/bootstrap");
  if (!payload?.user) {
    currentUser = null;
    return;
  }
  applyBootstrap(payload);
}

function renderBestiary() {
  const query = searchInput.value.trim().toLowerCase();
  const entries = db.bestiary.filter((creature) => {
    const matchesFilter = state.filter === "all" || creature.type === state.filter;
    const matchesQuery =
      creature.name.toLowerCase().includes(query) ||
      creature.description.toLowerCase().includes(query) ||
      creature.tag.toLowerCase().includes(query);
    return matchesFilter && matchesQuery;
  });

  bestiaryGrid.innerHTML = entries
    .map(
      (creature) => {
        const threat = dangerMeta(creature.dangerLevel || creature.danger);
        const image = safeMediaUrl(creature.image);
        return `<article class="card card--interactive" data-action="preview-creature" data-id="${creature.id}" ${image ? 'data-has-image="true"' : ""}>
        <div class="card__top">
          <div>
            <div class="card__type ${typeClass(creature.type)}">${typeLabel(creature.type)}</div>
            <h3>${escapeHtml(creature.name)}</h3>
          </div>
          <span class="card__tag ${threat.className}">${escapeHtml(threat.label)}</span>
        </div>
        <p>${escapeHtml(creature.description)}</p>
        <div class="meta-row">
          <span>${escapeHtml(creature.tag)}</span>
          ${
            isDm()
              ? `<button class="tiny-btn" data-action="edit-bestiary" data-id="${creature.id}" type="button">Править</button>
                 <button class="tiny-btn tiny-btn--danger" data-action="delete-bestiary" data-id="${creature.id}" type="button">Удалить</button>`
              : ""
          }
        </div>
      </article>`;
      }
    )
    .join("");
}

function renderBestiaryComposer() {
  if (bestiaryForm) bestiaryForm.classList.toggle("is-hidden", !isDm());
  if (!isDm() || !bestiaryForm) return;
  const currentId = String(bestiaryForm.elements.id.value || "").trim();
  if (!currentId) {
    resetBestiaryForm();
    return;
  }
  const currentCreature = db.bestiary.find((entry) => entry.id === currentId);
  if (!currentCreature) resetBestiaryForm();
}

function renderLore() {
  const query = state.loreQuery.trim().toLowerCase();
  const filteredLore = db.lore.filter((entry) => matchesLoreQuery(entry, query));
  const activeEntry =
    filteredLore.find((entry) => entry.id === state.selectedLoreId) || filteredLore[0] || null;

  if (activeEntry) state.selectedLoreId = activeEntry.id;
  if (loreSearch && loreSearch.value !== state.loreQuery) loreSearch.value = state.loreQuery;

  loreTabs.innerHTML = filteredLore
    .map(
      (entry) => `<button class="lore-tab ${loreTone(entry)} ${activeEntry?.id === entry.id ? "is-active" : ""}" data-action="select-lore" data-id="${entry.id}" type="button">
        <span class="lore-tab__name">${escapeHtml(entry.category)}</span>
        <span class="lore-tab__count">${String(entry.items.length).padStart(2, "0")}</span>
      </button>`
    )
    .join("");

  if (!filteredLore.length) {
    loreContent.innerHTML = `<div class="lore-empty">По этому запросу ничего не найдено.</div>`;
    return;
  }

  if (!activeEntry) {
    loreContent.innerHTML = `<div class="lore-empty">Пока нет записей лора.</div>`;
    return;
  }

  loreContent.innerHTML = `<article class="lore-sheet ${loreTone(activeEntry)}">
    <div class="lore-sheet__head">
      <div>
        <p class="lore-sheet__eyebrow">Раздел архива</p>
        <h3>${escapeHtml(activeEntry.category)}</h3>
      </div>
      <p class="lore-sheet__count">${String(activeEntry.items.length).padStart(2, "0")} записи</p>
    </div>
    <div class="lore-sheet__body">
      ${activeEntry.items
        .map(
          (item, entryIndex) => `<section class="lore-entry">
            <span class="lore-entry__index">${String(entryIndex + 1).padStart(2, "0")}</span>
            <p>${escapeHtml(item)}</p>
          </section>`
        )
        .join("")}
    </div>
  </article>`;
}

function populateLoreEditor(id) {
  if (!loreQuickForm) return;
  const entry = db.lore.find((item) => item.id === id);
  if (!entry) {
    resetLoreForm();
    if (loreEditorTitle) loreEditorTitle.textContent = "Новый раздел";
    if (loreEditorDelete) loreEditorDelete.disabled = true;
    return;
  }
  loreQuickForm.elements.id.value = entry.id;
  loreQuickForm.elements.category.value = entry.category;
  loreQuickForm.elements.tone.value = loreTone(entry);
  loreQuickForm.elements.items.value = entry.items.join("\n");
  if (loreEditorTitle) loreEditorTitle.textContent = `Редактирование: ${entry.category}`;
  if (loreEditorDelete) loreEditorDelete.disabled = false;
}

function renderLoreComposer() {
  if (loreQuickForm) loreQuickForm.classList.toggle("is-hidden", !isDm());
  if (!isDm()) return;
  populateLoreEditor(state.selectedLoreId);
}

function renderJournal() {
  journalField.value = db.journal || "";
}

function renderAccountSummary() {
  if (!currentUser) {
    accountSummary.textContent = "Сейчас вы не вошли в систему.";
    return;
  }
  accountSummary.textContent =
    currentUser.role === "dm"
      ? `Вы вошли как DM: ${currentUser.displayName}. Вам доступно управление игроками, персонажами и содержимым книги.`
      : `Вы вошли как игрок: ${currentUser.displayName}. Вам доступен мир книги и назначенный персонаж.`;
}

function renderMap() {
  const img = document.querySelector(".map-panel img");
  if (img) {
    img.src = db.map.src || "assets/map.svg";
    img.alt = db.map.note || "Карта Ферелдена";
  }
}

function resolveActiveCharacter() {
  if (isDm()) {
    const selectedId = state.selectedCharacterId || db.characters[0]?.id || "";
    const resolved =
      db.characters.find((character) => character.id === selectedId) || db.characters[0] || null;
    if (resolved) {
      state.selectedCharacterId = resolved.id;
      saveUiState();
    }
    return resolved;
  }
  return db.characters.find((character) => character.id === (currentUser?.characterId || "")) || null;
}

function renderCharacterView() {
  const character = resolveActiveCharacter();
  if (!character) {
    characterView.innerHTML = `<article class="panel"><p class="admin-empty">Для этого аккаунта пока не назначен персонаж. DM может выдать карточку в управлении.</p></article>`;
    return;
  }

  const preview = isDm()
    ? `<div class="character-preview-head"><span class="hero__role">Просмотр</span><select id="characterPreviewSelect">${db.characters
        .map(
          (entry) =>
            `<option value="${entry.id}" ${entry.id === character.id ? "selected" : ""}>${escapeHtml(entry.name)}</option>`
        )
        .join("")}</select></div>`
    : "";
  const image = safeMediaUrl(character.image);
  const portrait = image
    ? `<button class="sheet-portrait" type="button" data-action="preview-character-portrait" data-id="${character.id}">
        <img src="${escapeHtml(image)}" alt="${escapeHtml(character.name)}">
      </button>`
    : `<div class="sheet-portrait sheet-portrait--empty">
        <span>Портрет персонажа</span>
        <strong>${escapeHtml(character.name)}</strong>
      </div>`;

  characterView.innerHTML = `<div class="character-view">
    ${preview}
    <article class="panel character-sheet character-sheet--sheet">
      <div class="sheet-hero">
        ${portrait}
      </div>
      <div class="sheet-header">
        <div class="sheet-field sheet-field--label">Имя:</div>
        <div class="sheet-field sheet-field--value">${escapeHtml(character.name)}</div>
        <div class="sheet-field sheet-field--label">Здоровье:</div>
        <div class="sheet-field sheet-field--value sheet-field--right sheet-field--health">${character.health}</div>
      </div>
      <div class="sheet-strip">
        <div class="sheet-field sheet-field--label">Броня:</div>
        <div class="sheet-field sheet-field--value sheet-field--right sheet-field--armor">${character.armor}</div>
        <div class="sheet-field sheet-field--label">Раса:</div>
        <div class="sheet-field sheet-field--value">${escapeHtml(character.race)}</div>
        <div class="sheet-field sheet-field--label">Класс:</div>
        <div class="sheet-field sheet-field--value">${escapeHtml(character.className)}</div>
      </div>
      <div class="sheet-stats">
        <div class="stat-cell"><span>СИЛА</span><strong>${character.stats.strength}</strong><em>(${mod(character.stats.strength) >= 0 ? "+" : ""}${mod(character.stats.strength)})</em></div>
        <div class="stat-cell"><span>ЛОВКОСТЬ</span><strong>${character.stats.dexterity}</strong><em>(${mod(character.stats.dexterity) >= 0 ? "+" : ""}${mod(character.stats.dexterity)})</em></div>
        <div class="stat-cell"><span>ВЫНОСЛИВОСТЬ</span><strong>${character.stats.constitution}</strong><em>(${mod(character.stats.constitution) >= 0 ? "+" : ""}${mod(character.stats.constitution)})</em></div>
        <div class="stat-cell"><span>МУДРОСТЬ</span><strong>${character.stats.wisdom}</strong><em>(${mod(character.stats.wisdom) >= 0 ? "+" : ""}${mod(character.stats.wisdom)})</em></div>
        <div class="stat-cell"><span>ИНТЕЛЛЕКТ</span><strong>${character.stats.intelligence}</strong><em>(${mod(character.stats.intelligence) >= 0 ? "+" : ""}${mod(character.stats.intelligence)})</em></div>
        <div class="stat-cell"><span>ХАРИЗМА</span><strong>${character.stats.charisma}</strong><em>(${mod(character.stats.charisma) >= 0 ? "+" : ""}${mod(character.stats.charisma)})</em></div>
      </div>
      <div class="sheet-section">
        <div class="sheet-section__title">Владение оружием:</div>
        <div class="sheet-section__body">${escapeHtml(character.weapon || "")}</div>
      </div>
      <div class="sheet-section">
        <div class="sheet-section__title">Особые навыки:</div>
        <div class="sheet-section__body sheet-section__body--dense">${(character.skills || []).map((skill) => `<p>${escapeHtml(skill)};</p>`).join("")}</div>
      </div>
      <div class="sheet-section">
        <div class="sheet-section__title">Инвентарь:</div>
        <div class="sheet-section__body sheet-section__body--dense">${(character.inventory || []).map((item) => `<p>${escapeHtml(item)};</p>`).join("")}</div>
      </div>
      <div class="sheet-section">
        <div class="sheet-section__title">Описание:</div>
        <div class="sheet-section__body sheet-section__body--long">${escapeHtml(character.description || "")}</div>
      </div>
    </article>
  </div>`;

  if (isDm()) {
    document.getElementById("characterPreviewSelect")?.addEventListener("change", (event) => {
      state.selectedCharacterId = event.target.value;
      saveUiState();
      renderCharacterView();
    });
  }

  characterView.querySelector('[data-action="preview-character-portrait"]')?.addEventListener("click", () => {
    openMediaModal({
      eyebrow: "Портрет персонажа",
      title: character.name,
      image: character.image
    });
  });
}

function renderAdminSelects() {
  userCharacterSelect.innerHTML = [
    `<option value="">Без персонажа</option>`,
    ...db.characters.map(
      (character) => `<option value="${character.id}">${escapeHtml(character.name)}</option>`
    )
  ].join("");

  characterOwnerSelect.innerHTML = [
    `<option value="">Без владельца</option>`,
    ...db.users
      .filter((user) => user.role !== "dm")
      .map(
        (user) =>
          `<option value="${user.id}">${escapeHtml(user.displayName)} (${escapeHtml(user.username)})</option>`
      )
  ].join("");
}

function renderUserList() {
  userList.innerHTML = db.users
    .map((user) => {
      const assigned = user.characterId
        ? db.characters.find((character) => character.id === user.characterId)
        : null;
      return `<div class="admin-item">
        <div class="admin-item__top">
          <div>
            <strong>${escapeHtml(user.displayName)}</strong>
            <div class="admin-item__meta">${escapeHtml(user.username)} · ${user.role === "dm" ? "DM" : "Игрок"}${assigned ? ` · ${escapeHtml(assigned.name)}` : ""}</div>
          </div>
        </div>
        <div class="admin-item__actions">
          <button class="tiny-btn" data-action="edit-user" data-id="${user.id}" type="button">Править</button>
          ${user.role !== "dm" ? `<button class="tiny-btn tiny-btn--danger" data-action="delete-user" data-id="${user.id}" type="button">Удалить</button>` : ""}
        </div>
      </div>`;
    })
    .join("");
}

function renderCharacterList() {
  characterList.innerHTML = db.characters
    .map((character) => {
      const owner = db.users.find((user) => user.id === character.ownerUserId);
      return `<div class="admin-item">
        <div class="admin-item__top">
          <div>
            <strong>${escapeHtml(character.name)}</strong>
            <div class="admin-item__meta">${escapeHtml(character.race)} · ${escapeHtml(character.className)} · ${owner ? `Владелец: ${escapeHtml(owner.displayName)}` : "Без владельца"}</div>
          </div>
        </div>
        <div class="admin-item__actions">
          <button class="tiny-btn" data-action="edit-character" data-id="${character.id}" type="button">Править</button>
          <button class="tiny-btn tiny-btn--danger" data-action="delete-character" data-id="${character.id}" type="button">Удалить</button>
        </div>
      </div>`;
    })
    .join("");
}

function fillAdminForms() {
  mapForm.elements.src.value = db.map.src || "";
  mapForm.elements.note.value = db.map.note || "";
}

function renderAdminPanels() {
  if (!isDm()) {
    dmScreen?.classList.add("is-hidden");
    return;
  }
  dmScreen?.classList.remove("is-hidden");
  renderAdminSelects();
  renderUserList();
  renderCharacterList();
  fillAdminForms();
}

function resetUserForm() {
  userForm.reset();
  userForm.elements.id.value = "";
}

function resetCharacterForm() {
  characterForm.reset();
  characterForm.elements.id.value = "";
}

function resetBestiaryForm() {
  if (!bestiaryForm) return;
  bestiaryForm.reset();
  bestiaryForm.elements.id.value = "";
  bestiaryForm.elements.type.value = "wild";
  bestiaryForm.elements.dangerLevel.value = "medium";
  bestiaryForm.elements.image.value = "";
  if (bestiaryEditorTitle) bestiaryEditorTitle.textContent = "Новое существо";
  if (bestiaryEditorDelete) bestiaryEditorDelete.disabled = true;
}

function resetLoreForm() {
  if (!loreQuickForm) return;
  loreQuickForm.reset();
  loreQuickForm.elements.id.value = "";
  loreQuickForm.elements.tone.value = "lore-tone--ember";
  if (loreEditorTitle) loreEditorTitle.textContent = "Новый раздел";
  if (loreEditorDelete) loreEditorDelete.disabled = true;
}

function populateUserForm(user) {
  userForm.elements.id.value = user.id;
  userForm.elements.username.value = user.username;
  userForm.elements.displayName.value = user.displayName;
  userForm.elements.password.value = "";
  userForm.elements.characterId.value = user.characterId || "";
}

function populateCharacterForm(character) {
  characterForm.elements.id.value = character.id;
  characterForm.elements.name.value = character.name;
  characterForm.elements.race.value = character.race;
  characterForm.elements.className.value = character.className;
  characterForm.elements.health.value = character.health;
  characterForm.elements.armor.value = character.armor;
  characterForm.elements.ownerUserId.value = character.ownerUserId || "";
  characterForm.elements.strength.value = character.stats.strength;
  characterForm.elements.dexterity.value = character.stats.dexterity;
  characterForm.elements.constitution.value = character.stats.constitution;
  characterForm.elements.wisdom.value = character.stats.wisdom;
  characterForm.elements.intelligence.value = character.stats.intelligence;
  characterForm.elements.charisma.value = character.stats.charisma;
  characterForm.elements.weapon.value = character.weapon || "";
  characterForm.elements.skills.value = (character.skills || []).join("\n");
  characterForm.elements.inventory.value = (character.inventory || []).join("\n");
  characterForm.elements.description.value = character.description || "";
  characterForm.elements.image.value = character.image || "";
}

function populateBestiaryForm(creature) {
  if (!bestiaryForm) return;
  bestiaryForm.elements.id.value = creature.id;
  bestiaryForm.elements.name.value = creature.name;
  bestiaryForm.elements.type.value = creature.type;
  bestiaryForm.elements.tag.value = creature.tag;
  bestiaryForm.elements.dangerLevel.value = normalizeDangerLevel(
    creature.dangerLevel || creature.danger
  );
  bestiaryForm.elements.description.value = creature.description;
  bestiaryForm.elements.image.value = creature.image || "";
  if (bestiaryEditorTitle) bestiaryEditorTitle.textContent = `Редактирование: ${creature.name}`;
  if (bestiaryEditorDelete) bestiaryEditorDelete.disabled = false;
}

function openMediaModal({ eyebrow, title, image }) {
  if (!mediaModal || !mediaModalFrame || !mediaModalTitle || !mediaModalEyebrow) return;
  const source = safeMediaUrl(image);
  mediaModalEyebrow.textContent = eyebrow || "";
  mediaModalTitle.textContent = title || "";
  mediaModalFrame.innerHTML = source
    ? `<img class="media-modal__image" src="${escapeHtml(source)}" alt="${escapeHtml(title || "Изображение")}">`
    : `<div class="media-modal__empty">
        <span>Изображение не задано</span>
        <strong>${escapeHtml(title || "Образ недоступен")}</strong>
        <p>DM может добавить ссылку на изображение прямо в редакторе.</p>
      </div>`;
  mediaModal.classList.remove("is-hidden");
  mediaModal.setAttribute("aria-hidden", "false");
}

function closeMediaModal() {
  if (!mediaModal || !mediaModalFrame) return;
  mediaModal.classList.add("is-hidden");
  mediaModal.setAttribute("aria-hidden", "true");
  mediaModalFrame.innerHTML = "";
}

function startBestiaryCreate() {
  resetBestiaryForm();
  bestiaryForm?.elements.name.focus();
}

function startLoreCreate() {
  resetLoreForm();
  loreQuickForm?.elements.category.focus();
}

function refreshAll() {
  const loggedIn = Boolean(currentUser);
  syncDesktopDmMode();

  authScreen?.classList.toggle("is-hidden", loggedIn);
  appShell?.classList.toggle("is-hidden", !loggedIn);
  heroUserbar?.classList.toggle("is-hidden", !loggedIn);

  if (!loggedIn) {
    if (roleBadge) roleBadge.textContent = "";
    if (currentUserLabel) currentUserLabel.textContent = "";
    if (accountSummary) accountSummary.textContent = "Сейчас вы не вошли в систему.";
    navItems.forEach((button) => {
      if (button.dataset.target === "dm") {
        button.classList.add("is-hidden");
        if (button.classList.contains("is-active")) setView("bestiary");
      }
    });
    return;
  }

  if (roleBadge) roleBadge.textContent = currentUser.role === "dm" ? "DM" : "Игрок";
  if (currentUserLabel) {
    currentUserLabel.textContent =
      currentUser.role === "dm"
        ? `Вход как DM: ${currentUser.displayName}`
        : `Вход как игрок: ${currentUser.displayName}`;
  }

  renderAccountSummary();

  navItems.forEach((button) => {
    const shouldHide = button.dataset.target === "dm" && (!isDm() || isDesktopDm());
    button.classList.toggle("is-hidden", shouldHide);
    if (shouldHide && button.classList.contains("is-active")) setView("bestiary");
  });

  applyTheme(currentThemeId);
  renderBestiary();
  renderBestiaryComposer();
  renderLore();
  renderLoreComposer();
  renderJournal();
  renderMap();
  renderCharacterView();
  renderAdminPanels();

  if (isDesktopDm() && state.view === "dm") state.view = "bestiary";
  setView(isDm() ? state.view : state.view === "dm" ? "bestiary" : state.view);
}

async function handleAuthSubmit(event) {
  event.preventDefault();
  authError.textContent = "";
  const data = new FormData(authForm);
  try {
    await api("/api/login", {
      method: "POST",
      body: {
        username: String(data.get("username") || "").trim(),
        password: String(data.get("password") || "").trim()
      }
    });
    authForm.reset();
    await loadBootstrap();
    refreshAll();
  } catch (error) {
    authError.textContent = error.message || "Не удалось войти.";
  }
}

async function logout() {
  try {
    await api("/api/logout", { method: "POST" });
  } catch {}
  currentUser = null;
  state.selectedCharacterId = "";
  saveUiState();
  authError.textContent = "";
  authScreen?.classList.remove("is-hidden");
  appShell?.classList.add("is-hidden");
}

async function handleUserFormSubmit(event) {
  event.preventDefault();
  const data = new FormData(userForm);
  const payload = {
    id: String(data.get("id") || "").trim(),
    username: String(data.get("username") || "").trim(),
    displayName: String(data.get("displayName") || "").trim(),
    password: String(data.get("password") || "").trim(),
    characterId: String(data.get("characterId") || "").trim()
  };
  if (!payload.username || !payload.displayName) return;
  try {
    await api("/api/users", { method: "POST", body: payload });
    resetUserForm();
    await loadBootstrap();
    refreshAll();
  } catch (error) {
    alert(error.message || "Не удалось сохранить аккаунт.");
  }
}

async function handleCharacterFormSubmit(event) {
  event.preventDefault();
  const data = new FormData(characterForm);
  const payload = {
    id: String(data.get("id") || "").trim(),
    name: String(data.get("name") || "").trim(),
    race: String(data.get("race") || "").trim(),
    className: String(data.get("className") || "").trim(),
    health: Number(data.get("health") || 0),
    armor: Number(data.get("armor") || 0),
    stats: {
      strength: Number(data.get("strength") || 0),
      dexterity: Number(data.get("dexterity") || 0),
      constitution: Number(data.get("constitution") || 0),
      wisdom: Number(data.get("wisdom") || 0),
      intelligence: Number(data.get("intelligence") || 0),
      charisma: Number(data.get("charisma") || 0)
    },
    weapon: String(data.get("weapon") || "").trim(),
    skills: splitLines(String(data.get("skills") || "")),
    inventory: splitLines(String(data.get("inventory") || "")),
    description: String(data.get("description") || "").trim(),
    image: safeMediaUrl(data.get("image")),
    ownerUserId: String(data.get("ownerUserId") || "").trim()
  };
  if (!payload.name || !payload.race || !payload.className) return;
  try {
    await api("/api/characters", { method: "POST", body: payload });
    resetCharacterForm();
    await loadBootstrap();
    refreshAll();
  } catch (error) {
    alert(error.message || "Не удалось сохранить персонажа.");
  }
}

async function handleBestiaryFormSubmit(event) {
  event.preventDefault();
  const data = new FormData(bestiaryForm);
  const payload = {
    id: String(data.get("id") || "").trim(),
    name: String(data.get("name") || "").trim(),
    type: String(data.get("type") || "wild").trim(),
    tag: String(data.get("tag") || "").trim(),
    dangerLevel: normalizeDangerLevel(data.get("dangerLevel")),
    description: String(data.get("description") || "").trim(),
    image: safeMediaUrl(data.get("image"))
  };
  if (!payload.name || !payload.description) return;
  try {
    await api("/api/bestiary", { method: "POST", body: payload });
    resetBestiaryForm();
    await loadBootstrap();
    refreshAll();
  } catch (error) {
    alert(error.message || "Не удалось сохранить существо.");
  }
}

async function handleLoreQuickSubmit(event) {
  event.preventDefault();
  const data = new FormData(loreQuickForm);
  const payload = {
    id: String(data.get("id") || "").trim(),
    category: String(data.get("category") || "").trim(),
    tone: String(data.get("tone") || "").trim() || "lore-tone--ember",
    items: splitLines(String(data.get("items") || ""))
  };
  if (!payload.category || !payload.items.length) return;
  try {
    await api("/api/lore", { method: "POST", body: payload });
    await loadBootstrap();
    if (payload.id) {
      state.selectedLoreId = payload.id;
    } else {
      const matched = db.lore.find((entry) => entry.category === payload.category);
      state.selectedLoreId = matched?.id || db.lore[0]?.id || "";
    }
    refreshAll();
  } catch (error) {
    alert(error.message || "Не удалось сохранить раздел.");
  }
}

async function handleMapFormSubmit(event) {
  event.preventDefault();
  const data = new FormData(mapForm);
  try {
    await api("/api/map", {
      method: "PUT",
      body: {
        src: String(data.get("src") || "").trim(),
        note: String(data.get("note") || "").trim()
      }
    });
    await loadBootstrap();
    refreshAll();
  } catch (error) {
    alert(error.message || "Не удалось сохранить карту.");
  }
}

async function saveJournalNow() {
  if (!currentUser) return;
  try {
    await api("/api/journal", {
      method: "PUT",
      body: { journal: journalField.value }
    });
    db.journal = journalField.value;
  } catch (error) {
    console.error(error);
  }
}

function scheduleJournalSave() {
  clearTimeout(journalSaveTimer);
  journalSaveTimer = window.setTimeout(() => {
    saveJournalNow();
  }, 450);
}

async function removeUser(userId) {
  try {
    await api(`/api/users/${encodeURIComponent(userId)}`, { method: "DELETE" });
    await loadBootstrap();
    refreshAll();
  } catch (error) {
    alert(error.message || "Не удалось удалить аккаунт.");
  }
}

async function removeCharacter(characterId) {
  try {
    await api(`/api/characters/${encodeURIComponent(characterId)}`, { method: "DELETE" });
    await loadBootstrap();
    refreshAll();
  } catch (error) {
    alert(error.message || "Не удалось удалить персонажа.");
  }
}

async function removeBestiary(id) {
  try {
    await api(`/api/bestiary/${encodeURIComponent(id)}`, { method: "DELETE" });
    await loadBootstrap();
    refreshAll();
  } catch (error) {
    alert(error.message || "Не удалось удалить существо.");
  }
}

async function removeLore(id) {
  try {
    await api(`/api/lore/${encodeURIComponent(id)}`, { method: "DELETE" });
    await loadBootstrap();
    refreshAll();
  } catch (error) {
    alert(error.message || "Не удалось удалить раздел.");
  }
}

function focusAdminForm(formElement) {
  if (!isDm()) return;
  setView("dm");
  window.requestAnimationFrame(() => {
    formElement?.scrollIntoView({ behavior: "smooth", block: "center" });
  });
}

function handleAdminAction(event) {
  const button = event.target.closest("[data-action]");
  if (!button) return;
  const { action } = button.dataset;

  if (action === "select-lore") {
    state.selectedLoreId = button.dataset.id;
    renderLore();
    renderLoreComposer();
    return;
  }

  if (action === "edit-user") {
    const user = db.users.find((entry) => entry.id === button.dataset.id);
    if (user) {
      populateUserForm(user);
      focusAdminForm(userForm);
    }
  }

  if (action === "delete-user") removeUser(button.dataset.id);

  if (action === "edit-character") {
    const character = db.characters.find((entry) => entry.id === button.dataset.id);
    if (character) {
      populateCharacterForm(character);
      focusAdminForm(characterForm);
    }
  }

  if (action === "delete-character") removeCharacter(button.dataset.id);

  if (action === "edit-bestiary") {
    const creature = db.bestiary.find((entry) => entry.id === button.dataset.id);
    if (creature) {
      setView("bestiary");
      populateBestiaryForm(creature);
      window.requestAnimationFrame(() => {
        bestiaryForm?.scrollIntoView({ behavior: "smooth", block: "center" });
      });
    }
  }

  if (action === "delete-bestiary") removeBestiary(button.dataset.id);

  if (action === "preview-creature") {
    const creature = db.bestiary.find((entry) => entry.id === button.dataset.id);
    if (creature) {
      openMediaModal({
        eyebrow: typeLabel(creature.type),
        title: creature.name,
        image: creature.image
      });
    }
  }
}

function bindEvents() {
  authForm.addEventListener("submit", handleAuthSubmit);
  logoutBtn.addEventListener("click", logout);
  settingsLogoutBtn.addEventListener("click", logout);

  navItems.forEach((button) =>
    button.addEventListener("click", () => setView(button.dataset.target))
  );

  filterButtons.forEach((button) =>
    button.addEventListener("click", () => {
      state.filter = button.dataset.filter;
      filterButtons.forEach((entry) =>
        entry.classList.toggle("is-active", entry === button)
      );
      renderBestiary();
    })
  );

  searchInput.addEventListener("input", renderBestiary);

  loreSearch?.addEventListener("input", () => {
    state.loreQuery = loreSearch.value.trim();
    renderLore();
  });

  saveNotesBtn.addEventListener("click", saveJournalNow);
  clearNotesBtn.addEventListener("click", () => {
    journalField.value = "";
    saveJournalNow();
  });
  journalField.addEventListener("input", scheduleJournalSave);

  userForm.addEventListener("submit", handleUserFormSubmit);
  characterForm.addEventListener("submit", handleCharacterFormSubmit);
  bestiaryForm?.addEventListener("submit", handleBestiaryFormSubmit);
  loreQuickForm?.addEventListener("submit", handleLoreQuickSubmit);
  mapForm.addEventListener("submit", handleMapFormSubmit);

  userFormReset.addEventListener("click", resetUserForm);
  characterFormReset.addEventListener("click", resetCharacterForm);
  bestiaryFormReset?.addEventListener("click", resetBestiaryForm);
  loreQuickReset?.addEventListener("click", () => populateLoreEditor(state.selectedLoreId));

  bestiaryEditorNew?.addEventListener("click", startBestiaryCreate);
  bestiaryEditorDelete?.addEventListener("click", () => {
    const idRaw = bestiaryForm?.elements.id.value || "";
    if (idRaw) removeBestiary(idRaw);
  });

  loreEditorNew?.addEventListener("click", startLoreCreate);
  loreEditorDelete?.addEventListener("click", () => {
    const idRaw = loreQuickForm?.elements.id.value || "";
    if (idRaw) removeLore(idRaw);
  });

  userList.addEventListener("click", handleAdminAction);
  characterList.addEventListener("click", handleAdminAction);
  bestiaryGrid.addEventListener("click", handleAdminAction);
  loreTabs?.addEventListener("click", handleAdminAction);
  desktopDmQuery.addEventListener("change", refreshAll);
  mediaModalClose?.addEventListener("click", closeMediaModal);
  mediaModal?.addEventListener("click", (event) => {
    if (event.target instanceof HTMLElement && event.target.dataset.closeMedia === "true") {
      closeMediaModal();
    }
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMediaModal();
  });
}

async function init() {
  bindEvents();
  renderThemeControls();
  applyTheme(currentThemeId);

  try {
    await loadBootstrap();
    if (currentUser) {
      refreshAll();
    } else {
      authScreen?.classList.remove("is-hidden");
      appShell?.classList.add("is-hidden");
    }
  } catch (error) {
    authScreen?.classList.remove("is-hidden");
    appShell?.classList.add("is-hidden");
    if (error.status && error.status !== 401) {
      authError.textContent = "Сервер книги недоступен. Проверь запуск backend.";
    }
  }
}

init();
