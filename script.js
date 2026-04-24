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
const loadingScreen = document.getElementById("loadingScreen");
const loadingText = document.getElementById("loadingText");
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
const bestiaryPlayerHint = document.getElementById("bestiaryPlayerHint");
const searchInput = document.getElementById("creatureSearch");
const filterButtons = Array.from(document.querySelectorAll("[data-filter]"));
const themeList = document.getElementById("themeList");
const loreTabs = document.getElementById("loreTabs");
const loreContent = document.getElementById("loreContent");
const loreDmEditor = document.getElementById("loreDmEditor");
const loreSearch = document.getElementById("loreSearch");
const lorePeopleHint = document.getElementById("lorePeopleHint");
const journalField = document.getElementById("sessionNotes");
const saveNotesBtn = document.getElementById("saveNotes");
const clearNotesBtn = document.getElementById("clearNotes");
const journalUpdateToast = document.getElementById("journalUpdateToast");
const characterRequestState = document.getElementById("characterRequestState");
const characterView = document.getElementById("characterView");
const dmScreen = document.querySelector('[data-view="dm"]');
const dmPanelButtons = Array.from(document.querySelectorAll("[data-action='select-dm-panel']"));
const dmPanels = Array.from(document.querySelectorAll(".dm-panel"));
const dmUsersCount = document.getElementById("dmUsersCount");
const dmCharactersCount = document.getElementById("dmCharactersCount");
const dmRequestsCount = document.getElementById("dmRequestsCount");
const dmLoreCount = document.getElementById("dmLoreCount");
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
let lastModalTrigger = null;
let runtimeSyncTimer = null;
let runtimeSyncBusy = false;
let characterRuntimeRequestSeq = 0;
const latestCharacterRuntimeRequest = new Map();
const pendingCharacterRuntimeSnapshots = new Map();
let loadingStartedAt = 0;

let state = {
  view: "bestiary",
  filter: "all",
  selectedCharacterId: loadUiState().selectedCharacterId || "",
  selectedDmPanel: loadUiState().selectedDmPanel || "users",
  selectedLoreId: "",
  selectedLoreRecordIndex: 0,
  loreEditorDraftId: "",
  loreEditorDraft: null,
  loreQuery: ""
};

const desktopDmQuery = window.matchMedia("(min-width: 900px)");

function loadUiState() {
  const raw = localStorage.getItem(UI_STORAGE_KEY);
  if (!raw) return { selectedCharacterId: "", selectedDmPanel: "users" };
  try {
    const parsed = JSON.parse(raw);
    return {
      selectedCharacterId:
        typeof parsed.selectedCharacterId === "string" ? parsed.selectedCharacterId : "",
      selectedDmPanel:
        typeof parsed.selectedDmPanel === "string" ? parsed.selectedDmPanel : "users"
    };
  } catch {
    return { selectedCharacterId: "", selectedDmPanel: "users" };
  }
}

function saveUiState() {
  localStorage.setItem(
    UI_STORAGE_KEY,
    JSON.stringify({
      selectedCharacterId: state.selectedCharacterId,
      selectedDmPanel: state.selectedDmPanel
    })
  );
}

function isDm() {
  return currentUser?.role === "dm";
}

function isPlayer() {
  return currentUser?.role === "player";
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
  document.documentElement.dataset.activeView = view;
  document.body.dataset.activeView = view;
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

function setLoadingState(loading, message = "") {
  if (!loadingScreen) return;
  if (loading) {
    loadingStartedAt = Date.now();
    document.body.classList.add("boot-loading");
  }
  loadingScreen.classList.toggle("is-hidden", !loading);
  if (loadingText && message) {
    loadingText.textContent = message;
  }
  if (!loading) {
    document.body.classList.remove("boot-loading");
  }
}

function wait(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

async function finishLoadingState(minDuration = 700) {
  const elapsed = Date.now() - loadingStartedAt;
  if (elapsed < minDuration) {
    await wait(minDuration - elapsed);
  }
  setLoadingState(false);
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
    const fallbackMessage =
      response.status === 413
        ? "Файл слишком большой. Уменьши изображение карты или загрузи более лёгкую версию."
        : response.status >= 500
          ? "Сервер не смог обработать запрос."
          : `Ошибка запроса (${response.status}).`;
    const error = new Error(payload?.error || fallbackMessage);
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

function applyCharacterRuntimePatchLocally(characterId, patch = {}) {
  const characterIndex = db.characters.findIndex((entry) => entry.id === characterId);
  if (characterIndex < 0) return null;
  const currentCharacter = db.characters[characterIndex];
  const healthDelta = Number(patch.healthDelta || 0);
  const armorDelta = Number(patch.armorDelta || 0);
  const hasInventory = Object.prototype.hasOwnProperty.call(patch, "inventory");
  const nextCharacter = {
    ...currentCharacter,
    health: Number.isFinite(healthDelta)
      ? Math.max(0, currentCharacter.health + Math.trunc(healthDelta))
      : currentCharacter.health,
    armor: Number.isFinite(armorDelta)
      ? Math.max(0, currentCharacter.armor + Math.trunc(armorDelta))
      : currentCharacter.armor,
    inventory: hasInventory && Array.isArray(patch.inventory) ? [...patch.inventory] : currentCharacter.inventory
  };
  db.characters[characterIndex] = nextCharacter;
  pendingCharacterRuntimeSnapshots.set(characterId, { ...nextCharacter, inventory: [...(nextCharacter.inventory || [])] });
  return currentCharacter;
}

function mergeRuntimeCharactersWithPending(nextCharacters = []) {
  return nextCharacters.map((character) => {
    const pendingSnapshot = pendingCharacterRuntimeSnapshots.get(character.id);
    return pendingSnapshot ? { ...pendingSnapshot, inventory: [...(pendingSnapshot.inventory || [])] } : character;
  });
}

async function updateCharacterRuntime(characterId, patch) {
  const requestSeq = ++characterRuntimeRequestSeq;
  latestCharacterRuntimeRequest.set(characterId, requestSeq);
  const previousCharacter = applyCharacterRuntimePatchLocally(characterId, patch);
  refreshAll();
  try {
    const payload = await api(`/api/characters/${encodeURIComponent(characterId)}`, {
      method: "PATCH",
      body: patch
    });
    if (latestCharacterRuntimeRequest.get(characterId) !== requestSeq) return;
    pendingCharacterRuntimeSnapshots.delete(characterId);
    if (payload?.user) {
      applyBootstrap(payload);
    } else if (previousCharacter) {
      await loadBootstrap();
    }
    refreshAll();
  } catch (error) {
    if (latestCharacterRuntimeRequest.get(characterId) === requestSeq && previousCharacter) {
      pendingCharacterRuntimeSnapshots.delete(characterId);
      const characterIndex = db.characters.findIndex((entry) => entry.id === characterId);
      if (characterIndex >= 0) {
        db.characters[characterIndex] = previousCharacter;
      }
      refreshAll();
      try {
        await loadBootstrap();
        refreshAll();
      } catch {}
    }
    throw error;
  }
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
    const nextCharacters = mergeRuntimeCharactersWithPending(
      Array.isArray(runtime?.characters) ? runtime.characters : []
    );
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

function openMediaModal(payload) {
  if (!mediaModal || !mediaModalFrame || !mediaModalTitle || !mediaModalEyebrow) return;
  lastModalTrigger =
    document.activeElement instanceof HTMLElement ? document.activeElement : null;
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
  mediaModalClose?.focus();
}

function focusOutsideHiddenModal() {
  const focusTarget =
    lastModalTrigger && document.contains(lastModalTrigger)
      ? lastModalTrigger
      : appShell || document.body;
  if (!(focusTarget instanceof HTMLElement)) return;
  const hadTabIndex = focusTarget.hasAttribute("tabindex");
  const previousTabIndex = focusTarget.getAttribute("tabindex");
  if (!hadTabIndex) {
    focusTarget.setAttribute("tabindex", "-1");
  }
  focusTarget.focus({ preventScroll: true });
  if (!hadTabIndex) {
    focusTarget.removeAttribute("tabindex");
  } else if (previousTabIndex !== null) {
    focusTarget.setAttribute("tabindex", previousTabIndex);
  }
}

function closeMediaModal() {
  if (!mediaModal || !mediaModalFrame) return;
  if (document.activeElement instanceof HTMLElement && mediaModal.contains(document.activeElement)) {
    focusOutsideHiddenModal();
  }
  activeRacePreview = null;
  mediaModal.classList.add("is-hidden");
  mediaModal.setAttribute("aria-hidden", "true");
  mediaModalFrame.innerHTML = "";
  updateRaceImageManager();
  focusOutsideHiddenModal();
  lastModalTrigger = null;
}

function updateFloatingLoreSearch() {
  if (!loreSearch || !lorePanel) return;
  const searchContainer = loreSearch.closest(".lore-search");
  if (!searchContainer) return;
  const loreScreenActive = state.view === "lore";
  if (!loreScreenActive) {
    searchContainer.classList.remove("lore-search--floating");
    searchContainer.style.removeProperty("--lore-search-left");
    searchContainer.style.removeProperty("--lore-search-width");
    return;
  }

  const panelRect = lorePanel.getBoundingClientRect();
  const searchRect = searchContainer.getBoundingClientRect();
  const topOffset = 10;
  const shouldFloat =
    loreSearchAnchorTop > 0 &&
    window.scrollY > loreSearchAnchorTop - topOffset &&
    panelRect.bottom - searchRect.height > topOffset + 12;

  searchContainer.classList.toggle("lore-search--floating", shouldFloat);
  if (shouldFloat) {
    searchContainer.style.setProperty("--lore-search-left", `${panelRect.left + 16}px`);
    searchContainer.style.setProperty("--lore-search-width", `${Math.max(0, panelRect.width - 32)}px`);
  } else {
    searchContainer.style.removeProperty("--lore-search-left");
    searchContainer.style.removeProperty("--lore-search-width");
  }
}

function refreshLoreSearchAnchor() {
  if (!loreSearch) return;
  const searchContainer = loreSearch.closest(".lore-search");
  if (!searchContainer) return;
  searchContainer.classList.remove("lore-search--floating");
  searchContainer.style.removeProperty("--lore-search-left");
  searchContainer.style.removeProperty("--lore-search-width");
  loreSearchAnchorTop = searchContainer.getBoundingClientRect().top + window.scrollY;
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

  function estimateDataUrlBytes(dataUrl) {
    const source = String(dataUrl || "");
    const base64Index = source.indexOf(",");
    if (base64Index < 0) return 0;
    const base64 = source.slice(base64Index + 1);
    return Math.ceil((base64.length * 3) / 4);
  }

  function loadImageElement(source) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error("Не удалось подготовить изображение карты."));
      image.src = source;
    });
  }

  async function optimizeMapFile(file) {
    const originalDataUrl = await readFileAsDataUrl(file);
    const mime = String(file?.type || "").toLowerCase();
    if (!mime || mime === "image/svg+xml" || !/^image\/(png|jpeg|jpg|webp)$/i.test(mime)) {
      return originalDataUrl;
    }

    const targetBytes = 9 * 1024 * 1024;
    if (file.size <= targetBytes) {
      return originalDataUrl;
    }

    const image = await loadImageElement(originalDataUrl);
    let width = image.naturalWidth || image.width || 0;
    let height = image.naturalHeight || image.height || 0;
    if (!width || !height) {
      return originalDataUrl;
    }

    const maxDimension = 2800;
    const largestSide = Math.max(width, height);
    if (largestSide > maxDimension) {
      const scale = maxDimension / largestSide;
      width = Math.max(1, Math.round(width * scale));
      height = Math.max(1, Math.round(height * scale));
    }

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) {
      return originalDataUrl;
    }

    context.drawImage(image, 0, 0, width, height);

    const qualities = [0.9, 0.82, 0.74, 0.66, 0.58, 0.5];
    let bestCandidate = originalDataUrl;
    for (const quality of qualities) {
      const candidate = canvas.toDataURL("image/jpeg", quality);
      bestCandidate = candidate;
      if (estimateDataUrlBytes(candidate) <= targetBytes) {
        return candidate;
      }
    }

    return bestCandidate;
  }

  async function resolveFormFileValue(form, fileFieldName, currentFieldName) {
    if (!form) return "";
    const currentValue = safeMediaUrl(form.elements[currentFieldName]?.value || "");
    const selectedFile = form.elements[fileFieldName]?.files?.[0];
    if (!selectedFile) return currentValue;
    return readFileAsDataUrl(selectedFile);
  }

  async function resolveMapFileValue(form, fileFieldName, currentFieldName) {
    if (!form) return "";
    const currentValue = safeMediaUrl(form.elements[currentFieldName]?.value || "");
    const selectedFile = form.elements[fileFieldName]?.files?.[0];
    if (!selectedFile) return currentValue;
    return optimizeMapFile(selectedFile);
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
    const shouldHide = button.dataset.target === "dm" && !isDm();
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

  setView(isDm() ? state.view : state.view === "dm" ? "bestiary" : state.view);
}

async function handleAuthSubmit(event) {
  event.preventDefault();
  authError.textContent = "";
  const data = new FormData(authForm);
  setLoadingState(true, "Череп хранителя ищет твой след среди страниц...");
  try {
    await api("/api/login", {
      method: "POST",
      body: {
        username: String(data.get("username") || "").trim(),
        password: String(data.get("password") || "").trim(),
        remember: data.get("remember") === "on"
      }
    });
    authForm.reset();
    if (authForm.elements.remember) authForm.elements.remember.checked = true;
    await loadBootstrap();
    refreshAll();
  } catch (error) {
    authError.textContent = error.message || "Не удалось войти.";
  } finally {
    await finishLoadingState(800);
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
    const image = await resolveFormFileValue(characterForm, "imageFile", "currentImage");
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
      image,
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
    const image = await resolveFormFileValue(bestiaryForm, "imageFile", "currentImage");
    const payload = {
    id: String(data.get("id") || "").trim(),
    name: String(data.get("name") || "").trim(),
    type: String(data.get("type") || "wild").trim(),
      tag: String(data.get("tag") || "").trim(),
      dangerLevel: normalizeDangerLevel(data.get("dangerLevel")),
      description: String(data.get("description") || "").trim(),
      image
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
    const src = await resolveMapFileValue(mapForm, "mapFile", "currentSrc");
    try {
      await api("/api/map", {
        method: "PUT",
        body: {
          src,
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
  const panel = formElement?.closest?.("[data-dm-panel]")?.dataset?.dmPanel || "";
  if (panel && typeof selectDmPanel === "function") {
    selectDmPanel(panel);
  }
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
    state.selectedLoreRecordIndex = 0;
    state.loreEditorDraftId = "";
    state.loreEditorDraft = null;
    renderLore();
    renderLoreComposer();
    return;
  }

  if (action === "select-dm-panel") {
    selectDmPanel(button.dataset.panel || "users");
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
  loreTableBody?.addEventListener("paste", handleLoreTableCellPaste);
  loreTableForm?.elements.category?.addEventListener("change", () => {
    const category = String(loreTableForm.elements.category.value || "История").trim() || "История";
    const previousRows = collectLoreTableRows();
    const nextRows = previousRows.length ? previousRows.map(() => createEmptyLoreTableRow(category)) : [createEmptyLoreTableRow(category)];
    renderLoreTableRows(category, nextRows);
  });

  userList.addEventListener("click", handleAdminAction);
  characterList.addEventListener("click", handleAdminAction);
  characterRequestList?.addEventListener("click", handleAdminAction);
  dmScreen?.addEventListener("click", handleAdminAction);
  bestiaryGrid.addEventListener("click", handleAdminAction);
  loreContent?.addEventListener("click", handleAdminAction);
  loreTabs?.addEventListener("click", handleAdminAction);
  loreDmEditor?.addEventListener("click", handleLoreEditorAction);
  loreDmEditor?.addEventListener("input", handleLoreEditorInput);
  loreDmEditor?.addEventListener("change", handleLoreEditorInput);
  loreDmEditor?.addEventListener("submit", handleLoreEditorSubmit);
  loreTableBody?.addEventListener("paste", handleLoreTableCellPaste);
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
  setLoadingState(true, "Вызываем чернильных духов и собираем страницы воедино...");

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
  } finally {
    await finishLoadingState(900);
  }
}

init();
