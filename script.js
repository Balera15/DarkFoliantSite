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

const translitMap = {
  а: "a",
  б: "b",
  в: "v",
  г: "g",
  д: "d",
  е: "e",
  ё: "e",
  ж: "zh",
  з: "z",
  и: "i",
  й: "y",
  к: "k",
  л: "l",
  м: "m",
  н: "n",
  о: "o",
  п: "p",
  р: "r",
  с: "s",
  т: "t",
  у: "u",
  ф: "f",
  х: "h",
  ц: "ts",
  ч: "ch",
  ш: "sh",
  щ: "sch",
  ъ: "",
  ы: "y",
  ь: "",
  э: "e",
  ю: "yu",
  я: "ya"
};

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
const gameToggleBtn = document.getElementById("gameToggleBtn");
const gameStateLabel = document.getElementById("gameStateLabel");
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
const journalUpdateToast = document.getElementById("journalUpdateToast");
const characterRequestState = document.getElementById("characterRequestState");
const characterView = document.getElementById("characterView");
const dmScreen = document.querySelector('[data-view="dm"]');
const userCharacterSelect = document.getElementById("userCharacterSelect");
const characterOwnerSelect = document.getElementById("characterOwnerSelect");
const userForm = document.getElementById("userForm");
const characterForm = document.getElementById("characterForm");
const characterFormSubmitBtn = characterForm?.querySelector('button[type="submit"]');
const bestiaryForm = document.getElementById("bestiaryForm");
const mapForm = document.getElementById("mapForm");
const userFormReset = document.getElementById("userFormReset");
const characterFormReset = document.getElementById("characterFormReset");
const bestiaryFormReset = document.getElementById("bestiaryFormReset");
const userList = document.getElementById("userList");
const characterList = document.getElementById("characterList");
const characterRequestList = document.getElementById("characterRequestList");
const bestiaryEditorTitle = document.getElementById("bestiaryEditorTitle");
const bestiaryEditorNew = document.getElementById("bestiaryEditorNew");
const bestiaryEditorDelete = document.getElementById("bestiaryEditorDelete");
const loreQuickForm = document.getElementById("loreQuickForm");
const loreQuickReset = document.getElementById("loreQuickReset");
const loreEditorTitle = document.getElementById("loreEditorTitle");
const loreEditorNew = document.getElementById("loreEditorNew");
const loreEditorDelete = document.getElementById("loreEditorDelete");
const loreTableForm = document.getElementById("loreTableForm");
const loreTableHead = document.getElementById("loreTableHead");
const loreTableBody = document.getElementById("loreTableBody");
const loreTableReset = document.getElementById("loreTableReset");
const loreTableEditorTitle = document.getElementById("loreTableEditorTitle");
const loreTableEditorNew = document.getElementById("loreTableEditorNew");
const loreTableEditorDelete = document.getElementById("loreTableEditorDelete");
const loreTableAddRow = document.getElementById("loreTableAddRow");
const lorePanel = document.querySelector(".lore-panel");
const mediaModal = document.getElementById("mediaModal");
const mediaModalFrame = document.getElementById("mediaModalFrame");
const mediaModalTitle = document.getElementById("mediaModalTitle");
const mediaModalEyebrow = document.getElementById("mediaModalEyebrow");
const mediaModalClose = document.getElementById("mediaModalClose");
const raceImageManager = document.getElementById("raceImageManager");
const raceImageInput = document.getElementById("raceImageInput");
const raceImageSaveBtn = document.getElementById("raceImageSaveBtn");
const raceImageResetBtn = document.getElementById("raceImageResetBtn");
const raceImageHint = document.getElementById("raceImageHint");

let db = {
  users: [],
  characters: [],
  bestiary: [],
  lore: [],
  characterRequests: [],
  raceImages: {},
  game: { isActive: false },
  map: { ...themeDefaults.map },
  journal: themeDefaults.journal
};
let currentUser = null;
let currentThemeId = localStorage.getItem(PREF_KEYS.theme) || "ember";
let journalSaveTimer = null;
let loreSearchAnchorTop = 0;
let activeRacePreview = null;
let runtimeSyncTimer = null;
let runtimeSyncBusy = false;

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

function isGameActive() {
  return Boolean(db.game?.isActive);
}

function canPlayerActInSession(character) {
  if (!currentUser || !character) return false;
  if (isDm()) return true;
  return isGameActive() && (character.id === currentUser.characterId || character.ownerUserId === currentUser.id);
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

function getPendingCharacterRequest() {
  if (!currentUser || isDm()) return null;
  return (
    db.characterRequests.find(
      (request) => request.userId === currentUser.id && String(request.status || "") === "pending"
    ) || null
  );
}

function getLoreEntryByCategory(category) {
  const normalized = String(category || "").trim().toLowerCase();
  return db.lore.find((entry) => String(entry.category || "").trim().toLowerCase() === normalized) || null;
}

function getAvailableRaceOptions() {
  const loreEntry = getLoreEntryByCategory("народы");
  if (!loreEntry) return [];
  return loreEntry.items
    .map((item) => {
      const source = String(item || "").trim();
      const parsed = parseLabeledLoreRecord(String(item || ""), [
        "Название",
        "Бонусы",
        "Тип",
        "Размер",
        "Способности",
        "Пометка",
        "Описание"
      ]);
      if (parsed?.Название?.trim()) return parsed.Название.trim();
      const fallbackMatch = source.match(/^(.+?)(?:\.\s+Бонусы:|:)/);
      if (fallbackMatch?.[1]) return fallbackMatch[1].trim();
      const firstSentence = source.split(".")[0]?.trim();
      return firstSentence || "";
    })
    .filter(Boolean);
}

function getAvailableClassOptions() {
  const loreEntry = getLoreEntryByCategory("классы");
  if (!loreEntry) return [];
  return loreEntry.items
    .map((item) => {
      const parsed = parseLabeledLoreRecord(String(item || ""), [
        "Название",
        "Доступное оружие",
        "Сложность",
        "Описание"
      ]);
      return parsed?.Название?.trim() || "";
    })
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

function parseLoreRecord(text) {
  const source = String(text || "").trim();
  const labelPattern = /\.(?:\s+)(Бонусы|Тип|Описание|Способности|Пометка):\s*/g;
  const firstLabelMatch = labelPattern.exec(source);
  if (!firstLabelMatch) return null;

  const name = source.slice(0, firstLabelMatch.index).trim().replace(/\.$/, "");
  if (!name) return null;

  const sections = [];
  let currentLabel = firstLabelMatch[1];
  let valueStart = labelPattern.lastIndex;
  let nextMatch = labelPattern.exec(source);

  while (currentLabel) {
    const end = nextMatch ? nextMatch.index : source.length;
    const value = source.slice(valueStart, end).trim().replace(/\.$/, "");
    sections.push({ label: currentLabel, value });
    if (!nextMatch) break;
    currentLabel = nextMatch[1];
    valueStart = labelPattern.lastIndex;
    nextMatch = labelPattern.exec(source);
  }

  const mapped = Object.fromEntries(sections.map((section) => [section.label, section.value]));
  const description = mapped["Описание"] || "";
  const sizeMatch = description.match(/Размер\s+[^.]+/i);
  const size = sizeMatch ? sizeMatch[0].replace(/^Размер\s+/i, "").trim() : "";
  const trimmedDescription = sizeMatch
    ? description.replace(sizeMatch[0], "").replace(/\s+\.$/, ".").trim().replace(/\.$/, "")
    : description;

  return {
    name,
    bonus: mapped["Бонусы"] || "",
    type: mapped["Тип"] || "",
    description: trimmedDescription,
    size,
    abilities: mapped["Способности"] || "",
    note: mapped["Пометка"] || ""
  };
}

function parseLabeledLoreRecord(text, labels) {
  const source = String(text || "").trim();
  const labelPattern = new RegExp(`(?:^|\\.\\s+)(${labels.join("|")}):\\s*`, "g");
  const firstLabelMatch = labelPattern.exec(source);
  if (!firstLabelMatch) return null;

  const sections = [];
  let currentLabel = firstLabelMatch[1];
  let valueStart = labelPattern.lastIndex;
  let nextMatch = labelPattern.exec(source);

  while (currentLabel) {
    const end = nextMatch ? nextMatch.index : source.length;
    const value = source.slice(valueStart, end).trim().replace(/\.$/, "");
    sections.push({ label: currentLabel, value });
    if (!nextMatch) break;
    currentLabel = nextMatch[1];
    valueStart = labelPattern.lastIndex;
    nextMatch = labelPattern.exec(source);
  }

  return Object.fromEntries(sections.map((section) => [section.label, section.value]));
}

function normalizedLoreCategory(category) {
  return String(category || "").trim().toLowerCase();
}

function getLoreTableSchema(category) {
  const normalized = normalizedLoreCategory(category);
  if (normalized === "народы") {
    return ["Название", "Бонусы", "Тип", "Размер", "Способности", "Пометка", "Описание"];
  }
  if (normalized === "классы") {
    return ["Название", "Доступное оружие", "Сложность", "Описание"];
  }
  if (normalized === "государства") {
    return ["Название", "Правитель", "Осн. население", "Идеология"];
  }
  if (normalized === "поселения") {
    return ["Название", "Принадлежность", "Местоположение", "Заметки"];
  }
  return ["Запись"];
}

function parseLoreItemForTable(category, item) {
  const columns = getLoreTableSchema(category);
  if (columns.length === 1 && columns[0] === "Запись") {
    return { Запись: String(item || "").trim() };
  }
  const normalized = normalizedLoreCategory(category);
  if (normalized === "народы") {
    const parsed = parseLabeledLoreRecord(item, columns);
    if (parsed) return parsed;
    const fallback = parseLoreRecord(item);
    if (!fallback) return Object.fromEntries(columns.map((column) => [column, ""]));
    return {
      Название: fallback.name || "",
      Бонусы: fallback.bonus || "",
      Тип: fallback.type || "",
      Размер: fallback.size || "",
      Способности: fallback.abilities || "",
      Пометка: fallback.note || "",
      Описание: fallback.description || ""
    };
  }
  return parseLabeledLoreRecord(item, columns) || Object.fromEntries(columns.map((column) => [column, ""]));
}

function buildLoreItemFromTable(category, row) {
  const columns = getLoreTableSchema(category);
  if (columns.length === 1 && columns[0] === "Запись") {
    return String(row.Запись || "").trim();
  }
  return columns
    .map((column) => {
      const value = String(row[column] || "").trim();
      return value ? `${column}: ${value}` : "";
    })
    .filter(Boolean)
    .join(". ");
}

function createEmptyLoreTableRow(category) {
  return Object.fromEntries(getLoreTableSchema(category).map((column) => [column, ""]));
}

function collectLoreTableRows() {
  if (!loreTableBody) return [];
  return Array.from(loreTableBody.querySelectorAll("tr[data-row-index]"))
    .map((row) => {
      const result = {};
      Array.from(row.querySelectorAll("[data-column]")).forEach((field) => {
        result[field.dataset.column] = field.value;
      });
      return result;
    })
    .filter((row) => Object.values(row).some((value) => String(value || "").trim()));
}

function renderLoreTableRows(category, rows) {
  if (!loreTableHead || !loreTableBody) return;
  const columns = getLoreTableSchema(category);
  loreTableHead.innerHTML = `<tr>${columns
    .map((column) => `<th>${escapeHtml(column)}</th>`)
    .join("")}<th class="lore-table__actions">Действие</th></tr>`;
  loreTableBody.innerHTML = rows
    .map((row, index) => {
      const cells = columns
        .map((column) => {
          const value = String(row[column] || "");
          const multiline = value.length > 90 || column === "Описание" || column === "Заметки" || column === "Способности";
          return `<td>${
            multiline
              ? `<textarea data-column="${escapeHtml(column)}" rows="3" placeholder="${escapeHtml(column)}">${escapeHtml(value)}</textarea>`
              : `<input data-column="${escapeHtml(column)}" type="text" value="${escapeHtml(value)}" placeholder="${escapeHtml(column)}">`
          }</td>`;
        })
        .join("");
      return `<tr data-row-index="${index}">${cells}<td class="lore-table__actions"><button class="ghost-btn ghost-btn--small" data-action="remove-lore-row" data-row-index="${index}" type="button">Убрать</button></td></tr>`;
    })
    .join("");
}

function loreFieldClass(category, label) {
  const normalizedCategory = String(category || "").trim().toLowerCase();
  const normalizedLabel = String(label || "").trim().toLowerCase();

  if (normalizedCategory === "классы") {
    if (normalizedLabel === "название") return "lore-field--name";
    if (normalizedLabel === "доступное оружие") return "lore-field--weapon";
    if (normalizedLabel === "сложность") return "lore-field--difficulty";
    if (normalizedLabel === "описание") return "lore-field--notes";
  }

  if (normalizedCategory === "государства") {
    if (normalizedLabel === "название") return "lore-field--name";
    if (normalizedLabel === "правитель") return "lore-field--ruler";
    if (normalizedLabel === "осн. население") return "lore-field--people";
    if (normalizedLabel === "идеология") return "lore-field--ideology";
  }

  if (normalizedCategory === "поселения") {
    if (normalizedLabel === "название") return "lore-field--name";
    if (normalizedLabel === "принадлежность") return "lore-field--domain";
    if (normalizedLabel === "местоположение") return "lore-field--location";
    if (normalizedLabel === "заметки") return "lore-field--notes";
  }

  return "";
}

function renderStructuredLoreItem(category, item) {
  const normalizedCategory = String(category || "").trim().toLowerCase();
  if (!["государства", "поселения", "классы"].includes(normalizedCategory)) return null;

  const labels =
    normalizedCategory === "государства"
      ? ["Название", "Правитель", "Осн\\. население", "Идеология"]
      : normalizedCategory === "поселения"
        ? ["Название", "Принадлежность", "Местоположение", "Заметки"]
        : ["Название", "Доступное оружие", "Сложность", "Описание"];

  const mapped = parseLabeledLoreRecord(item, labels);
  if (!mapped) return null;

  const title = mapped["Название"] || "Без названия";
  const orderedLabels =
    normalizedCategory === "государства"
      ? ["Правитель", "Осн. население", "Идеология"]
      : normalizedCategory === "поселения"
        ? ["Принадлежность", "Местоположение", "Заметки"]
        : ["Доступное оружие", "Сложность", "Описание"];

  return `<div class="lore-record lore-record--structured">
    <h4 class="lore-record__title">${escapeHtml(title)}</h4>
    <div class="lore-record__facts">
      ${orderedLabels
        .filter((label) => mapped[label])
        .map(
          (label) => `<p class="lore-field ${loreFieldClass(category, label)}${normalizedCategory === "классы" && label === "Сложность" ? ` ${loreClassDifficultyClass(mapped[label])}` : ""}">
            <span class="lore-key">${escapeHtml(label)}</span>
            <span>${escapeHtml(mapped[label])}</span>
          </p>`
        )
        .join("")}
    </div>
  </div>`;
}

function loreClassDifficultyClass(value) {
  const normalized = String(value || "").trim().toLowerCase();
  if (normalized === "легко") return "lore-difficulty--easy";
  if (normalized === "средне") return "lore-difficulty--medium";
  if (normalized === "сложно") return "lore-difficulty--hard";
  return "lore-difficulty--default";
}

function renderLoreItem(item, category) {
  const structured = renderStructuredLoreItem(category, item);
  if (structured) return structured;

  const parsed = parseLoreRecord(item);
  if (!parsed) return `<p>${escapeHtml(item)}</p>`;
  const typeClass = parsed.type ? ` lore-field--type ${loreTypeClass(parsed.type)}` : "";

  const rows = [
    parsed.bonus ? ["Бонусы", parsed.bonus] : null,
    parsed.type ? ["Тип", parsed.type] : null,
    parsed.size ? ["Размер", parsed.size] : null,
    parsed.abilities ? ["Способности", parsed.abilities] : null,
    parsed.note ? ["Пометка", parsed.note] : null
  ].filter(Boolean);

  return `<div class="lore-record">
    <div class="lore-record__head">
      <h4 class="lore-record__title">${escapeHtml(parsed.name)}</h4>
      ${
        String(category || "").trim().toLowerCase() === "народы"
          ? `<button
              class="tiny-btn lore-record__media"
              data-action="preview-lore-race"
              data-name="${escapeHtml(parsed.name)}"
              data-type="${escapeHtml(parsed.type)}"
              type="button"
            >Тварь</button>`
          : ""
      }
    </div>
    ${
      rows.length
        ? `<div class="lore-record__facts">
            ${rows
              .map(
                ([label, value]) => `<p class="lore-field${label === "Тип" ? typeClass : ""}">
                  <span class="lore-key">${escapeHtml(label)}</span>
                  <span>${escapeHtml(value)}</span>
                </p>`
              )
              .join("")}
          </div>`
        : ""
    }
    ${
      parsed.description
        ? `<p class="lore-record__description">
            <span class="lore-key">Описание</span>
            <span>${escapeHtml(parsed.description)}</span>
          </p>`
        : ""
    }
  </div>`;
}

function loreTypeClass(type) {
  const normalized = String(type || "").trim().toLowerCase();
  if (normalized === "гуманоид") return "lore-type--humanoid";
  if (normalized === "фея") return "lore-type--fey";
  if (normalized === "слизь") return "lore-type--ooze";
  if (normalized === "нежить") return "lore-type--undead";
  if (normalized === "монстр") return "lore-type--monster";
  if (normalized === "механизм") return "lore-type--construct";
  return "lore-type--default";
}

function loreTypePalette(type) {
  const normalized = String(type || "").trim().toLowerCase();
  if (normalized === "гуманоид") {
    return { accent: "#d1a45e", accentSoft: "#5c4528", bg1: "#201913", bg2: "#100d0b", sigil: "I" };
  }
  if (normalized === "фея") {
    return { accent: "#86d6b1", accentSoft: "#20443b", bg1: "#11211d", bg2: "#091210", sigil: "✦" };
  }
  if (normalized === "слизь") {
    return { accent: "#73d5c3", accentSoft: "#1d4942", bg1: "#10211e", bg2: "#091210", sigil: "◉" };
  }
  if (normalized === "нежить") {
    return { accent: "#b18cff", accentSoft: "#352353", bg1: "#17111f", bg2: "#0c0912", sigil: "☠" };
  }
  if (normalized === "монстр") {
    return { accent: "#e07f64", accentSoft: "#5c2d23", bg1: "#23130f", bg2: "#120907", sigil: "✧" };
  }
  if (normalized === "механизм") {
    return { accent: "#8fb8d8", accentSoft: "#274257", bg1: "#101920", bg2: "#090d12", sigil: "⚙" };
  }
  return { accent: "#d8bb86", accentSoft: "#5f4b2e", bg1: "#1e1711", bg2: "#100d0b", sigil: "◇" };
}

function buildLoreRaceImage(name, type) {
  const palette = loreTypePalette(type);
  const safeName = String(name || "").trim() || "Неизвестная тварь";
  const safeType = String(type || "").trim() || "Народ";
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1200">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${palette.bg1}"/>
          <stop offset="100%" stop-color="${palette.bg2}"/>
        </linearGradient>
        <radialGradient id="glow" cx="50%" cy="32%" r="54%">
          <stop offset="0%" stop-color="${palette.accent}" stop-opacity="0.34"/>
          <stop offset="100%" stop-color="${palette.accent}" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="1200" height="1200" rx="84" fill="url(#bg)"/>
      <rect x="36" y="36" width="1128" height="1128" rx="64" fill="none" stroke="${palette.accentSoft}" stroke-width="4"/>
      <rect x="68" y="68" width="1064" height="1064" rx="48" fill="none" stroke="${palette.accent}" stroke-opacity="0.28" stroke-width="3"/>
      <circle cx="600" cy="390" r="250" fill="url(#glow)"/>
      <circle cx="600" cy="390" r="188" fill="none" stroke="${palette.accent}" stroke-opacity="0.32" stroke-width="12"/>
      <circle cx="600" cy="390" r="128" fill="none" stroke="${palette.accent}" stroke-opacity="0.56" stroke-width="8"/>
      <text x="600" y="430" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="188" fill="${palette.accent}">${palette.sigil}</text>
      <text x="600" y="760" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="84" font-weight="700" fill="#f6ead9">${escapeHtml(safeName)}</text>
      <rect x="410" y="818" width="380" height="68" rx="34" fill="${palette.accentSoft}" stroke="${palette.accent}" stroke-opacity="0.45"/>
      <text x="600" y="863" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="34" letter-spacing="4" fill="${palette.accent}">${escapeHtml(safeType.toUpperCase())}</text>
    </svg>
  `.trim();
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function slugifyRaceName(name) {
  return String(name || "")
    .trim()
    .toLowerCase()
    .split("")
    .map((char) => translitMap[char] ?? char)
    .join("")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-");
}

function getLoreRaceImage(name, type) {
  const slug = slugifyRaceName(name);
  if (slug && db.raceImages?.[slug]) return db.raceImages[slug];
  return slug ? `assets/races/${slug}.svg` : buildLoreRaceImage(name, type);
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
  if (view === "journal") hideJournalUpdateToast();
  updateFloatingLoreSearch();
}

function showJournalUpdateToast() {
  if (!journalUpdateToast || state.view === "journal") return;
  journalUpdateToast.classList.remove("is-hidden");
}

function hideJournalUpdateToast() {
  journalUpdateToast?.classList.add("is-hidden");
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
    characterRequests: Array.isArray(incoming?.characterRequests) ? incoming.characterRequests : [],
    raceImages: incoming?.raceImages && typeof incoming.raceImages === "object" ? incoming.raceImages : {},
    game:
      incoming?.game && typeof incoming.game === "object"
        ? { isActive: Boolean(incoming.game.isActive) }
        : { isActive: false },
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
            ${renderLoreItem(item, activeEntry.category)}
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
  const useTableEditor = isDm() && desktopDmQuery.matches;
  if (loreQuickForm) loreQuickForm.classList.toggle("is-hidden", !isDm() || useTableEditor);
  if (loreTableForm) loreTableForm.classList.toggle("is-hidden", !useTableEditor);
  if (!isDm()) return;
  populateLoreEditor(state.selectedLoreId);
  populateLoreTableEditor(state.selectedLoreId);
}

function populateLoreTableEditor(id) {
  if (!loreTableForm) return;
  const entry = db.lore.find((item) => item.id === id);
  if (!entry) {
    resetLoreTableForm();
    return;
  }
  loreTableForm.elements.id.value = entry.id;
  loreTableForm.elements.category.value = entry.category;
  loreTableForm.elements.tone.value = loreTone(entry);
  renderLoreTableRows(entry.category, entry.items.map((item) => parseLoreItemForTable(entry.category, item)));
  if (loreTableEditorTitle) loreTableEditorTitle.textContent = `Таблица: ${entry.category}`;
  if (loreTableEditorDelete) loreTableEditorDelete.disabled = false;
}

function renderJournal() {
  journalField.value = db.journal || "";
  const editable = isDm();
  journalField.readOnly = !editable;
  journalField.disabled = false;
  journalField.classList.toggle("is-readonly", !editable);
  if (saveNotesBtn) saveNotesBtn.classList.toggle("is-hidden", !editable);
  if (clearNotesBtn) clearNotesBtn.classList.toggle("is-hidden", !editable);
  journalField.placeholder = editable
    ? "Кто пришёл на совет? Какие улики нашли? Что случилось у костра?"
    : "Только DM может редактировать журнал сессии.";
  if (state.view === "journal") hideJournalUpdateToast();
}

function renderAccountSummary() {
  if (!currentUser) {
    accountSummary.textContent = "Сейчас вы не вошли в систему.";
    return;
  }
  accountSummary.textContent =
    currentUser.role === "dm"
      ? `Вы вошли как DM: ${currentUser.displayName}. Вам доступно управление игроками, персонажами и содержимым книги. Игра сейчас ${isGameActive() ? "запущена" : "не запущена"}.`
      : `Вы вошли как игрок: ${currentUser.displayName}. Вам доступен мир книги и назначенный персонаж. ${isGameActive() ? "Сессия активна: можно менять HP, броню и инвентарь." : "Сессия ещё не запущена DM."}`;
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
  return (
    db.characters.find(
      (character) =>
        character.id === (currentUser?.characterId || "") || character.ownerUserId === currentUser?.id
    ) || db.characters[0] || null
  );
}

function renderCharacterCard(character, options = {}) {
  const { showPreviewSelector = false, compact = false } = options;
  const image = safeMediaUrl(character.image);
  const playerCanAct = canPlayerActInSession(character);
  const inventoryValue = (character.inventory || []).join("\n");
  const owner = db.users.find((entry) => entry.id === character.ownerUserId);
  const ownerMeta = isDm() && owner ? `<div class="sheet-owner">Игрок: ${escapeHtml(owner.displayName)}</div>` : "";
  const preview = showPreviewSelector
    ? `<div class="character-preview-head"><span class="hero__role">Просмотр</span><select id="characterPreviewSelect">${db.characters
        .map(
          (entry) =>
            `<option value="${entry.id}" ${entry.id === character.id ? "selected" : ""}>${escapeHtml(entry.name)}</option>`
        )
        .join("")}</select></div>`
    : ownerMeta;
  const portrait = image
    ? `<button class="sheet-portrait" type="button" data-action="preview-character-portrait" data-id="${character.id}">
        <img src="${escapeHtml(image)}" alt="${escapeHtml(character.name)}">
      </button>`
    : `<div class="sheet-portrait sheet-portrait--empty">
        <span>Портрет персонажа</span>
        <strong>${escapeHtml(character.name)}</strong>
      </div>`;

  return `<div class="character-card-shell${compact ? " character-card-shell--compact" : ""}">
    ${preview}
    <article class="panel character-sheet character-sheet--sheet" data-character-card="${character.id}">
      <div class="sheet-hero">
        ${portrait}
      </div>
      <div class="sheet-header">
        <div class="sheet-field sheet-field--label">Имя:</div>
        <div class="sheet-field sheet-field--value">${escapeHtml(character.name)}</div>
        <div class="sheet-field sheet-field--label">Здоровье:</div>
        <div class="sheet-field sheet-field--value sheet-field--right sheet-field--value-control sheet-field--health">
          ${playerCanAct ? `<button class="sheet-adjust sheet-adjust--minus" type="button" data-action="adjust-character" data-stat="health" data-delta="-1" aria-label="Убавить здоровье">-</button>` : ""}
          <span class="sheet-value-number">${character.health}</span>
          ${playerCanAct ? `<button class="sheet-adjust sheet-adjust--plus" type="button" data-action="adjust-character" data-stat="health" data-delta="1" aria-label="Прибавить здоровье">+</button>` : ""}
        </div>
      </div>
      <div class="sheet-strip">
        <div class="sheet-field sheet-field--label">Броня:</div>
        <div class="sheet-field sheet-field--value sheet-field--right sheet-field--value-control sheet-field--armor">
          ${playerCanAct ? `<button class="sheet-adjust sheet-adjust--minus" type="button" data-action="adjust-character" data-stat="armor" data-delta="-1" aria-label="Убавить броню">-</button>` : ""}
          <span class="sheet-value-number">${character.armor}</span>
          ${playerCanAct ? `<button class="sheet-adjust sheet-adjust--plus" type="button" data-action="adjust-character" data-stat="armor" data-delta="1" aria-label="Прибавить броню">+</button>` : ""}
        </div>
        <div class="sheet-field sheet-field--label">Раса:</div>
        <div class="sheet-field sheet-field--value">${escapeHtml(character.race)}</div>
        <div class="sheet-field sheet-field--label">Класс:</div>
        <div class="sheet-field sheet-field--value">${escapeHtml(character.className)}</div>
      </div>
      <div class="sheet-stats">
        <div class="stat-cell"><span>СИЛА</span><em>(${mod(character.stats.strength) >= 0 ? "+" : ""}${mod(character.stats.strength)})</em><strong>${character.stats.strength}</strong></div>
        <div class="stat-cell"><span>ЛОВКОСТЬ</span><em>(${mod(character.stats.dexterity) >= 0 ? "+" : ""}${mod(character.stats.dexterity)})</em><strong>${character.stats.dexterity}</strong></div>
        <div class="stat-cell"><span>ВЫНОСЛИВОСТЬ</span><em>(${mod(character.stats.constitution) >= 0 ? "+" : ""}${mod(character.stats.constitution)})</em><strong>${character.stats.constitution}</strong></div>
        <div class="stat-cell"><span>МУДРОСТЬ</span><em>(${mod(character.stats.wisdom) >= 0 ? "+" : ""}${mod(character.stats.wisdom)})</em><strong>${character.stats.wisdom}</strong></div>
        <div class="stat-cell"><span>ИНТЕЛЛЕКТ</span><em>(${mod(character.stats.intelligence) >= 0 ? "+" : ""}${mod(character.stats.intelligence)})</em><strong>${character.stats.intelligence}</strong></div>
        <div class="stat-cell"><span>ХАРИЗМА</span><em>(${mod(character.stats.charisma) >= 0 ? "+" : ""}${mod(character.stats.charisma)})</em><strong>${character.stats.charisma}</strong></div>
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
        ${
          playerCanAct && !isDm()
            ? `<label class="sheet-section__editor">
                <textarea id="characterInventoryEditor" class="sheet-section__textarea" rows="7" placeholder="Каждая строка — отдельный предмет">${escapeHtml(inventoryValue)}</textarea>
              </label>
              <div class="journal-actions journal-actions--compact">
                <button class="action-btn" data-action="save-character-inventory" data-id="${character.id}" type="button">Сохранить инвентарь</button>
              </div>`
            : `<div class="sheet-section__body sheet-section__body--dense">${(character.inventory || []).map((item) => `<p>${escapeHtml(item)};</p>`).join("")}</div>`
        }
      </div>
      <div class="sheet-section">
        <div class="sheet-section__title">Описание:</div>
        <div class="sheet-section__body sheet-section__body--long">${escapeHtml(character.description || "")}</div>
      </div>
    </article>
  </div>`;
}

function bindCharacterViewActions(root = characterView) {
  root.querySelectorAll("#characterPreviewSelect").forEach((select) => {
    select.addEventListener("change", (event) => {
      state.selectedCharacterId = event.target.value;
      saveUiState();
      renderCharacterView();
    });
  });

  root.querySelectorAll('[data-action="preview-character-portrait"]').forEach((button) => {
    button.addEventListener("click", () => {
      const character = db.characters.find((entry) => entry.id === button.dataset.id);
      if (!character) return;
      openMediaModal({
        eyebrow: "Портрет персонажа",
        title: character.name,
        image: character.image
      });
    });
  });

  root.querySelectorAll('[data-action="adjust-character"]').forEach((button) => {
    button.addEventListener("click", async () => {
      const characterId = button.closest("[data-character-card]")?.dataset.characterCard;
      const stat = button.dataset.stat;
      const delta = Number(button.dataset.delta || 0);
      if (!characterId || !stat || !Number.isFinite(delta)) return;
      try {
        await updateCharacterRuntime(characterId, {
          healthDelta: stat === "health" ? delta : 0,
          armorDelta: stat === "armor" ? delta : 0
        });
      } catch (error) {
        alert(error.message || "Не удалось обновить значение.");
      }
    });
  });

  root.querySelectorAll('[data-action="save-character-inventory"]').forEach((button) => {
    button.addEventListener("click", async () => {
      const characterId = button.dataset.id;
      const editor = root.querySelector(`#characterInventoryEditor-${characterId}`);
      if (!editor) return;
      try {
        await updateCharacterRuntime(characterId, {
          inventory: splitLines(editor.value)
        });
      } catch (error) {
        alert(error.message || "Не удалось сохранить инвентарь.");
      }
    });
  });
}

function renderCharacterView() {
  const character = resolveActiveCharacter();
  renderCharacterRequestState();
  if (!character && !isDm()) {
    const pendingRequest = getPendingCharacterRequest();
    characterView.innerHTML = pendingRequest
      ? ""
      : `<article class="panel"><p class="admin-empty">У этого игрока пока нет подтверждённого персонажа. Заполни заявку выше, и мастер доведёт героя до полноценной карточки.</p></article>`;
    return;
  }

  if (isDesktopDm()) {
    characterView.innerHTML = `<div class="character-view character-view--grid">${db.characters
      .map((entry) => renderCharacterCard(entry, { compact: true }))
      .join("")}</div>`;
    bindCharacterViewActions(characterView);
    return;
  }

  characterView.innerHTML = `<div class="character-view">
    ${renderCharacterCard(character, { showPreviewSelector: isDm() })}
  </div>`;

  const playerEditor = characterView.querySelector("#characterInventoryEditor");
  if (playerEditor) {
    playerEditor.id = `characterInventoryEditor-${character.id}`;
  }
  bindCharacterViewActions(characterView);
}

async function updateCharacterRuntime(characterId, patch) {
  await api(`/api/characters/${encodeURIComponent(characterId)}`, {
    method: "PATCH",
    body: patch
  });
  await loadBootstrap();
  refreshAll();
}

async function toggleGameState() {
  if (!isDm()) return;
  try {
    await api("/api/game", {
      method: "PUT",
      body: { isActive: !isGameActive() }
    });
    await loadBootstrap();
    refreshAll();
  } catch (error) {
    alert(error.message || "Не удалось переключить состояние игры.");
  }
}

function stopRuntimeSync() {
  if (runtimeSyncTimer) {
    window.clearInterval(runtimeSyncTimer);
    runtimeSyncTimer = null;
  }
}

function shouldSkipRuntimeCharacterRefresh() {
  const active = document.activeElement;
  return Boolean(active && active instanceof HTMLElement && active.matches(".sheet-section__textarea"));
}

function shouldSkipRuntimeJournalRefresh() {
  const active = document.activeElement;
  return Boolean(isDm() && active === journalField);
}

async function syncRuntimeState() {
  if (!currentUser || runtimeSyncBusy) return;
  runtimeSyncBusy = true;
  try {
    const runtime = await api("/api/runtime");
    const nextCharacters = Array.isArray(runtime?.characters) ? runtime.characters : [];
    const nextCharacterRequests = Array.isArray(runtime?.characterRequests) ? runtime.characterRequests : [];
    const nextGame = runtime?.game && typeof runtime.game === "object"
      ? { isActive: Boolean(runtime.game.isActive) }
      : { isActive: false };
    const nextJournal = typeof runtime?.journal === "string" ? runtime.journal : "";

    const charactersChanged = JSON.stringify(db.characters) !== JSON.stringify(nextCharacters);
    const requestsChanged =
      JSON.stringify(db.characterRequests) !== JSON.stringify(nextCharacterRequests);
    const gameChanged = JSON.stringify(db.game) !== JSON.stringify(nextGame);
    const journalChanged = db.journal !== nextJournal;
    if (!charactersChanged && !requestsChanged && !gameChanged && !journalChanged) return;

    db.characters = nextCharacters;
    db.characterRequests = nextCharacterRequests;
    db.game = nextGame;
    db.journal = nextJournal;

    if (gameStateLabel) {
      gameStateLabel.textContent = isGameActive() ? "Сессия активна" : "Сессия не запущена";
    }
    if (gameToggleBtn) {
      gameToggleBtn.textContent = isGameActive() ? "Завершить игру" : "Начать игру";
    }
    renderAccountSummary();

    if (journalChanged && !shouldSkipRuntimeJournalRefresh()) {
      renderJournal();
    } else if (journalChanged) {
      showJournalUpdateToast();
    }

    if (journalChanged && state.view !== "journal") {
      showJournalUpdateToast();
    }

    if ((charactersChanged || requestsChanged || gameChanged) && !shouldSkipRuntimeCharacterRefresh()) {
      renderCharacterView();
    }

    if (requestsChanged && isDm()) {
      renderAdminPanels();
    }
  } catch (error) {
    if (error?.status === 401) {
      stopRuntimeSync();
    }
  } finally {
    runtimeSyncBusy = false;
  }
}

function ensureRuntimeSync() {
  if (!currentUser) {
    stopRuntimeSync();
    return;
  }
  if (runtimeSyncTimer) return;
  runtimeSyncTimer = window.setInterval(() => {
    syncRuntimeState();
  }, 2000);
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

function renderCharacterRequestList() {
  if (!characterRequestList) return;
  const requests = (db.characterRequests || []).filter(
    (request) => String(request.status || "") === "pending"
  );

  if (!requests.length) {
    characterRequestList.innerHTML = `<div class="admin-item"><p class="admin-empty">Пока нет новых заявок на персонажей.</p></div>`;
    return;
  }

  characterRequestList.innerHTML = requests
    .map(
      (request) => `<div class="admin-item admin-item--request">
        <div class="admin-item__top">
          <div>
            <strong>${escapeHtml(request.name)}</strong>
            <div class="admin-item__meta">${escapeHtml(request.displayName || request.username)} · ${escapeHtml(request.className)} · ${escapeHtml(request.race)}</div>
          </div>
          <span class="admin-request-badge">Ожидает</span>
        </div>
        <p class="admin-request__lead"><strong>Игрок:</strong> ${escapeHtml(request.displayName || request.username)}</p>
        <p class="admin-request__lead"><strong>Описание:</strong> ${escapeHtml(request.description || "Игрок пока ничего не написал.")}</p>
        <div class="admin-item__actions">
          <button class="tiny-btn" data-action="edit-request" data-id="${request.id}" type="button">Редактировать</button>
          <button class="tiny-btn tiny-btn--accent" data-action="approve-request" data-id="${request.id}" type="button">Подтвердить</button>
          <button class="tiny-btn tiny-btn--danger" data-action="delete-request" data-id="${request.id}" type="button">Отклонить</button>
        </div>
      </div>`
    )
    .join("");
}

function renderCharacterRequestState() {
  if (!characterRequestState) return;
  if (!currentUser || isDm()) {
    characterRequestState.innerHTML = "";
    return;
  }

  const character = resolveActiveCharacter();
  const pendingRequest = getPendingCharacterRequest();

  if (character) {
    characterRequestState.innerHTML = "";
    return;
  }

  if (pendingRequest) {
    characterRequestState.innerHTML = `<article class="panel request-panel request-panel--pending">
      <p class="eyebrow">Сила уже услышала</p>
      <h3>Ваш персонаж отправлен на согласование великой силе</h3>
      <p class="request-panel__text">DM увидит заявку, дополнит её характеристиками и утвердит героя. После этого карточка появится здесь автоматически.</p>
      <div class="request-summary">
        <span>${escapeHtml(pendingRequest.name)}</span>
        <span>${escapeHtml(pendingRequest.race)}</span>
        <span>${escapeHtml(pendingRequest.className)}</span>
      </div>
    </article>`;
    return;
  }

  const raceOptions = getAvailableRaceOptions();
  const classOptions = getAvailableClassOptions();

  characterRequestState.innerHTML = `<article class="panel request-panel">
    <p class="eyebrow">Новый герой</p>
    <h3>Создание заявки на персонажа</h3>
    <p class="request-panel__text">Заполни основу героя, а мастер затем доведёт карточку до боевого состояния.</p>
    <form id="characterRequestForm" class="admin-form request-form">
      <div class="field-grid">
        <label class="auth-field">
          <span>Имя персонажа</span>
          <input type="text" name="name" placeholder="Например, Астэр">
        </label>
        <label class="auth-field">
          <span>Раса</span>
          <select name="race">
            <option value="">Выбери народ</option>
            ${raceOptions.map((race) => `<option value="${escapeHtml(race)}">${escapeHtml(race)}</option>`).join("")}
          </select>
        </label>
        <label class="auth-field">
          <span>Класс</span>
          <select name="className">
            <option value="">Выбери класс</option>
            ${classOptions.map((className) => `<option value="${escapeHtml(className)}">${escapeHtml(className)}</option>`).join("")}
          </select>
        </label>
        <label class="auth-field field-grid__wide">
          <span>Описание</span>
          <textarea name="description" rows="5" placeholder="Кто это, как он выглядит и чем запомнится в книге?"></textarea>
        </label>
      </div>
      <div class="journal-actions">
        <button class="action-btn" type="submit">Отправить мастеру</button>
      </div>
    </form>
  </article>`;

  characterRequestState
    .querySelector("#characterRequestForm")
    ?.addEventListener("submit", handleCharacterRequestSubmit);
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
  renderCharacterRequestList();
  fillAdminForms();
}

function resetUserForm() {
  userForm.reset();
  userForm.elements.id.value = "";
}

function resetCharacterForm() {
  characterForm.reset();
  characterForm.elements.id.value = "";
  characterForm.elements.requestId.value = "";
  if (characterFormSubmitBtn) characterFormSubmitBtn.textContent = "Сохранить персонажа";
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

function resetLoreTableForm() {
  if (!loreTableForm) return;
  loreTableForm.reset();
  loreTableForm.elements.id.value = "";
  loreTableForm.elements.tone.value = "lore-tone--ember";
  renderLoreTableRows("История", [createEmptyLoreTableRow("История")]);
  if (loreTableEditorTitle) loreTableEditorTitle.textContent = "Таблица раздела";
  if (loreTableEditorDelete) loreTableEditorDelete.disabled = true;
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
  characterForm.elements.requestId.value = "";
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
  if (characterFormSubmitBtn) characterFormSubmitBtn.textContent = "Сохранить персонажа";
}

function populateCharacterRequestApproval(requestEntry) {
  resetCharacterForm();
  characterForm.elements.requestId.value = requestEntry.id;
  characterForm.elements.name.value = requestEntry.name || "";
  characterForm.elements.race.value = requestEntry.race || "";
  characterForm.elements.className.value = requestEntry.className || "";
  characterForm.elements.ownerUserId.value = requestEntry.userId || "";
  characterForm.elements.description.value = requestEntry.description || "";
  characterForm.elements.health.value = 0;
  characterForm.elements.armor.value = 0;
  if (characterFormSubmitBtn) characterFormSubmitBtn.textContent = "Подтвердить персонажа";
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

function openMediaModal(payload) {
  if (!mediaModal || !mediaModalFrame || !mediaModalTitle || !mediaModalEyebrow) return;
  activeRacePreview = payload?.kind === "lore-race" ? { ...payload } : null;
  const { eyebrow, title, image } = payload || {};
  const source = safeMediaUrl(image);
  mediaModalEyebrow.textContent = eyebrow || "";
  mediaModalTitle.textContent = title || "";
  mediaModalFrame.innerHTML = source
    ? `<img class="media-modal__image" src="${escapeHtml(source)}" alt="${escapeHtml(title || "Изображение")}">`
    : `<div class="media-modal__empty">
        <span>Изображение не задано</span>
        <strong>${escapeHtml(title || "Образ недоступен")}</strong>
        <p>DM может загрузить сюда собственную картинку.</p>
      </div>`;
  mediaModal.classList.remove("is-hidden");
  mediaModal.setAttribute("aria-hidden", "false");
  updateRaceImageManager();
}

function closeMediaModal() {
  if (!mediaModal || !mediaModalFrame) return;
  activeRacePreview = null;
  mediaModal.classList.add("is-hidden");
  mediaModal.setAttribute("aria-hidden", "true");
  mediaModalFrame.innerHTML = "";
  updateRaceImageManager();
}

function updateFloatingLoreSearch() {
  if (!loreSearch || !lorePanel) return;
  const loreScreenActive = state.view === "lore";
  if (!loreScreenActive) {
    loreSearch.classList.remove("lore-search--floating");
    loreSearch.style.removeProperty("--lore-search-left");
    loreSearch.style.removeProperty("--lore-search-width");
    return;
  }

  const panelRect = lorePanel.getBoundingClientRect();
  const searchRect = loreSearch.getBoundingClientRect();
  const topOffset = 10;
  const shouldFloat =
    loreSearchAnchorTop > 0 &&
    window.scrollY > loreSearchAnchorTop - topOffset &&
    panelRect.bottom - searchRect.height > topOffset + 12;

  loreSearch.classList.toggle("lore-search--floating", shouldFloat);
  if (shouldFloat) {
    loreSearch.style.setProperty("--lore-search-left", `${panelRect.left + 16}px`);
    loreSearch.style.setProperty("--lore-search-width", `${Math.max(0, panelRect.width - 32)}px`);
  } else {
    loreSearch.style.removeProperty("--lore-search-left");
    loreSearch.style.removeProperty("--lore-search-width");
  }
}

function refreshLoreSearchAnchor() {
  if (!loreSearch) return;
  loreSearch.classList.remove("lore-search--floating");
  loreSearch.style.removeProperty("--lore-search-left");
  loreSearch.style.removeProperty("--lore-search-width");
  loreSearchAnchorTop = loreSearch.getBoundingClientRect().top + window.scrollY;
  updateFloatingLoreSearch();
}

function updateRaceImageManager() {
  if (!raceImageManager || !raceImageHint) return;
  const visible = isDm() && activeRacePreview?.kind === "lore-race";
  raceImageManager.classList.toggle("is-hidden", !visible);
  if (!visible) return;
  const customExists = Boolean(db.raceImages?.[activeRacePreview.slug]);
  raceImageHint.textContent = customExists
    ? "Для этой расы уже загружена своя картинка. Можно заменить её новым файлом."
    : "Можно загрузить своё изображение для выбранной расы.";
  if (raceImageResetBtn) raceImageResetBtn.disabled = !customExists;
  if (raceImageInput) raceImageInput.value = "";
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Не удалось прочитать файл."));
    reader.readAsDataURL(file);
  });
}

async function uploadRaceImage() {
  if (!isDm() || !activeRacePreview || activeRacePreview.kind !== "lore-race" || !raceImageInput?.files?.[0]) {
    return;
  }
  const file = raceImageInput.files[0];
  const dataUrl = await readFileAsDataUrl(file);
  try {
    await api("/api/race-images", {
      method: "POST",
      body: {
        name: activeRacePreview.name,
        dataUrl
      }
    });
  } catch (error) {
    if (error?.status === 404) {
      throw new Error("Сервер книги не перезапущен. Перезапусти backend, чтобы загрузка картинок рас заработала.");
    }
    throw error;
  }
  await loadBootstrap();
  activeRacePreview.image = getLoreRaceImage(activeRacePreview.name, activeRacePreview.type);
  openMediaModal(activeRacePreview);
}

async function resetRaceImage() {
  if (!isDm() || !activeRacePreview || activeRacePreview.kind !== "lore-race") return;
  try {
    await api(`/api/race-images/${encodeURIComponent(activeRacePreview.slug)}`, { method: "DELETE" });
  } catch (error) {
    if (error?.status === 404) {
      throw new Error("Сервер книги не перезапущен. Перезапусти backend, чтобы сброс картинки расы заработал.");
    }
    throw error;
  }
  await loadBootstrap();
  activeRacePreview.image = getLoreRaceImage(activeRacePreview.name, activeRacePreview.type);
  openMediaModal(activeRacePreview);
}

function startBestiaryCreate() {
  resetBestiaryForm();
  bestiaryForm?.elements.name.focus();
}

function startLoreCreate() {
  resetLoreForm();
  resetLoreTableForm();
  loreQuickForm?.elements.category.focus();
}

function refreshAll() {
  const loggedIn = Boolean(currentUser);
  syncDesktopDmMode();

  authScreen?.classList.toggle("is-hidden", loggedIn);
  appShell?.classList.toggle("is-hidden", !loggedIn);
  heroUserbar?.classList.toggle("is-hidden", !loggedIn);

  if (!loggedIn) {
    stopRuntimeSync();
    if (characterRequestState) characterRequestState.innerHTML = "";
    if (roleBadge) roleBadge.textContent = "";
    if (currentUserLabel) currentUserLabel.textContent = "";
    if (gameStateLabel) gameStateLabel.textContent = "";
    if (accountSummary) accountSummary.textContent = "Сейчас вы не вошли в систему.";
    navItems.forEach((button) => {
      if (button.dataset.target === "dm") {
        button.classList.add("is-hidden");
        if (button.classList.contains("is-active")) setView("bestiary");
      }
    });
    return;
  }

  ensureRuntimeSync();

  if (roleBadge) roleBadge.textContent = currentUser.role === "dm" ? "DM" : "Игрок";
  if (currentUserLabel) {
    currentUserLabel.textContent =
      currentUser.role === "dm"
        ? `Вход как DM: ${currentUser.displayName}`
        : `Вход как игрок: ${currentUser.displayName}`;
  }
  if (gameStateLabel) {
    gameStateLabel.textContent = isGameActive() ? "Сессия активна" : "Сессия не запущена";
  }
  if (gameToggleBtn) {
    gameToggleBtn.textContent = isGameActive() ? "Завершить игру" : "Начать игру";
    gameToggleBtn.classList.toggle("is-hidden", !isDm());
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
  refreshLoreSearchAnchor();
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
  stopRuntimeSync();
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

async function handleCharacterRequestSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const data = new FormData(form);
  const payload = {
    name: String(data.get("name") || "").trim(),
    race: String(data.get("race") || "").trim(),
    className: String(data.get("className") || "").trim(),
    description: String(data.get("description") || "").trim()
  };
  if (!payload.name || !payload.race || !payload.className) return;
  try {
    await api("/api/character-requests", { method: "POST", body: payload });
    await loadBootstrap();
    refreshAll();
  } catch (error) {
    alert(error.message || "Не удалось отправить заявку мастеру.");
  }
}

async function handleCharacterFormSubmit(event) {
  event.preventDefault();
  const data = new FormData(characterForm);
  const requestId = String(data.get("requestId") || "").trim();
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
    if (requestId) {
      await api(`/api/character-requests/${encodeURIComponent(requestId)}/approve`, {
        method: "POST",
        body: payload
      });
    } else {
      await api("/api/characters", { method: "POST", body: payload });
    }
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

async function handleLoreTableSubmit(event) {
  event.preventDefault();
  const category = String(loreTableForm.elements.category.value || "").trim();
  const rows = collectLoreTableRows();
  const payload = {
    id: String(loreTableForm.elements.id.value || "").trim(),
    category,
    tone: String(loreTableForm.elements.tone.value || "").trim() || "lore-tone--ember",
    items: rows.map((row) => buildLoreItemFromTable(category, row)).filter(Boolean)
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
  if (!currentUser || !isDm()) return;
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
  if (!isDm()) return;
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

async function removeCharacterRequest(requestId) {
  try {
    await api(`/api/character-requests/${encodeURIComponent(requestId)}`, { method: "DELETE" });
    if (characterForm?.elements.requestId.value === requestId) resetCharacterForm();
    await loadBootstrap();
    refreshAll();
  } catch (error) {
    alert(error.message || "Не удалось отклонить заявку.");
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

  if (action === "edit-request" || action === "approve-request") {
    const requestEntry = (db.characterRequests || []).find((entry) => entry.id === button.dataset.id);
    if (requestEntry) {
      populateCharacterRequestApproval(requestEntry);
      focusAdminForm(characterForm);
    }
  }

  if (action === "delete-request") removeCharacterRequest(button.dataset.id);

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

  if (action === "preview-lore-race") {
    const slug = slugifyRaceName(button.dataset.name);
    openMediaModal({
      kind: "lore-race",
      eyebrow: button.dataset.type || "Народ",
      title: button.dataset.name || "Тварь",
      name: button.dataset.name || "Тварь",
      type: button.dataset.type || "Народ",
      slug,
      image: getLoreRaceImage(button.dataset.name, button.dataset.type)
    });
  }

  if (action === "remove-lore-row") {
    const row = button.closest("tr");
    if (row) row.remove();
    if (!loreTableBody?.children.length) {
      const category = String(loreTableForm?.elements.category.value || "История").trim() || "История";
      renderLoreTableRows(category, [createEmptyLoreTableRow(category)]);
    }
  }
}

function bindEvents() {
  authForm.addEventListener("submit", handleAuthSubmit);
  logoutBtn.addEventListener("click", logout);
  settingsLogoutBtn.addEventListener("click", logout);
  gameToggleBtn?.addEventListener("click", toggleGameState);
  journalUpdateToast?.addEventListener("click", () => setView("journal"));

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
    refreshLoreSearchAnchor();
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
  loreTableForm?.addEventListener("submit", handleLoreTableSubmit);
  mapForm.addEventListener("submit", handleMapFormSubmit);

  userFormReset.addEventListener("click", resetUserForm);
  characterFormReset.addEventListener("click", resetCharacterForm);
  bestiaryFormReset?.addEventListener("click", resetBestiaryForm);
  loreQuickReset?.addEventListener("click", () => populateLoreEditor(state.selectedLoreId));
  loreTableReset?.addEventListener("click", () => populateLoreTableEditor(state.selectedLoreId));

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
  loreTableEditorNew?.addEventListener("click", startLoreCreate);
  loreTableEditorDelete?.addEventListener("click", () => {
    const idRaw = loreTableForm?.elements.id.value || "";
    if (idRaw) removeLore(idRaw);
  });
  loreTableAddRow?.addEventListener("click", () => {
    const category = String(loreTableForm?.elements.category.value || "История").trim() || "История";
    const rows = collectLoreTableRows();
    rows.push(createEmptyLoreTableRow(category));
    renderLoreTableRows(category, rows);
  });
  loreTableForm?.elements.category?.addEventListener("change", () => {
    const category = String(loreTableForm.elements.category.value || "История").trim() || "История";
    const previousRows = collectLoreTableRows();
    const nextRows = previousRows.length ? previousRows.map(() => createEmptyLoreTableRow(category)) : [createEmptyLoreTableRow(category)];
    renderLoreTableRows(category, nextRows);
  });

  userList.addEventListener("click", handleAdminAction);
  characterList.addEventListener("click", handleAdminAction);
  characterRequestList?.addEventListener("click", handleAdminAction);
  bestiaryGrid.addEventListener("click", handleAdminAction);
  loreContent?.addEventListener("click", handleAdminAction);
  loreTabs?.addEventListener("click", handleAdminAction);
  desktopDmQuery.addEventListener("change", refreshAll);
  window.addEventListener("scroll", updateFloatingLoreSearch, { passive: true });
  window.addEventListener("resize", refreshLoreSearchAnchor);
  mediaModalClose?.addEventListener("click", closeMediaModal);
  raceImageSaveBtn?.addEventListener("click", async () => {
    try {
      await uploadRaceImage();
    } catch (error) {
      alert(error.message || "Не удалось сохранить изображение расы.");
    }
  });
  raceImageResetBtn?.addEventListener("click", async () => {
    try {
      await resetRaceImage();
    } catch (error) {
      alert(error.message || "Не удалось сбросить изображение расы.");
    }
  });
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
