const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");

const HOST = process.env.HOST || "0.0.0.0";
const PORT = Number(process.env.PORT || 8000);
const ROOT = __dirname;
const RACES_DIR = path.join(ROOT, "assets", "races");
const DEFAULT_DATA_DIR = path.join(ROOT, "data");
const DEFAULT_MEDIA_DIR = path.join(RACES_DIR, "uploads");
const DATA_DIR = path.resolve(process.env.DATA_DIR || DEFAULT_DATA_DIR);
const DB_PATH = path.join(DATA_DIR, "db.json");
const DB_SEED_PATH = path.join(DEFAULT_DATA_DIR, "db.json");
const MEDIA_DIR = path.resolve(process.env.MEDIA_DIR || DEFAULT_MEDIA_DIR);
const MEDIA_PUBLIC_PREFIX = String(process.env.MEDIA_PUBLIC_PREFIX || (process.env.MEDIA_DIR ? "media/races/uploads" : "assets/races/uploads"))
  .replace(/^\/+|\/+$/g, "");
const RACE_UPLOAD_DIR = process.env.MEDIA_DIR ? path.join(MEDIA_DIR, "races", "uploads") : MEDIA_DIR;
const SESSION_COOKIE = "ferelden_sid";
const DANGER_LEVEL_LABELS = {
  safe: "Угроза: безопасный",
  low: "Угроза: низкий",
  medium: "Угроза: средний",
  high: "Угроза: высокий",
  critical: "Угроза: критический",
  legendary: "Угроза: легендарный",
  existential: "Угроза: экзистенциальный"
};

const sessions = new Map();

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".json": "application/json; charset=utf-8",
  ".ico": "image/x-icon"
};

const defaultDb = {
  users: [
    {
      id: "dm-1",
      username: "valera",
      displayName: "Валера",
      role: "dm",
      characterId: "",
      passwordHash: hashPassword("valera123")
    },
    {
      id: "player-ivan",
      username: "ivan",
      displayName: "Иван",
      role: "player",
      characterId: "char-olygia",
      passwordHash: hashPassword("ivan123")
    },
    {
      id: "player-anna",
      username: "anna",
      displayName: "Анна",
      role: "player",
      characterId: "",
      passwordHash: hashPassword("anna123")
    }
  ],
  characters: [
    {
      id: "char-olygia",
      name: 'Ольгия "Шальной-хвост"',
      race: "Гитьянка",
      className: "Варвар",
      health: 29,
      armor: 16,
      stats: {
        strength: 16,
        dexterity: 12,
        constitution: 14,
        wisdom: 12,
        intelligence: 8,
        charisma: 10
      },
      weapon: 'Двуручный топор "Зелёный Реванш" 1d12 + 3',
      image: "",
      skills: [
        "Телепатия гитьянки (может прочитать мысли существа) 1 раз на уровень",
        "Высокий прыжок (может далеко и высоко прыгать, преимущество бросок на ловкость и выносливость) пассивно",
        "Безносая ярость (не воспринимает урон 2 хода) 2 раза на уровень",
        "Жажда битвы (может отвлечь на себя внимание врагов в бою) 3 раза за игру",
        "Связь с оружием (может добавить 1 урона к одному оружию) единоразово",
        "Путь медведя (+7 hp себе) 3 раза на игру"
      ],
      inventory: [
        'Двуручный топор "Зелёный Реванш"',
        "Точильный камень",
        "1 бутерброд",
        "медвежье ухо на цепочке",
        "Зелье анти-отравления (иммунитет к яду на недолгий срок, нельзя применить, если уже отравлена)",
        "Голова грифона (вероятно дорогой трофей)"
      ],
      description:
        'Ольгия "Шальной-хвост" — высокая, мускулистая гитьянка с кожей цвета зелёной стали, блестящими чёрными волосами до пояса и яркими золотыми глазами, в которых постоянно играют огоньки азарта. Родом из племени, где силу уважают больше, чем законы, она выросла, считая, что если тебя не боятся — ты никому не интересен. В юности она случайно разнесла целое селение, пытаясь разобраться в личной драме с местным шаманом, который назвал её движения «не кошачьими». После этого её отправили странствовать по миру, чтобы "научиться контролю". Ольгия выбрала путь варвара, потому что это был самый короткий путь к топору. Теперь она рубит головы, но при этом всегда спрашивает: "А вы точно не потеряли? Может, я вам помогу найти?"',
      ownerUserId: "player-ivan"
    }
  ],
  bestiary: [
    {
      id: "be-1",
      name: "Пепельный волк",
      type: "wild",
      tag: "Стая на границе леса",
      description: "Серебристая шерсть пахнет золой, а следы исчезают до рассвета.",
      dangerLevel: "medium",
      image: ""
    },
    {
      id: "be-2",
      name: "Костяной сир",
      type: "undead",
      tag: "Служитель усыпальниц",
      description: "Говорит шёпотом из-под шлема и собирает имена павших в кости.",
      dangerLevel: "high",
      image: ""
    },
    {
      id: "be-3",
      name: "Лунная виверна",
      type: "arcane",
      tag: "Тварь древних пиков",
      description: "Её чешуя отражает небо, которого нет, а дыхание светится холодом.",
      dangerLevel: "legendary",
      image: ""
    }
  ],
  lore: [
    {
      id: "lore-history",
      category: "История",
      tone: "lore-tone--ember",
      items: [
        "Эпоха Туманов: мир скрыт за вечной дымкой, а границы королевств зависят от костров путников.",
        "Падение Башни Севера: старая крепость раскололась надвое, когда артефактный колокол прозвучал без звонаря."
      ]
    },
    {
      id: "lore-peoples",
      category: "Народы",
      tone: "lore-tone--sage",
      items: [
        "Кочевники кромки леса чтят знаки ветра и не называют волков по имени.",
        "Чернильные писцы хранят родословные на свитках, пропитанных пеплом."
      ]
    },
    {
      id: "lore-realms",
      category: "Государства",
      tone: "lore-tone--steel",
      items: [
        "Серебряный Дом держит северные дороги и требует плату не монетой, а клятвой.",
        "Княжество Трёх Башен правит через совет магистров и старые печати."
      ]
    },
    {
      id: "lore-places",
      category: "Поселения",
      tone: "lore-tone--rose",
      items: [
        "Лесная Слобода стоит на костяных мостках и закрывает ставни до заката.",
        "Село Каменных Колодцев живёт вокруг источника, который, говорят, помнит имена умерших."
      ]
    },
    {
      id: "lore-other",
      category: "Разное",
      tone: "lore-tone--violet",
      items: [
        "Клятва Чернильного Совета запрещает открывать имена мёртвых до окончания зимы.",
        "Возвращение Драконьих Писцов подарило первые карты, где реки помечены рунами."
      ]
    }
  ],
  characterRequests: [],
  raceImages: {},
  game: {
    isActive: false
  },
  map: {
    src: "assets/map.svg",
    note: "Путеводная карта"
  },
  journal: ""
};

ensureDataDir();
let db;
db = loadDb();

function ensureDataDir() {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.mkdirSync(RACES_DIR, { recursive: true });
  fs.mkdirSync(RACE_UPLOAD_DIR, { recursive: true });
}

function getRaceImagePublicPath(fileName) {
  return path.join(MEDIA_PUBLIC_PREFIX, fileName).replace(/\\/g, "/");
}

function getRaceImageAbsolutePath(storedPath) {
  const fileName = path.basename(String(storedPath || "").trim());
  return fileName ? path.join(RACE_UPLOAD_DIR, fileName) : "";
}

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, 120000, 64, "sha512").toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password, stored) {
  const [salt, hash] = String(stored || "").split(":");
  if (!salt || !hash) return false;
  const candidate = crypto
    .pbkdf2Sync(password, salt, 120000, 64, "sha512")
    .toString("hex");
  return crypto.timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(candidate, "hex"));
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function createId(prefix) {
  return `${prefix}-${crypto.randomUUID()}`;
}

function normalizeStats(stats = {}) {
  return {
    strength: Number(stats.strength || 0),
    dexterity: Number(stats.dexterity || 0),
    constitution: Number(stats.constitution || 0),
    wisdom: Number(stats.wisdom || 0),
    intelligence: Number(stats.intelligence || 0),
    charisma: Number(stats.charisma || 0)
  };
}

function normalizeLoreEntry(entry) {
  return {
    id: entry.id || createId("lore"),
    category: String(entry.category || "").trim(),
    tone: String(entry.tone || "lore-tone--ember").trim() || "lore-tone--ember",
    items: Array.isArray(entry.items) ? entry.items.map((item) => String(item).trim()).filter(Boolean) : []
  };
}

function normalizeDangerLevel(value) {
  const normalized = String(value || "").trim().toLowerCase();
  if (DANGER_LEVEL_LABELS[normalized]) return normalized;
  if (normalized.includes("безопас")) return "safe";
  if (normalized.includes("низ")) return "low";
  if (normalized.includes("сред")) return "medium";
  if (normalized.includes("выс")) return "high";
  if (normalized.includes("крит")) return "critical";
  if (normalized.includes("леген")) return "legendary";
  if (normalized.includes("экзист")) return "existential";
  return "medium";
}

function normalizeBestiaryEntry(entry) {
  const dangerLevel = normalizeDangerLevel(entry.dangerLevel || entry.danger);
  return {
    id: entry.id || createId("be"),
    name: String(entry.name || "").trim(),
    type: String(entry.type || "wild").trim() || "wild",
    tag: String(entry.tag || "").trim(),
    description: String(entry.description || "").trim(),
    dangerLevel,
    image: String(entry.image || "").trim()
  };
}

function normalizeCharacterRequest(entry) {
  return {
    id: entry.id || createId("req"),
    userId: String(entry.userId || "").trim(),
    username: String(entry.username || "").trim(),
    displayName: String(entry.displayName || "").trim(),
    name: String(entry.name || "").trim(),
    race: String(entry.race || "").trim(),
    className: String(entry.className || "").trim(),
    description: String(entry.description || "").trim(),
    status: String(entry.status || "pending").trim() || "pending",
    createdAt: String(entry.createdAt || new Date().toISOString()),
    updatedAt: String(entry.updatedAt || new Date().toISOString())
  };
}

function normalizeDb(value) {
  return {
    users: Array.isArray(value?.users) ? value.users : [],
    characters: Array.isArray(value?.characters)
      ? value.characters.map((character) => ({
          ...character,
          stats: normalizeStats(character.stats),
          skills: Array.isArray(character.skills) ? character.skills : [],
          inventory: Array.isArray(character.inventory) ? character.inventory : [],
          image: String(character.image || "").trim()
        }))
      : [],
    bestiary: Array.isArray(value?.bestiary) ? value.bestiary.map(normalizeBestiaryEntry) : [],
    lore: Array.isArray(value?.lore) ? value.lore.map(normalizeLoreEntry) : [],
    characterRequests: Array.isArray(value?.characterRequests)
      ? value.characterRequests.map(normalizeCharacterRequest)
      : [],
    raceImages: value?.raceImages && typeof value.raceImages === "object" ? value.raceImages : {},
    game: {
      isActive: Boolean(value?.game?.isActive)
    },
    map: value?.map && typeof value.map === "object" ? value.map : clone(defaultDb.map),
    journal: typeof value?.journal === "string" ? value.journal : ""
  };
}

function loadDb() {
  if (!fs.existsSync(DB_PATH)) {
    const seeded = loadSeedDb();
    saveDb(seeded);
    return seeded;
  }
  try {
    return normalizeDb(JSON.parse(fs.readFileSync(DB_PATH, "utf8")));
  } catch {
    const seeded = loadSeedDb();
    saveDb(seeded);
    return seeded;
  }
}

function loadSeedDb() {
  try {
    if (fs.existsSync(DB_SEED_PATH)) {
      return normalizeDb(JSON.parse(fs.readFileSync(DB_SEED_PATH, "utf8")));
    }
  } catch {}
  return normalizeDb(defaultDb);
}

function saveDb(nextDb) {
  db = normalizeDb(nextDb);
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), "utf8");
}

function sanitizeUser(user) {
  const { passwordHash, ...safeUser } = user;
  return safeUser;
}

function visibleDbFor(user) {
  if (user.role === "dm") {
    return {
      users: db.users.map(sanitizeUser),
      characters: clone(db.characters),
      bestiary: clone(db.bestiary),
      lore: clone(db.lore),
      characterRequests: clone(db.characterRequests),
      raceImages: clone(db.raceImages),
      game: clone(db.game),
      map: clone(db.map),
      journal: db.journal
    };
  }

  return {
    users: [],
    characters: clone(
      db.characters.filter(
        (character) => character.id === user.characterId || character.ownerUserId === user.id
      )
    ),
    bestiary: clone(db.bestiary),
    lore: clone(db.lore),
    characterRequests: clone(
      db.characterRequests.filter((request) => request.userId === user.id && request.status === "pending")
    ),
    raceImages: clone(db.raceImages),
    game: clone(db.game),
    map: clone(db.map),
    journal: db.journal
  };
}

function visibleCharactersFor(user) {
  return clone(visibleDbFor(user).characters);
}

function visibleCharacterRequestsFor(user) {
  return clone(visibleDbFor(user).characterRequests || []);
}

function canPlayerManageCharacter(user, character) {
  if (!user || !character) return false;
  if (user.role === "dm") return true;
  return Boolean(db.game?.isActive) && (character.id === user.characterId || character.ownerUserId === user.id);
}

function getLoreEntryByCategory(category) {
  const normalized = String(category || "").trim().toLowerCase();
  return db.lore.find((entry) => String(entry.category || "").trim().toLowerCase() === normalized) || null;
}

function parseLabeledLoreRecord(text, labels) {
  const source = String(text || "").trim();
  const escapedLabels = labels.map((label) => label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const labelPattern = new RegExp(`(?:^|\\.\\s+)(${escapedLabels.join("|")}):\\s*`, "g");
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

function extractAvailableRaces() {
  const entry = getLoreEntryByCategory("народы");
  if (!entry) return [];
  return entry.items
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
      if (parsed?.Название) return parsed.Название.trim();
      const fallbackMatch = source.match(/^(.+?)(?:\.\s+Бонусы:|:)/);
      if (fallbackMatch?.[1]) return fallbackMatch[1].trim();
      return source.split(".")[0].trim();
    })
    .filter(Boolean);
}

function extractAvailableClasses() {
  const entry = getLoreEntryByCategory("классы");
  if (!entry) return [];
  return entry.items
    .map((item) => {
      const parsed = parseLabeledLoreRecord(String(item || ""), [
        "Название",
        "Доступное оружие",
        "Сложность",
        "Описание"
      ]);
      if (parsed?.Название) return parsed.Название.trim();
      return String(item || "").split(".")[0].trim();
    })
    .filter(Boolean);
}

function findPendingRequestForUser(userId) {
  return db.characterRequests.find(
    (request) => request.userId === userId && String(request.status || "") === "pending"
  ) || null;
}

function slugifyRaceName(name) {
  const translitMap = {
    а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "zh", з: "z", и: "i",
    й: "y", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r", с: "s", т: "t",
    у: "u", ф: "f", х: "h", ц: "ts", ч: "ch", ш: "sh", щ: "sch", ъ: "", ы: "y",
    ь: "", э: "e", ю: "yu", я: "ya"
  };
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

function decodeDataUrl(dataUrl) {
  const match = String(dataUrl || "").match(/^data:(image\/(?:png|jpeg|jpg|webp|gif|svg\+xml));base64,([A-Za-z0-9+/=]+)$/);
  if (!match) return null;
  const mime = match[1];
  const base64 = match[2];
  const ext =
    mime === "image/png" ? ".png"
      : mime === "image/jpeg" || mime === "image/jpg" ? ".jpg"
        : mime === "image/webp" ? ".webp"
          : mime === "image/gif" ? ".gif"
            : mime === "image/svg+xml" ? ".svg"
              : "";
  if (!ext) return null;
  return { mime, ext, buffer: Buffer.from(base64, "base64") };
}

function payloadFor(user) {
  return {
    user: sanitizeUser(user),
    db: visibleDbFor(user)
  };
}

function parseCookies(request) {
  const header = request.headers.cookie || "";
  return header.split(";").reduce((acc, part) => {
    const trimmed = part.trim();
    if (!trimmed) return acc;
    const separatorIndex = trimmed.indexOf("=");
    const key = separatorIndex >= 0 ? trimmed.slice(0, separatorIndex) : trimmed;
    const value = separatorIndex >= 0 ? trimmed.slice(separatorIndex + 1) : "";
    acc[key] = decodeURIComponent(value);
    return acc;
  }, {});
}

function getSessionUser(request) {
  const cookies = parseCookies(request);
  const sessionId = cookies[SESSION_COOKIE];
  if (!sessionId) return null;
  const session = sessions.get(sessionId);
  if (!session) return null;
  return db.users.find((user) => user.id === session.userId) || null;
}

function setSession(response, userId) {
  const sessionId = crypto.randomUUID();
  sessions.set(sessionId, { userId, createdAt: Date.now() });
  response.setHeader(
    "Set-Cookie",
    `${SESSION_COOKIE}=${encodeURIComponent(sessionId)}; HttpOnly; Path=/; SameSite=Lax`
  );
}

function clearSession(request, response) {
  const cookies = parseCookies(request);
  const sessionId = cookies[SESSION_COOKIE];
  if (sessionId) sessions.delete(sessionId);
  response.setHeader(
    "Set-Cookie",
    `${SESSION_COOKIE}=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax`
  );
}

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8"
  });
  response.end(JSON.stringify(payload));
}

function sendError(response, statusCode, message) {
  sendJson(response, statusCode, { error: message });
}

function readBody(request) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    request.on("data", (chunk) => chunks.push(chunk));
    request.on("end", () => {
      if (!chunks.length) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString("utf8")));
      } catch {
        reject(new Error("Некорректный JSON."));
      }
    });
    request.on("error", reject);
  });
}

function requireAuth(request, response) {
  const user = getSessionUser(request);
  if (!user) {
    sendError(response, 401, "Требуется вход.");
    return null;
  }
  return user;
}

function requireDm(request, response) {
  const user = requireAuth(request, response);
  if (!user) return null;
  if (user.role !== "dm") {
    sendError(response, 403, "Это действие доступно только DM.");
    return null;
  }
  return user;
}

function updateUserAssignments(characterId, ownerUserId) {
  db.users = db.users.map((user) =>
    user.role === "dm"
      ? user
      : user.id === ownerUserId
        ? { ...user, characterId }
        : user.characterId === characterId
          ? { ...user, characterId: "" }
          : user
  );
}

async function handleApi(request, response, url) {
  if (request.method === "GET" && url.pathname === "/api/bootstrap") {
    const user = getSessionUser(request);
    if (!user) {
      sendJson(response, 200, { user: null, db: null });
      return;
    }
    sendJson(response, 200, payloadFor(user));
    return;
  }

  if (request.method === "GET" && url.pathname === "/api/runtime") {
    const user = requireAuth(request, response);
    if (!user) return;
    sendJson(response, 200, {
      game: clone(db.game),
      characters: visibleCharactersFor(user),
      characterRequests: visibleCharacterRequestsFor(user),
      journal: db.journal
    });
    return;
  }

  if (request.method === "POST" && url.pathname === "/api/login") {
    const body = await readBody(request);
    const username = String(body.username || "").trim();
    const password = String(body.password || "").trim();
    const user = db.users.find((entry) => entry.username === username);
    if (!user || !verifyPassword(password, user.passwordHash)) {
      sendError(response, 401, "Неверный логин или пароль.");
      return;
    }
    setSession(response, user.id);
    sendJson(response, 200, payloadFor(user));
    return;
  }

  if (request.method === "POST" && url.pathname === "/api/character-requests") {
    const user = requireAuth(request, response);
    if (!user) return;
    if (user.role === "dm") {
      sendError(response, 403, "DM не отправляет заявку на персонажа.");
      return;
    }
    if (user.characterId || db.characters.some((character) => character.ownerUserId === user.id)) {
      sendError(response, 400, "Для этого игрока уже существует персонаж.");
      return;
    }
    if (findPendingRequestForUser(user.id)) {
      sendError(response, 400, "Заявка уже ожидает согласования.");
      return;
    }

    const body = await readBody(request);
    const availableRaces = extractAvailableRaces();
    const availableClasses = extractAvailableClasses();
    const race = String(body.race || "").trim();
    const className = String(body.className || "").trim();
    const name = String(body.name || "").trim();
    const description = String(body.description || "").trim();

    if (!name || !race || !className) {
      sendError(response, 400, "Имя, раса и класс обязательны.");
      return;
    }
    if (!availableRaces.includes(race)) {
      sendError(response, 400, "Выбрана недоступная раса.");
      return;
    }
    if (!availableClasses.includes(className)) {
      sendError(response, 400, "Выбран недоступный класс.");
      return;
    }

    db.characterRequests.push(
      normalizeCharacterRequest({
        userId: user.id,
        username: user.username,
        displayName: user.displayName,
        name,
        race,
        className,
        description,
        status: "pending"
      })
    );
    saveDb(db);
    sendJson(response, 200, payloadFor(user));
    return;
  }

  if (request.method === "POST" && url.pathname === "/api/logout") {
    clearSession(request, response);
    sendJson(response, 200, { ok: true });
    return;
  }

  if (request.method === "PUT" && url.pathname === "/api/journal") {
    const user = requireDm(request, response);
    if (!user) return;
    const body = await readBody(request);
    db.journal = String(body.journal || "");
    saveDb(db);
    sendJson(response, 200, payloadFor(user));
    return;
  }

  if (request.method === "PUT" && url.pathname === "/api/map") {
    const user = requireDm(request, response);
    if (!user) return;
    const body = await readBody(request);
    db.map = {
      src: String(body.src || "").trim() || "assets/map.svg",
      note: String(body.note || "").trim() || "Путеводная карта"
    };
    saveDb(db);
    sendJson(response, 200, payloadFor(user));
    return;
  }

  if (request.method === "PUT" && url.pathname === "/api/game") {
    const user = requireDm(request, response);
    if (!user) return;
    const body = await readBody(request);
    db.game = {
      isActive: Boolean(body.isActive)
    };
    saveDb(db);
    sendJson(response, 200, payloadFor(user));
    return;
  }

  if (request.method === "POST" && url.pathname === "/api/users") {
    const user = requireDm(request, response);
    if (!user) return;
    const body = await readBody(request);
    const id = String(body.id || "").trim();
    const existing = db.users.find((entry) => entry.id === id);
    const username = String(body.username || "").trim();
    const displayName = String(body.displayName || "").trim();
    const password = String(body.password || "").trim();
    const characterId = String(body.characterId || "").trim();

    if (!username || !displayName) {
      sendError(response, 400, "Логин и имя обязательны.");
      return;
    }

    const duplicate = db.users.find(
      (entry) => entry.username === username && entry.id !== id
    );
    if (duplicate) {
      sendError(response, 400, "Такой логин уже существует.");
      return;
    }

    if (!existing && !password) {
      sendError(response, 400, "Для нового игрока нужен пароль.");
      return;
    }

    const nextUser = {
      id: existing?.id || createId("user"),
      username,
      displayName,
      role: "player",
      characterId,
      passwordHash: password ? hashPassword(password) : existing.passwordHash
    };

    db.users = db.users.filter((entry) => entry.id !== nextUser.id);
    db.users.push(nextUser);

    if (existing?.characterId && existing.characterId !== nextUser.characterId) {
      db.characters = db.characters.map((character) =>
        character.id === existing.characterId && character.ownerUserId === nextUser.id
          ? { ...character, ownerUserId: "" }
          : character
      );
    }

    db.characters = db.characters.map((character) =>
      character.id === nextUser.characterId
        ? { ...character, ownerUserId: nextUser.id }
        : character.ownerUserId === nextUser.id
          ? { ...character, ownerUserId: "" }
          : character
    );

    db.users = db.users.map((entry) =>
      entry.id !== nextUser.id && entry.characterId === nextUser.characterId
        ? { ...entry, characterId: "" }
        : entry
    );
    if (nextUser.characterId) {
      db.characterRequests = db.characterRequests.map((entry) =>
        entry.userId === nextUser.id && entry.status === "pending"
          ? { ...entry, status: "approved", updatedAt: new Date().toISOString() }
          : entry
      );
    }

    saveDb(db);
    sendJson(response, 200, payloadFor(user));
    return;
  }

  if (request.method === "DELETE" && url.pathname.startsWith("/api/users/")) {
    const user = requireDm(request, response);
    if (!user) return;
    const targetId = decodeURIComponent(url.pathname.slice("/api/users/".length));
    const target = db.users.find((entry) => entry.id === targetId);
    if (!target || target.role === "dm") {
      sendError(response, 404, "Игрок не найден.");
      return;
    }
    db.users = db.users.filter((entry) => entry.id !== targetId);
    db.characterRequests = db.characterRequests.filter((request) => request.userId !== targetId);
    db.characters = db.characters.map((character) =>
      character.ownerUserId === targetId ? { ...character, ownerUserId: "" } : character
    );
    saveDb(db);
    sendJson(response, 200, payloadFor(user));
    return;
  }

  if (request.method === "POST" && url.pathname === "/api/characters") {
    const user = requireDm(request, response);
    if (!user) return;
    const body = await readBody(request);
    const id = String(body.id || "").trim();
    const existingIndex = db.characters.findIndex((entry) => entry.id === id);
    const nextCharacter = {
      id: id || createId("char"),
      name: String(body.name || "").trim(),
      race: String(body.race || "").trim(),
      className: String(body.className || "").trim(),
      health: Number(body.health || 0),
      armor: Number(body.armor || 0),
      stats: normalizeStats(body.stats),
      weapon: String(body.weapon || "").trim(),
      image: String(body.image || "").trim(),
      skills: Array.isArray(body.skills) ? body.skills.map(String) : [],
      inventory: Array.isArray(body.inventory) ? body.inventory.map(String) : [],
      description: String(body.description || "").trim(),
      ownerUserId: String(body.ownerUserId || "").trim()
    };

    if (!nextCharacter.name || !nextCharacter.race || !nextCharacter.className) {
      sendError(response, 400, "Имя, раса и класс обязательны.");
      return;
    }

    if (existingIndex >= 0) db.characters[existingIndex] = nextCharacter;
    else db.characters.push(nextCharacter);

    updateUserAssignments(nextCharacter.id, nextCharacter.ownerUserId);
    db.characters = db.characters.map((character) =>
      character.id !== nextCharacter.id && character.ownerUserId === nextCharacter.ownerUserId
        ? { ...character, ownerUserId: "" }
        : character
    );
    if (nextCharacter.ownerUserId) {
      db.characterRequests = db.characterRequests.map((entry) =>
        entry.userId === nextCharacter.ownerUserId && entry.status === "pending"
          ? { ...entry, status: "approved", updatedAt: new Date().toISOString() }
          : entry
      );
    }

    saveDb(db);
    sendJson(response, 200, payloadFor(user));
    return;
  }

  if (request.method === "POST" && url.pathname.startsWith("/api/character-requests/") && url.pathname.endsWith("/approve")) {
    const user = requireDm(request, response);
    if (!user) return;
    const requestId = decodeURIComponent(
      url.pathname.slice("/api/character-requests/".length, -"/approve".length)
    );
    const existingRequest = db.characterRequests.find(
      (entry) => entry.id === requestId && String(entry.status || "") === "pending"
    );
    if (!existingRequest) {
      sendError(response, 404, "Заявка не найдена.");
      return;
    }

    const body = await readBody(request);
    const nextCharacter = {
      id: String(body.id || "").trim() || createId("char"),
      name: String(body.name || existingRequest.name).trim(),
      race: String(body.race || existingRequest.race).trim(),
      className: String(body.className || existingRequest.className).trim(),
      health: Number(body.health || 0),
      armor: Number(body.armor || 0),
      stats: normalizeStats(body.stats),
      weapon: String(body.weapon || "").trim(),
      image: String(body.image || "").trim(),
      skills: Array.isArray(body.skills) ? body.skills.map(String) : [],
      inventory: Array.isArray(body.inventory) ? body.inventory.map(String) : [],
      description: String(body.description || existingRequest.description || "").trim(),
      ownerUserId: existingRequest.userId
    };

    if (!nextCharacter.name || !nextCharacter.race || !nextCharacter.className) {
      sendError(response, 400, "Имя, раса и класс обязательны.");
      return;
    }

    const existingIndex = db.characters.findIndex((entry) => entry.id === nextCharacter.id);
    if (existingIndex >= 0) db.characters[existingIndex] = nextCharacter;
    else db.characters.push(nextCharacter);

    updateUserAssignments(nextCharacter.id, nextCharacter.ownerUserId);
    db.characters = db.characters.map((character) =>
      character.id !== nextCharacter.id && character.ownerUserId === nextCharacter.ownerUserId
        ? { ...character, ownerUserId: "" }
        : character
    );

    db.characterRequests = db.characterRequests.map((entry) =>
      entry.id === requestId
        ? { ...entry, status: "approved", updatedAt: new Date().toISOString() }
        : entry
    );
    saveDb(db);
    sendJson(response, 200, payloadFor(user));
    return;
  }

  if (request.method === "DELETE" && url.pathname.startsWith("/api/character-requests/")) {
    const user = requireDm(request, response);
    if (!user) return;
    const targetId = decodeURIComponent(url.pathname.slice("/api/character-requests/".length));
    db.characterRequests = db.characterRequests.filter((entry) => entry.id !== targetId);
    saveDb(db);
    sendJson(response, 200, payloadFor(user));
    return;
  }

  if (request.method === "DELETE" && url.pathname.startsWith("/api/characters/")) {
    const user = requireDm(request, response);
    if (!user) return;
    const targetId = decodeURIComponent(url.pathname.slice("/api/characters/".length));
    db.characters = db.characters.filter((character) => character.id !== targetId);
    db.users = db.users.map((entry) =>
      entry.characterId === targetId ? { ...entry, characterId: "" } : entry
    );
    saveDb(db);
    sendJson(response, 200, payloadFor(user));
    return;
  }

  if (request.method === "PATCH" && url.pathname.startsWith("/api/characters/")) {
    const user = requireAuth(request, response);
    if (!user) return;
    const targetId = decodeURIComponent(url.pathname.slice("/api/characters/".length));
    const existingIndex = db.characters.findIndex((character) => character.id === targetId);
    if (existingIndex < 0) {
      sendError(response, 404, "Персонаж не найден.");
      return;
    }

    const currentCharacter = db.characters[existingIndex];
    if (!canPlayerManageCharacter(user, currentCharacter)) {
      sendError(response, 403, "Редактирование персонажа сейчас недоступно.");
      return;
    }

    const body = await readBody(request);
    const healthDelta = Number(body.healthDelta || 0);
    const armorDelta = Number(body.armorDelta || 0);
    const hasInventory = Object.prototype.hasOwnProperty.call(body, "inventory");
    const inventory = hasInventory && Array.isArray(body.inventory) ? body.inventory.map(String) : currentCharacter.inventory;

    if (!Number.isFinite(healthDelta) || !Number.isFinite(armorDelta)) {
      sendError(response, 400, "Некорректное изменение характеристик.");
      return;
    }

    const nextCharacter = {
      ...currentCharacter,
      health: Math.max(0, currentCharacter.health + Math.trunc(healthDelta)),
      armor: Math.max(0, currentCharacter.armor + Math.trunc(armorDelta)),
      inventory
    };

    db.characters[existingIndex] = nextCharacter;
    saveDb(db);
    sendJson(response, 200, payloadFor(user));
    return;
  }

  if (request.method === "POST" && url.pathname === "/api/bestiary") {
    const user = requireDm(request, response);
    if (!user) return;
    const body = await readBody(request);
    const id = String(body.id || "").trim();
    const nextCreature = {
      id: id || createId("be"),
      name: String(body.name || "").trim(),
      type: String(body.type || "wild").trim(),
      tag: String(body.tag || "").trim(),
      dangerLevel: normalizeDangerLevel(body.dangerLevel || body.danger),
      description: String(body.description || "").trim(),
      image: String(body.image || "").trim()
    };

    if (!nextCreature.name || !nextCreature.description) {
      sendError(response, 400, "Название и описание обязательны.");
      return;
    }

    const existingIndex = db.bestiary.findIndex((entry) => entry.id === nextCreature.id);
    if (existingIndex >= 0) db.bestiary[existingIndex] = nextCreature;
    else db.bestiary.push(nextCreature);

    saveDb(db);
    sendJson(response, 200, payloadFor(user));
    return;
  }

  if (request.method === "DELETE" && url.pathname.startsWith("/api/bestiary/")) {
    const user = requireDm(request, response);
    if (!user) return;
    const targetId = decodeURIComponent(url.pathname.slice("/api/bestiary/".length));
    db.bestiary = db.bestiary.filter((entry) => entry.id !== targetId);
    saveDb(db);
    sendJson(response, 200, payloadFor(user));
    return;
  }

  if (request.method === "POST" && url.pathname === "/api/lore") {
    const user = requireDm(request, response);
    if (!user) return;
    const body = await readBody(request);
    const nextEntry = normalizeLoreEntry({
      id: String(body.id || "").trim() || undefined,
      category: body.category,
      tone: body.tone,
      items: body.items
    });

    if (!nextEntry.category || !nextEntry.items.length) {
      sendError(response, 400, "Раздел и хотя бы одна запись обязательны.");
      return;
    }

    const existingIndex = db.lore.findIndex((entry) => entry.id === nextEntry.id);
    if (existingIndex >= 0) db.lore[existingIndex] = nextEntry;
    else db.lore.push(nextEntry);

    saveDb(db);
    sendJson(response, 200, payloadFor(user));
    return;
  }

  if (request.method === "DELETE" && url.pathname.startsWith("/api/lore/")) {
    const user = requireDm(request, response);
    if (!user) return;
    const targetId = decodeURIComponent(url.pathname.slice("/api/lore/".length));
    db.lore = db.lore.filter((entry) => entry.id !== targetId);
    saveDb(db);
    sendJson(response, 200, payloadFor(user));
    return;
  }

  if (request.method === "POST" && url.pathname === "/api/race-images") {
    const user = requireDm(request, response);
    if (!user) return;
    const body = await readBody(request);
    const raceName = String(body.name || "").trim();
    const slug = slugifyRaceName(raceName);
    const decoded = decodeDataUrl(body.dataUrl);
    if (!slug || !decoded) {
      sendError(response, 400, "Не удалось прочитать изображение расы.");
      return;
    }

    const previous = typeof db.raceImages?.[slug] === "string" ? db.raceImages[slug] : "";
    if (previous) {
      const previousPath = getRaceImageAbsolutePath(previous);
      if (previousPath && previousPath.startsWith(RACE_UPLOAD_DIR) && fs.existsSync(previousPath)) {
        fs.unlinkSync(previousPath);
      }
    }

    const fileName = `${slug}${decoded.ext}`;
    const targetPath = path.join(RACE_UPLOAD_DIR, fileName);
    fs.writeFileSync(targetPath, decoded.buffer);
    db.raceImages = { ...db.raceImages, [slug]: getRaceImagePublicPath(fileName) };
    saveDb(db);
    sendJson(response, 200, payloadFor(user));
    return;
  }

  if (request.method === "DELETE" && url.pathname.startsWith("/api/race-images/")) {
    const user = requireDm(request, response);
    if (!user) return;
    const slug = decodeURIComponent(url.pathname.slice("/api/race-images/".length));
    const previous = typeof db.raceImages?.[slug] === "string" ? db.raceImages[slug] : "";
    if (previous) {
      const previousPath = getRaceImageAbsolutePath(previous);
      if (previousPath && previousPath.startsWith(RACE_UPLOAD_DIR) && fs.existsSync(previousPath)) {
        fs.unlinkSync(previousPath);
      }
    }
    if (db.raceImages && slug in db.raceImages) {
      delete db.raceImages[slug];
      db.raceImages = { ...db.raceImages };
    }
    saveDb(db);
    sendJson(response, 200, payloadFor(user));
    return;
  }

  sendError(response, 404, "Маршрут не найден.");
}

function serveStatic(response, filePath) {
  serveStaticFromBase(response, ROOT, filePath);
}

function serveStaticFromBase(response, baseDir, filePath) {
  const safePath = path.normalize(filePath).replace(/^(\.\.[/\\])+/, "");
  const absolutePath = path.resolve(baseDir, safePath);
  const allowedRoot = path.resolve(baseDir);
  if (!absolutePath.startsWith(allowedRoot)) {
    sendError(response, 403, "Доступ запрещён.");
    return;
  }

  if (!fs.existsSync(absolutePath) || fs.statSync(absolutePath).isDirectory()) {
    sendError(response, 404, "Файл не найден.");
    return;
  }

  response.writeHead(200, {
    "Content-Type": mimeTypes[path.extname(absolutePath).toLowerCase()] || "application/octet-stream"
  });
  fs.createReadStream(absolutePath).pipe(response);
}

const server = http.createServer(async (request, response) => {
  try {
    const url = new URL(request.url, `http://${request.headers.host || "localhost"}`);

    if (url.pathname.startsWith("/api/")) {
      await handleApi(request, response, url);
      return;
    }

    if (request.method !== "GET" && request.method !== "HEAD") {
      sendError(response, 405, "Метод не поддерживается.");
      return;
    }

    if (url.pathname === "/") {
      serveStatic(response, "index.html");
      return;
    }

    if (url.pathname.startsWith(`/${MEDIA_PUBLIC_PREFIX}/`)) {
      const relativeMediaPath = url.pathname.slice(`/${MEDIA_PUBLIC_PREFIX}/`.length);
      serveStaticFromBase(response, RACE_UPLOAD_DIR, relativeMediaPath);
      return;
    }

    serveStatic(response, url.pathname.slice(1));
  } catch (error) {
    console.error(error);
    sendError(response, 500, "Внутренняя ошибка сервера.");
  }
});

if (require.main === module) {
  server.listen(PORT, HOST, () => {
    console.log(`Ferelden server listening on http://${HOST}:${PORT}`);
  });
}

module.exports = server;
