const plugin = require("tailwindcss/plugin");

/**
 * Tailwind CSS plugin to control the maximum number of visible child elements in a container.
 * This plugin generates utility classes in the form of `.child-cap-{n}`, where `{n}` is the number of child elements to display,
 * and `.child-cap-none` to display all child elements.
 *
 * @param {Object} options - Optional. Configuration options for the plugin.
 */
const childCapPlugin = plugin(function ({ addUtilities, e, theme }, options = {}) {
    const maxRange = options.maxRange || 24;
    const screens = theme("screens", {});

    let newUtilities = {};

    // Function to generate utilities for a given selector.
    const generateUtilities = (selectorPrefix, maxItems, mediaQuery) => {
        for (let i = 1; i <= maxItems; i++) {
            const selector = `${selectorPrefix}${i} > *`;
            const visibleSelector = `${selectorPrefix}${i} > :nth-child(-n+${i})`;
            const hideAfterSelector = `${selectorPrefix}${i} > :nth-child(n+${i + 1})`;

            const utilities = {
                [selector]: { display: "none" },  // Hide all by default
                [visibleSelector]: { display: "block" },  // Show only the first n elements
                [hideAfterSelector]: { display: "none" },  // Ensure all elements after the nth are hidden
            };

            if (mediaQuery) {
                newUtilities[`@media (min-width: ${mediaQuery})`] = {
                    ...newUtilities[`@media (min-width: ${mediaQuery})`],
                    ...utilities,
                };
            } else {
                newUtilities = { ...newUtilities, ...utilities };
            }
        }

        // Reset all children visibility if no cap is applied
        const allVisibleSelector = `${selectorPrefix}none > *`;
        if (mediaQuery) {
            newUtilities[`@media (min-width: ${mediaQuery})`] = {
                ...newUtilities[`@media (min-width: ${mediaQuery})`],
                [allVisibleSelector]: { display: "block" },
            };
        } else {
            newUtilities[allVisibleSelector] = { display: "block" };
        }
    };

    // Generate base utilities for all ranges (no media query).
    generateUtilities(".child-cap-", maxRange);

    // Generate responsive utilities for each breakpoint.
    Object.keys(screens).forEach((screen) => {
        const screenClassPrefix = `.${e(`${screen}:child-cap-`)}`;
        const mediaQuery = screens[screen];
        generateUtilities(screenClassPrefix, maxRange, mediaQuery);
    });

    addUtilities(newUtilities, ["responsive"]);
});

module.exports = childCapPlugin;

