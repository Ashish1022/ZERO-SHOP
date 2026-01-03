import { parseAsArrayOf, parseAsString, parseAsStringLiteral, useQueryStates } from "nuqs";

export const sortedValues = ["featured", "low_to_high", "high_to_low", "newest"] as const;

const params = {
    search: parseAsString
        .withOptions({
            clearOnDefault: true
        })
        .withDefault(""),
    sort: parseAsStringLiteral(sortedValues).
        withDefault("newest"),
    category: parseAsArrayOf(parseAsString)
        .withOptions({
            clearOnDefault: true,
        }).
        withDefault([]),
}

export const useProductFilters = () => {
    return useQueryStates(params);
}
