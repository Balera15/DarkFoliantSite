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

function mod(score) {
  return Math.floor((score - 10) / 2);
}

function renderCharacterCard(character, options = {}) {
  if (!character) {
    return `<article class="panel"><p class="admin-empty">Персонаж не найден.</p></article>`;
  }
  const { showPreviewSelector = false, compact = false } = options;
  const image = safeMediaUrl(character?.image || "");
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

  if (!character && isDm() && !db.characters.length) {
    characterView.innerHTML = `<article class="panel"><p class="admin-empty">Пока нет ни одной карточки персонажа. Создай персонажа в управлении DM.</p></article>`;
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
