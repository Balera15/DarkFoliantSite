function parseLoreRecord(text) {
  const source = String(text || "").trim();
  const labelPattern = /\.(?:\s+)(Бонусы|Тип|Размер|Описание|Способности|Пометка):\s*/g;
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
  const sizeMatch = !mapped["Размер"] ? description.match(/Размер\s+[^.]+/i) : null;
  const size = mapped["Размер"] || (sizeMatch ? sizeMatch[0].replace(/^Размер\s+/i, "").trim() : "");
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

function isBrokenLoreName(value) {
  const normalized = String(value || "").trim().toLowerCase();
  if (!normalized) return true;
  return /^(название|бонусы|тип|размер|способности|пометка|описание)\s*:/.test(normalized);
}

function stripKnownLoreLabelPrefix(value) {
  let normalized = String(value || "").trim();
  while (/^(название|бонусы|тип|размер|способности|пометка|описание)\s*:/i.test(normalized)) {
    normalized = normalized.replace(
      /^(название|бонусы|тип|размер|способности|пометка|описание)\s*:\s*/i,
      ""
    ).trim();
  }
  return normalized;
}

function isMisplacedLoreName(name, row = {}) {
  const normalizedName = String(name || "").trim().toLowerCase();
  if (!normalizedName) return true;
  const peers = [row["Бонусы"], row["Тип"], row["Размер"]]
    .map((value) => String(value || "").trim().toLowerCase())
    .filter(Boolean);
  return peers.includes(normalizedName);
}

function sanitizeLoreFieldValue(label, value) {
  const raw = String(value || "").trim();
  if (!raw) return "";
  const normalizedLabel = String(label || "").trim().toLowerCase();
  const labelMap = {
    "название": "Название",
    "бонусы": "Бонусы",
    "тип": "Тип",
    "размер": "Размер",
    "способности": "Способности",
    "пометка": "Пометка",
    "описание": "Описание"
  };
  const displayLabel = labelMap[normalizedLabel];
  const withoutGenericPrefix = stripKnownLoreLabelPrefix(raw);
  if (!displayLabel) return withoutGenericPrefix;
  return withoutGenericPrefix.replace(new RegExp(`^${displayLabel}:\\s*`, "i"), "").trim();
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

function getLoreTableSelectOptions(category, column) {
  const normalizedCategory = normalizedLoreCategory(category);
  if (normalizedCategory === "народы" && column === "Тип") {
    return ["Гуманоид", "Фея", "Слизь", "Нежить", "Монстр", "Механизм"];
  }
  if (normalizedCategory === "классы" && column === "Сложность") {
    return ["Легко", "Средне", "Сложно"];
  }
  return null;
}

function parseLoreItemForTable(category, item) {
  const columns = getLoreTableSchema(category);
  if (columns.length === 1 && columns[0] === "Запись") {
    return { Запись: String(item || "").trim() };
  }
  const normalized = normalizedLoreCategory(category);
  if (normalized === "народы") {
    const parsed = parseLabeledLoreRecord(item, columns);
    const fallback = parseLoreRecord(item);
    const resolved = {
      Название: sanitizeLoreFieldValue("Название", parsed?.["Название"] || fallback?.name || ""),
      Бонусы: sanitizeLoreFieldValue("Бонусы", parsed?.["Бонусы"] || fallback?.bonus || ""),
      Тип: sanitizeLoreFieldValue("Тип", parsed?.["Тип"] || fallback?.type || ""),
      Размер: sanitizeLoreFieldValue("Размер", parsed?.["Размер"] || fallback?.size || ""),
      Способности: sanitizeLoreFieldValue("Способности", parsed?.["Способности"] || fallback?.abilities || ""),
      Пометка: sanitizeLoreFieldValue("Пометка", parsed?.["Пометка"] || fallback?.note || ""),
      Описание: sanitizeLoreFieldValue("Описание", parsed?.["Описание"] || fallback?.description || "")
    };
    if (isBrokenLoreName(resolved["Название"]) || isMisplacedLoreName(resolved["Название"], resolved)) {
      const fallbackName = stripKnownLoreLabelPrefix(fallback?.name || "");
      resolved["Название"] =
        isBrokenLoreName(fallbackName) || isMisplacedLoreName(fallbackName, resolved) ? "" : fallbackName;
    }
    if (!resolved["Название"] && fallback?.name) {
      resolved["Название"] = fallback.name;
    }
    if (Object.values(resolved).some((value) => String(value || "").trim())) {
      return resolved;
    }
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
  const normalized = normalizedLoreCategory(category);
  if (normalized === "народы") {
    const title = sanitizeLoreFieldValue("Название", row["Название"]);
    const parts = [
      title,
      row["Бонусы"] ? `Бонусы: ${sanitizeLoreFieldValue("Бонусы", row["Бонусы"])}` : "",
      row["Тип"] ? `Тип: ${sanitizeLoreFieldValue("Тип", row["Тип"])}` : "",
      row["Размер"] ? `Размер: ${sanitizeLoreFieldValue("Размер", row["Размер"])}` : "",
      row["Способности"] ? `Способности: ${sanitizeLoreFieldValue("Способности", row["Способности"])}` : "",
      row["Пометка"] ? `Пометка: ${sanitizeLoreFieldValue("Пометка", row["Пометка"])}` : "",
      row["Описание"] ? `Описание: ${sanitizeLoreFieldValue("Описание", row["Описание"])}` : ""
    ].filter(Boolean);
    return parts.join(". ");
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

function readLoreTableFieldValue(field) {
  if (!field) return "";
  if ("value" in field) return field.value;
  return field.textContent || "";
}

function collectLoreTableRows() {
  if (!loreTableBody) return [];
  return Array.from(loreTableBody.querySelectorAll("tr[data-row-index]"))
    .map((row) => {
      const result = {};
      Array.from(row.querySelectorAll("[data-column]")).forEach((field) => {
        result[field.dataset.column] = readLoreTableFieldValue(field);
      });
      return result;
    })
    .filter((row) => Object.values(row).some((value) => String(value || "").trim()));
}

function renderLoreEditableCell(column, value, multiline) {
  const className = multiline ? "lore-table__cell lore-table__cell--long" : "lore-table__cell";
  return `<div class="${className}" data-column="${escapeHtml(column)}" contenteditable="plaintext-only" role="textbox" tabindex="0" aria-label="${escapeHtml(column)}" data-placeholder="${escapeHtml(column)}">${escapeHtml(value)}</div>`;
}

function handleLoreTableCellPaste(event) {
  const cell =
    event.target instanceof HTMLElement
      ? event.target.closest(".lore-table__cell[contenteditable]")
      : null;
  if (!cell) return;
  const text = event.clipboardData?.getData("text/plain");
  if (!text) return;
  event.preventDefault();
  document.execCommand("insertText", false, text);
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
          const options = getLoreTableSelectOptions(category, column);
          const normalizedCategory = normalizedLoreCategory(category);
          const multiline =
            value.length > 90 ||
            column === "Описание" ||
            column === "Заметки" ||
            column === "Способности" ||
            (normalizedCategory === "государства" && column === "Осн. население");
          if (options) {
            return `<td><select data-column="${escapeHtml(column)}">
              <option value="">Выбрать</option>
              ${options
                .map(
                  (option) =>
                    `<option value="${escapeHtml(option)}" ${option === value ? "selected" : ""}>${escapeHtml(option)}</option>`
                )
                .join("")}
            </select></td>`;
          }
          return `<td>${renderLoreEditableCell(column, value, multiline)}</td>`;
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

function resolveLoreEntry(entryOrId) {
  if (!entryOrId) return null;
  if (typeof entryOrId === "object" && entryOrId.id) return entryOrId;
  return db.lore.find((entry) => entry.id === entryOrId) || null;
}

function loreEntryTitle(entry) {
  return String(entry?.category || entry?.title || "").trim();
}

function isLoreTableCategory(entryOrId) {
  const entry = resolveLoreEntry(entryOrId);
  const normalized = normalizedLoreCategory(loreEntryTitle(entry));
  return entry?.editor === "table" || ["народы", "классы", "государства", "поселения"].includes(normalized);
}

function getLoreVisibleEntries() {
  const query = String(state.loreQuery || "").trim().toLowerCase();
  return db.lore
    .map((entry) => {
      const items = (entry.items || []).filter((item) => String(item || "").toLowerCase().includes(query));
      return {
        ...entry,
        filteredItems: items
      };
    })
    .filter((entry) => !query || matchesLoreQuery(entry, query) || entry.filteredItems.length);
}

function renderLore() {
  if (!loreTabs || !loreContent) return;

  const entries = getLoreVisibleEntries();
  let activeLore =
    entries.find((entry) => entry.id === state.selectedLoreId) ||
    resolveLoreEntry(state.selectedLoreId) ||
    entries[0] ||
    db.lore[0] ||
    null;

  state.selectedLoreId = activeLore?.id || "";

  loreTabs.innerHTML = entries
    .map(
      (entry) => `<button class="lore-tab ${entry.id === activeLore?.id ? "is-active" : ""} ${entry.tone || ""}" data-action="select-lore" data-id="${entry.id}" type="button">
        <span class="lore-tab__name">${escapeHtml(loreEntryTitle(entry))}</span>
        <span class="lore-tab__count">${String((entry.filteredItems || entry.items || []).length).padStart(2, "0")}</span>
      </button>`
    )
    .join("");

  const currentVisible = entries.find((entry) => entry.id === activeLore?.id) || null;
  const visibleItems = currentVisible
    ? currentVisible.filteredItems || currentVisible.items || []
    : String(state.loreQuery || "").trim()
      ? []
      : activeLore?.items || [];

  if (lorePeopleHint) {
    const showPeopleHint =
      !isDm() &&
      normalizedLoreCategory(loreEntryTitle(activeLore)) === "народы" &&
      visibleItems.length > 0;
    lorePeopleHint.classList.toggle("is-hidden", !showPeopleHint);
  }

  loreContent.innerHTML = activeLore
    ? `<article class="lore-sheet ${activeLore.tone || ""}">
        <div class="lore-sheet__head">
          <div>
            <p class="lore-sheet__eyebrow">Раздел архива</p>
            <h3>${escapeHtml(loreEntryTitle(activeLore))}</h3>
          </div>
          <p class="lore-sheet__count">${String(visibleItems.length).padStart(2, "0")} записи</p>
        </div>
        <div class="lore-sheet__body">
          ${
            visibleItems.length
              ? visibleItems
                  .map(
                    (item, index) => `<section class="lore-entry">
                      <span class="lore-entry__index">${String(index + 1).padStart(2, "0")}</span>
                      ${renderLoreItem(item, loreEntryTitle(activeLore))}
                    </section>`
                  )
                  .join("")
              : `<div class="lore-empty">По этому запросу в разделе пока ничего не найдено.</div>`
          }
        </div>
      </article>`
    : `<div class="lore-empty">В архиве пока нет ни одного раздела.</div>`;

  renderLoreComposer(activeLore);
}

function createLoreDraft(entry) {
  return {
    id: entry.id || "",
    category: loreEntryTitle(entry),
    tone: entry.tone || "lore-tone--ember",
    items: Array.isArray(entry.items) && entry.items.length ? [...entry.items] : [""]
  };
}

function ensureLoreEditorDraft(entryOrId) {
  const entry = resolveLoreEntry(entryOrId);
  if (!entry) {
    state.loreEditorDraftId = "";
    state.loreEditorDraft = null;
    state.selectedLoreRecordIndex = 0;
    return null;
  }

  if (state.loreEditorDraftId !== entry.id || !state.loreEditorDraft) {
    state.loreEditorDraftId = entry.id;
    state.loreEditorDraft = createLoreDraft(entry);
    state.selectedLoreRecordIndex = 0;
  }

  if (!Array.isArray(state.loreEditorDraft.items) || !state.loreEditorDraft.items.length) {
    state.loreEditorDraft.items = [""];
  }

  if (state.selectedLoreRecordIndex < 0) {
    state.selectedLoreRecordIndex = 0;
  }
  if (state.selectedLoreRecordIndex >= state.loreEditorDraft.items.length) {
    state.selectedLoreRecordIndex = state.loreEditorDraft.items.length - 1;
  }

  return state.loreEditorDraft;
}

function loreEditorFieldDefs(category) {
  const columns = getLoreTableSchema(category);
  return columns.map((column) => ({
    key: column,
    label: column,
    options: getLoreTableSelectOptions(category, column),
    multiline: columns.length === 1 || ["Описание", "Заметки", "Способности"].includes(column)
  }));
}

function escapeAttribute(value) {
  return escapeHtml(String(value || "")).replace(/"/g, "&quot;");
}

function loreRecordSummary(category, item, index) {
  const parsed = parseLoreItemForTable(category, item || "");
  const schema = getLoreTableSchema(category);
  const titleKey = schema[0];
  const title =
    String(parsed?.[titleKey] || "").trim() ||
    String(item || "").split(".")[0].trim() ||
    `Запись ${index + 1}`;
  const metaKey =
    category.toLowerCase() === "народы"
      ? "Тип"
      : category.toLowerCase() === "классы"
        ? "Сложность"
        : category.toLowerCase() === "государства"
          ? "Правитель"
          : category.toLowerCase() === "поселения"
            ? "Принадлежность"
            : "";
  const meta = metaKey ? String(parsed?.[metaKey] || "").trim() : "";
  return { title, meta };
}

function renderLoreEditorField(field, value) {
  if (field.options) {
    return `<label class="auth-field lore-dm-editor__field">
      <span>${escapeHtml(field.label)}</span>
      <select data-lore-field="${escapeAttribute(field.key)}">
        <option value="">Выбрать</option>
        ${field.options
          .map(
            (option) =>
              `<option value="${escapeAttribute(option)}" ${option === value ? "selected" : ""}>${escapeHtml(option)}</option>`
          )
          .join("")}
      </select>
    </label>`;
  }

  if (field.multiline) {
    return `<label class="auth-field lore-dm-editor__field lore-dm-editor__field--wide">
      <span>${escapeHtml(field.label)}</span>
      <textarea data-lore-field="${escapeAttribute(field.key)}" rows="${field.key === "Запись" ? 8 : 6}" placeholder="${escapeAttribute(field.label)}">${escapeHtml(value)}</textarea>
    </label>`;
  }

  return `<label class="auth-field lore-dm-editor__field">
    <span>${escapeHtml(field.label)}</span>
    <input type="text" data-lore-field="${escapeAttribute(field.key)}" value="${escapeAttribute(value)}" placeholder="${escapeAttribute(field.label)}">
  </label>`;
}

function cloneLoreEntries(entries = []) {
  return entries.map((entry) => ({
    ...entry,
    items: Array.isArray(entry.items) ? [...entry.items] : []
  }));
}

function applyLorePayloadLocally(payload) {
  const nextEntry = {
    id: String(payload.id || "").trim(),
    category: String(payload.category || "").trim(),
    tone: String(payload.tone || "").trim() || "lore-tone--ember",
    items: Array.isArray(payload.items) ? payload.items.map((item) => String(item || "").trim()).filter(Boolean) : []
  };
  if (!nextEntry.id || !nextEntry.category || !nextEntry.items.length) return;

  const existingIndex = db.lore.findIndex((entry) => entry.id === nextEntry.id);
  if (existingIndex >= 0) {
    db.lore[existingIndex] = nextEntry;
  } else {
    db.lore.push(nextEntry);
  }
}

function renderLoreComposer(activeLore) {
  if (!lorePanel || !loreDmEditor) return;
  const resolvedLore = activeLore || resolveLoreEntry(state.selectedLoreId);

  if (!isDm()) {
    loreDmEditor.classList.add("is-hidden");
    loreDmEditor.innerHTML = "";
    lorePanel.classList.remove("lore-panel--editing", "lore-panel--editor-mode");
    return;
  }

  const draft = ensureLoreEditorDraft(resolvedLore);
  if (!draft) {
    loreDmEditor.classList.add("is-hidden");
    loreDmEditor.innerHTML = "";
    lorePanel.classList.remove("lore-panel--editing", "lore-panel--editor-mode");
    return;
  }

  const category = String(draft.category || "").trim() || "История";
  const currentItem = draft.items[state.selectedLoreRecordIndex] || "";
  const currentRow = parseLoreItemForTable(category, currentItem);
  const fields = loreEditorFieldDefs(category);

  lorePanel.classList.add("lore-panel--editing", "lore-panel--editor-mode");
  loreDmEditor.classList.remove("is-hidden");
  loreDmEditor.innerHTML = `
    <form class="lore-dm-editor__form">
      <div class="lore-editor__head">
        <div>
          <p class="lore-editor__eyebrow">Редактор DM</p>
          <h4>Раздел: ${escapeHtml(category)}</h4>
        </div>
        <div class="lore-editor__tools">
          <button class="ghost-btn ghost-btn--small" data-lore-editor-action="add-record" type="button">Новая запись</button>
          <button class="ghost-btn ghost-btn--small" data-lore-editor-action="remove-record" type="button" ${draft.items.length <= 1 ? "disabled" : ""}>Удалить запись</button>
        </div>
      </div>
      <div class="lore-dm-editor__meta">
        <label class="auth-field lore-dm-editor__field">
          <span>Раздел</span>
          <input type="text" value="${escapeAttribute(category)}" readonly>
        </label>
        <label class="auth-field lore-dm-editor__field">
          <span>Цвет раздела</span>
          <select data-lore-meta="tone">
            <option value="lore-tone--ember" ${draft.tone === "lore-tone--ember" ? "selected" : ""}>Янтарный</option>
            <option value="lore-tone--sage" ${draft.tone === "lore-tone--sage" ? "selected" : ""}>Шалфейный</option>
            <option value="lore-tone--steel" ${draft.tone === "lore-tone--steel" ? "selected" : ""}>Стальной</option>
            <option value="lore-tone--rose" ${draft.tone === "lore-tone--rose" ? "selected" : ""}>Пепельно-розовый</option>
            <option value="lore-tone--violet" ${draft.tone === "lore-tone--violet" ? "selected" : ""}>Сумеречный</option>
          </select>
        </label>
        <div class="lore-dm-editor__count">
          <span>Записей</span>
          <strong>${draft.items.length}</strong>
        </div>
      </div>
      <div class="lore-dm-editor__layout">
        <aside class="lore-dm-editor__records">
          <p class="lore-dm-editor__label">Записи раздела</p>
          <div class="lore-dm-editor__record-list">
            ${draft.items
              .map((item, index) => {
                const summary = loreRecordSummary(category, item, index);
                return `<button class="lore-dm-editor__record ${index === state.selectedLoreRecordIndex ? "is-active" : ""}" data-lore-editor-action="select-record" data-index="${index}" type="button">
                  <span class="lore-dm-editor__record-title">${escapeHtml(summary.title)}</span>
                  ${summary.meta ? `<span class="lore-dm-editor__record-meta">${escapeHtml(summary.meta)}</span>` : ""}
                </button>`;
              })
              .join("")}
          </div>
        </aside>
        <section class="lore-dm-editor__editor">
          <p class="lore-dm-editor__label">Редактирование записи</p>
          <div class="lore-dm-editor__fields">
            ${fields.map((field) => renderLoreEditorField(field, currentRow[field.key] || "")).join("")}
          </div>
        </section>
      </div>
      <div class="journal-actions">
        <button class="action-btn" type="submit">Сохранить раздел</button>
        <button class="ghost-btn" data-lore-editor-action="reset-draft" type="button">Сбросить</button>
      </div>
    </form>`;
}

function updateLoreDraftFromField(fieldName, value) {
  const draft = state.loreEditorDraft;
  if (!draft) return;
  const category = String(draft.category || "").trim() || "История";
  const index = state.selectedLoreRecordIndex;
  const currentRow = parseLoreItemForTable(category, draft.items[index] || "");
  currentRow[fieldName] = String(value || "").trim();
  draft.items[index] = buildLoreItemFromTable(category, currentRow);
}

function handleLoreEditorInput(event) {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;
  if (!state.loreEditorDraft) return;

  const fieldName = target.dataset?.loreField || "";
  const metaName = target.dataset?.loreMeta || "";

  if (fieldName) {
    const value = "value" in target ? target.value : target.textContent || "";
    updateLoreDraftFromField(fieldName, value);
    return;
  }

  if (metaName === "tone" && "value" in target) {
    state.loreEditorDraft.tone = String(target.value || "").trim() || "lore-tone--ember";
  }
}

function handleLoreEditorAction(event) {
  const button = event.target instanceof HTMLElement
    ? event.target.closest("[data-lore-editor-action]")
    : null;
  if (!button || !state.loreEditorDraft) return;

  const action = button.dataset.loreEditorAction;
  const draft = state.loreEditorDraft;
  const category = String(draft.category || "").trim() || "История";

  if (action === "select-record") {
    state.selectedLoreRecordIndex = Number(button.dataset.index || 0);
    renderLoreComposer(resolveLoreEntry(state.selectedLoreId));
    return;
  }

  if (action === "add-record") {
    draft.items.push(buildLoreItemFromTable(category, createEmptyLoreTableRow(category)));
    state.selectedLoreRecordIndex = draft.items.length - 1;
    renderLoreComposer(resolveLoreEntry(state.selectedLoreId));
    return;
  }

  if (action === "remove-record") {
    if (draft.items.length <= 1) return;
    draft.items.splice(state.selectedLoreRecordIndex, 1);
    state.selectedLoreRecordIndex = Math.max(0, state.selectedLoreRecordIndex - 1);
    renderLoreComposer(resolveLoreEntry(state.selectedLoreId));
    return;
  }

  if (action === "reset-draft") {
    state.loreEditorDraftId = "";
    state.loreEditorDraft = null;
    state.selectedLoreRecordIndex = 0;
    renderLoreComposer(resolveLoreEntry(state.selectedLoreId));
  }
}

async function handleLoreEditorSubmit(event) {
  if (!(event.target instanceof HTMLFormElement) || !event.target.closest("#loreDmEditor")) return;
  event.preventDefault();
  const draft = state.loreEditorDraft;
  if (!draft) return;

  const payload = {
    id: String(draft.id || "").trim(),
    category: String(draft.category || "").trim(),
    tone: String(draft.tone || "").trim() || "lore-tone--ember",
    items: (draft.items || []).map((item) => String(item || "").trim()).filter(Boolean)
  };

  if (!payload.category || !payload.items.length) return;

  const previousLore = cloneLoreEntries(db.lore);
  applyLorePayloadLocally(payload);
  state.selectedLoreId = payload.id || state.selectedLoreId;
  refreshAll();

  try {
    const response = await api("/api/lore", { method: "POST", body: payload });
    state.loreEditorDraftId = "";
    state.loreEditorDraft = null;
    if (response?.user && response?.db) {
      applyBootstrap(response);
    } else {
      await loadBootstrap();
    }
    state.selectedLoreId = payload.id || state.selectedLoreId;
    refreshAll();
  } catch (error) {
    db.lore = previousLore;
    state.loreEditorDraftId = draft.id || "";
    state.loreEditorDraft = {
      id: draft.id || "",
      category: draft.category || "",
      tone: draft.tone || "lore-tone--ember",
      items: Array.isArray(draft.items) ? [...draft.items] : [""]
    };
    refreshAll();
    alert(error.message || "Не удалось сохранить раздел.");
  }
}

function populateLoreEditor(entryOrId) {
  if (!loreQuickForm) return;
  const entry = resolveLoreEntry(entryOrId);
  if (!entry) {
    resetLoreForm();
    return;
  }

  loreQuickForm.elements.id.value = entry.id || "";
  loreQuickForm.elements.category.value = loreEntryTitle(entry);
  loreQuickForm.elements.tone.value = entry.tone || "lore-tone--ember";
  loreQuickForm.elements.items.value = (entry.items || []).join("\n");

  if (loreEditorTitle) {
    loreEditorTitle.textContent = `Редактирование: ${loreEntryTitle(entry) || "Раздел"}`;
  }
  if (loreEditorDelete) {
    loreEditorDelete.disabled = !entry.id;
  }
}

function populateLoreTableEditor(entryOrId) {
  if (!loreTableForm) return;
  const entry = resolveLoreEntry(entryOrId);
  if (!entry) {
    resetLoreTableForm();
    return;
  }

  loreTableForm.elements.id.value = entry.id || "";
  loreTableForm.elements.category.value = loreEntryTitle(entry);
  loreTableForm.elements.tone.value = entry.tone || "lore-tone--ember";

  if (loreTableEditorTitle) {
    loreTableEditorTitle.textContent = `Таблица: ${loreEntryTitle(entry) || "Раздел"}`;
  }
  if (loreTableEditorDelete) {
    loreTableEditorDelete.disabled = !entry.id;
  }

  const category = loreEntryTitle(entry);
  const rows = (entry.items || []).map((item) => parseLoreItemForTable(category, item));
  renderLoreTableRows(category, rows.length ? rows : [createEmptyLoreTableRow(category)]);
}
