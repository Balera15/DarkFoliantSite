function selectDmPanel(panel) {
  const availablePanels = new Set(["users", "characters", "requests", "map"]);
  state.selectedDmPanel = availablePanels.has(panel) ? panel : "users";
  saveUiState();
  renderDmWorkspace();
}

function renderDmWorkspace() {
  if (!dmScreen) return;
  const panel = state.selectedDmPanel || "users";
  dmPanelButtons.forEach((button) => {
    const active = button.dataset.panel === panel;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-selected", active ? "true" : "false");
  });
  dmPanels.forEach((entry) => {
    entry.classList.toggle("is-active", entry.dataset.dmPanel === panel);
  });
  if (dmUsersCount) dmUsersCount.textContent = String(db.users.filter((entry) => entry.role !== "dm").length);
  if (dmCharactersCount) dmCharactersCount.textContent = String(db.characters.length);
  if (dmRequestsCount) {
    dmRequestsCount.textContent = String((db.characterRequests || []).filter((entry) => String(entry.status || "") === "pending").length);
  }
  if (dmLoreCount) dmLoreCount.textContent = String(db.lore.length);
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
  if (!mapForm) return;
  mapForm.elements.currentSrc.value = db.map.src || "";
  if (mapForm.elements.mapFile) mapForm.elements.mapFile.value = "";
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
  renderDmWorkspace();
}

function resetUserForm() {
  userForm.reset();
  userForm.elements.id.value = "";
}

function resetCharacterForm() {
  characterForm.reset();
  characterForm.elements.id.value = "";
  characterForm.elements.requestId.value = "";
  characterForm.elements.currentImage.value = "";
  if (characterFormSubmitBtn) characterFormSubmitBtn.textContent = "Сохранить персонажа";
}

function populateUserForm(user) {
  selectDmPanel("users");
  userForm.elements.id.value = user.id;
  userForm.elements.username.value = user.username;
  userForm.elements.displayName.value = user.displayName;
  userForm.elements.password.value = "";
  userForm.elements.characterId.value = user.characterId || "";
}

function populateCharacterForm(character) {
  selectDmPanel("characters");
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
  characterForm.elements.currentImage.value = character.image || "";
  if (characterForm.elements.imageFile) characterForm.elements.imageFile.value = "";
  if (characterFormSubmitBtn) characterFormSubmitBtn.textContent = "Сохранить персонажа";
}

function populateCharacterRequestApproval(requestEntry) {
  selectDmPanel("requests");
  resetCharacterForm();
  characterForm.elements.requestId.value = requestEntry.id;
  characterForm.elements.name.value = requestEntry.name || "";
  characterForm.elements.race.value = requestEntry.race || "";
  characterForm.elements.className.value = requestEntry.className || "";
  characterForm.elements.ownerUserId.value = requestEntry.userId || "";
  characterForm.elements.description.value = requestEntry.description || "";
  characterForm.elements.health.value = 0;
  characterForm.elements.armor.value = 0;
  characterForm.elements.currentImage.value = "";
  if (characterForm.elements.imageFile) characterForm.elements.imageFile.value = "";
  if (characterFormSubmitBtn) characterFormSubmitBtn.textContent = "Подтвердить персонажа";
}
