const plugin = require("tailwindcss/plugin");

const DEFAULT_MAX_RANGE = 24;

function normalizeOptions(options) {
    if (!options || typeof options !== "object" || Array.isArray(options)) {
        return {};
    }

    return Object.fromEntries(
        Object.entries(options).map(([key, value]) => [
            key.toLowerCase().replace(/[-_]/g, ""),
            value,
        ]),
    );
}

function resolveMaxRange(options = {}) {
    const normalized = normalizeOptions(options);
    const raw = normalized.maxrange ?? DEFAULT_MAX_RANGE;
    const parsed = Number.parseInt(String(raw).trim(), 10);

    if (!Number.isFinite(parsed) || parsed < 1) {
        return DEFAULT_MAX_RANGE;
    }

    return parsed;
}

function createUtilities(maxRange) {
    const utilities = {};

    for (let i = 1; i <= maxRange; i++) {
        utilities[`.child-cap-${i}`] = {
            "& > *": {
                display: "none",
                [`&:nth-child(-n+${i})`]: {
                    display: "block",
                },
            },
        };
    }

    utilities[".child-cap-none"] = {
        "& > *": {display: "block"},
    };

    return utilities;
}

const childCapPlugin = plugin.withOptions(
    (options = {}) =>
        ({addUtilities}) => {
            const maxRange = resolveMaxRange(options);
            addUtilities(createUtilities(maxRange), {
                respectPrefix: false,
                respectImportant: false,
            });
        },
);

module.exports = childCapPlugin;
module.exports._private = {
    DEFAULT_MAX_RANGE,
    createUtilities,
    resolveMaxRange,
};
