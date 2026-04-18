const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");

const HOST = process.env.HOST || "0.0.0.0";
const PORT = Number(process.env.PORT || 8000);
const ROOT = __dirname;
const DATA_DIR = path.join(ROOT, "data");
const DB_PATH = path.join(DATA_DIR, "db.json");
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
    map: value?.map && typeof value.map === "object" ? value.map : clone(defaultDb.map),
    journal: typeof value?.journal === "string" ? value.journal : ""
  };
}

function loadDb() {
  if (!fs.existsSync(DB_PATH)) {
    const seeded = normalizeDb(defaultDb);
    saveDb(seeded);
    return seeded;
  }
  try {
    return normalizeDb(JSON.parse(fs.readFileSync(DB_PATH, "utf8")));
  } catch {
    const seeded = normalizeDb(defaultDb);
    saveDb(seeded);
    return seeded;
  }
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
    map: clone(db.map),
    journal: db.journal
  };
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

  if (request.method === "POST" && url.pathname === "/api/logout") {
    clearSession(request, response);
    sendJson(response, 200, { ok: true });
    return;
  }

  if (request.method === "PUT" && url.pathname === "/api/journal") {
    const user = requireAuth(request, response);
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

  sendError(response, 404, "Маршрут не найден.");
}

function serveStatic(response, filePath) {
  const safePath = path.normalize(filePath).replace(/^(\.\.[/\\])+/, "");
  const absolutePath = path.join(ROOT, safePath);
  if (!absolutePath.startsWith(ROOT)) {
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
