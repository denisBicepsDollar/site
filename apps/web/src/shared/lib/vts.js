// `vts` wire encoding — kept in sync with the API route's parser:
// `Type1*v1.v2!Type2*v3` (`!` between types, `*` between a type and its values, `.` between values).
const TYPES_SEPARATOR = "!";
const TYPE_AND_VALUES_SEPARATOR = "*";
const VALUES_SEPARATOR = ".";

export function parseVts(vts) {
    if (!vts) {
        return {};
    }
    const pairs = vts
        .split(TYPES_SEPARATOR)
        .map((segment) => segment.split(TYPE_AND_VALUES_SEPARATOR, 2))
        .map(([type, values]) =>
            type && values ? [type, values.split(VALUES_SEPARATOR).filter(Boolean)] : null,
        )
        .filter((pair) => pair !== null && pair[1].length > 0);
    return Object.fromEntries(pairs);
}

export function encodeVts(record) {
    return Object.entries(record)
        .filter(([, values]) => values.length > 0)
        .map(([type, values]) => `${type}${TYPE_AND_VALUES_SEPARATOR}${values.join(VALUES_SEPARATOR)}`)
        .join(TYPES_SEPARATOR);
}