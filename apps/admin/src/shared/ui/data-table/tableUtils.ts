export function getUniqueStatuses<T extends {status?: string | null}>(data: readonly T[]) {
    const statusInfo: Record<string, number> = {};
    for (const row of data) {
        if (row.status) {
            statusInfo[row.status] = (statusInfo[row.status] || 0) + 1;
        }
    }

    const totalCount = Object.values(statusInfo).reduce((sum, count) => sum + count, 0);

    return [
        {label: "all", count: totalCount},
        ...Object.entries(statusInfo).map(([label, count]) => ({label, count})),
    ];
}
