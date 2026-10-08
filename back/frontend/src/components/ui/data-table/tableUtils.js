export function getUniqueStatuses(data) {
    const statuses = new Set(data.map(row => row.status));
    return Array.from(statuses);
}