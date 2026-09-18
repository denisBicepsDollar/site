/* ============================================================================
   API.JS — МОДУЛЬ ДЛЯ РАБОТЫ С API
   ============================================================================ */
async function handleResponse(res) {
    /* Получаем текст ответа, игнорируя ошибки парсинга */
    const text = await res.text().catch(() => '');

    /* Пытаемся распарсить текст как JSON */
    let json;
    try {
        json = text ? JSON.parse(text) : {};
    } catch {
        /* Если парсинг не удался, оборачиваем текст в объект */
        json = {raw: text};
    }

    /* Проверяем успешность ответа */
    if (!res.ok) {
        /* Формируем сообщение об ошибке из ответа или HTTP статуса */
        const errMsg = json?.error || json?.message || `HTTP ${res.status}`;
        const err = new Error(errMsg);
        err.status = res.status;
        err.payload = json;
        throw err;
    }

    return json;
}

/* ─────────────────────────────────────────────────────────────────────────
   ТАБЛИЦЫ (TABLES)
   ───────────────────────────────────────────────────────────────────────── */

export async function getListTables() {
    const res = await fetch(`/admin/tables`);
    return handleResponse(res);
}


export async function getTable(tableName) {
    const res = await fetch(`/admin/tables/${encodeURIComponent(tableName)}`);
    return handleResponse(res);
}

/* ─────────────────────────────────────────────────────────────────────────
   СТРОКИ (ROWS)
   ───────────────────────────────────────────────────────────────────────── */


export async function postCreateRow(tableName, payload) {
    const res = await fetch(`/admin/tables/${encodeURIComponent(tableName)}/rows`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload),
    });
    return handleResponse(res);
}


export async function deleteRow(tableName, filterColumn, filterValue) {
    const res = await fetch(
        `/admin/tables/${encodeURIComponent(tableName)}/rows/${encodeURIComponent(filterColumn)}/${encodeURIComponent(filterValue)}`,
        {method: 'DELETE'},
    );
    return handleResponse(res);
}


export async function putReplaceRow(tableName, filterColumn, filterValue, data) {
    const res = await fetch(
        `/admin/tables/${encodeURIComponent(tableName)}/rows/${encodeURIComponent(filterColumn)}/${encodeURIComponent(filterValue)}`,
        {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data),
        },
    );
    return handleResponse(res);
}
