// tableService.js
// Сервисный слой для работы с таблицами.
// Содержит бизнес-логику нормализации колонок перед передачей в репозиторий.

import * as tableRepo from '../../db/common/tableRepo.js';

// Возвращает список имён всех таблиц
export async function listTables() {
    return tableRepo.listTables();
}

