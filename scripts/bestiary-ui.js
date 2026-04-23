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

function renderBestiary() {
  const query = String(searchInput?.value || "").trim().toLowerCase();
  const entries = db.bestiary.filter((creature) => {
    const matchesFilter = state.filter === "all" || creature.type === state.filter;
    const matchesQuery =
      creature.name.toLowerCase().includes(query) ||
      creature.description.toLowerCase().includes(query) ||
      creature.tag.toLowerCase().includes(query);
    return matchesFilter && matchesQuery;
  });

  bestiaryPlayerHint?.classList.toggle("is-hidden", !isPlayer());

  if (!bestiaryGrid) return;
  bestiaryGrid.innerHTML = entries
    .map((creature) => {
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
    })
    .join("");
}

function resetBestiaryForm() {
  if (!bestiaryForm) return;
  bestiaryForm.reset();
  bestiaryForm.elements.id.value = "";
  bestiaryForm.elements.type.value = "wild";
  bestiaryForm.elements.dangerLevel.value = "medium";
  bestiaryForm.elements.currentImage.value = "";
  if (bestiaryEditorTitle) bestiaryEditorTitle.textContent = "Новое существо";
  if (bestiaryEditorDelete) bestiaryEditorDelete.disabled = true;
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
  bestiaryForm.elements.currentImage.value = creature.image || "";
  if (bestiaryForm.elements.imageFile) bestiaryForm.elements.imageFile.value = "";
  if (bestiaryEditorTitle) bestiaryEditorTitle.textContent = `Редактирование: ${creature.name}`;
  if (bestiaryEditorDelete) bestiaryEditorDelete.disabled = false;
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
